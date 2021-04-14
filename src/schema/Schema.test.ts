import * as Schema from './Schema';

describe('Schema', function () {
    it('should create a NumberSchema', function () {
        const validator = Schema.number();
        const result = validator.validate(1);
        expect(result).toBe(1);
    });

    it('should create a StringSchema', function () {
        const validator = Schema.string();
        const result = validator.validate('a');
        expect(result).toBe('a');
    });

    it('should create an ObjectSchema', function () {
        const validator = Schema.object({
            value: Schema.string(),
            nested: Schema.object({
                test: Schema.number(),
            }),
        });
        const picked = validator.pick(['value']);
        picked.validate({
            value: 'a',
        });
        const omitted = validator.omit(['nested']);
        omitted.validate({
            value: 'a',
        });
        const result = validator.validate({
            value: 1,
            nested: 'a',
        });
        expect(result).toStrictEqual({
            value: 'a',
        });
    });
});
