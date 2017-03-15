import * as Router from "koa-router"
import * as boom from "boom";

import { validator } from "../utils";
import { AppModel, ICaseModel } from "../model"
import { CaseModel } from "../model/case";

/*
    app: any,
    fullRoutePath: string, // used to case db read
    routePath: string,
    query: string,
    body: string,
    response: string,
*/
function checkJSONField(value) {
    if (value && !validator.validator.isJSON(value)) return false;
    return true
}

export const routes = new Router({ prefix: "/cases" })
    .post("/", async (ctx) => {
        let payload = ctx.request.body;
        if (!payload.appid) throw boom.badRequest("appid is required");
        let npayload = payload as ICaseModel
        if (!validator.isHttpMethod(npayload.method)) throw boom.badRequest("method is required");
        if (!npayload.routePath) throw boom.badRequest("route path is required");
        if (!checkJSONField(npayload.query)) throw boom.badRequest("query field is invalid");
        if (!checkJSONField(npayload.body)) throw boom.badRequest("body field is invalid");
        let app = await AppModel.repo.findById(payload.appid);
        if (app.isEmpty()) throw boom.badRequest("invalid id");

        let created;
        let method = npayload.method.toLowerCase()
        if (method === "get" || method === "delete") {
            created = await CaseModel.create(app.get(), method, npayload.routePath, npayload.query, undefined, npayload.response, npayload.responseType)
        } else if (method === "post" || method === "put") {
            created = await CaseModel.create(app.get(), method, npayload.routePath, undefined, npayload.body, npayload.response, npayload.responseType)
        } else {
            created = await CaseModel.create(app.get(), method, npayload.routePath, npayload.query, npayload.body, npayload.response, npayload.responseType)
        }
        ctx.body = created;
    }).put("/:id", async (ctx) => {
        if (!ctx.params.id) throw boom.badRequest("id_is_required")
        let payload = ctx.request.body;
        // update app relation is not allowed;
        let icase = payload as ICaseModel;
        delete icase.app
        // todo: extract this
        delete icase._id;
        await CaseModel.repo.update(ctx.params.id, icase)
        ctx.status = 200;
    })
    .delete("/:id", async ctx => {
        if (!ctx.params.id) throw boom.badRequest("id_is_required")
        await CaseModel.repo.delete(ctx.params.id)
        ctx.status = 200;
    })
    .get("/:id", async ctx => {
        if (!ctx.params.id) throw boom.badRequest("id_is_required")
        let option = await CaseModel.repo.findById(ctx.params.id, [{ path: "app", select: "name" }]);
        if (option.isEmpty()) throw boom.notFound("no_entity_found")
        else ctx.body = option.get()
    })

