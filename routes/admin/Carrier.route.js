const express = require('express');
const carrierController = require('../../controllers/Carrier.controller.js');
const carrierApi = require('../../controllers/Carrier.api.controller.js');
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

router.get('/carriers', csrfProt, carrierController.carrierPage);

//---------------- API -----------------
router.post('/api/v1/carriers', multipartForm, urlEncodedParser, csrfProt, carrierApi.doAddCarrier);
router.put('/api/v1/carriers/:id', multipartForm, urlEncodedParser, csrfProt, carrierApi.doEditCarrier);

module.exports = router;