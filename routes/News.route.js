const express = require('express');
const newsService = require('../controllers/General.news.controller.js');
const menuProduct = require('../middlewares/Product.middleware.js');
const headerPage = require('../middlewares/Headerpage.js');
const router = express.Router();

router.get('/berita', menuProduct,headerPage, newsService.newsPage);
router.get('/berita/:id/detail', menuProduct,headerPage, newsService.detailPage);

module.exports = router;