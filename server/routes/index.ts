import * as Boom from "boom";
import * as cors from "koa2-cors";

import { apiRoutes } from "../api"
import { appRouts } from "./app_routes";
import { router as mRouter } from "./m_routes";


const corsOption = {
    origin: "*",
}

export function initRoutes(app: any) {
    appRouts.use(cors(corsOption), apiRoutes.routes())
    appRouts.use(mRouter.routes())
    app
        .use(appRouts.routes())
        .use(appRouts.allowedMethods({
            throw: true,
            notImplemented: () => Boom.notImplemented(),
            methodNotAllowed: () => Boom.methodNotAllowed()
        }));

}