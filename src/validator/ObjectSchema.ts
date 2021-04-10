import { RequiredSchema, ValidationSchema } from './ValidationSchema';

export type ObjectOutput<T> = {
    [Property in keyof T]: T extends RequiredSchema<infer U>
        ? U
        : T extends ValidationSchema<any, infer V>
        ? V | undefined
        : never;
};

export type ObjectInput<T> = {
    [Property in keyof T]: T[Property] extends ObjectSchema<infer U> ? ObjectInput<U> : string;
};

export class ObjectSchema<T extends Record<string, ValidationSchema<any, any>>> extends ValidationSchema<
    ObjectInput<T>,
    ObjectOutput<T>
> {
    members: T;

    constructor(members: T) {
        super();
        this.members = members;
    }

    validate(value: any): ObjectOutput<T> {
        switch (typeof value) {
            case 'object': {
                const result: ObjectOutput<T> = {} as any;
                Object.entries(this.members).forEach(([name, member]) => {
                    result[name as keyof T] = member.validate(value[name]);
                });
                return value;
            }
            default:
                throw new Error('validation error');
        }
    }

    cast(value: any): ObjectOutput<T> {
        const result: ObjectOutput<T> = {} as any;
        Object.entries(this.members).forEach(([name, member]) => {
            result[name as keyof T] = member.cast(value[name]);
        });
        return value;
    }

    extend<U extends Record<string, ValidationSchema<any, any>>>(extendedMembers: U) {
        return new ObjectSchema({ ...this.members, ...extendedMembers });
    }

    pick<U extends keyof T>(keys: U[]) {
        const result: Pick<T, U> = {} as any;
        keys.reduce((result, key) => {
            result[key] = this.members[key];
            return result;
        }, result);
        return new ObjectSchema(result);
    }

    omit<U extends keyof T>(keys: U[]) {
        const result: Omit<T, U> = {} as any;
        Object.keys(this.members)
            .filter((key) => !keys.includes(key as U))
            .reduce((result, key) => {
                result[key as keyof typeof result] = this.members[key] as any;
                return result;
            }, result);
        return new ObjectSchema(result);
    }
}

export function object<T>(
    members: {
        [Property in keyof T]: ValidationSchema<Partial<T[Property]>, T[Property]>;
    }
) {
    return new ObjectSchema(members);
}
