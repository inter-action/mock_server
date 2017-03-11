import * as Boom from "boom";
import { apiRoutes } from "../api"
import { appRouts } from "./app_routes";


export const Routes = {
    api: apiRoutes,
    app: appRouts
}


export function initRoutes(app: any) {
    appRouts.use(Routes.api.routes())
    app
        .use(appRouts.routes())
        .use(appRouts.allowedMethods({
            throw: true,
            notImplemented: () => Boom.notImplemented(),
            methodNotAllowed: () => Boom.methodNotAllowed()
        }));

}