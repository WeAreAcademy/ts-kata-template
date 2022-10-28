import { parseInstructionOrComment } from "./parser";
import {
    CommentOrInstruction,
    ComparisonResult,
    Instruction,
    InstructionPointerOffset,
    isInstructionNotComment,
    LabelName,
    OtherState,
    RegisterName,
    Registers,
} from "./types";
import { UnreachableCodeError } from "./util";

/* 

This is the first part of this kata series. Second part is here.

We want to create a simple interpreter of assembler which will 
support the following instructions:

mov x y - copies y (either a constant value or the content of a register) into register x
inc x - increases the content of the register x by one
dec x - decreases the content of the register x by one
jnz x y - jumps to an instruction y steps away (positive means forward, negative means backward, y can be a register or a constant), but only if x (a constant or a register) is not zero

Register names are alphabetical (letters only).
Constants are always integers (positive or negative).

Note: the jnz instruction moves relative to itself. 
For example, an offset of -1 would continue at the previous instruction,
while an offset of 2 would skip over the next instruction.

The function will take an input list with the sequence of the program
 instructions and will execute them. 
 The program ends when there are no more instructions to execute, 
 then it returns a dictionary (a table in COBOL) with the contents 
 of the registers.

Also, every inc/dec/jnz on a register will always be preceeded by a 
mov on the register first, so you don't need to worry about 
uninitialized registers.

Example
["mov a 5"; "inc a"; "dec a"; "dec a"; "jnz a -1"; "inc a"]

visualized:

mov a 5
inc a
dec a
dec a
jnz a -1
inc a
*/
function literalOrRegValue(
    sourceRegOrValue: number | RegisterName,
    registers: Registers
): number {
    return typeof sourceRegOrValue === "number"
        ? sourceRegOrValue
        : registers[sourceRegOrValue];
}

export type MsgComponent =
    | { type: "literal"; value: string }
    | { type: "registerName"; value: RegisterName };
export type MsgStructure = MsgComponent[];
export function substituteRegisterValues(
    msg: MsgStructure,
    regs: Registers
): string {
    return msg
        .map((component) =>
            component.type === "literal"
                ? component.value
                : regs[component.value]
        )
        .join("");
}

export function execute(
    instruction: Instruction,
    registers: Registers,
    otherState: OtherState,
    currentInstructionPointer: number
): InstructionPointerOffset | LabelName | { exact: number } {
    switch (instruction.command) {
        case "mov":
            const v = literalOrRegValue(
                instruction.sourceRegOrValue,
                registers
            );
            registers[instruction.toRegister] = v;
            return 1;
        case "inc":
            registers[instruction.registerName] += 1;
            return 1;

        case "dec":
            registers[instruction.registerName] -= 1;
            return 1;

        case "add":
            registers[instruction.toRegister] += literalOrRegValue(
                instruction.sourceRegOrValue,
                registers
            );
            return 1;
        case "sub":
            registers[instruction.toRegister] -= literalOrRegValue(
                instruction.sourceRegOrValue,
                registers
            );
            return 1;
        case "mul":
            registers[instruction.toRegister] *= literalOrRegValue(
                instruction.sourceRegOrValue,
                registers
            );
            return 1;
        case "div":
            registers[instruction.toRegister] = Math.floor(
                registers[instruction.toRegister] /
                    literalOrRegValue(instruction.sourceRegOrValue, registers)
            );
            return 1;
        case "label":
            //labels are PRE-processed. They are not executed in the main flow.
            // console.log("processing label adding: ", instruction.label);
            // otherState.labels[instruction.label] = currentInstructionPointer;
            return 1;
        case "cmp":
            const comparisonResult: "lt" | "eq" | "gt" = compare(
                literalOrRegValue(instruction.x, registers),
                literalOrRegValue(instruction.y, registers)
            );
            otherState.lastComparisonResult = comparisonResult;
            return 1;

        case "msg":
            otherState.storedOutput = substituteRegisterValues(
                instruction.message,
                registers
            );
            return 1;
        case "end":
            return 1;
        case "jmp":
            return instruction.toLabel;
        case "jne":
            failIfNoLastComparisonResult(otherState, instruction);
            return otherState.lastComparisonResult !== "eq"
                ? instruction.toLabel
                : 1;
        case "je":
            failIfNoLastComparisonResult(otherState, instruction);
            return otherState.lastComparisonResult === "eq"
                ? instruction.toLabel
                : 1;

        case "jge":
            if (!otherState.lastComparisonResult) {
                throw new Error(
                    "No last comparison result, yet a conditional jump was attempted: instruction: " +
                        JSON.stringify(instruction)
                );
            }

            return ["gt", "eq"].includes(otherState.lastComparisonResult)
                ? instruction.toLabel
                : 1;
        case "jg":
            if (!otherState.lastComparisonResult) {
                throw new Error(
                    "No last comparison result, yet a conditional jump was attempted: instruction: " +
                        JSON.stringify(instruction)
                );
            }
            return ["gt"].includes(otherState.lastComparisonResult)
                ? instruction.toLabel
                : 1;

        case "jle":
            if (!otherState.lastComparisonResult) {
                throw new Error(
                    "No last comparison result, yet a conditional jump was attempted: instruction: " +
                        JSON.stringify(instruction)
                );
            }
            return ["lt", "eq"].includes(otherState.lastComparisonResult)
                ? instruction.toLabel
                : 1;

        case "jl":
            if (!otherState.lastComparisonResult) {
                throw new Error(
                    "No last comparison result, yet a conditional jump was attempted: instruction: " +
                        JSON.stringify(instruction)
                );
            }
            return ["lt"].includes(otherState.lastComparisonResult)
                ? instruction.toLabel
                : 1;
        case "call":
            otherState.stack.push(currentInstructionPointer + 1);
            return instruction.toLabel;

        case "ret":
            return { exact: otherState.stack.pop()! }; ///TODO; check there's something on the stack!
        default:
            throw new UnreachableCodeError(
                instruction,
                `unexpected instruction: ${instruction}`
            );
    }
}
export function interpret(rawProgramText: string): string | -1 {
    const instrLines: string[] = rawProgramText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

    const res = interpretInstructions(instrLines);
    if (res === -1) {
        return res;
    }
    if (res.otherState.storedOutput === null) {
        throw new Error("no stored output but 'end' command reached!");
    }

    return res.otherState.storedOutput;
}

