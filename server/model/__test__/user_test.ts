const ava = require("ava")

import { UserModel } from "../user";
import { connect } from "../../db/mongoose";


ava.before(async _ => {
    await connect();
})

let tag = "#User: "
ava.only(`${tag} create user`, async t => {
    await UserModel.createUser("Steve", "Flying", "someemail@qq.com");
    let result = await UserModel.findByUsername("Steve");
    if (result.isEmpty()) throw new Error("insertion failed")
    let user = result.get();
    user.email = "somewicked@ele.me"
    let updated = await user.save();
    // console.log("updated: ", updated);
});

