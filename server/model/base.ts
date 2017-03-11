import * as mongoose from "mongoose";

// credit: https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6

export interface IRead<T> {
    retrieve: (callback: (error: any, result: any) => void) => void;
    findById: (id: string, callback: (error: any, result: T) => void) => void;
    findOne(cond?: ModelIndex<T>, callback?: (err: any, res: T) => void): mongoose.Query<T>;
    find(cond: ModelIndex<T>, projection?: object, options?: object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]>;
}

export interface IWrite<T> {
    create: (item: T) => Promise<T>;
    update: (_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) => void;
    delete: (_id: string, callback: (error: any, result: any) => void) => void;
}

type ModelIndex<T> = {[P in keyof T]?: T[P]}
export class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {

    // todo: replace mongoose.Document with T
    private _model: mongoose.Model<T>;

    constructor(schemaModel: mongoose.Model<T>) {
        this._model = schemaModel;
    }

    create(item: T) {
        return this._model.create(item);
    }

    retrieve(callback: (error: any, result: T) => void) {
        this._model.find({}, callback);
    }

    update(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
        this._model.update({ _id: _id }, item, callback);
    }

    delete(_id: string, callback: (error: any, result: any) => void) {
        this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
    }

    findById(_id: string, callback: (error: any, result: T) => void) {
        this._model.findById(_id, callback);
    }

    findOne(cond?: ModelIndex<T>, callback?: (err: any, res: T) => void): mongoose.Query<T> {
        return this._model.findOne(cond as any, callback);
    }

    find(cond: ModelIndex<T>, projection?: object, options?: object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]> {
        return this._model.find(cond as any, projection as any, options as any, callback);
    }

    private toObjectId(_id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(_id);
    }

}
