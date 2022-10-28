import { parseInstruction } from "./parser";

test("original codewars tests pass", function () {
    expect(
        parseInstruction("mov a -10") //, "mov b a", "inc a", "dec b", "jnz a -2"])
    ).toEqual({ command: "mov", toRegister: "a", sourceRegOrValue: -10 });
});
