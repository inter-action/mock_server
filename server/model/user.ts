import * as mongoose from "mongoose";
import { Option, Some, None } from "../extend_type";
import { RepositoryBase, Schema, COLLECTIONS } from "./common/base"

import { IUserModel } from "./common/imodel";

// example: https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6

let schema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: {
        type: Date,
        required: false
    },
    updatedAt: {
        type: Date,
        required: false
    }
}).pre("save", function (next) {
    if (this._doc) {
        let doc = <IUserModel>this._doc;
        let now = new Date();
        if (!doc.createdAt) {
            doc.createdAt = now;
        }
        doc.updatedAt = now;
    }
    next();
    return this;
});

export const RawUserModel = mongoose.model<IUserModel>(COLLECTIONS.USER, schema);
export class UserRepository extends RepositoryBase<IUserModel> {
    constructor() {
        super(RawUserModel);
    }
}

Object.seal(UserRepository);



export class UserModel {
    private static repo: UserRepository = new UserRepository();

    private _model: IUserModel;

    constructor(model: IUserModel) {
        this._model = model;
    }

    static async createUser(username: string, password: string, email: string) {
        let repo = new UserRepository();
        let model = <IUserModel>{
            username, password, email
        };
        return await repo.create(model)
    }

    static async findByUsername(username: string): Promise<Option<IUserModel>> {
        let result = await UserModel.repo._raw.find({ username: username }).sort({ createdAt: -1 }).limit(1)
        if (result.length) return Some.create(result[0])
        else return None;
    }
}

Object.seal(UserModel);


