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
    return t.fail("should_not_reach_here")
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
    t.fail("should_not_reach_here")
});

ava.only(`${tag} update should fail on invalid field #2`, async t => {
    let created = await AppModel.create("some_app");
    created.name = ""
    try {
        await AppModel.repo.update(created._id, created)
    } catch (error) {
        t.true(error != null)
        return t.pass();
    }
    t.fail("should_not_reach_here")
});


ava(`${tag} findById should work`, async t => {
    let created = await AppModel.create("some_app");
    let result = await AppModel.repo.findById(created._id);
    t.true(result != null)
});


