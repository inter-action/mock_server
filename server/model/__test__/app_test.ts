const ava = require("ava")

import { AppModel } from "../app";
import { connect } from "../../db/mongoose";


ava.before(async _ => {
    await connect();
})

let tag = "#User: "
ava(`${tag} create app should success`, async t => {
    await AppModel.create("some_app");
    let result = await AppModel.findByName("some_app");
    if (result.isEmpty()) throw new Error("insertion failed")
});

ava(`${tag} create app should fail on invalid field`, async t => {
    try {
        await AppModel.create("some.@app");
    } catch (error) {
        t.true(error != null)

        try {
            return await AppModel.create("");
        } catch (error) {
            return t.true(error != null)
        }
    }
    return t.fail("should not reach here")
});

ava(`${tag} update app should success`, async t => {
    await AppModel.create("some_app");
    let result = await AppModel.findByName("some_app");
    let saved = result.get()
    saved.name = "some_other_app"
    let updated = await saved.save();
    t.is(updated.name, "some_other_app")
});


ava(`${tag} update app should fail on invalid field`, async t => {
    await AppModel.create("some_app");
    let result = await AppModel.findByName("some_app");
    let saved = result.get()
    saved.name = ""
    try {
        await saved.save();
    } catch (error) {
        return t.true(error != null)
    }
    t.fail("should not reach here")
});