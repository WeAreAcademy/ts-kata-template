import { CommentOrInstruction, Instruction, RegisterName } from "./types";

function parseSourceRegOrValueOrFail(str: string): number | RegisterName {
    return isNaN(parseInt(str)) ? parseRegisterNameOrFail(str) : parseInt(str);
}

export function parseInstructionOrComment(
    instructionString: string
): CommentOrInstruction {
    if (instructionString.startsWith(";")) {
        return { command: "comment", comment: instructionString.slice(0) };
    }
    if (instructionString.endsWith(":")) {
        return { command: "label", label: instructionString.split(":")[0] };
    }

    const [command, b, c] = instructionString.split(" ");

    switch (command) {
        case "inc":
        case "dec":
            return { command, registerName: parseRegisterNameOrFail(b) };

        case "mov":
        case "add":
        case "sub":
        case "div":
        case "mul": {
            return {
                command,
                toRegister: parseRegisterNameOrFail(b),
                sourceRegOrValue: parseSourceRegOrValueOrFail(c),
            };
        }
        case "cmp": {
            return {
                command,
                x: parseSourceRegOrValueOrFail(c),
                y: parseSourceRegOrValueOrFail(c),
            };
        }
        case "ret": {
            return { command };
        }
        case "msg": {
            return { command, message: instructionString.trim().slice(4) }; //TODO: parse into list of lit strings and registers?
        }
        case "end": {
            return { command };
        }
        case "jmp":
        case "jne":
        case "je":
        case "jge":
        case "jg":
        case "jle":
        case "jl":
        case "call": {
            return {
                command,
                toLabel: b,
            };
        }
        case "jnz":
            return {
                command,
                registerName: parseRegisterNameOrFail(b),
                offset: parseInt(c),
            };

        default:
            throw new Error(
                "failed to parse instruction: " + instructionString
            );
    }
}

function isValidRegisterName(candidate: string): candidate is RegisterName {
    if (candidate.length !== 1) {
        return false;
    }
    const firstChar: string = candidate.charAt(0);
    if (firstChar < "a" || firstChar > "z") {
        return false;
    }
    return true;
}

function parseRegisterNameOrFail(candidate: string): RegisterName {
    if (isValidRegisterName(candidate)) {
        return candidate;
    }
    throw new Error("invalid register name: " + candidate);
}
