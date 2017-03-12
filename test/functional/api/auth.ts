const ava = require("ava");
import { chai, server } from "../func_test_util";

let TAG = "API_TEST:rister&login";

export function withSideEffect() {
    // ava.cb(`${TAG}: register should success`, t => {
    //     chai.request(server)
    //         .post("/api/register")
    //         .send({
    //             username: "alexafdsf",
    //             email: "243127392@qq.com",
    //             password: "fuckyouguys"
    //         })
    //         .end(function (_, res) {
    //             res.should.have.status(200);
    //             t.end();
    //         });
    // })
}


export function noSideEffect() {
    // ava.cb(`${TAG}: auth success`, t => {
    //     chai.request(server)
    //         .get("/m/some_app/a/b").query({
    //             email: "bran_stark@ele.me",
    //             password: "fuckyouguys",
    //         })
    //         .end(function (_, res) {
    //             t.is(res.status, 200);
    //             t.truthy(typeof res.body.data === "string" && res.body.data);
    //             t.end();
    //         });
    // })
}