// https://github.com/Microsoft/TypeScript/issues/280
// https://github.com/Microsoft/TypeScript/issues/10859
import * as Koa from "koa"
import * as http from "http"

declare module "koa-router" {
    export interface IRouterContext extends Koa.Context {
        session: {
            passport: {
                user: number
            },
        },
        serverData?: any,
        render: (tpl_path: string, opts?: object) => Promise<any>,
    }
}


declare module "http" {
    export interface IncomingMessage {
        user?: any
    }
}


