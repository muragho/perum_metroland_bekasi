const express = require('express');
const userController = require('../../controllers/User.controller.js');
const userApiController = require('../../controllers/User.api.controller.js');
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

router.get('/profile', csrfProt, userController.profilePage);

//------------------- USER API --------------------
router.post('/users/api/v1/user', urlEncodedParser, csrfProt, userApiController.doSave);
router.put('/users/api/v1/user/reset-password/:id', urlEncodedParser, csrfProt, userApiController.doReset);
router.put('/users/api/v1/user/:id/password', urlEncodedParser, csrfProt, userApiController.doChangePassword);
router.put('/users/api/v1/profile/:id', multipartForm, urlEncodedParser, csrfProt, userApiController.doChangeProfile);

module.exports = router;