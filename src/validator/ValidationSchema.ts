export abstract class ValidationSchema<INPUT, OUTPUT> {
    abstract validate<T extends INPUT>(value: T): OUTPUT;

    abstract cast<T extends INPUT>(value: T): OUTPUT;

    required(): RequiredSchema<this> {
        return new RequiredSchema(this);
    }
}

export type ValidationSchemaInput<T> = T extends ValidationSchema<infer U, any> ? U : never;
export type ValidationSchemaOutput<T> = T extends ValidationSchema<any, infer U> ? U : never;

export class RequiredSchema<INNER extends ValidationSchema<any, any>> extends ValidationSchema<
    ValidationSchemaInput<INNER>,
    ValidationSchemaOutput<INNER>
> {
    inner: INNER;

    constructor(inner: INNER) {
        super();
        this.inner = inner;
    }

    validate(value: any) {
        if (value === undefined || value === null) {
            throw new Error('validation error');
        }
        return this.inner.validate(value);
    }

    cast(value: any) {
        return this.inner.cast(value);
    }
}
