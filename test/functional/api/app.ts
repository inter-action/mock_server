const ava = require("ava");
import { chai, server, getAppName } from "../func_test_util";

let tag = "app:";

export function doInSerial() {
}


export function doInParellel() {
    ava.cb(`${tag}: create app`, t => {
        chai.request(server)
            .post("/api/apps").send({
                name: getAppName(),
            })
            .end(function (_, res) {
                t.is(res.status, 200);
                t.end();
            });
    })

    ava.cb(`${tag}: create app should failed on invalid name input`, t => {
        chai.request(server)
            .post("/api/apps").send({
                name: "bran_stark@ele.me",
            })
            .end(function (_, res) {
                t.not(res.status, 200);
                t.end();
            });
    })


    ava.cb(`${tag}: update app should work`, t => {
        let agent = chai.request.agent(server);
        agent.post("/api/apps").send({ name: getAppName() }).then(resp => {
            let _id = resp.body._id
            return agent.put(`/api/apps/${_id}`).send({ name: "some_other_app" })
        }).then(resp => {
            t.is(resp.status, 200);
            t.end();
        }).catch(e => {
            t.fail("failed: ", e);
            t.end();
        })
    })

    ava.cb(`${tag}: get app should work`, t => {
        let agent = chai.request.agent(server);
        let appname = getAppName()
        agent.post("/api/apps").send({ name: appname }).then(resp => {
            let _id = resp.body._id
            return agent.get(`/api/apps/${_id}`)
        }).then(resp => {
            t.is(resp.body.name, appname);
            t.end();
        }).catch(e => {
            t.fail("failed: ", e);
            t.end();
        })
    });

    ava.cb(`${tag}: delete app should work`, t => {
        let agent = chai.request.agent(server);
        let _id;
        agent.post("/api/apps").send({ name: getAppName() }).then(resp => {
            _id = resp.body._id
            return agent.del(`/api/apps/${_id}`)
        }).then(resp => {
            t.is(resp.status, 200);
            // couldnt return use `return agent` here, will cause `catch` to be executed
            agent.get(`/api/apps/${_id}`).end((err, resp) => {
                t.true(err != null)
                console.log("resp.body", resp.body)
                console.log("resp.status", resp.status)
                t.not(resp.status, 200);
                t.end();
            })
        }).catch(e => {
            console.log(e);
            t.fail("failed: ", e);
            t.end();
        })
    });
}