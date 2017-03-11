export abstract class Option<T> {
    protected value: T;

    abstract get(): T
    abstract isEmpty(): boolean
    abstract flatMap<B>(f: (t: T) => Option<B>): Option<B>

    exists(): boolean {
        return !this.isEmpty();
    }

    map<B>(f: (t: T) => B): Option<B> {
        return this.flatMap(() => new Some<B>(f(this.value)))
    }

    getOrElse(f: () => T): T {
        if (this.exists()) return this.value
        else return f();
    }
}



export class Some<T> extends Option<T>{
    static create<T>(value: T) {
        return new Some<T>(value)
    }

    constructor(value: T) { super(); this.value = value; };

    get(): T {
        return this.value;
    }


    isEmpty(): boolean {
        return false;
    }

    flatMap<B>(f: (t: T) => Option<B>): Option<B> {
        return f(this.value)
    }
}


class INone extends Option<any> {
    constructor() { super(); };

    get(): never {
        throw new Error("invalid get on None type");
    }

    isEmpty(): boolean {
        return true;
    }

    flatMap<B>(_: (t) => Option<B>): Option<B> {
        return this;
    }
}

export const None = new INone()
