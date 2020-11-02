import express from "express";
import {connect, disconnect} from "./database/database";
import cors from "cors";
import bodyParser from "body-parser";
import {FieldsTranslateHelper} from "./helpers/fieldsTranslateHelper";
import {UserModel} from "./database/users/users.model";
import logger from "./shared/logger";
import path from "path";
import {ApartmentModel} from "./database/apartments/araptments.model";

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

    app.get('/cities', async (req, res) => {
        // todo: city model
        const apartmentCities = await ApartmentModel
            .find({city:{$ne:''}})
            .distinct('city')
            .lean()


        res.send(JSON.stringify(apartmentCities))
    })
    app.get('/cities/:city', async (req, res) => {
        // todo: city model

        const apartmentAreas = await ApartmentModel
            .find({city:{$eq:req.params.city}})
            .distinct('area')
            .lean()
        res.send(JSON.stringify(apartmentAreas))
    })



})();


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
