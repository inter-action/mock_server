const ava = require("ava");
import { chai, server } from "../func_test_util";

let tag = "app:";

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
    ava.cb(`${tag}: create app`, t => {
        chai.request(server)
            .post("/api/app").send({
                name: "some_app",
            })
            .end(function (_, res) {
                t.is(res.status, 200);
                t.end();
            });
    })

    ava.cb(`${tag}: create app should failed on invalid name input`, t => {
        chai.request(server)
            .post("/api/app").send({
                name: "bran_stark@ele.me",
            })
            .end(function (_, res) {
                t.not(res.status, 200);
                t.end();
            });
    })
}