export abstract class Either<L, R> {
    abstract isLeft(): boolean;
    abstract isRight(): boolean;
    abstract mapRight<C>(f: (R) => C): Either<L, C>;
    abstract mapLeft<C>(f: (L) => C): Either<C, R>;
    abstract getLeft(): L;
    abstract getRight(): R;
}


export class Left<L, R> extends Either<L, R> {
    constructor(private value: L) {
        super()
    }

    isLeft(): boolean {
        return true;
    }

    isRight(): boolean {
        return false;
    }

    mapRight<C>(_: (R) => C): Either<L, C> {
        return new Left<L, C>(this.value);
    }

    mapLeft<C>(f: (L) => C): Either<C, R> {
        return new Left<C, R>(f(this.value));
    }

    getLeft(): L {
        return this.value;
    }

    getRight(): never {
        throw new Error("invalid operation on left value")
    }
}



export class Right<L, R> extends Either<L, R> {
    constructor(private value: R) {
        super()
    }

    isLeft(): boolean {
        return false;
    }

    isRight(): boolean {
        return true;
    }

    mapRight<C>(f: (R) => C): Either<L, C> {
        return new Right<L, C>(f(this.value));
    }

    mapLeft<C>(_: (L) => C): Either<C, R> {
        return new Right<C, R>(this.value);
    }

    getLeft(): never {
        throw new Error("invalid operation on right value")
    }

    getRight(): R {
        return this.value;
    }
}
