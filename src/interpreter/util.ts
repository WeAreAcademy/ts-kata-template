export class UnreachableCodeError extends Error {
    constructor(myNever: never, message: string) {
        super(message);
    }
}
