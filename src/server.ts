import express from "express";
import {connect, disconnect} from "./database/database";
import cors from "cors";
import bodyParser from "body-parser";
import {FieldsTranslateHelper} from "./helpers/fieldsTranslateHelper";
import {UserModel} from "./database/users/users.model";
import logger from "./shared/logger";
import path from "path";
import {ApartmentModel} from "./database/apartments/araptments.model";
import {Apartment} from "./database/apartments/apartments.types";

const cheerio = require('cheerio')
const selectors = require('./public/yad2/selectors.json')
const translations = require('./public/yad2/translations.json')

const app = express();
const port = 9191;

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const snakeToCamel = (str: string) => {
    return str.replace(/([-_]\w)/g, g => g[1].toUpperCase())
}

(async () => {

    connect();


    /** yad2 */
    app.use('/selectors', express.static(path.join(__dirname, 'public/yad2/selectors.json')))
    app.use('/translations', express.static(path.join(__dirname, 'public/yad2/translations.json')))
    app.post('/check', async (req, res) => {
        const apartmentIds = req.body
        const apartmentIdFound = await ApartmentModel
            .find({apartmentId: {$in: apartmentIds}})
            .distinct('apartmentId')
            .lean()
        const apartmentIdsFiltered = apartmentIds.filter((ai: any) => {
            return (apartmentIdFound.indexOf(ai) === -1);
        })
        res.send(JSON.stringify(apartmentIdsFiltered))
        logger.info(`${apartmentIdsFiltered.length} - ${apartmentIds.length}`)

    })
    app.post('/apartment', async (req, res) => {
        const reqBody = req.body
        const apartment = reqBody['apartment']
        // await ApartmentModel.create(apartment)
        await ApartmentModel.updateOne({apartmentId: apartment.apartmentId}, apartment, {upsert: true})
        const body = JSON.stringify({
            reason: 'added successfully',
            status: 'success',
            id: apartment.id
        })
        res.send(body)
        logger.info(body)
    })
    app.post('/wholeHtml', async (req, res) => {
        const reqBody = req.body
        // console.log(reqBody.body);

        const $ = cheerio.load(reqBody.body)


        const apartment: Apartment = new Apartment()

        apartment.updated = $(selectors.updated).text()
        apartment.summary = $(selectors.summary).text()
        apartment.viaMakler = apartment.summary.includes('(תיווך)')


        apartment.city = $(selectors.city).text()
        apartment.area = $(selectors.area).text().replace(/,$/, '')

        apartment.meters = $(selectors.meters).text()
        apartment.floor = $(selectors.floor).text()
        apartment.rooms = $(selectors.rooms).text()

        apartment.price = $(selectors.price).text().replace(/[^0-9]/gim, '')
        apartment.price = !!apartment.price ? apartment.price : null

        apartment.about = $(selectors.about).text()


        $(selectors.featuresPresent).each((idx: number, el: Element) => {

            const featureName = snakeToCamel($(el).attr('id'))

            // @ts-ignore
            if (apartment[featureName] === undefined)
                console.log(featureName);
            // @ts-ignore
            apartment[featureName] = true
        })

        $(selectors.featuresAbsent).each((idx: number, el: Element) => {
            const featureName = snakeToCamel($(el).attr('id'))
            // @ts-ignore
            if (apartment[featureName] === undefined)
                console.log(featureName);
            // @ts-ignore
            apartment[featureName] = false
        })


        $(selectors.detailsField).each((idx: number, el: Element) => {
            const fieldName = translations[$(el).find('.title').text()]
            // @ts-ignore
            if (apartment[fieldName] === undefined)
                console.log(fieldName);

            // @ts-ignore
            apartment[fieldName] = $(el).find('.value').text()
        })


        // apartment.details['arnona'] = apartment.details['arnona']?.replace(/[^0-9]/gim, '')
        // apartment.details['arnona'] = apartment.details['arnona'] || false
        //
        // apartment.details['houseCommittee'] = apartment.details['houseCommittee']?.replace(/[^0-9]/gim, '')
        // apartment.details['houseCommittee'] = apartment.details['houseCommittee'] || false
        //
        // apartment.details['totalFloors'] = apartment.details['totalFloors']?.replace(/[^0-9]/gim, '')
        // apartment.details['totalFloors'] = apartment.details['totalFloors'] || false

        // for (const [key, value] of Object.entries(apartment.details)) {
        //     // console.log(`${key}: ${value}`);
        //     try {
        //         // @ts-ignore
        //         apartment[key] = value
        //     } catch (e) {
        //         console.log(e);
        //     }
        // }

        // apartment.featuresPresent.forEach(apfp => {
        //     try {
        //         // @ts-ignore
        //         apartment[apfp] = true
        //     } catch (e) {
        //         console.log(e);
        //     }
        // })
        // apartment.featuresAbsent.forEach(apfa => {
        //     try {
        //         // @ts-ignore
        //         apartment[apfa] = false
        //     } catch (e) {
        //         console.log(e);
        //     }
        // })

        // document.querySelectorAll("#lightbox_phone_number_0 > a")
        // document.querySelectorAll("[id*=img_slide_container]")


        console.log(`------------------------------------------`);
        console.log(apartment);

    })


    app.get('/cities', async (req, res) => {
        // todo: city model
        const apartmentCities = await ApartmentModel
            .find({city: {$ne: ''}})
            .distinct('city')
            .lean()


        res.send(JSON.stringify(apartmentCities))
    })
    app.get('/areas/:city', async (req, res) => {
        // todo: city model

        const apartmentAreas = await ApartmentModel
            .find({city: {$eq: req.params.city}})
            .distinct('area')
            .lean()
        res.send(JSON.stringify(apartmentAreas))
    })
    app.get('/apartments/:city/:area', async (req, res) => {
        // todo: city model

        const apartments = await ApartmentModel
            .find({city: {$eq: req.params.city}, area: {$eq: req.params.area}})
            .distinct('address')
            .lean()
        res.send(JSON.stringify(apartments))
    })
    app.get('/apartment/:city/:area/:address', async (req, res) => {
        const apartment = await ApartmentModel
            .findOne({
                city: {$eq: req.params.city},
                area: {$eq: req.params.area},
                address: {$eq: req.params.address}
            })
            .lean()
        res.send(JSON.stringify(apartment))
    })


})();


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
