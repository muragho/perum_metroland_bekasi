const express = require('express');
const productService = require('../controllers/General.product.controller.js');
const menuProduct = require('../middlewares/Product.middleware.js');
const router = express.Router();

router.get('/produk', menuProduct, productService.allProductPage);
router.get('/produk/:id', menuProduct, productService.productPage);

module.exports = router;