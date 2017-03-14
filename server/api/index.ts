import * as Router from "koa-router";
import * as apps from "./apps";
import * as cases from "./cases";


export const apiRoutes = new Router({ prefix: "/api" })
apiRoutes.use(apps.routes.routes())
apiRoutes.use(cases.routes.routes())
