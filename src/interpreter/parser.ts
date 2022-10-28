import { Instruction, RegisterName } from "./types";

function parseSourceRegOrValueOrFail(str: string): number | RegisterName {
    return isNaN(parseInt(str)) ? parseRegisterNameOrFail(str) : parseInt(str);
}
export function parseInstruction(instructionString: string): Instruction {
    const [command, registerName, other] = instructionString.split(" ");

    if (!isValidRegisterName(registerName)) {
        throw new Error(
            "invalid register name" +
                registerName +
                " in instruction " +
                instructionString
        );
    }

    switch (command) {
        case "inc":
        case "dec":
            return { command, registerName };
        case "mov":
        case "mul": { // case "div":
            const sourceRegOrValue = parseSourceRegOrValueOrFail(other);
            return { command, toRegister: registerName, sourceRegOrValue };
        }

        case "jnz":
            return {
                command,
                registerName: registerName,
                offset: parseInt(other),
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
