
import { ICaseModel } from "./imodel";

export function timestamp(next) {
    if (this._doc) {
        let doc = <ICaseModel>this._doc;
        let now = new Date();
        if (!doc.createdAt) {
            doc.createdAt = now;
        }
        doc.updatedAt = now;
    }
    next();
}