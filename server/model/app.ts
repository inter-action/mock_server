import * as mongoose from "mongoose";
import { Option, Some, None } from "../extend_type";
import { RepositoryBase, Schema, COLLECTIONS } from "./common/base"


import { validator } from "../utils";
import { IAppModel } from "./common/imodel";

// example: https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6


// schema validation: http://mongoosejs.com/docs/validation.html
// schema optiosn: http://mongoosejs.com/docs/guide.html
let schema = new Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return validator.onlyChars(v);
            },
            message: "name={VALUE} is invalid!"
        },
    },
    cases: [{ type: Schema.Types.ObjectId, ref: COLLECTIONS.CASE }],
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

export const RawAppModel = mongoose.model<IAppModel>(COLLECTIONS.APP, schema);
export class AppRepository extends RepositoryBase<IAppModel> {
    constructor() {
        super(RawAppModel);
    }
}
Object.seal(AppRepository);

export class AppModel {
    static readonly repo: AppRepository = new AppRepository();

    readonly _model: IAppModel;

    constructor(model: IAppModel) {
        this._model = model;
    }

    static async create(name: string) {
        let repo = new AppRepository();
        let model = <IAppModel>{
            name
        };
        return await repo.create(model)
    }

    static async findByName(name: string): Promise<Option<IAppModel>> {
        let result = await AppModel.repo._raw.find({ name }).sort({ createdAt: -1 }).limit(1)
        if (result.length) return Some.create(result[0])
        else return None;
    }


}

Object.seal(AppModel);

