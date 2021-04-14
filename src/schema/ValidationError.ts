export class ValidationError extends Error {
    property?: string;
    constructor(message: string, property?: string) {
        super(message);
        this.property = property;
    }

    toString() {
        return this.property ? `${this.property}: ${this.message}` : this.message;
    }
}

export enum ValidationMessage {
    IsNullish = 'is nullish',
    NotAnObject = 'not an object',
    NotANumber = 'not a number',
    NotAString = 'not a string',
}
