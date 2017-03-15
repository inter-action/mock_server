import * as Router from "koa-router";
const passport = require("koa-passport");


// import { paths } from "../utils/index";
// import { logger } from "../logging";



export const appRouts = new Router()



appRouts.get("/logout", async ctx => {
    ctx.logout();
    ctx.redirect("/")
});

appRouts.get("/login", async (ctx) => {
    await ctx.render("login")
})

appRouts.post("/login", async (ctx, next) => {
    let nuser = null;
    await passport.authenticate("local", (user) => {
        nuser = user;
    })(ctx, next);
    if (nuser) {
        ctx.logIn(nuser, (error) => {
            if (error) throw error;
            else ctx.redirect("/")
        })
    } else {
        await ctx.render("error", { msg: "incorrect username or password" });
    }
})

// let createReactMiddleware = require(paths.clientPath("routes/server")).default;
// appRouts.get(/\.html$/g, async (ctx, next) => {
//     // pass data down to reatjs component
//     ctx.serverData = { "username": "alexander" };
//     await next();
// }, createReactMiddleware(logger));

// // has to be put in the last. Otherwise this route would get matched before others
// appRouts.get("/", async (ctx) => {
//     ctx.redirect("/index.html");
//     // let option: any = {}
//     // if (ctx.req.user) {
//     //     option.user = ctx.req.user
//     // }
//     // await ctx.render("index", option);
// })
