import * as mongoose from "mongoose";



import { COLLECTIONS } from "../db/mongoose"
import { Option, Some, None } from "../extend_type";
import { RepositoryBase, Schema, decorateWithTimestamp } from "./common/base"
import { IUserModel } from "./common/imodel";

// example: https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6

let schema = new Schema({
    username: {
        type: String,
        required: true,
        index: { sparse: true, type: "hashed" },
    },
    password: { type: String, required: true },
    email: {
        type: String,
        required: true,
        index: { sparse: true, type: "hashed" },
    },
})

export const RawUserModel = mongoose.model<IUserModel>(COLLECTIONS.user, decorateWithTimestamp(schema));
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


