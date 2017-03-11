const ava = require("ava");

import { ENV_UTILS } from "../env";
import { configEnv } from "../../config";

let origin_env = process.env;

ava.beforeEach(_ => {
    configEnv()
})

ava.afterEach(async _ => {
    process.env = origin_env;
});

ava("dotenv: command line should override .env file", t => {
    t.is(process.env.TEST_OVERRIDE, "test");
    t.pass();
});

// Generate a v4 UUID (random)
const uuidV4 = require("uuid/v4");

ava.skip("dotenv: command line should override .env file", _ => {
    console.log(uuidV4())
});
