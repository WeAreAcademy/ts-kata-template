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
            const msgStructure: MsgStructure = parseMsgStructure(
                instructionString.trim().slice(4)
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
    const trimmed = quotedString.trim();
    if (trimmed[0] === trimmed[trimmed.length - 1] && trimmed[0] === "'") {
        return trimmed.slice(1, -1);
    } else {
        throw new Error(
            "can't remove quotes - not surrounded by quotes: " + quotedString
        );
    }
}

// msg   'mod(', a, ', ', b, ') = ', d        ; output
//msg   a, '! = ', c ; output text
//TODO: simplify this overly complex parser for msg instruction string
export function parseMsgStructure(fullStr: string): MsgStructure {
    let inString = false;
    const allComponents: MsgStructure = [];
    let stringInProgress = "";
    let registerNameInProgress = "";

    function pushRegisterName(rn: string) {
        if (!isValidRegisterName(rn)) {
            throw new Error("invalid register name: " + rn);
        }
        allComponents.push({
            type: "registerName",
            value: rn,
        });
    }
    for (let c of fullStr) {
        if (inString) {
            if (c === "'") {
                inString = !inString;
                allComponents.push({
                    type: "literal",
                    value: stringInProgress,
                });
                stringInProgress = "";
            } else {
                stringInProgress += c;
            }
        } else {
            if (c === "'") {
                if (registerNameInProgress.length > 0) {
                    pushRegisterName(registerNameInProgress);
                }
                registerNameInProgress = "";
                inString = !inString;
            } else if (c === ";") {
                break;
            } else if (c !== " " && c !== ",") {
                registerNameInProgress += c;
            }
        }
    }
    if (!inString && registerNameInProgress) {
        pushRegisterName(registerNameInProgress);
        registerNameInProgress = "";
    }
    return allComponents;
}
