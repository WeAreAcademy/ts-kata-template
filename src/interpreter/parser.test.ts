import { MsgStructure } from "./interpreter";
import { parseInstructionOrComment, parseMsgStructure } from "./parser";

test("original codewars tests pass", function () {
    expect(
        parseInstructionOrComment("mov a, -10") //, "mov b a", "inc a", "dec b", "jnz a -2"])
    ).toEqual({ command: "mov", toRegister: "a", sourceRegOrValue: -10 });
});

test("parse message body", () => {
    const input = "'hello', a, 'world, it, is good', b, 'final'";

    const expected: MsgStructure = [
        { type: "literal", value: "hello" },
        { type: "registerName", value: "a" },
        { type: "literal", value: "world, it, is good" },
        { type: "registerName", value: "b" },
        { type: "literal", value: "final" },
    ];
    expect(parseMsgStructure(input)).toEqual(expected);
});
test("parse message body for mod(", () => {
    const input = "   'mod(', a, ', ', b, ') = ', d        ; output";

    const expected: MsgStructure = [
        { type: "literal", value: "mod(" },
        { type: "registerName", value: "a" },
        { type: "literal", value: ", " },
        { type: "registerName", value: "b" },
        { type: "literal", value: ") = " },
        { type: "registerName", value: "d" },
    ];
    expect(parseMsgStructure(input)).toEqual(expected);
});
// msg   'mod(', a, ', ', b, ') = ', d        ; output
//msg   a, '! = ', c ; output text
