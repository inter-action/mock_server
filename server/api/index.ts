import * as Router from "koa-router";

import * as cors from "koa2-cors";
import * as apps from "./apps";
import * as cases from "./cases";

export const apiRoutes = new Router({ prefix: "/api" })
apiRoutes.use(apps.routes.routes())
apiRoutes.use(cases.routes.routes())
// cors pre-flight
apiRoutes.options("*", cors())
