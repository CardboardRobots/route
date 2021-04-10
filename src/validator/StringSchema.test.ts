import { string } from './StringSchema';

describe('StringSchema', function () {
    describe('validate', function () {
        const schema = string();
        it('should validate string', function () {
            const result = schema.validate('a');
            expect(result).toBe('a');
        });

        it('should validate string', function () {
            const result = schema.validate('a');
            expect(result).toBe('a');
        });

        it('should validate string', function () {
            const result = schema.validate('a');
            expect(result).toBe('a');
        });

        it('should validate string', function () {
            const result = schema.validate('a');
            expect(result).toBe('a');
        });
    });
});
