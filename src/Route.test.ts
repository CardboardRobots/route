import { stringToRegex } from './RouteUtil';
import { Route, defaultParseFunction } from './Route';

describe('Route', function () {
    describe('constructor', function () {
        describe('default', function () {
            const routeFunction = (id: string | number, name: string | number) => `/test/${id}/${name}`;
            const route = new Route(routeFunction, defaultParseFunction);

            it('should set route', function () {
                expect(route.route).toBe(routeFunction);
            });

            it('should set names', function () {
                expect(route.names).toStrictEqual(['id', 'name']);
            });

            it('should set definition', function () {
                expect(route.definition).toBe('/test/:id/:name');
            });

            it('should set regExp', function () {
                expect(route.regExp).toStrictEqual(stringToRegex('/test/:id/:name'));
            });

            it('should set parser', function () {
                expect(route.parser).toBe(defaultParseFunction);
            });
        });

        describe('parser', function () {
            const routeFunction = (id: string | number, name: string | number) => `/test/${id}/${name}`;
            const route = new Route(routeFunction, defaultParseFunction, ['first', 'second']);

            it('should set parser', function () {
                const result = route.toString();
                expect(result).toBe('/test/:first/:second');
                expect(route.names).toStrictEqual(['first', 'second']);
            });
        });

        describe('names', function () {});
    });

    describe('run', function () {
        const route = new Route((id, name) => `/test/${id}/${name}`);

        it('should create route strings', function () {
            const result = route.run(1, 'value');
            expect(result).toBe('/test/1/value');
        });
    });

    describe('match', function () {
        describe('default parser', function () {
            const route = new Route((id, name) => `/test/${id}/${name}`);

            it('should match route strings', function () {
                const result = route.match('/test/1/value');
                expect(result).toStrictEqual(['1', 'value']);
            });
        });

        describe('custom parser', function () {
            const route = new Route(
                (id, name) => `/test/${id}/${name}`,
                (id, name) => ({ id, name })
            );

            it('should create match objects', function () {
                const result = route.match('/test/1/value');
                expect(result).toStrictEqual({
                    id: '1',
                    name: 'value',
                });
            });
        });
    });

    describe('toString', function () {
        it('should create parameter string', function () {
            const route = new Route((id, name) => `/test/${id}/${name}`);

            const result = route.toString();
            expect(result).toBe('/test/:id/:name');
        });
    });

    describe('toRegExp', function () {
        it('should create a RegExp', function () {
            const route = new Route((id, name) => `/test/${id}/${name}`);

            const result = route.toRegExp();
            expect(result).toStrictEqual(stringToRegex('/test/:id/:name'));
        });
    });

    describe('setNames', function () {
        it('should set names', function () {
            const route = new Route((id, name) => `/test/${id}/${name}`);
            route.setNames('first', 1);
            const result = route.toString();
            expect(route.names).toStrictEqual(['first', 1]);
            expect(result).toBe('/test/:first/:1');
        });

        it('should return the route', function () {
            const route = new Route((id, name) => `/test/${id}/${name}`);
            const result = route.setNames('first', 'second');
            expect(route).toBe(result);
        });
    });
});
