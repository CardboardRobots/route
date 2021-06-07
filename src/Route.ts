import { stringToRegex, getParameterNames } from './RouteUtil';

export interface RouteFunction {
    (...args: (string | number)[]): string;
}

export type MatchArray<T> = {
    [Property in keyof T]?: string;
};

export type MatchParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
    ? MatchArray<P>
    : never;

export interface ParseFunction<T extends RouteFunction, U> {
    (...args: MatchParameters<T>): U;
}

export class Route<
    T extends RouteFunction,
    U extends ParseFunction<T, any> = (...args: MatchParameters<T>) => MatchParameters<T>
> {
    readonly route: T;
    readonly parser: U;
    names: Parameters<T>;
    definition: string;
    regExp: RegExp;

    constructor(route: T);
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    constructor(route: T, parser: U, names?: Parameters<T>);
    constructor(
        route: any,
        parser: any = defaultParseFunction,
        names: Parameters<T> = getParameterNames(route) as any
    ) {
        this.route = route;
        this.parser = parser;
        this.names = names;
        this.definition = route(...this.names.map((name) => `:${name}`));
        this.regExp = stringToRegex(this.definition);
    }

    run(...args: Parameters<T>) {
        return this.route(...args);
    }

    match(pathname: string): ReturnType<U> | undefined {
        const matches = pathname.match(this.regExp);
        if (matches) {
            return this.parser(...(matches.splice(1) as any));
        } else {
            return undefined;
        }
    }

    setNames(...names: Parameters<T>) {
        this.names = names;
        this.definition = this.route(...this.names.map((name) => `:${name}`));
        this.regExp = stringToRegex(this.definition);

        return this;
    }

    toString() {
        return this.definition;
    }

    toRegExp() {
        return this.regExp;
    }
}

export function createRoute<T extends RouteFunction>(
    route: T
): Route<T, (...args: MatchParameters<T>) => MatchParameters<T>>;
export function createRoute<T extends RouteFunction, U extends ParseFunction<T, any>>(route: T, parser: U): Route<T, U>;
export function createRoute(route: any, parser: any = defaultParseFunction) {
    return new Route(route, parser);
}

export function defaultParseFunction<T extends RouteFunction>(...args: MatchParameters<T>) {
    return [...args];
}
