import { ValidationError, ValidationMessage } from './ValidationError';
import { ValidationSchema } from './ValidationSchema';

export class NumberSchema extends ValidationSchema<any, number> {
    validate(value: any, property?: string) {
        const output = parseFloat(value);
        if (isNaN(output) && !isFinite(output)) {
            throw new ValidationError(ValidationMessage.NotANumber, property);
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
