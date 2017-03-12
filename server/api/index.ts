import * as Router from "koa-router"
import * as koaPassport from "koa-passport";
import * as boom from "boom";

import { validator } from "../utils";
import { AppModel } from "../model"

export const apiRoutes = new Router({ prefix: "/api" })
    .post("/app", async (ctx) => {
        let payload = ctx.request.body
        if (!validator.onlyChars(payload.name)) throw boom.badRequest("name is invalid")
        else {
            await AppModel.create(payload.name)
            ctx.status = 200
        }
    })
    // return a bearer token for auth. using username & password
    .post("/auth", koaPassport.authenticate("local", { session: false }), async (ctx) => {
    })
    .get("/", (ctx) => {
        ctx.body = "Hello api";
    })
