const ava = require("ava");
import { Option, Some, None } from "../option";

let TAG = "#Option<T>: ";

ava(`${TAG} type assign should work as expected`, _ => {
    let opt1: Option<string>;
    opt1 = None;

    let opt2: Option<string>;
    opt2 = Some.create("tfds");

    let opt3 = None;
    let optNumber: Option<number>;
    optNumber = opt3;

    // string=>number
    optNumber = opt1.map(_ => 1)
});

ava(`${TAG} Some operations should work as expected`, t => {
    let opt = Some.create("abc");
    t.true(opt.exists());
    t.true(!opt.isEmpty());
    t.is(opt.get(), "abc");
    t.is(opt.getOrElse(() => "def"), "abc");
    t.is(opt.map(str => str + "d").get(), "abcd");
    t.is(opt.flatMap(str => Some.create(str + "d")).get(), "abcd")
});

ava(`${TAG} None operations should work as expected`, t => {
    let opt = None;
    t.true(!opt.exists());
    t.true(opt.isEmpty());
    let err = t.throws(() => opt.get())
    t.true(err != null);
    t.is(opt.getOrElse(() => "def"), "def");
    let err1 = t.throws(() => opt.flatMap(str => Some.create(str + "d")).get())
    t.true(err1 != null);
});

