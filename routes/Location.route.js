const express = require('express');
const locationController = require('../controllers/General.location.controller.js');
const menuProduct = require('../middlewares/Product.middleware.js');
const headerPage = require('../middlewares/Headerpage.js');
const router = express.Router();

router.get('/lokasi', menuProduct,headerPage, locationController.locationPage);

module.exports = router;