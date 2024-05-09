const express = require('express');
const carrierController = require('../controllers/General.carrier.controller.js');
const menuProduct = require('../middlewares/Product.middleware.js');
const headerPage = require('../middlewares/Headerpage.js');
const router = express.Router();

router.get('/karir', menuProduct,headerPage, carrierController.carrierPage);

module.exports = router;