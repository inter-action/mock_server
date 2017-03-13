import * as path from "path";
import * as mongoose from "mongoose";
import { RepositoryBase, Schema, COLLECTIONS } from "./common/base"


import { validator } from "../utils";
import { ICaseModel, IAppModel } from "./common/imodel";
// example: https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6


const json_validate = (field) => {
    return {
        validator: function (v) {
            return validator.validator.isJSON(v);
        },
        message: `${field}={VALUE} is invalid!`
    }
}

// schema validation: http://mongoosejs.com/docs/validation.html
let schema = new Schema({
    app: { type: Schema.Types.ObjectId, ref: COLLECTIONS.APP },
    routePath: {
        type: String,
        validate: {
            validator: function (v) {
                return validator.path(v);
            },
            message: "routePath={VALUE} is invalid!"
        },
        required: [true, "routePath is required"]
    },
    fullRoutePath: { type: String, required: true },
    query: { type: String, validate: json_validate("query"), default: "{}" },
    body: { type: String, validate: json_validate("body"), default: "{}" },
    response: { type: String, default: "" },
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
        let doc = <ICaseModel>this._doc;
        let now = new Date();
        if (!doc.createdAt) {
            doc.createdAt = now;
        }
        doc.updatedAt = now;
    }
    next();
    return this;
});

export const RawCaseModel = mongoose.model<ICaseModel>(COLLECTIONS.CASE, schema);
export class CaseRepository extends RepositoryBase<ICaseModel> {
    constructor() {
        super(RawCaseModel);
    }
}
Object.seal(CaseRepository);


export class CaseModel {
    static readonly repo: CaseRepository = new CaseRepository();

    readonly _appModel: ICaseModel;

    constructor(heroModel: ICaseModel) {
        this._appModel = heroModel;
    }

    // default value specified at schema level
    static async create(app: IAppModel, routePath: string, query?: string, body?: string, response?: string) {
        let repo = new CaseRepository();
        let model = <ICaseModel>{
            routePath, query, body, response, app: app._id, fullRoutePath: path.join(app.name, routePath)
        };
        let saved = await repo.create(model)
        app.cases.push(saved)
        await app.save()
        return saved;
    }
}
Object.seal(CaseModel);

