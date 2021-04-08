export class ValidationError extends Error {}

export enum ValidationMessage {
    NotAString = 'not a string',
    NotANumber = 'not a number',
}
