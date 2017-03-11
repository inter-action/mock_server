import * as fs from "fs"

import { expect } from "chai";
const ava = require("ava");

import { BytesReader } from "../io"

let TAG = "IO_SPEC";
ava.cb(`${TAG}: BufferReader() - get same string from test resource file`, t => {
    const reader = new BytesReader()
    fs.createReadStream("./test/resources/io_writeble.txt").pipe(reader)

    reader.on("finish", () => {
        try {
            const str = reader.buffer.toString("utf8")
            expect(str).to.equal("this is a writable test")
            t.end();
        } catch (e) {
            t.end(e);
        }

    })

    reader.on("error", (error) => {
        t.end(error);
    })
});