const express = require('express');
const productService = require('../controllers/General.product.controller.js');
const menuProduct = require('../middlewares/Product.middleware.js');
const { tryCatch } = require('../helpers/TryCatch.js');
const router = express.Router();

router.get('/produk', menuProduct, tryCatch(productService.allProductPage));
router.get('/produk/:id', menuProduct, tryCatch(productService.productPage));

module.exports = router;