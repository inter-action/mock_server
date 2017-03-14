import * as mongoose from "mongoose";
import { Option, None, Some } from "../../extend_type/option";

export const Schema = mongoose.Schema;
export const ObjectId = mongoose.Schema.Types.ObjectId;
export const Mixed = mongoose.Schema.Types.Mixed;

// credit: https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6


export interface IRead<T> {
    retrieve(callback: (error: any, result: any) => void): void
    findById(_id: string): Promise<Option<T>>
    findOne(cond?: ModelIndex<T>): Promise<Option<T>>
    find(cond: ModelIndex<T>, projection?: object, options?: object): Promise<T[]>
}

export interface IWrite<T> {
    create: (item: T) => Promise<T>;
    update(_id: mongoose.Types.ObjectId | string, item: T): Promise<any>
    delete(_id: mongoose.Types.ObjectId | string): Promise<void>
}

type ModelIndex<T> = {[P in keyof T]?: T[P]}
export class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {

    public readonly _raw: mongoose.Model<T>;

    constructor(schemaModel: mongoose.Model<T>) {
        this._raw = schemaModel;
    }

    create(item: T) {
        return this._raw.create(item);
    }

    retrieve() {
        return this._raw.find({}).exec()
    }

    update(_id: mongoose.Types.ObjectId | string, item: T): Promise<any> {
        let opts = { runValidators: true };
        if (typeof _id === "string") {
            _id = this.toObjectId(_id)
        }
        return this._raw.update({ _id: _id }, item, opts).exec();
    }

    delete(_id: mongoose.Types.ObjectId | string): Promise<void> {
        if (typeof _id === "string") {
            _id = this.toObjectId(_id)
        }
        return this._raw.remove({ _id: _id }).exec();
    }

    async findById(_id: string, withFields: string[] = []): Promise<Option<T>> {
        let query = this._raw.findById(_id)
        withFields.map(p => { query.populate(p) })
        let result = await query.exec();
        if (result == null) return None;
        else return Some.create(result);
    }

    /**
     *
     *
     * @param {ModelIndex<T>} [cond]
     * @param {string[]} [populates=[]] , target model's field name
     * @returns {Promise<Option<T>>}
     *
     * @memberOf RepositoryBase
     */
    async findOne(cond?: ModelIndex<T>, withFields: string[] = []): Promise<Option<T>> {
        let query = this._raw.findOne(cond as any)
        withFields.map(p => { query.populate(p) })
        let result = await query.exec();
        if (result == null) return None;
        else return Some.create(result);
    }

    find(cond: ModelIndex<T>, projection?: object, options?: object): Promise<T[]> {
        return this._raw.find(cond as any, projection as any, options as any).exec();
    }

    toObjectId(_id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(_id);
    }

}


export const COLLECTIONS = {
    APP: "APP", CASE: "CASE", USER: "USER"
}