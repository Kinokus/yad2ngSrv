import {Document, Model} from "mongoose";

export interface IApartment {
    apartmentId?:string
    "summary"?: string
    "address"?: string
    "cityArea"?: string
    "city"?: string
    "area"?: string
    "rooms"?: number
    "floor"?: string | number
    "meters"?: number
    "price"?: string | number
    "description"?: string
    "dateOfEntrance"?: {}
    "sellerName"?: string
    "sellerPhone1"?: string
    "sellerPhone2"?: string
    "images"?: string[]
    "conditioning"?: boolean
    "elevators"?: boolean
    "renovated"?: boolean
    "pandoraDoors"?: boolean
    "tadiran"?: boolean
    "longTerm"?: boolean
    "bars"?: boolean
    "accessForDisabled"?: boolean
    "shelter"?: boolean
    "storage"?: boolean
    "pets"?: boolean
    "furniture"?: boolean
    "Entry date"?: Date
    "houseCommittee"?: string
    "totalFloors"?: number
    "numberPayments"?: number
    "parking"?: string
    "levelQuietOnStreet"?: number
    "streetParking"?: number
    "proximityCommercialServices"?: number
    "accessibilityPublicTransportation"?: number
    "exclusiveProperty"?: boolean
    "propertyCondition"?: string
    "id"?: string
    title?: string;
    message?: string;
}

export interface IApartmentDocument extends IApartment, Document {
}

export interface IUserModel extends Model<IApartment> {
}

