
import { ITimeStampedModel } from "./imodel";

export function timestamp(this: ITimeStampedModel, next) {
    this.updatedAt = new Date();
    if (!this.createdAt) this.createdAt = this.updatedAt;
    return next();
}
