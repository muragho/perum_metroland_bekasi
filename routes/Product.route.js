const express = require('express');
const productService = require('../controllers/General.product.controller.js');
const menuProduct = require('../middlewares/Product.middleware.js');
const headerPage = require('../middlewares/Headerpage.js');
const { tryCatch } = require('../helpers/TryCatch.js');
const router = express.Router();

router.get('/produk', menuProduct, tryCatch(productService.allProductPage));
router.get('/produk/:id', menuProduct,headerPage, tryCatch(productService.productPage));
router.get('/produk/v2/:id', menuProduct,headerPage, tryCatch(productService.productV2Page));

router.get('/produk/api/v2/:video', menuProduct,headerPage, tryCatch(productService.getStreamVideo));


module.exports = router;