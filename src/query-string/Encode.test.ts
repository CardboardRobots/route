import { encode } from './Encode';

describe('encode', function () {
    it('should not create a query string for undefined', function () {
        const result = encode({
            key: undefined,
        });
        expect(result).toBe('');
    });

    it('should create a query string for true', function () {
        const result = encode({
            key: true,
        });
        expect(result).toBe('key=true');
    });

    it('should create a query string for number', function () {
        const result = encode({
            key: 1,
        });
        expect(result).toBe('key=1');
    });

    it('should create a query string for string', function () {
        const result = encode({
            key: 'value',
        });
        expect(result).toBe('key=value');
    });

    it('should create an encoded query string for strings', function () {
        const input = {
            nameA: 'first last',
        };
        const output = encode(input);
        expect(output).toBe('nameA=first%20last');
    });

    it('should create a query string for null', function () {
        const result = encode({
            key: null,
        });
        expect(result).toBe('key=null');
    });

    it('should create a query string for multiple primitives', function () {
        const result = encode({
            nameA: 'valueA',
            nameB: 'valueB',
        });
        expect(result).toBe('nameA=valueA&nameB=valueB');
    });

    it('should create a query string for arrays', function () {
        const result = encode({
            key: [1, 2, 3],
        });
        expect(result).toBe('key[]=1&key[]=2&key[]=3');
    });

    it('should create an entry object for objects', function () {
        const result = encode({
            key: {
                nameA: 'valueA',
                nameB: 'valueB',
            },
        });
        expect(result).toBe('key[nameA]=valueA&key[nameB]=valueB');
    });

    it('should encode complex objects', function () {
        const result = encode({
            nameA: [
                1,
                2,
                {
                    nameC: 'valueC',
                },
            ],
            nameB: 'valueB',
        });
        expect(result).toBe('nameA[]=1&nameA[]=2&nameA[][nameC]=valueC&nameB=valueB');
    });
});
