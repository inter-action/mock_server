import * as Router from "koa-router"
import * as boom from "boom";

import { validator } from "../utils";
import { AppModel } from "../model"

export const apiRoutes = new Router({ prefix: "/api" })
    .post("/app", async (ctx) => {
        let payload = ctx.request.body
        if (!validator.onlyChars(payload.name)) throw boom.badRequest("name is invalid")
        else {
            ctx.body = await AppModel.create(payload.name)
        }
    })
    // return a bearer token for auth. using username & password
    .put("/app/:id", async (ctx) => {

    })
    .get("/", (ctx) => {
        ctx.body = "Hello api";
    })
