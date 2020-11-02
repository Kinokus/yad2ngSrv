import {Document, Model} from "mongoose";

export interface IUser {
    fullName?: string,
    nick?: string,
    email?: string,
    ICQ?: string,
    maritalStatus?: string,
    preferences?: string,
    dob?: string,
    country?: string,
    city?: string,
    bio?: string,
    userPhotos?: string[],
    firstName?: string,
    lastName?: string,
    age?: number,
    dateOfEntry?: Date,
    lastUpdated?: Date,
    profileComments?: any[]
    gatheringStart?: Date,
    gatheringEnd?: Date,
}

export interface IUserDocument extends IUser, Document {
}

export interface IUserModel extends Model<IUserDocument> {

    findOneOrCreate: (
        this: IUserModel,
        {
            firstName,
            lastName,
            age,
        }: { firstName: string; lastName: string; age: number }
    ) => Promise<IUserDocument>;


    findByAge: (
        this: IUserModel,
        min?: number,
        max?: number
    ) => Promise<IUserDocument[]>;
}
