import * as mongoose from "mongoose";
import { Option, Some, None } from "../extend_type";
import { RepositoryBase, ITimeStampedModel, Schema } from "./base"


import { validator } from "../utils";

// example: https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6

export interface IAppModel extends ITimeStampedModel {
    name: string
}

// schema validation: http://mongoosejs.com/docs/validation.html
let schema = new Schema({
    name: {
        type: String,
        validate: {
            validator: function (v) {
                return validator.onlyChars(v);
            },
            message: "name={VALUE} is invalid!"
        },
        required: [true, "name is required"]
    },
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
        let doc = <IAppModel>this._doc;
        let now = new Date();
        if (!doc.createdAt) {
            doc.createdAt = now;
        }
        doc.updatedAt = now;
    }
    next();
    return this;
});

export const RawAppModel = mongoose.model<IAppModel>("app", schema);
export class AppRepository extends RepositoryBase<IAppModel> {
    constructor() {
        super(RawAppModel);
    }
}
Object.seal(AppRepository);

export class AppModel {
    private static repo: AppRepository = new AppRepository();

    private _appModel: IAppModel;

    constructor(heroModel: IAppModel) {
        this._appModel = heroModel;
    }

    get name() {
        return this._appModel.name
    }

    static async create(name: string) {
        let repo = new AppRepository();
        let user = <IAppModel>{
            name
        };
        return await repo.create(user)
    }

    static async findByName(name: string): Promise<Option<IAppModel>> {
        let result = await AppModel.repo.find({ name }).sort({ createdAt: -1 }).limit(1)
        if (result.length) return Some.create(result[0])
        else return None;
    }

}
Object.seal(AppModel);

