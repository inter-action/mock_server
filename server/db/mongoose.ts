import * as mongoose from "mongoose";
import { logger } from "../logging";

// replace promise
// http://mongoosejs.com/docs/promises.html
(mongoose as any).Promise = Promise;
mongoose.set("debug", true)
let hasConnected = false;
export async function connect() {

    hasConnected = true
    let dburl = "mongodb://127.0.0.1/my_database";

    return new Promise((resolve, reject) => {
        mongoose.connect(dburl, (err) => {
            if (err) {
                logger.error("failed to connect mongodb: ", err)
                reject(err)
            } else {
                resolve()
            }
        });
    })
}

export function getConnection() {
    return mongoose.connection
}
