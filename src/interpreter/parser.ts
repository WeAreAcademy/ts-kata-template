import { shouldTrace } from "./debuggingConfig";
import { MsgStructure } from "./interpreter";
import { CommentOrInstruction, Instruction, RegisterName } from "./types";

function parseSourceRegOrValueOrFail(str: string): number | RegisterName {
    return isNaN(parseInt(str)) ? parseRegisterNameOrFail(str) : parseInt(str);
}

export function parseInstructionOrComment(
    instructionString: string
): CommentOrInstruction {
    // console.log("parsing instruction/comment: " + instructionString);
    if (instructionString.startsWith(";")) {
        return { command: "comment", comment: instructionString.slice(0) };
    }
    //remove comments
    instructionString = instructionString.replace(/;.*/, "");

    if (instructionString.trim().endsWith(":")) {
        const label = instructionString.split(":")[0];
        shouldTrace && console.log("found label: ", label);
        return { command: "label", label };
    }

    const [command, b, c] = instructionString
        .split(" ")
        .map((s) => s.replace(/[,]$/, "").trim())
        .filter((s) => s.length > 0);

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
                x: parseSourceRegOrValueOrFail(b),
                y: parseSourceRegOrValueOrFail(c),
            };
        }
        case "ret": {
            return { command };
        }
        case "msg": {
            //TODO: this does not handle , in message literals (only as a separator)
            //TODO: this does not remove ; comments
            const msgStructure: MsgStructure = instructionString
                .trim()
                .slice(4)
                .split(",")
                .map((str) =>
                    str.trim().startsWith("'")
                        ? { type: "literal", value: remQuotes(str.trim()) }
                        : {
                              type: "registerName",
                              value: parseRegisterNameOrFail(str.trim()),
                          }
                );
            return { command, message: msgStructure }; //TODO: parse into list of lit strings and registers?
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
    throw new Error("invalid register name: '" + candidate + "'");
}

function remQuotes(quotedString: string): string {
    return quotedString.trim().slice(1, -1);
}
