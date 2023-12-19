const express = require('express');
const userController = require('../../controllers/User.controller.js');
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

router.get('/users', csrfProt, userController.userPage);

//------------------- USER API --------------------

module.exports = router;