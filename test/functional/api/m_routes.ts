const ava = require("ava");
import { chai, server } from "../func_test_util";

let tag = "m_routes:";

export function doInSerial() {
    ava(`${tag}: get should work`, async t => {
        try {
            let agent = chai.request.agent(server);
            let resp = await agent.post("/api/apps").send({ name: "some_app" })
            let appid = resp.body._id;

            resp = await agent.post(`/api/cases`).send({
                appid,
                method: "get",
                routePath: "some_path",
                query: `{"some": "json"}`,
                body: `{"body": "hey, i am a body"}`,
                response: `{"resp": "i_resp"}`
            })
            resp = await agent.get("/_m/some_app/some_path").query({ some: "json" });
            t.is(resp.body.resp, "i_resp")
        } catch (e) {
            console.log(e.response.text); throw e;
        }
    });

    ava(`${tag}: get should fail on nonmatch query`, async t => {
        try {
            let agent = chai.request.agent(server);
            let resp = await agent.post("/api/apps").send({ name: "some_app" })
            let appid = resp.body._id;

            resp = await agent.post(`/api/cases`).send({
                appid,
                method: "get",
                routePath: "some_path",
                query: `{"some": "json"}`,
                body: `{"body": "hey, i am a body"}`,
                response: `{"resp": "i_resp"}`
            })
            try {
                await agent.get("/_m/some_app/some_path").query({ someoj: "json" })
            } catch (error) {
                t.true(error != null);
                t.is(error.response.status, 404)
            }
        } catch (e) {
            console.log(e.response.text); throw e;
        }
    });

    ava(`${tag}: post should work`, async t => {
        try {
            let agent = chai.request.agent(server);
            let resp = await agent.post("/api/apps").send({ name: "some_app" })
            let appid = resp.body._id;

            resp = await agent.post(`/api/cases`).send({
                appid,
                method: "post",
                routePath: "some_path",
                query: `{"some": "json"}`,
                body: `{"body": "i_body"}`,
                response: `{"resp": "i_resp"}`
            })
            resp = await agent.post("/_m/some_app/some_path").send({ body: "i_body" });
            t.is(resp.body.resp, "i_resp")
        } catch (e) {
            console.log(e.response.text); throw e;
        }
    });

    ava.only(`${tag}: empty query should match anything`, async t => {
        try {
            let agent = chai.request.agent(server);
            let resp = await agent.post("/api/apps").send({ name: "some_app" })
            let appid = resp.body._id;

            resp = await agent.post(`/api/cases`).send({
                appid,
                method: "get",
                routePath: "some_path",
                query: `{}`,
                body: `{"body": "i_body"}`,
                response: `{"resp": "i_resp"}`
            })
            resp = await agent.get("/_m/some_app/some_path").send({ whatever: "wiw" });
            t.is(resp.body.resp, "i_resp")
        } catch (e) {
            console.log(e.response.text); throw e;
        }
    });
}


export function doInParellel() {

}