export function interpretInstructions(
    programInstructionStrings: string[]
): -1 | { registers: Registers; otherState: OtherState } {
    //Will fail at this point if the input strings don't parse as instructions
    const instructionsOrComments: CommentOrInstruction[] =
        programInstructionStrings.map(parseInstructionOrComment);

    const instructions = instructionsOrComments.filter(isInstructionNotComment);
    const registers: Registers = {};
    let instructionPointer: number = 0;
    let counter = 0; //for runaway loop detection
    const builtLabels: [string, number][] = instructions
        .map((instr, ix) =>
            instr.command === "label"
                ? ([instr.label, ix] as [string, number])
                : null
        )
        .filter((l) => l !== null) as [string, number][]; //TODO: use guard

    const otherState: OtherState = {
        lastComparisonResult: null,
        storedOutput: null,
        stack: [],
        labels: Object.fromEntries(builtLabels),
    };
    while (instructionPointer < instructions.length) {
        const instruction: Instruction = instructions[instructionPointer];
        let instructionPointerOffsetOrLabel = execute(
            instruction,
            registers,
            otherState,
            instructionPointer
        );
        if (typeof instructionPointerOffsetOrLabel === "number") {
            instructionPointer += instructionPointerOffsetOrLabel;
        } else if (typeof instructionPointerOffsetOrLabel === "string") {
            const newIP = otherState.labels[instructionPointerOffsetOrLabel];
            if (newIP === undefined) {
                throw new Error(
                    "missing label: " +
                        instructionPointerOffsetOrLabel +
                        ", labels: " +
                        JSON.stringify(otherState.labels)
                );
            }
            instructionPointer = newIP;
        } else {
            instructionPointer = instructionPointerOffsetOrLabel.exact;
        }

        //optional!
        if (counter >= 10000) {
            throw new Error(
                "likely infinite loop.  executed: " + counter + " cycles"
            );
        }

        if (instruction.command === "end") {
            return { registers, otherState };
        }
    }

    return -1;
}
function compare(arg0: number, arg1: number): ComparisonResult {
    if (arg0 < arg1) {
        return "lt";
    }
    if (arg0 > arg1) {
        return "gt";
    }
    return "eq";
}

function failIfNoLastComparisonResult(
    otherState: OtherState,
    instruction: Instruction
) {
    if (otherState.lastComparisonResult === null) {
        throw new Error(
            "No last comparison result, yet a conditional jump was attempted: instruction: " +
                JSON.stringify(instruction)
        );
    }
}

// interpret(["mov a -10", "mov b a", "inc a", "dec b", "jnz a -2"]);
// should yield { a: 0, b: -20 }
