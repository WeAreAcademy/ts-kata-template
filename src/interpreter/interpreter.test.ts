import {
    execute,
    assemblerInterpreter,
    interpretInstructions,
    MsgStructure,
    substituteRegisterValues,
} from "./interpreter";
import { OtherState, Registers } from "./types";

describe.skip("smaller tests", () => {
    test("original codewars tests pass", function () {
        const res = interpretInstructions([
            "mov a, -10",
            "mov b, a",
            "inc a",
            "dec b",
            "foo:",
            "cmp a, 0",
            "jg foo",
            "end",
        ]);
        if (res === -1) {
            throw new Error("unexpected.  todo: use jest for this");
        }
        // expect(res.registers).toEqual({ a: 0, b: -20 });

        const res2 = interpretInstructions([
            "mov a, 5",
            "inc a",
            "dec a",
            "dec a",
            "label2:",
            "cmp 0, 0",
            "jl label2",
            "inc a",
            "end",
        ]);

        if (res2 === -1) {
            throw new Error("unexpected.  todo: use jest for this");
        }
        // expect(res2.registers).toEqual({ a: 1 });
    });

    function defaultState() {
        return {
            lastComparisonResult: null,
            storedOutput: null,
            labels: {},
            stack: [],
        };
    }

    function defaultInstructionPointer() {
        return 100;
    }
    test("execute mov a <- 5 works", function () {
        const regs: Registers = {};
        const ipOffset = execute(
            { command: "mov", toRegister: "a", sourceRegOrValue: 5 },
            regs,
            defaultState(),
            defaultInstructionPointer()
        );

        expect(ipOffset).toEqual(1);
        expect(regs).toEqual({ a: 5 });
    });

    test("execute mov a <- b works", function () {
        const regs: Registers = { b: 99 };
        const ipOffset = execute(
            { command: "mov", toRegister: "a", sourceRegOrValue: "b" },
            regs,
            defaultState(),
            defaultInstructionPointer()
        );

        expect(ipOffset).toEqual(1);
        expect(regs).toEqual({ a: 99, b: 99 });
    });

    test("execute mul a, b works", function () {
        const regs: Registers = { b: 3 };
        const ipOffset = execute(
            { command: "mul", toRegister: "b", sourceRegOrValue: "b" },
            regs,
            defaultState(),
            defaultInstructionPointer()
        );

        expect(ipOffset).toEqual(1);
        expect(regs).toEqual({ b: 9 });
    });

    test("execute add a, b works", function () {
        const regs: Registers = { b: 3 };
        const ipOffset = execute(
            { command: "add", toRegister: "b", sourceRegOrValue: 10 },
            regs,
            defaultState(),
            defaultInstructionPointer()
        );

        expect(regs).toEqual({ b: 13 });
        expect(ipOffset).toEqual(1);
    });

    test("execute inc a", function () {
        const regs: Registers = { a: 3, b: 100 };
        const ipOffset = execute(
            { command: "inc", registerName: "a" },
            regs,
            defaultState(),
            defaultInstructionPointer()
        );

        expect(ipOffset).toEqual(1);
        expect(regs).toEqual({ a: 4, b: 100 });
    });

    test("execute dec b", function () {
        const regs: Registers = { a: 3, b: 100 };
        const ipOffset = execute(
            { command: "dec", registerName: "b" },
            regs,
            defaultState(),
            defaultInstructionPointer()
        );

        expect(ipOffset).toEqual(1);
        expect(regs).toEqual({ a: 3, b: 99 });
    });

    // test("execute label", function () {
    //     const otherState: OtherState = defaultState();

    //     expect(otherState.labels.foo).toEqual(undefined);
    //     expect(otherState.labels.bar).toEqual(undefined);

    //     const ipOffset = execute(
    //         { command: "label", label: "foo" },
    //         {},
    //         otherState,
    //         22
    //     );

    //     expect(otherState.labels.foo).toEqual(22);
    //     expect(ipOffset).toEqual(1);

    //     execute({ command: "label", label: "bar" }, {}, otherState, 33);

    //     expect(otherState.labels.foo).toEqual(22);
    //     expect(otherState.labels.bar).toEqual(33);
    //     expect(ipOffset).toEqual(1);
    // });

    test("execute cmp", function () {
        const regs: Registers = { a: 3, b: 2, c: 0 };
        const otherState: OtherState = defaultState();

        const ipOffset = execute(
            { command: "cmp", x: 3, y: "b" },
            regs,
            otherState,
            defaultInstructionPointer()
        );

        expect(otherState.lastComparisonResult).toEqual("gt");
        expect(regs).toEqual({ a: 3, b: 2, c: 0 });
        expect(ipOffset).toEqual(1);
    });

    test("execute cmp", function () {
        const regs: Registers = { a: 3, b: 2, c: 0 };
        const otherState: OtherState = {
            ...defaultState(),
            lastComparisonResult: "eq",
        };

        const ipOffset = execute(
            { command: "cmp", x: "b", y: "a" },
            regs,
            otherState,
            defaultInstructionPointer()
        );

        expect(otherState.lastComparisonResult).toEqual("lt");
        expect(regs).toEqual({ a: 3, b: 2, c: 0 });
        expect(ipOffset).toEqual(1);
    });

    test("execute msg", function () {
        const regs: Registers = { a: 3, b: 2, c: 0 };
        const otherState: OtherState = {
            ...defaultState(),
            lastComparisonResult: "eq",
        };

        const ipOffset = execute(
            {
                command: "msg",
                message: [{ type: "literal", value: "blah blah blah" }],
            },
            regs,
            otherState,
            defaultInstructionPointer()
        );

        expect(otherState.storedOutput).toEqual("blah blah blah");
    });

    test("message substitution", function () {
        const components: MsgStructure = [
            { type: "literal", value: "10/2=" },
            { type: "registerName", value: "k" },
            { type: "literal", value: "the end" },
        ];
        const regs: Registers = { k: 5 };

        expect(substituteRegisterValues(components, regs)).toBe(
            "10/2=5the end"
        );
    });
});
describe("assemblerInterpreter", () => {
    test.skip("raw program parses", () => {
        const rawProgramText = `
; My first program
mov  a, 5
inc  a
call function
msg  '(5+1)/2 = ', a    ; output message
end

function:
    div  a, 2
    ret
`;
        expect(assemblerInterpreter(rawProgramText)).toEqual("(5+1)/2 = 3");
    });

    test.skip("factorial", () => {
        var program_factorial = `mov   a, 5
mov   b, a
mov   c, a
call  proc_fact
call  print
end

proc_fact:
    dec   b
    mul   c, b
    cmp   b, 1
    jne   proc_fact
    ret

print:
    msg   a, '! = ', c ; output text
    ret`;

        expect(assemblerInterpreter(program_factorial)).toEqual("5! = 120");
    });

    test.skip("fib", () => {
        var program_fibonacci = `mov   a, 8            ; value
mov   b, 0            ; next
mov   c, 0            ; counter
mov   d, 0            ; first
mov   e, 1            ; second
call  proc_fib
call  print
end

proc_fib:
    cmp   c, 2
    jl    func_0
    mov   b, d
    add   b, e
    mov   d, e
    mov   e, b
    inc   c
    cmp   c, a
    jle   proc_fib
    ret

func_0:
    mov   b, c
    inc   c
    jmp   proc_fib

print:
    msg   'Term ', a, ' of Fibonacci series is: ', b        ; output text
    ret`;

        expect(assemblerInterpreter(program_fibonacci)).toEqual(
            "Term 8 of Fibonacci series is: 21"
        );
    });

    test.skip("program_mod", () => {
        var program_mod = `mov   a, 11           ; value1
mov   b, 3            ; value2
call  mod_func
msg   'mod(', a, ', ', b, ') = ', d        ; output
end

; Mod function
mod_func:
    mov   c, a        ; temp1
    div   c, b
    mul   c, b
    mov   d, a        ; temp2
    sub   d, c
    ret`;
        expect(assemblerInterpreter(program_mod)).toEqual("mod(11, 3) = 2");
    });

    test.skip("program_gcd", () => {
        var program_gcd = `mov   a, 81         ; value1
mov   b, 153        ; value2
call  init
call  proc_gcd
call  print
end

proc_gcd:
    cmp   c, d
    jne   loop
    ret

loop:
    cmp   c, d
    jg    a_bigger
    jmp   b_bigger

a_bigger:
    sub   c, d
    jmp   proc_gcd

b_bigger:
    sub   d, c
    jmp   proc_gcd

init:
    cmp   a, 0
    jl    a_abs
    cmp   b, 0
    jl    b_abs
    mov   c, a            ; temp1
    mov   d, b            ; temp2
    ret

a_abs:
    mul   a, -1
    jmp   init

b_abs:
    mul   b, -1
    jmp   init

print:
    msg   'gcd(', a, ', ', b, ') = ', c
    ret`;
        expect(assemblerInterpreter(program_gcd)).toEqual("gcd(81, 153) = 9");
    });

    test.skip("program_fail", () => {
        var program_fail = `call  func1
call  print
end

func1:
    call  func2
    ret

func2:
    ret

print:
    msg 'This program should return -1'`;
        expect(assemblerInterpreter(program_fail)).toEqual(-1);
    });

    test("program_power", () => {
        var program_power = `mov   a, 2            ; value1
mov   b, 10           ; value2
mov   c, a            ; temp1
mov   d, b            ; temp2
call  proc_func
call  print
end

proc_func:
    cmp   d, 1
    je    continue
    mul   c, a
    dec   d
    call  proc_func

continue:
    ret

print:
    msg a, '^', b, ' = ', c
    ret`;
        expect(assemblerInterpreter(program_power)).toEqual("2^10 = 1024");
    });
});
