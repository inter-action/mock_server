const ava = require("ava");

import { runWithFilter } from "./func_test_util"

ava.before(async _ => {
});

ava.beforeEach(async _ => {
});


runWithFilter((module, key, hasSideEffect) => {
    if (!hasSideEffect) return;
    else module[key]();
})

ava(`dumb test`, t => {
    t.is(1, 1);
});

