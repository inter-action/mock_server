const ava = require("ava");
import { chai, server, getAppName } from "../func_test_util";

let tag = "app:";

export function doInSerial() {
}


/*
    app: any,
    fullRoutePath: string, // used to case db read
    routePath: string,
    query: string,
    body: string,
    response: string,
*/
export function doInParellel() {
    ava.cb(`${tag}: create case`, t => {
        let agent = chai.request.agent(server);
        agent.post("/api/apps").send({
            name: getAppName(),
        }).then(resp => {
            return resp.body._id
        }).then(_id => {
            return agent.post("/api/cases").send({
                appid: _id,
                method: "get",
                routePath: "some_path",
                query: `{"some": "json"}`,
                body: `{"body": "hey, i am a body"}`,
                response: `{"resp": "iam a resp"}`
            })
        }).then(resp => {
            t.is(resp.status, 200);
            t.end()
        }).catch(e => {
            console.log(e.response.text)
            t.end(e);
        })
    });


    ava(`${tag}: update case`, async t => {
        try {
            let agent = chai.request.agent(server);
            let resp = await agent.post("/api/apps").send({ name: getAppName() })
            let appid = resp.body._id;

            resp = await agent.post(`/api/cases`).send({
                appid,
                method: "get",
                routePath: "some_path",
                query: `{"some": "json"}`,
                body: `{"body": "hey, i am a body"}`,
                response: `{"resp": "iam a resp"}`
            })
            resp.body.routePath = "some_other_apth";
            let caseId = resp.body._id;
            resp.body._id = "bad_shouldn't be updated with body"
            resp = await agent.put(`/api/cases/${caseId}`).send(resp.body);
            t.is(resp.status, 200)
        } catch (e) {
            console.log(e.response.text); throw e;
        }
    })


    ava(`${tag}: get case should work`, async t => {
        try {
            let agent = chai.request.agent(server);
            let resp = await agent.post("/api/apps").send({ name: getAppName() })
            let appid = resp.body._id;

            resp = await agent.post(`/api/cases`).send({
                appid,
                method: "get",
                routePath: "some_path",
                query: `{"some": "json"}`,
                body: `{"body": "hey, i am a body"}`,
                response: `{"resp": "iam a resp"}`
            })
            resp.body.routePath = "some_other_apth";
            let caseId = resp.body._id;
            resp.body._id = "bad_shouldn't be updated with body"
            resp = await agent.get(`/api/cases/${caseId}`);
            t.is(resp.status, 200)
            t.is(resp.body.routePath, "some_path")
        } catch (e) {
            console.log(e.response.text); throw e;
        }
    });

    ava(`${tag}: delete case should work`, async t => {
        try {
            let agent = chai.request.agent(server);
            let resp = await agent.post("/api/apps").send({ name: getAppName() })
            let appid = resp.body._id;

            resp = await agent.post(`/api/cases`).send({
                appid,
                method: "get",
                routePath: "some_path",
                query: `{"some": "json"}`,
                body: `{"body": "hey, i am a body"}`,
                response: `{"resp": "iam a resp"}`
            })
            resp.body.routePath = "some_other_apth";
            let caseId = resp.body._id;
            resp.body._id = "bad_shouldn't be updated with body"
            resp = await agent.del(`/api/cases/${caseId}`);
            t.is(resp.status, 200)
        } catch (e) {
            console.log(e.response.text); throw e;
        }
    });
}