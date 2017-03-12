import * as chai from "chai"
const glob = require("glob");

// KnexInstance
import { server } from "../../server/index"

const chaiHttp = require("chai-http")
const should = chai.should()

const expect = chai.expect
chai.use(chaiHttp);




// load from config/test.env, but i hate context switching
let methodBlackList: RegExp[] = [
    // /^tv_show/gi
];


export function runWithFilter(cb: (module: any, key: string, hasSideEffect: boolean) => void) {
    // options is optional
    glob(`${__dirname}/api/**/*.js`, function (err, files) {
        if (err) throw err;
        else {
            for (let i = 0; i < files.length; i++) {
                let filepath: string = files[i];
                let filename = filepath.substring(filepath.lastIndexOf("/") + 1);
                if (filename.indexOf("test") !== -1) {
                    console.log("skip test with no test keyword: ", filename);
                    continue;
                }

                if (methodBlackList.some(r => r.test(filename))) {
                    console.log(`skip test:  ${filename} in blacklist `);
                    continue;
                }

                let module = require(filepath);
                Reflect.ownKeys(module).forEach((k: string) => {
                    if (typeof module[k] !== "function") return;

                    let isSerial = false
                    if (/serial$/i.test(k)) {
                        isSerial = true
                    }
                    cb(module, k, isSerial)
                })
            }
        }

    })
}

export { chai, chaiHttp, server, should, expect }