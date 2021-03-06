import {Schema} from "mongoose";

const ApartmentSchema = new Schema({
    summary: {type: String, required: false, default: ''},
    apartmentId: {type: String, required: false, default: ''},
    "address": {type: String, required: false, default: ''},
    "cityArea": {type: String, required: false, default: ''},
    "city": {type: String, required: false, default: ''},
    "area": {type: String, required: false, default: ''},
    "rooms": {type: Number, required: false, default: -1},
    "floor": {type: String, required: false, default: ''},
    "meters": {type: Number, required: false, default: -1},
    "price": {type: String, required: false, default: ''},
    "description": {type: String, required: false, default: ''},
    "dateOfEntrance": {type: Object, required: false, default: ''},
    "sellerName": {type: String, required: false, default: ''},
    "sellerPhone1": {type: String, required: false, default: ''},
    "sellerPhone2": {type: String, required: false, default: ''},
    "images": {type: Array, required: false, default: []},
    "conditioning": {type: Boolean, required: false, default: false},
    "elevators": {type: Boolean, required: false, default: false},
    "renovated": {type: Boolean, required: false, default: false},
    "pandoraDoors": {type: Boolean, required: false, default: false},
    "tadiran": {type: Boolean, required: false, default: false},
    "longTerm": {type: Boolean, required: false, default: false},
    "bars": {type: Boolean, required: false, default: false},
    "accessForDisabled": {type: Boolean, required: false, default: false},
    "shelter": {type: Boolean, required: false, default: false},
    "storage": {type: Boolean, required: false, default: false},
    "pets": {type: Boolean, required: false, default: false},
    "furniture": {type: Boolean, required: false, default: false},
    "Entry date": {type: Date, required: false},
    "houseCommittee": {type: String, required: false, default: ''},
    "totalFloors": {type: Number, required: false, default: -1},
    "numberPayments": {type: Number, required: false, default: -1},
    "parking": {type: Boolean, required: false, default: false},
    "levelQuietOnStreet": {type: Number, required: false, default: -1},
    "streetParking": {type: Number, required: false, default: -1},
    "proximityCommercialServices": {type: Number, required: false, default: -1},
    "accessibilityPublicTransportation": {type: Number, required: false, default: -1},
    "exclusiveProperty": {type: Boolean, required: false, default: false},
    "propertyCondition": {type: String, required: false, default: ''},
    "id": {type: String, required: false, default: ''},
    title: {type: String, required: false, default: ''},
    message: {type: String, required: false, default: ''},

})

export default ApartmentSchema
