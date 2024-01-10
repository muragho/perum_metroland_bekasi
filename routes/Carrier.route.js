const express = require('express');
const carrierController = require('../controllers/General.carrier.controller.js');
const menuProduct = require('../middlewares/Product.middleware.js');
const router = express.Router();

router.get('/karir', menuProduct, carrierController.carrierPage);

module.exports = router;