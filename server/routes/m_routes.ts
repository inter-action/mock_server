import * as Router from "koa-router";
import * as boom from "boom";
import * as _ from "lodash";

import { CaseModel, ICaseModel } from "../model"

export const router = new Router({ prefix: "/_m" })

const isEqual = (src, target) => {
    return Object.keys(src).every(k => {
        return _.isEqual(src[k], target[k])
    })
};
router.all("*", async ctx => {
    let path = ctx.path;
    let payload = ctx.request.body;
    let req_method = ctx.method.toLowerCase();
    let cases = await CaseModel.repo.find({ fullRoutePath: path.replace("/_m/", ""), method: req_method }, undefined, undefined, { updatedAt: -1 });
    if (cases.length === 0) throw boom.notFound("no_case_found");
    else {
        let compare;
        if (req_method === "get" || req_method === "delete") {
            compare = (e: ICaseModel) => {
                return isEqual(JSON.parse(e.query), ctx.query)
            }
        } else if (req_method === "post" || req_method === "put") {
            compare = (e: ICaseModel) => {
                return isEqual(JSON.parse(e.body), payload)
            }
        }
        let target_case = cases.find(e => compare(e));
        if (target_case) {
            let te = target_case as any as ICaseModel
            if (te.responseType === "json") {
                ctx.body = JSON.parse(te.response)
            } else {
                ctx.body = te.response;
            }
        }
        else throw boom.notFound("no_case_found")
    }
});
