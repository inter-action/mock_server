import * as mongoose from "mongoose";
import { Option, None, Some } from "../extend_type/option";

export const Schema = mongoose.Schema;
export const ObjectId = mongoose.Schema.Types.ObjectId;
export const Mixed = mongoose.Schema.Types.Mixed;

// credit: https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6

export interface ITimeStampedModel extends mongoose.Document {
    createdAt: Date
    updatedAt: Date
}


export interface IRead<T> {
    retrieve(callback: (error: any, result: any) => void): void
    findById(_id: string): Promise<Option<T>>
    findOne(cond?: ModelIndex<T>): Promise<Option<T>>
    find(cond: ModelIndex<T>, projection?: object, options?: object): Promise<T[]>
}

export interface IWrite<T> {
    create: (item: T) => Promise<T>;
    update(_id: mongoose.Types.ObjectId, item: T): Promise<any>
    delete(_id: string): Promise<void>
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

    update(_id: mongoose.Types.ObjectId, item: T): Promise<any> {
        let opts = { runValidators: true };
        return this._raw.update({ _id: _id }, item, opts).exec();
    }

    delete(_id: string): Promise<void> {
        return this._raw.remove({ _id: this.toObjectId(_id) }).exec();
    }

    async findById(_id: string): Promise<Option<T>> {
        let result = await this._raw.findById(_id).exec()
        if (result == null) return None;
        else return Some.create(result);
    }

    async findOne(cond?: ModelIndex<T>): Promise<Option<T>> {
        let result = await this._raw.findOne(cond as any).exec();
        if (!result) return None;
        else return Some.create(result)
    }

    find(cond: ModelIndex<T>, projection?: object, options?: object): Promise<T[]> {
        return this._raw.find(cond as any, projection as any, options as any).exec();
    }

    toObjectId(_id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(_id);
    }

}
