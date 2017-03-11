import * as Router from "koa-router";
import * as boom from "boom";
const passport = require("koa-passport");

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


// has to be put in the last. Otherwise this route would get matched before others
appRouts.get("/", async (ctx) => {
    ctx.body = "hello koa"
})
