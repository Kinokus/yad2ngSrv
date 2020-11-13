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


        // todo: TEMPORARY
        // res.send(JSON.stringify(apartmentIds))
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
        const apartmentId = reqBody.apartmentId


        const apartment: Apartment = new Apartment()

        apartment.updated = $(selectors.updated).text()
        apartment.summary = $(selectors.summary).text()
        apartment.viaMakler = apartment.summary.includes('(תיווך)')


        apartment.city = $(selectors.city).text()
        apartment.address = $(selectors.address).text()
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

            const rawFieldName = $(el).find('.title').text()
            const rawFieldValue = $(el).find('.value').text()

            const fieldName = translations[rawFieldName] !== undefined ? translations[rawFieldName] : rawFieldName
            const fieldValue = translations[rawFieldValue] !== undefined ? translations[rawFieldValue] : rawFieldValue


            // @ts-ignore
            if (apartment[fieldName] === undefined)
                console.log(fieldName);

            // @ts-ignore
            apartment[fieldName] = fieldValue
        })


        apartment.sellerPhone1 = $(selectors.sellerPhone0).text().replace(/[^0-9]/gim, '')
        apartment.sellerPhone2 = $(selectors.sellerPhone1).text().replace(/[^0-9]/gim, '')
        apartment.sellerName = $(selectors.sellerName).text().trim()


        apartment.images = Array.from($(selectors.photo)).map(el => {
            return $(el).attr('src')
        })

        apartment.video = $(selectors.video).attr('src')

        // @ts-ignore
        apartment.houseCommittee = apartment.houseCommittee.replace(/[^0-9]/gim, '') - 0


        // @ts-ignore
        apartment.arnona = (apartment.arnona + '')?.replace(/[^0-9]/gim, '')

        apartment.apartmentId = apartmentId


        // console.log(apartment);
        const dbResp =
            await ApartmentModel.updateOne(
                {apartmentId: apartment.apartmentId, address: apartment.address},
                apartment,
                {upsert: true})

        console.log(dbResp);

        res.send({status: 'ok'})

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
