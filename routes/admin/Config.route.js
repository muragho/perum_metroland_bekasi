const express = require('express');
const configController = require('../../controllers/Configuration.controller.js');
const router = express.Router();

router.get('/configs', configController.configPage);

module.exports = router;