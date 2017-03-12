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
    /*
    - return
        { n: 1, nModified: 1, ok: 1 }
    */
    .put("/app/:id", async (ctx) => {
        if (!ctx.params.id) throw boom.badRequest("id_is_required")
        let payload = ctx.request.body;
        let option = await AppModel.repo.findById(ctx.params.id)
        if (option.isEmpty()) throw boom.badRequest("no_entity_found")
        await AppModel.repo.update(ctx.params.id, payload)
        ctx.status = 200;
    })
    .delete("/app/:id", async ctx => {
        if (!ctx.params.id) throw boom.badRequest("id_is_required")
        await AppModel.repo.delete(ctx.params.id)
        ctx.status = 200;
    })
    .get("/app/:id", async ctx => {
        if (!ctx.params.id) throw boom.badRequest("id_is_required")
        let option = await AppModel.repo.findById(ctx.params.id);
        if (option.isEmpty()) throw boom.badRequest("no_entity_found")
        else ctx.body = option.get()
    })
