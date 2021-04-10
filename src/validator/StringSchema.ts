import { ValidationSchema } from './ValidationSchema';

export class StringSchema extends ValidationSchema<any, string> {
    validate(value: any): string {
        switch (typeof value) {
            case 'string':
                return value;
            case 'number':
            case 'symbol':
            case 'bigint':
            case 'boolean':
                return value.toString();
            default:
                throw new Error('validation error');
        }
    }

    cast(value: any): string {
        switch (typeof value) {
            case 'string':
                return value;
            case 'undefined':
                return '';
            case 'object':
                return value ? JSON.stringify(value) : '';
            case 'number':
            case 'symbol':
            case 'bigint':
            case 'boolean':
            case 'function':
            default:
                return value.toString();
        }
    }
}

export function string() {
    return new StringSchema();
}
