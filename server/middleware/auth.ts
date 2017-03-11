import * as Router from "koa-router";



type Next = () => Promise<any>


// used for app router
export async function ensureUser(ctx: Router.IRouterContext, next: Next) {
    if (ctx.isUnauthenticated()) {
        return ctx.throw(401);
    }
    next()
}