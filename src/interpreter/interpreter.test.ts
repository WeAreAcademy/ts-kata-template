import { interpret, execute, Registers } from "./interpreter";
test("original codewars tests pass", function () {
    expect(
        interpret(["mov a -10", "mov b a", "inc a", "dec b", "jnz a -2"])
    ).toEqual({ a: 0, b: -20 });

    expect(
        interpret(["mov a 5", "inc a", "dec a", "dec a", "jnz a -1", "inc a"])
    ).toEqual({ a: 1 });
});

test("execute mov a <- 5 works", function () {
    const regs: Registers = {};
    const ipOffset = execute(
        { command: "mov", toRegister: "a", sourceRegOrValue: 5 },
        regs
    );

    expect(ipOffset).toEqual(1);
    expect(regs).toEqual({ a: 5 });
});

test("execute mov a <- b works", function () {
    const regs: Registers = { b: 99 };
    const ipOffset = execute(
        { command: "mov", toRegister: "a", sourceRegOrValue: "b" },
        regs
    );

    expect(ipOffset).toEqual(1);
    expect(regs).toEqual({ a: 99, b: 99 });
});

test("execute inc a", function () {
    const regs: Registers = { a: 3, b: 100 };
    const ipOffset = execute({ command: "inc", registerName: "a" }, regs);

    expect(ipOffset).toEqual(1);
    expect(regs).toEqual({ a: 4, b: 100 });
});

test("execute dec b", function () {
    const regs: Registers = { a: 3, b: 100 };
    const ipOffset = execute({ command: "dec", registerName: "b" }, regs);

    expect(ipOffset).toEqual(1);
    expect(regs).toEqual({ a: 3, b: 99 });
});

test("execute jnz c -5 does not jump when not zero", function () {
    const regs: Registers = { a: 0, b: 100, c: 2 };
    const ipOffset = execute(
        { command: "jnz", registerName: "a", offset: -5 },
        regs
    );

    expect(ipOffset).toEqual(1);
    expect(regs).toEqual({ a: 0, b: 100, c: 2 });
});

test("execute jnz c -5 jumps when zero", function () {
    const regs: Registers = { a: 3, b: 100, c: 0 };
    const ipOffset = execute(
        { command: "jnz", registerName: "a", offset: -5 },
        regs
    );

    expect(ipOffset).toEqual(-5);
    expect(regs).toEqual({ a: 3, b: 100, c: 0 });
});
