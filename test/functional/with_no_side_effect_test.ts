const ava = require("ava");

import { runWithFilter } from "./func_test_util"
// import { runTvShowTest } from "./_tv_shows"
// import { runRegisterTest } from "./_auth";

ava.before(async _ => {
});

// runTvShowTest();
// runRegisterTest();

runWithFilter((module, key, hasSideEffect) => {
    if (hasSideEffect) return;
    else module[key]();
})

ava(`dumb test`, t => {
    t.is(1, 1);
});


