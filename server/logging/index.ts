import * as pino from "pino"

import { ENV_UTILS } from "../utils/env";
import * as Constants from "../utils/constants";

export class LOGGER_LEVELS {
    static readonly fatal = "fatal"
    static readonly error = "error"
    static readonly warn = "warn"
    static readonly info = "info"
    static readonly debug = "debug"
    static readonly trace = "trace"
}


function createLogger() {
    let logger = pino({
        name: Constants.APP_NAME,
    });
    // extract logger type
    type Logger = typeof logger;
    if (ENV_UTILS.is_test()) {
        return { info: console.log, error: console.log, warn: console.log, trace: console.log } as any as Logger;
    } else {
        return logger
    }
}

export const logger = createLogger();
export function initLogger() {
    console.log(process.env.LOG_LEVEL)
    logger.level = process.env.LOG_LEVEL || "debug";
    logger.info("logging level: ", logger.level);
}
