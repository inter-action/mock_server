import * as mongoose from "mongoose";
import { Option, Some, None } from "../extend_type";
import { RepositoryBase, ITimeStampedModel, Schema } from "./base"


// example: https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6

export interface IUserModel extends ITimeStampedModel {
    username: string
    password: string
    email: string
}

let schema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: {
        type: Date,
        required: false
    },
    modifiedAt: {
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

export const RawUserModel = mongoose.model<IUserModel>("user", schema);
export class UserRepository extends RepositoryBase<IUserModel> {
    constructor() {
        super(RawUserModel);
    }
}

Object.seal(UserRepository);



export class UserModel {
    private static repo: UserRepository = new UserRepository();

    private _userModel: IUserModel;

    constructor(model: IUserModel) {
        this._userModel = model;
    }

    get username(): string {
        return this._userModel.username;
    }

    get password(): string {
        return this._userModel.password;
    }

    get email() {
        return this._userModel.email;
    }

    static async createUser(username: string, password: string, email: string) {
        let repo = new UserRepository();
        let user = <IUserModel>{
            username, password, email
        };
        return await repo.create(user)
    }

    static async findByUsername(username: string): Promise<Option<IUserModel>> {
        let result = await UserModel.repo._raw.find({ username: username }).sort({ createdAt: -1 }).limit(1)
        if (result.length) return Some.create(result[0])
        else return None;
    }
}

Object.seal(UserModel);


