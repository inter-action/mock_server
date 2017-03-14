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
        payload = payload as ICaseModel
        if (!validator.isHttpMethod(payload.method)) throw boom.badRequest("method is required");
        if (!payload.routePath) throw boom.badRequest("route path is required");
        if (!checkJSONField(payload.query)) throw boom.badRequest("query field is invalid");
        if (!checkJSONField(payload.body)) throw boom.badRequest("body field is invalid");
        let app = await AppModel.repo.findById(payload.appid);
        if (app.isEmpty()) throw boom.badRequest("invalid id");
        let created;
        let method = payload.method.toLowerCase()
        if (method === "get" || method === "delete") {
            created = await CaseModel.create(app.get(), method, payload.routePath, payload.query, undefined, payload.response)
        } else if (method === "post" || method === "put") {
            created = await CaseModel.create(app.get(), method, payload.routePath, undefined, payload.body, payload.response)
        } else {
            created = await CaseModel.create(app.get(), method, payload.routePath, payload.query, payload.body, payload.response)
        }
        ctx.body = created;
    }).put("/:id", async (ctx) => {
        if (!ctx.params.id) throw boom.badRequest("id_is_required")
        let payload = ctx.request.body;
        // update app relation is not allowed;
        let _case = payload as ICaseModel;
        delete _case.app
        // todo: extract this
        delete _case._id;
        await CaseModel.repo.update(ctx.params.id, _case)
        ctx.status = 200;
    })


