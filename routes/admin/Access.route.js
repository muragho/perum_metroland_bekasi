const express = require('express');
const accessController = require('../../controllers/Access.controller.js');
const router = express.Router();
const csrf = require('csurf');
const bodyParser = require('body-parser');
const csrfProt = csrf({
    cookie: true,
});

router.get('/api/v1/accesses/:id/product_id', csrfProt, accessController.getAccessByProduct);

module.exports = router;