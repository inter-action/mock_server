import * as mongoose from "mongoose";
import { logger } from "../logging";

// replace promise
// http://mongoosejs.com/docs/promises.html
(mongoose as any).Promise = Promise;
// mongoose.set("debug", true)
let hasConnected = false;

export async function connect() {
    let dburl = "mongodb://127.0.0.1/my_database";
    if (hasConnected) return Promise.resolve();
    else {
        return new Promise((resolve, reject) => {
            mongoose.connect(dburl, { config: { autoIndex: true } }, (err) => {
                if (err) {
                    logger.error("failed to connect mongodb: ", err)
                    reject(err)
                } else {
                    hasConnected = true
                    resolve();
                }
            });
        })
    }
}

export function getConnection() {
    return mongoose.connection
}

export const COLLECTIONS = {
    app: "mockapp", case: "case", user: "user"
}
