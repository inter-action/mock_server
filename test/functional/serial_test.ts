const ava = require("ava");
// import { connect, getConnection } from "../../server/db/mongoose";

import { runWithFilter } from "./func_test_util"

// ava.before(async _ => {
//     await connect();
// })

// ava.beforeEach(async _ => {
//     await getConnection().dropDatabase()
// })

runWithFilter((module, key, isSerial) => {
    if (!isSerial) return;
    else module[key]();
})

ava(`dumb test prevent ava from abnormal shutdown`, t => {
    t.is(1, 1);
});
