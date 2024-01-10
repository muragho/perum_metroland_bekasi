
const jsdom = require('jsdom');
const { db } = require('../configs/Database.js');

const { JSDOM } = jsdom;
const INTERNAL_SERVER_ERROR = 500;
async function aboutUsPage(req, res) {
    const products = req.products;
    try {
        const data = await db.AboutUs.findOne();

        res.render("f_about_us/index", { products, data, JSDOM });
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).render("500/index");
    }
}



module.exports = { aboutUsPage }