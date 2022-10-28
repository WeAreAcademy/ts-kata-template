import { parseInstruction } from "./parser";
import { Instruction, RegisterName, Registers } from "./types";
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

function execute(instruction: Instruction, registers: Registers): number {
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

        case "jnz":
            if (registers[instruction.registerName] === 0) {
                return 1;
            } else {
                return instruction.offset;
            }
        case "mul":
            registers[instruction.toRegister] *= literalOrRegValue(
                instruction.sourceRegOrValue,
                registers
            );
            return 1;
        default:
            throw new UnreachableCodeError(
                instruction,
                `unexpected instruction: ${instruction}`
            );
    }
}

function interpret(programInstructions: string[]): Registers {
    //Will fail at this point if the input strings don't parse as instructions
    const instructions: Instruction[] =
        programInstructions.map(parseInstruction);

    const registers: Registers = {};
    let instructionPointer: number = 0;
    let counter = 0; //for runaway loop detection

    while (instructionPointer < instructions.length) {
        const instruction: Instruction = instructions[instructionPointer];
        let instructionPointerOffset = execute(instruction, registers);
        instructionPointer += instructionPointerOffset;

        //optional!
        if (counter >= 10000) {
            throw new Error(
                "likely infinite loop.  executed: " + counter + " cycles"
            );
        }
    }

    return registers;
}

// interpret(["mov a -10", "mov b a", "inc a", "dec b", "jnz a -2"]);
// should yield { a: 0, b: -20 }

export { interpret, execute, Registers };
