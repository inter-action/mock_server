import * as AuthMiddlewares from "./auth";

export { AuthMiddlewares }

export function createErrMiddleware() {
    return async (ctx, next) => {
        try {
            await next()
        } catch (err) {
            if (err.isBoom) {
                let output = err.output;
                ctx.status = output.statusCode;
                Reflect.ownKeys(output.headers).forEach(k => {
                    ctx.response.set(k as string, output.headers[k]);
                });
                ctx.body = output.payload;
            } else {
                ctx.status = err.status || 500
                ctx.body = err.message
                // this line could be replace with a simple throw
                ctx.app.emit("error", err, ctx)
            }
        }
    }
}

