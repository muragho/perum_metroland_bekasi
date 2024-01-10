const express = require('express');
const newsService = require('../controllers/General.news.controller.js');
const menuProduct = require('../middlewares/Product.middleware.js');
const router = express.Router();

router.get('/berita', menuProduct, newsService.newsPage);
router.get('/berita/:id/detail', menuProduct, newsService.detailPage);

module.exports = router;