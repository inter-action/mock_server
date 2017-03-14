import * as Boom from "boom";
import { apiRoutes } from "../api"
import { appRouts } from "./app_routes";
import { router as mRouter } from "./m_routes";



export function initRoutes(app: any) {
    appRouts.use(apiRoutes.routes())
    appRouts.use(mRouter.routes())
    app
        .use(appRouts.routes())
        .use(appRouts.allowedMethods({
            throw: true,
            notImplemented: () => Boom.notImplemented(),
            methodNotAllowed: () => Boom.methodNotAllowed()
        }));

}