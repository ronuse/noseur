
import { NoseurObject } from "../constants/Types";

export class FunctionStackManager {

    push: Function;
    popSmoke: Function;
    stack: NoseurObject<Function[]> = {};

    constructor() {
        this.push = this.register;
        this.popSmoke = this.invokeAllAndClear;
    }

    register(key: string, ...funsies: Function[]) {
        if (!this.stack || !key || !funsies) return;
        if (!(key in this.stack)) this.stack[key] = [] as Function[];
        this.stack[key].push(...funsies)
    }

    unRegister(key: string, ...funsies: Function[]) {
        if (!this.stack || !key || !funsies) return;
        if (!(key in this.stack)) this.stack[key] = [] as Function[];
        for (const funsy of funsies) {
            const index = this.stack[key].indexOf(funsy);
		    if (index > -1) this.stack[key].splice(index, 1);
        };
    }

    pop(key: string) {
        if (!this.stack || !key) return;
        if (!(key in this.stack) || !this.stack[key].length) return;
        return this.stack[key][this.stack[key].length-1];
    }

    popAll(key: string) {
        if (!this.stack || !key) return [];
        if (!(key in this.stack) || !this.stack[key].length) return [];
        const funsies = this.stack[key];
        delete this.stack[key];
        return funsies;
    }

    invokeAll(key: string, ...params: any[]) {
        if (!this.stack || !key) return;
        if (!(key in this.stack)) return;
        this.stack[key].forEach(funsy => funsy(...params));
    }

    invokeAllAndClear(key: string, ...params: any[]) {
        if (!this.stack || !key) return;
        if (!(key in this.stack)) return;
        this.stack[key].forEach(funsy => funsy(...params));
        delete this.stack[key];
    }

}

