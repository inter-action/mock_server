import * as mongoose from "mongoose";

export interface ITimeStampedModel extends mongoose.Document {
    createdAt: Date
    updatedAt: Date
}

export interface IUserModel extends ITimeStampedModel {
    username: string
    password: string
    email: string
}

export interface IAppModel extends ITimeStampedModel {
    name: string,
    cases: any[],
}

export interface ICaseModel extends ITimeStampedModel {
    app: any,
    method: string,
    fullRoutePath: string, // used to case db read
    routePath: string,
    query: string,
    body: string,
    response: string,
}

