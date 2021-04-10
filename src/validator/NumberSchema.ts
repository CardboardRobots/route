import { ValidationSchema } from './ValidationSchema';

export class NumberSchema extends ValidationSchema<any, number> {
    validate(value: any) {
        const output = parseFloat(value);
        if (isNaN(output) && !isFinite(output)) {
            throw new Error('validation error');
        }
        return output;
    }

    cast(value: any) {
        return parseFloat(value);
    }
}

export function number() {
    return new NumberSchema();
}
