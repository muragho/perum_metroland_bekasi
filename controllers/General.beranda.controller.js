const productServ = require('../services/Product.service.js');
const newsService = require('../services/News.service.js');
const jsdom = require('jsdom');
const moment = require('moment');
const title = "Metroland | Cluster";
const header = "Cluster";
const INTERNAL_SERVER_ERROR = 500;

const { JSDOM } = jsdom;

async function berandaPage(req, res) {
    console.log('inside berandaPage')

    const header_images = req.header_image;
    try {
        console.log("header",JSON.stringify(header_images))

        const products = await productServ.getAllProducts();
        const news = await newsService.getAllNewsByLimit(3);
        // console.log(JSON.stringify(news))

        res.render("f_beranda/index", { products, news, JSDOM, moment,header_images });
    } catch (error) {
        console.error(`err clusterPage : ${error}`)
        return res.status(INTERNAL_SERVER_ERROR).render("500/index");
    }
}

module.exports = { berandaPage }