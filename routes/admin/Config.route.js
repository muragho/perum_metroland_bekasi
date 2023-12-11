const express = require('express');
const configController = require('../../controllers/Configuration.controller.js');
const configApiController = require('../../controllers/Configuration.api.controller.js');
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

router.get('/configs', csrfProt, configController.configPage);

router.put('/api/v1/configs/:id', multipartForm, urlEncodedParser, csrfProt, configApiController.doEditConfig);

module.exports = router;