import * as path from "path";


import { logger, initLogger } from "../logging";
import { connect } from "../db";

export async function initConfig() {
    configEnv();
    initLogger();
    await connect();
}

export function configEnv() {
    const env = process.env.NODE_ENV;

    if (!env) {
        throw new Error("process.env.NODE_ENV is not defined");
    }
    let configPath = path.resolve(__dirname, `./dotenv/${env}.env`);
    logger.info("config env using path: ", configPath);
    let result = require("dotenv").config({ path: configPath });
    if (result.error) {
        throw result.error
    }

}
