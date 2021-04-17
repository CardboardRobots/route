export class ValidationError extends Error {
    property?: string | number | symbol;
    constructor(message: string, property?: string | number | symbol) {
        super(message);
        this.property = property;
    }

    toString() {
        return this.property ? `${String(this.property)}: ${this.message}` : this.message;
    }
}

export enum ValidationMessage {
    IsNullish = 'is nullish',
    NotAnObject = 'not an object',
    NotANumber = 'not a number',
    NotAString = 'not a string',
}
