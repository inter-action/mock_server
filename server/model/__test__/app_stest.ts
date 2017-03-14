const ava = require("ava")

import { AppModel } from "../app";
import { CaseModel } from "../case";
import { ICaseModel } from "../common/imodel";
import { test } from "../../utils"

test.cleanDbAtEachTest(ava);


let tag = "#App: "
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

// todo: cant figure out a proper way to enable unique index on name field.
// ava.only.serial(`${tag} create app should fail on duplicate record`, async t => {
//     await AppModel.create("some_app");
//     try {
//         await AppModel.create("some_app");
//     } catch (error) {
//         return t.true(error != null)
//     }
//     return t.fail("should_not_reach_here")
// });


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

ava(`${tag} update should fail on invalid field #2`, async t => {
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

ava(`${tag} relation should work`, async t => {
    let created = await AppModel.create("some_app");
    let case1 = <ICaseModel>{
        method: "get",
        routePath: "some/path",
        app: created._id,
        fullRoutePath: "some_app/some/path"
    }
    case1 = await CaseModel.repo.create(case1)
    created.cases.push(case1)

    let case2 = <ICaseModel>{
        method: "get",
        routePath: "some/path2",
        app: created._id,
        fullRoutePath: "some_app/some/path2"
    }
    case2 = await CaseModel.repo.create(case2)
    created.cases.push(case2)
    await created.save();
    let result = await AppModel.repo.findById(created._id, ["cases"]);
    t.true(result.get().cases.length === 2)
});


ava(`${tag} relation, delete should affect on both end #1`, async t => {
    let created = await AppModel.create("some_app");
    let case1 = <ICaseModel>{
        method: "get",
        routePath: "some/path",
        app: created._id,
        fullRoutePath: "some_app/some/path"
    }
    case1 = await CaseModel.repo.create(case1)
    created.cases.push(case1)

    let case2 = <ICaseModel>{
        method: "get",
        routePath: "some/path2",
        app: created._id,
        fullRoutePath: "some_app/some/path2"
    }
    case2 = await CaseModel.repo.create(case2)
    created.cases.push(case2)
    await created.save();
    let result = await AppModel.repo.findById(created._id, ["cases"]);
    t.true(result.get().cases.length === 2)
    await CaseModel.repo.delete(case2._id);
    result = await AppModel.repo.findById(created._id, ["cases"]);
    t.true(result.get().cases.length === 1)
});


ava(`${tag} relation, delete should affect on both end #2`, async t => {
    let created = await AppModel.create("some_app");
    let case1 = <ICaseModel>{
        method: "get",
        routePath: "some/path",
        app: created._id,
        fullRoutePath: "some_app/some/path"
    }
    case1 = await CaseModel.repo.create(case1)
    created.cases.push(case1)

    let case2 = <ICaseModel>{
        method: "get",
        routePath: "some/path2",
        app: created._id,
        fullRoutePath: "some_app/some/path2"
    }
    case2 = await CaseModel.repo.create(case2)
    created.cases.push(case2)
    await created.save();

    await AppModel.repo.delete(created._id);

    let _case = await CaseModel.repo.findById(case2._id, ["app"])
    t.true(_case.get().app === null)
    t.true(_case.get().routePath === "some/path2")
});


