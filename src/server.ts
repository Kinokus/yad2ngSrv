import express from "express";
import {connect, disconnect} from "./database/database";
import cors from "cors";
import bodyParser from "body-parser";
import {FieldsTranslateHelper} from "./helpers/fieldsTranslateHelper";
import {UserModel} from "./database/users/users.model";
import logger from "./shared/logger";
import path from "path";
import {ApartmentModel} from "./database/apartments/araptments.model";
import {IApartment} from "./database/apartments/apartments.types";

const cheerio = require('cheerio')
const selectors = require('./public/yad2/selectors.json')

const app = express();
const port = 9191;

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


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



        const apartment: IApartment = {}

        apartment.updated = $(selectors.updated).text()
        apartment.summary = $(selectors.summary).text()
        apartment.viaMakler = apartment.summary.includes('(תיווך)')


        console.log(apartment);
        // console.log(selectors);
        // console.log($(".content .top .right").text());
        // console.log($(".content .top .left").text());

        // $('h2.title').text('Hello there!')
        // $('h2').addClass('welcome')

        // $.html()
        // const apartment = reqBody['apartment']
        // // await ApartmentModel.create(apartment)
        // await ApartmentModel.updateOne({apartmentId: apartment.apartmentId}, apartment, {upsert: true})
        // const body = JSON.stringify({
        //     reason: 'added successfully',
        //     status: 'success',
        //     id: apartment.id
        // })
        // res.send(body)
        // logger.info(JSON.stringify(req.body))
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
            // .distinct('address')
            .lean()
        res.send(JSON.stringify(apartment))
    })


})();


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
