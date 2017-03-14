const ava = require("ava")

import { UserModel } from "../user";
import { test } from "../../utils"

test.cleanDbAtEachTest(ava);

let tag = "#User: "
ava(`${tag} create user`, async t => {
    await UserModel.createUser("Steve", "Flying", "someemail@qq.com");
    let result = await UserModel.findByUsername("Steve");
    if (result.isEmpty()) throw new Error("insertion failed")
    let user = result.get();
    user.email = "somewicked@ele.me"
    await user.save();
    // console.log("updated: ", updated);
});

