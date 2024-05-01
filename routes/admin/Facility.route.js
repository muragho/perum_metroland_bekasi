const express = require('express');
const facilityApi = require('../../controllers/Facility.api.controller.js');
const router = express.Router();
const csrf = require('csurf');
const csrfProt = csrf({
    cookie: true,
});

//------------------- PRODUCT API --------------------
router.get('/api/v1/facilities', csrfProt, facilityApi.getAllFacilities);

module.exports = router;