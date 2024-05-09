
const jsdom = require('jsdom');
const { Op } = require('sequelize');
const carrierService = require('../services/Carrier.service.js');
const { JSDOM } = jsdom;
const INTERNAL_SERVER_ERROR = 500;
async function carrierPage(req, res) {
    const products = req.products;
    const page = req.query.page;

    const header_images = req.header_image;
    try {
        const page_ = typeof page === 'undefined' ? 1 : page;
        const size_ = 6;

        let where = {};
        where.expired = { [Op.gte]: new Date() }

        const { count, rows } = await carrierService.getAllCarrier(where, page_, size_);
        console.log(JSON.stringify(rows))

        res.render("f_carrier/index", { products, rows: rows ? rows : [],header_images });
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).render("500/index");
    }
}



module.exports = { carrierPage }