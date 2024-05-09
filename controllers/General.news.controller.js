const newsService = require('../services/News.service.js');
const util = require('../helpers/Util.js');
const pagination = require('../helpers/Pagination.js');
const moment = require('moment');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

async function newsPage(req, res) {
    const page = req.query.page;
    const products = req.products;
    const header_images = req.header_image;
    console.log(page)
    try {
        const page_ = typeof page === 'undefined' ? 1 : page;
        const size_ = 6;

        let where = {};
        const { count, rows } = await newsService.getNewsList(where, page_, size_);
        let { number, pageNumUi } = pagination.setPagination(rows, count, page_, size_, null, "/berita");
        // console.log(JSON.stringify(rows))
        res.render("f_news/index", { products, rows, moment, pagination: pageNumUi, JSDOM,header_images });
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).render("500/index");
    }
}

async function detailPage(req, res) {
    const id = req.params.id;
    const products = req.products;
    console.log("id : " + id);
    try {

        let where = {};
        where.id = id;
        const news = await newsService.getDetail(where);

        let next = null;
        if (news && typeof news !== 'undefined') {
            next = await newsService.nextNews(news.id);
        }
        console.log(JSON.stringify(news))

        res.render("f_news/detail", {
            products, news, moment, next
        })
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).render("500/index");
    }
}

module.exports = { newsPage, detailPage }