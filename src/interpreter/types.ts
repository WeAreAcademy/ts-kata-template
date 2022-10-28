import { MsgStructure } from "./interpreter";
export type Registers = { [key: string]: number };
export type RegisterName =
    | "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f"
    | "g"
    | "h"
    | "i"
    | "j"
    | "k"
    | "l"
    | "m"
    | "n"
    | "o"
    | "p"
    | "q"
    | "s"
    | "t"
    | "u"
    | "v"
    | "w"
    | "x"
    | "y"
    | "z";
export type CommentOrInstruction = Comment | Instruction;
export function isComment(v: CommentOrInstruction): v is Comment {
    return v.command === "comment";
}

export type LabelName = string;
export function isInstructionNotComment(
    v: CommentOrInstruction
): v is Instruction {
    return !isComment(v);
}

export type Comment = { command: "comment"; comment: string };

export type Instruction =
    | {
          command: "mov";
          toRegister: RegisterName;
          sourceRegOrValue: number | RegisterName; //we can do better
      }
    | {
          command: "add";
          toRegister: RegisterName;
          sourceRegOrValue: number | RegisterName; //we can do better
      }
    | {
          command: "sub";
          toRegister: RegisterName;
          sourceRegOrValue: number | RegisterName; //we can do better
      }
    | {
          command: "mul";
          toRegister: RegisterName;
          sourceRegOrValue: number | RegisterName; //we can do better
      }
    | {
          command: "div";
          toRegister: RegisterName;
          sourceRegOrValue: number | RegisterName; //we can do better
      }
    | {
          command: "cmp";
          x: number | RegisterName;
          y: number | RegisterName;
      }
    | {
          command: "label";
          label: string;
      }
    | {
          command: "msg";
          message: MsgStructure;
      }
    | {
          command: "end";
      }
    | {
          command: "ret";
      }
    | { command: "inc"; registerName: RegisterName }
    | { command: "dec"; registerName: RegisterName }
    | { command: "jnz"; registerName: RegisterName; offset: number }
    | { command: "jmp"; toLabel: string }
    | { command: "jmp"; toLabel: LabelName }
    | { command: "jne"; toLabel: LabelName }
    | { command: "je"; toLabel: LabelName }
    | { command: "jge"; toLabel: LabelName }
    | { command: "jg"; toLabel: LabelName }
    | { command: "jle"; toLabel: LabelName }
    | { command: "jl"; toLabel: LabelName }
    | { command: "call"; toLabel: LabelName };

export interface OtherState {
    lastComparisonResult: ComparisonResult | null;
    storedOutput: string | null;
    labels: { [key: string]: number };
}

export type ComparisonResult = "lt" | "eq" | "gt";
