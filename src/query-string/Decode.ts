import { ParseError, ParseMessage } from './ParseError';

export function decode<
    T = {
        [index: string]: string;
        [index: number]: string;
    }
>(queryString: string): T {
    const graphEntries = createEntries(queryString);
    const graphNode = createNodes(graphEntries);
    return graphNode.decode();
}

function createEntries(query: string) {
    const entries: GraphEntry[] = [];
    const parts = query.split('&');
    for (const part of parts) {
        const pieces = part.split('=');
        if (pieces.length !== 2) {
            continue;
        }
        const key = pieces[0];
        const value = pieces[1];
        if (!key) {
            continue;
        }
        entries.push(new GraphEntry(key, value));
    }
    return entries;
}

function createNodes(graphEntries: GraphEntry[]) {
    const root = new GraphNode();
    graphEntries.forEach((entry) => {
        root.addEntry(entry);
    });
    return root;
}

class GraphEntry {
    static regex = /[a-zA-Z0-9\-_.!~*'()%]+|\[\]/g;
    key: string;
    keys: string[];
    value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.keys = this.parseKey(key);
        this.value = value;
    }

    private parseKey(key: string) {
        const matches = key.match(GraphEntry.regex);
        return (
            matches?.map((match) => {
                switch (match) {
                    case '[]':
                        return '';
                    default:
                        return match;
                }
            }) || []
        );
    }
}

class GraphNode {
    values: string[] = [];
    children: Record<string, GraphNode> = {};

    addValue(value: string) {
        const values = value.split(',');
        for (const value of values) {
            this.values.push(decodeURIComponent(value));
        }
    }

    addEntry(graphEntry: GraphEntry, index = 0) {
        const key = graphEntry.keys[index];
        let node = this.children[key];
        if (!node) {
            node = new GraphNode();
            this.children[key] = node;
        }
        const nextIndex = index + 1;
        if (graphEntry.keys.length === nextIndex) {
            node.addValue(graphEntry.value);
        } else {
            node.addEntry(graphEntry, nextIndex);
        }
    }

    decode<T>() {
        const output: T = this.createOutput() as any;
        return output;
    }

    createOutput<T>(): T {
        const keys = Object.keys(this.children);
        const outputObject: Record<string, any> = {};
        const outputArray: any[] = [];
        keys.forEach((key) => {
            const entry = this.children[key];
            if (key === '') {
                outputArray.push(entry.createOutput());
            } else {
                outputObject[key] = entry.createOutput();
            }
        });
        this.values.forEach((value) => {
            outputArray.push(value);
        });
        if (outputArray.length) {
            if (Object.keys(outputObject).length) {
                throw new ParseError(ParseMessage.CannotParse);
            } else {
                return outputArray.length > 1 ? outputArray : outputArray[0];
            }
        } else {
            return outputObject as T;
        }
    }
}
