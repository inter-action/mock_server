const ava = require("ava");
import { Either, Left, Right } from "../either";

let TAG = "#Either: ";

ava(`${TAG} type assign should work as expected`, _ => {
    let a: Either<Error, number>;
    a = new Left<Error, number>(new Error(""))

    let b: Either<Error, number>;
    b = new Right<Error, number>(3);

});

ava(`${TAG} left operations should work as expected`, t => {
    let a: Either<string, number>;
    a = new Left<string, number>("abc");
    t.true(a.isLeft(), "Left#isLeft")
    t.is(a.getLeft(), "abc", "Left#getLeft");
    let err = t.throws(() => a.getRight())
    t.true(err != null, "left#getRight should throws");
    t.is(a.mapLeft(() => 10).getLeft(), 10, "Left#mapLeft");
    t.is(a.mapRight(() => "righton").getLeft(), "abc", "Left#mapRight");
});


ava(`${TAG} left operations should work as expected`, t => {
    let a: Either<string, number>;
    a = new Right<string, number>(33);
    t.true(a.isRight(), "Right#isRight")
    t.is(a.getRight(), 33, "Right#getRight");
    let err = t.throws(() => a.getLeft())
    t.true(err != null, "Right#getLeft should throws");
    t.is(a.mapRight(() => 10).getRight(), 10, "Right#mapRight");
    t.is(a.mapLeft(() => "righton").getRight(), 33, "Right#mapLeft");
});
