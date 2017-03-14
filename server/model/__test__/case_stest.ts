const ava = require("ava")

import { CaseModel } from "../case";
import { AppModel } from "../app";
import { test } from "../../utils"

test.cleanDbAtEachTest(ava);

let tag = "#Case: "
ava(`${tag} create case should success`, async t => {
    let saved = await AppModel.create("some_app");
    let saved_case = await CaseModel.create(saved, "get", "some/path", `{"name": "alex"}`, `{"body": "ok"}`, "some_resonse")
    t.is(saved_case.fullRoutePath, "some_app/some/path")

    let find_saved_app = await AppModel.repo.findOne({ name: "some_app" }, ["cases"]);
    let app = find_saved_app.get();
    t.true(app.cases.length !== 0)
    t.is(app.cases[0].routePath, "some/path")
});
