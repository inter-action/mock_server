if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "dev";
}
import { initConfig } from "./config";
initConfig().catch(e => {
    console.error("init config failed: ", e);
    process.exit(1);
})

import * as http from "http"
import * as path from "path";

import * as Koa from "koa"
import * as bodyParser from "koa-bodyparser"

// necessary until koa-generic-session has been updated to support koa@2
const convert = require("koa-convert");
const session = require("koa-generic-session");
const passport = require("koa-passport");
require("./auth/passport");

const views = require("koa-views");
const send = require("koa-send");


import { logger } from "./logging"
import { env } from "./utils"
import { createErrMiddleware } from "./middleware"
import { initRoutes } from "./routes"

const koa = new Koa()

// session require this
koa.keys = [env.ENV_UTILS.getEnvConfig("APP_COOKIE_KEY")]
koa.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date().getTime() - start.getTime();
    logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
})
    .use(createErrMiddleware())
    .use(async function (ctx, next) {
        if (/\.js$|\.css$/.test(ctx.path)) {
            await send(ctx, ctx.path, { root: path.resolve(__dirname, "../../client/dist") });
        } else {
            await next();
        }
    })
    .use(views(path.resolve(__dirname, "../views"), { extension: "ejs", map: { ejs: "ejs" }, }))
    .use(bodyParser({ jsonLimit: "1kb" }))
    .use(convert(session()))
    // req._passport.session = req.session[passport._key];
    // extract data with key `passport._key` from session
    // passport._key is the result of `serializeUser`
    .use(passport.initialize())
    // passport core lib include a session strategy. on success it would set a serialized user 
    // on req object.
    // var property = req._passport.instance._userProperty || "user";
    // req[property] = user;
    .use(passport.session())


initRoutes(koa);




// handle uncaught error. replace console with logger 
koa.on("error", function (error: any) {
    // skip logging HttpError all together
    // todo: find a better way to discriminate HttpError
    if (error.__proto__.status != null || error.status) {
        return;
    }
    // if (error.isBoom) {
    //     error.expose = true; // skip default koa error handling
    //     return;
    // }
    logger.error(error, "server error");
});

// gracefully exit or handle error here
process.on("uncaughtException", (err) => {
    logger.error(err, "fatal err occurred, ready to shutdown");
    // todo: in order to let app work more robustly, maybe i should remove the following line.
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    logger.error(reason, promise);
    process.exit(1);
});

let port = env.ENV_UTILS.getEnvConfig("APP_PORT");
const server = http.createServer(koa.callback()).listen(port)
logger.info(`server started at localhost:${port}, with Env: ${process.env.NODE_ENV}`)
export { koa, server };