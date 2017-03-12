

// all as should be equal to its filename
import * as paths from "./paths"
import * as Constants from "./constants"
import * as errors from "./errors";
import * as validator from "./validator"

import * as env from "./env"
import * as io from "./io";



export { Constants, paths, errors, env, io, validator }

/*
return `authorization: Bearer <token>` if found otherwise null
*/
export function getAuthBearerToken(ctx): null | string {
    const header = ctx.request.header.authorization
    if (!header) {
        return null
    }
    const parts = header.split(" ")
    if (parts.length !== 2) {
        return null
    }
    const scheme = parts[0]
    const token = parts[1]
    if (/^Bearer$/i.test(scheme)) {
        return token
    }
    return null
}


/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
export function uid(len: number): string {
    let buf: string[] = [],
        chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        charlen = chars.length,
        i;

    for (i = 1; i < len; i = i + 1) {
        let t = chars[getRandomInt(0, charlen - 1)]
        buf.push(t);
    }

    return buf.join("");
}

// return a int in range [from, end], inclusive
function getRandomInt(from: number, end: number): number {
    return Math.floor(Math.random() * ((end + 1) - from)) + from
}

// The token is encoded URL safe by replacing "+" with "-", "\" with "_" and removing "="
// NOTE: the token is not encoded using valid base64 anymore
export function encodeBase64URLsafe(base64String: string) {
    return base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
// Decode url safe base64 encoding and add padding ("=")
export function decodeBase64URLsafe(base64String: string) {
    base64String = base64String.replace(/-/g, "+").replace(/_/g, "/");
    while (base64String.length % 4) {
        base64String += "=";
    }
    return base64String;
}
