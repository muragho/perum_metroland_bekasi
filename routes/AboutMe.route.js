const express = require('express');
const abountController = require('../controllers/General.aboutUs.controller.js');
const menuProduct = require('../middlewares/Product.middleware.js');
const router = express.Router();

router.get('/tentang-kami', menuProduct, abountController.aboutUsPage);

module.exports = router;