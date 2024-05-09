const express = require('express');
const abountController = require('../controllers/General.aboutUs.controller.js');
const menuProduct = require('../middlewares/Product.middleware.js');
const headerPage = require('../middlewares/Headerpage.js');

const router = express.Router();

router.get('/tentang-kami', menuProduct,headerPage, abountController.aboutUsPage);

module.exports = router;