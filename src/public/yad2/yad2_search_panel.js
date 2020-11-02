// ==UserScript==
// @name         yad2 search panel
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.yad2.co.il/realestate/rent*
// @grant        none
// ==/UserScript==
// todo: check-by-photo
(async function() {
    'use strict';

    //document.querySelector('[id="desktop-top-banners"]').style.display = 'none'
    //document.querySelector('.top_boxes_row.inactive').style.display = 'none'


    const timeout = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


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


    const pollingFunc = ()=>{
        console.log(httpGet('http://127.0.0.1:9191/polling'))
        setTimeout(pollingFunc, 10000)
    }



    const scriptText = Array.from(document.querySelectorAll('script')).map((f)=>f.innerText).join(';').replace('window.__NUXT__','window.layout')
    window.eval(scriptText)
    const items = window.layout.state.feed.items.map(itm=>itm.id)
    console.log(items)
    pollingFunc()


    const urlServer = "http://127.0.0.1:9191/check"
    const itemsFiltered = JSON.parse(httpPost(urlServer, JSON.stringify(items)))




    for(let idx = 0; idx < itemsFiltered.length; idx++){
        const url = `https://www.yad2.co.il/item/${items[idx]}`
        console.log(`${idx}\t-\t${itemsFiltered.length}\t-\t${url}`)
        const curentDate  = new Date(Date.now()).toJSON()
        const newTab = window.open(url, '_blank');
        newTab.blur()
        //newTab.onclose(()=>{console.log('closed')})
        await timeout(45000)
    }

    document.querySelector('.navigation-button-text.next-text').click()
    await timeout(5000)
    location.reload()




})();