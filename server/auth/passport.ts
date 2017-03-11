
const passport = require("koa-passport");
const { Strategy } = require("passport-local")

import { UserModel, IUserModel } from "../model"
import { errors, uid, env } from "../utils";
import { logger } from "../logging"

// any error would propagate with `next(error)` call
// these two function is current used by passport session strategy
// also could be used by other strategies.
passport.serializeUser((user: IUserModel, done) => {
    // done(null, user.uuid)
})

passport.deserializeUser(async (uuid, done) => {
    // try {
    //     let access = getUserAccess();
    //     const model = await access.findOne({ uuid: uuid })
    //     if (model) {
    //         done(null, model);
    //     } else {
    //         done(new Error("no user found for: " + uuid))
    //     }
    // } catch (err) {
    //     done(err)
    // }
})
// passport can paired with session, if auth success, a `passport.user` field would add to 
// session object which is the result of serializeUser

// passport-core include a session strategy which get deserialized user from session"s `passport.user`
// via deserializeUser method
passport.use("local", new Strategy({
    usernameField: "email",
    passwordField: "password",
    // passReqToCallback: true,
}, async (/*req,*/ email, password, done) => {
    // const ctx = req.ctx;
    // try {
    //     if (!email || !password) {
    //         return done(new errors.ValidationError("invalid request"));
    //     }
    //     let user = await User.loginPr(email, password)

    //     if (!user) {
    //         return done(new errors.AppError("invalid username or password", 401))
    //     } else {
    //         done(null, user);
    //     }
    // } catch (err) {
    //     done(err)
    // }
}))

