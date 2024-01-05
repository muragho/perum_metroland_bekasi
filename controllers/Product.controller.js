const productServ = require('../services/Product.service.js');
const pagination = require('../helpers/Pagination.js');
const moment = require('moment');
const { Op } = require("sequelize");
const jsdom = require('jsdom');
const title = "Metroland | Home";
const header = "Klaster";
const INTERNAL_SERVER_ERROR = 500;

const { JSDOM } = jsdom;

async function productPage(req, res) {
    const page = req.query.page || 1;
    const size = req.query.size || 10;
    const key = req.query.q || null;
    const bearer = req.bearer;

    try {
        console.log("key : " + key)
        let where = {};
        if (key != null) {
            where.title = { [Op.substring]: key }
        }
        const { count, rows } = await productServ.getAllProduct(where, page, size)
        let { number, pageNumUi } = pagination.setPagination(rows, count, page, size, key, "/auth/products");

        res.render("products/index", {
            title, header, bearer, products: rows, moment, csrfToken: req.csrfToken(), JSDOM, pagination: pageNumUi
        });
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).render("500/index");
    }
}

module.exports = { productPage }