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
router.post('/api/v1/configs/akses-icon', multipartForm, urlEncodedParser, csrfProt, configApiController.doAddConfigAksesIcon);
router.put('/api/v1/configs/akses-icon/:id', multipartForm, urlEncodedParser, csrfProt, configApiController.doEditConfigAksesIcon);
router.delete('/api/v1/configs/akses-icon/:id', csrfProt, configApiController.deleteAccessIcon);
router.delete('/api/v1/configs/fasility-icon/:id', csrfProt, configApiController.deleteFasilityIcon);
router.put('/api/v1/configs/facility-icon/:id', multipartForm, urlEncodedParser, csrfProt, configApiController.doEditConfigFacilityIcon);
router.put('/api/v1/configs/about/:id', multipartForm, urlEncodedParser, csrfProt, configApiController.doEditConfigAbout);
router.post('/api/v1/configs/facility', multipartForm, urlEncodedParser, csrfProt, configApiController.doAddConfigFacilityIcon);

module.exports = router;