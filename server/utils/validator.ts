import { Validator } from "class-validator";

export const validator = new Validator();

export function getRawValidator() {
    return validator;
}

export function onlyChars(v) {
    return validator.matches(v, /^[a-z-_]+$/i);
}

export function path(v) {
    validator.matches(v.replace(/\//gi, ""), /^[a-z0-9-_]+$/i);
}

export function isHttpMethod(v: string) {
    let m = ["post", "get", "options", "delete", "put", "head", "trace", "trace"]
    if (v) {
        v = v.toLocaleLowerCase();
        if (m.find(e => e === v)) return true;
    }
    return false;
}