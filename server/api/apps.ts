import * as Router from "koa-router"
import * as boom from "boom";

import { validator } from "../utils";
import { AppModel } from "../model"


export const routes = new Router({ prefix: "/app" })
    .get("/", async ctx => {
        ctx.body = await AppModel.repo.find({})
    })
    .post("/", async (ctx) => {
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
    .put("/:id", async (ctx) => {
        if (!ctx.params.id) throw boom.badRequest("id_is_required")
        let payload = ctx.request.body;
        let option = await AppModel.repo.findById(ctx.params.id)
        if (option.isEmpty()) throw boom.badRequest("no_entity_found")
        delete payload._id
        await AppModel.repo.update(ctx.params.id, payload)
        ctx.status = 200;
    })
    .delete("/:id", async ctx => {
        if (!ctx.params.id) throw boom.badRequest("id_is_required")
        await AppModel.repo.delete(ctx.params.id)
        ctx.status = 200;
    })
    .get("/:id", async ctx => {
        if (!ctx.params.id) throw boom.badRequest("id_is_required")
        let option = await AppModel.repo.findById(ctx.params.id);
        if (option.isEmpty()) throw boom.badRequest("no_entity_found")
        else ctx.body = option.get()
    })
