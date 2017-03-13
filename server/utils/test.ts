import { connect, getConnection } from "../db/mongoose";

export function cleanDbAtEachTest(ava: any) {
    ava.before(async _ => {
        await connect();
    })

    ava.beforeEach(async _ => {
        await getConnection().dropDatabase()
    })

}