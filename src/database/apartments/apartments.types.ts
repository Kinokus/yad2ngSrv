import {Document, Model} from 'mongoose';

export class Apartment {

    'airConditioner': boolean = null
    'forPartners': boolean = null
    'kosherKitchen': boolean = null
    'elevator': boolean = null
    'accessibility': boolean = null
    'warhouse': boolean = null
    'pandorDoors': boolean = null
    'tadiranC': boolean = null
    'viaMakler': boolean = null;
    'updated': string = '';
    'about': string = ''
    'apartmentId': string = ''
    'summary': string = ''
    'address': string = ''
    'cityArea': string = ''
    'city': string = ''
    'area': string = ''
    'rooms': number = -2
    'floor': number = -2
    'meters': number = -2
    'price': number = -2
    'description': string = ''
    'dateOfEntrance': any = null
    'sellerName': string = ''
    'sellerPhone1': string = ''
    'sellerPhone2': string = ''
    'images': string[] = []
    'conditioning': boolean = false
    'elevators': boolean = false
    'renovated': boolean = false
    'pandoraDoors': boolean = false
    'tadiran': boolean = false
    'longTerm': boolean = false
    'bars': boolean = false
    'accessForDisabled': boolean = false
    'shelter': boolean = false
    'storage': boolean = false
    'pets': boolean = false
    'furniture': boolean = false
    'entryDate': any = null
    'houseCommittee': number = -2
    'totalFloors': number = -2
    'numberPayments': number = -2
    'parking': string = ''
    'levelQuietOnStreet': number = -2
    'streetParking': number = -2
    'proximityCommercialServices': number = -2
    'accessibilityPublicTransportation': number = -2
    'exclusiveProperty': boolean = false
    'propertyCondition': string = ''
    // 'id':''
    'title': string = '';
    'message': string = '';
}

export interface IApartmentDocument extends Apartment, Document {
}

export interface IApartmentModel extends Model<IApartmentDocument> {
}

