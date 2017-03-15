import * as Router from "koa-router"
import * as boom from "boom";

import { validator } from "../utils";
import { AppModel, IAppModel } from "../model"


export const routes = new Router({ prefix: "/apps" })
    .get("/", async ctx => {
        ctx.body = await AppModel.repo.find({}, undefined, undefined, { updatedAt: -1 })
    })
    .post("/", async (ctx) => {
        let payload = ctx.request.body
        if (!validator.onlyChars(payload.name)) throw boom.badRequest(`name is invalid: ${payload.name}`)
        // todo: naive approch, could faild under mass concurrent requests.
        let find = await AppModel.findByName(payload.name);
        if (find.exists()) throw boom.badRequest("duplicate app name");
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
        let iapp = payload as IAppModel;
        delete iapp._id
        delete iapp.cases
        await AppModel.repo.update(ctx.params.id, iapp)
        ctx.status = 200;
    })
    .delete("/:id", async ctx => {
        if (!ctx.params.id) throw boom.badRequest("id_is_required")
        await AppModel.repo.delete(ctx.params.id)
        ctx.status = 200;
    })
    .get("/:id", async ctx => {
        if (!ctx.params.id) throw boom.badRequest("id_is_required")
        let option = await AppModel.repo.findById(ctx.params.id, ["cases"]);
        if (option.isEmpty()) throw boom.badRequest("no_entity_found")
        else ctx.body = option.get()
    })
