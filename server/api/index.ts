import * as Router from "koa-router"
import * as koaPassport from "koa-passport";

export const apiRoutes = new Router({ prefix: "/api" })
    .post("/register", async (ctx) => {
    })
    // return a bearer token for auth. using username & password
    .post("/auth", koaPassport.authenticate("local", { session: false }), async (ctx) => {
    })
    .get("/", (ctx) => {
        ctx.body = "Hello api";
    })
