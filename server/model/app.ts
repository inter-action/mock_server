import * as mongoose from "mongoose";

import { COLLECTIONS } from "../db/mongoose"
import { Option, Some, None } from "../extend_type";
import { RepositoryBase, Schema, decorateWithTimestamp } from "./common/base"
import { validator } from "../utils";
import { IAppModel } from "./common/imodel";

// example: https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6


// schema validation: http://mongoosejs.com/docs/validation.html
// schema optiosn: http://mongoosejs.com/docs/guide.html
// mongodb index: https://docs.mongodb.com/manual/indexes/#Indexes-CompoundKeys
// mongoose index type value:  http://mongoosejs.com/docs/api.html#schematype_SchemaType-index

let schema = new Schema({
    name: {
        type: String,
        required: true,
        index: { unique: true, sparse: true }, // unique key cant be hashed type
        validate: {
            validator: function (v) {
                return validator.onlyChars(v);
            },
            message: "name={VALUE} is invalid!"
        },
    },
    cases: [{ type: Schema.Types.ObjectId, ref: COLLECTIONS.case }],
})


export const RawAppModel = mongoose.model<IAppModel>(COLLECTIONS.app, decorateWithTimestamp(schema));
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

