import {Schema} from "mongoose";
import {findByAge, findOneOrCreate} from "./users.statics";
import {sameLastName, setLastUpdated} from "./users.methods";

const UserSchema = new Schema({
    fullName: {
        type: String,
        required:false,
    },
    nick: {
        type: String,
        required:false,
    },
    email: {
        type: String,
        required:false,
    },
    ICQ: {
        type: String,
        required:false,
    },
    maritalStatus: {
        type: String,
        required:false,
    },
    preferences: {
        type: String,
        required:false,
    },
    dob: {
        type: String,
        required:false,
    },
    country: {
        type: String,
        required:false,
    },
    city: {
        type: String,
        required:false,
    },
    bio: {
        type: String,
        required:false,
    },
    userPhotos: {
        type: Array,
        required:false,
    },
    firstName: {
        type: String,
        required:false,
    },
    lastName: {
        type: String,
        required:false,
    },
    age: {
        type: Number,
        required:false,
    },
    dateOfEntry: {
        required: false,
        type: Date,
        default: new Date()
    },
    lastUpdated: {
        required:false,
        type: Date,
        default: new Date()
    },
    // todo: comments model
    profileComments: {
        required:false,
        type: Array,
        default: []
    },
    gatheringStart: {
        required:false,
        type: Date,
        default: new Date()
    },
    gatheringEnd: {
        required:false,
        type: Date,
        default: new Date()
    },
});

UserSchema.statics.findOneOrCreate = findOneOrCreate;
UserSchema.statics.findByAge = findByAge;
UserSchema.methods.setLastUpdated = setLastUpdated;
UserSchema.methods.sameLastName = sameLastName;

export default UserSchema;
