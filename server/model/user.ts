import * as mongoose from "mongoose";
import { Option, Some, None } from "../extend_type";
import { RepositoryBase } from "./base"

export let Schema = mongoose.Schema;
export let ObjectId = mongoose.Schema.Types.ObjectId;
export let Mixed = mongoose.Schema.Types.Mixed;

// example: https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6

export interface IUserModel extends mongoose.Document {
    username: string
    password: string
    email: string
    createdAt: Date
    updatedAt: Date
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

export let UserSchema = mongoose.model<IUserModel>("user", schema);

export class UserModel {

    private _userModel: IUserModel;

    constructor(heroModel: IUserModel) {
        this._userModel = heroModel;
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

    static findByUsername(username: string): Promise<Option<IUserModel>> {
        return new Promise((resolve, reject) => {
            let repo = new UserRepository();

            repo.find({ username: username }).sort({ createdAt: -1 }).limit(1).exec((err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (res.length) {
                        resolve(Some.create(res[0]));
                    }
                    else {
                        resolve(None);
                    }
                }
            });
        });
    }

}

Object.seal(UserModel);

export class UserRepository extends RepositoryBase<IUserModel> {
    constructor() {
        super(UserSchema);
    }
}

Object.seal(UserRepository);

