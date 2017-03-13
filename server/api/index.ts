import * as Router from "koa-router"
import * as app from "./app";

export const apiRoutes = new Router({ prefix: "/api" })
apiRoutes.use(app.routes.routes())