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

export type Instruction =
    | {
          command: "mov";
          toRegister: RegisterName;
          sourceRegOrValue: number | RegisterName; //we can do better
      }
    // | {
    //       command: "add";
    //       toRegister: RegisterName;
    //       sourceRegOrValue: number | RegisterName; //we can do better
    //   }
    // | {
    //       command: "sub";
    //       toRegister: RegisterName;
    //       sourceRegOrValue: number | RegisterName; //we can do better
    //   }
    | {
          command: "mul";
          toRegister: RegisterName;
          sourceRegOrValue: number | RegisterName; //we can do better
      }
    // | {
    //       command: "div";
    //       toRegister: RegisterName;
    //       sourceRegOrValue: number | RegisterName; //we can do better
    //   }
    // | {
    //       command: "label";
    //       label: string;
    //   }
    | { command: "inc"; registerName: RegisterName }
    | { command: "dec"; registerName: RegisterName }
    | { command: "jnz"; registerName: RegisterName; offset: number };
// | { command: "jmp"; label: string };
