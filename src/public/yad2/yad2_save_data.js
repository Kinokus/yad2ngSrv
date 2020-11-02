// ==UserScript==
// @name         yad2 saver
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  try to take over the world!
// @author       You
// @match        https://www.yad2.co.il/item/*
// @grant        none
// ==/UserScript==
// todo: obfuscate code
// todo: add update url to tampermonkey
// todo: copy files after build
// todo: reverse translate fields

(async function () {
    'use strict';
    const timeout = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await timeout(3000)
    try {
        document.querySelector('#lightbox_contact_seller_0').click()

    } catch (e) {
        console.log(e);
    }


    // const chatId = -490379979
    const serverName = '127.0.0.1:9191'
    // const chat_id = 325325519

    const httpGet = function (theUrl) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', theUrl, false); // false for synchronous request
        xmlHttp.setRequestHeader('Access-Control-Allow-Origin', '*')
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

    const httpPost = function (theUrl, theData) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open('POST', theUrl, false); // false for synchronous request
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.send(theData);
        return xmlHttp.responseText;
    }

    const mainFunc = async () => {
        await timeout(3000)
        const apartment = {}
        const selectors = JSON.parse(httpGet('http://127.0.0.1:9191/selectors'))

        const translations = JSON.parse(httpGet('http://127.0.0.1:9191/translations'))

        apartment.summary = document.querySelector(selectors.summary).innerText
        try {
            apartment.updated = document.querySelector(selectors.updated).innerText
        } catch (e) {
            console.log(e);
        }

        try {
            apartment.furnniture = document.querySelector(selectors.furnniture).innerText
        } catch (e) {
            console.log(e);
        }


        apartment.address = document.querySelector(selectors.address).innerText
        apartment.cityArea = document.querySelector(selectors.cityArea).innerText
        apartment.city = document.querySelector(selectors.city)?.innerText
        apartment.area = document.querySelector(selectors.area)?.innerText.trim()
        apartment.rooms = document.querySelector(selectors.rooms).innerText.replace(',','')
        apartment.floor = document.querySelector(selectors.floor).innerText
        apartment.meters = document.querySelector(selectors.meters).innerText
        apartment.price = document.querySelector(selectors.price).innerText

        try {
            apartment.description = document.querySelector(selectors.description).innerText
        }catch (e) {
            console.log(e);
        }


        apartment.dateOfEntrance = document.querySelector(selectors.dateOfEntrance)
        Array
            .from(document.querySelectorAll(selectors.features))
            .forEach(a => apartment[a.innerText.trim()] = true)
        Array
            .from(document.querySelectorAll(selectors.featuresAbsent))
            .forEach(a => apartment[a.innerText.trim()] = false)

        const countOfDetailsFields = Array.from(document.querySelectorAll(selectors.detailsField)).length
        for (let idx = 0; idx < countOfDetailsFields; idx++) {
            const detailName = document.querySelector(`${selectors.detailsField}:nth-child(${idx + 1}) span:nth-child(1)`).innerText
            apartment[detailName] = document.querySelector(`${selectors.detailsField}:nth-child(${idx + 1}) span:nth-child(2)`).innerText
        }

        const countOfMArks = Array.from(document.querySelectorAll(selectors.feedbackMark)).length
        for (let idx = 0; idx < countOfMArks; idx++) {
            const mark =
                Array.from(
                    document.querySelectorAll(`${selectors.feedbackMark}:nth-child(${idx + 1}) .graph div span`))
                    .length
            const markName =
                document.querySelector(`${selectors.feedbackMark}:nth-child(${idx + 1}) .slider_title`)
                    .innerText
            apartment[markName] = mark
        }

        await timeout(5000)
        apartment.sellerName = document.querySelector(selectors.sellerName).innerText
        apartment.sellerPhone1 = document.querySelector(selectors.sellerPhone0)?.innerText
        apartment.sellerPhone2 = document.querySelector(selectors.sellerPhone1)?.innerText


        const photoButton = document.querySelector(selectors.hasPhoto)
        if (photoButton) {
            photoButton.click()
            await timeout(3000)
            apartment.images = Array
                .from(document.querySelectorAll(selectors.photo))
                .map(img => {
                    return img.getAttribute('src')
                })
                .map(img => {
                    return img.replace('//', '')
                })
                .map(img => {
                    return img.split('?')[0]
                })
                .filter((aprt, idx, aparts) => {
                    return aparts.indexOf(aprt) === idx
                })// .map(img=>btoa(img))
        }

        await timeout(3000)
        const videoButton = document.querySelector(selectors.hasVideo)
        if (videoButton) {
            videoButton.click()
            await timeout(3000)
            const videoContainer = document.querySelector('video')
            apartment.video = videoContainer
                .getAttribute('src')
                .replace('//', '')
        }

        for (const [tKey, tValue] of Object.entries(translations)) {
            apartment[tValue] = apartment[tKey]
            delete apartment[tKey]
        }

        sendApartment({
            urlsPhotos: apartment.images,
            apartment: apartment
        })

    }


    async function sendApartment(options) {
        console.log(options.apartment.id)

        options.apartment.id = location.href.split('/')[4].split('?')[0]
        const urlServer = "http://127.0.0.1:9191/apartment"
        const optionsJson = JSON.stringify(options)
        httpPost(urlServer, optionsJson)
        await timeout(1000)
        window.close()
    }
    await timeout(3000)
    await mainFunc()
})();
