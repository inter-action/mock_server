import * as stream from "stream"


// like java BytesReader, read bytes into memory
export class BytesReader extends stream.Writable {
    private _buffer;
    private length = 0
    private encoding: null | string = null

    constructor(size: number = 512 * 1024, options?: object) {
        super(options);
        this._buffer = new Buffer(size).fill(0);
    }

    protected _write(chunk: any, encoding: string, callback: Function): void {
        try {
            if (Buffer.isBuffer(chunk)) {
                const src = chunk as Buffer
                const copied = src.copy(this._buffer, this.length, 0, src.length)
                this.length += copied
            } else {
                if (encoding) {
                    this.encoding = encoding
                }
                const copied = this._buffer.write(chunk, this.length, undefined, encoding)
                this.length += copied
            }
            callback()
        } catch (e) {
            callback(e)
        }
    }

    get buffer() {
        return this._buffer.slice(0, this.length)
    }

    get string(): null | string {
        if (this.encoding) {
            return this.buffer.toString(this.encoding)
        } else {
            return null
        }
    }

}