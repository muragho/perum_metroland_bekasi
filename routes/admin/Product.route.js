const express = require('express');
const productController = require('../../controllers/Product.controller.js');
const productApi = require('../../controllers/Product.api.controller.js');
const multipartForm = require('../../middlewares/MultipartForm.js');
const router = express.Router();
const csrf = require('csurf');
const bodyParser = require('body-parser');
const csrfProt = csrf({
    cookie: true,
});
const urlEncodedParser = bodyParser.urlencoded({
    extended: false,
});

router.get('/products', csrfProt, productController.productPage);



//------------------- PRODUCT API --------------------
router.put('/api/v1/products/:id', multipartForm, urlEncodedParser, csrfProt, productApi.doEditProduct);
router.post('/api/v1/products', multipartForm, urlEncodedParser, csrfProt, productApi.doAddProduct);
router.get('/api/v1/products/cluster/:id/product', csrfProt, productApi.getClusterByProduct);
router.put('/api/v1/products/:logo/image/:id/product', csrfProt, productApi.removeLogoOrSitePlanImage);
router.delete('/api/v1/products/:id', urlEncodedParser, csrfProt, productApi.doDeleteProduct);

module.exports = router;