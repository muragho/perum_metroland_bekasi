const express = require('express');
const bodyParser = require('body-parser');
const newsController = require('../../controllers/News.controller.js');
const multipartForm = require('../../middlewares/MultipartForm.js');
const isLogin = require('../../middlewares/LoginCheck.js');
const upload = require('../../helpers/Multer.js');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require('fs');
const router = express.Router();
const csrf = require('csurf');
const csrfProt = csrf({
    cookie: true,
});
const urlEncodedParser = bodyParser.urlencoded({
    extended: false,
});

router.get('/news', csrfProt, newsController.newsPage);
router.post('/news', isLogin, upload.single("thubnail"), newsController.save);
// router.post('/news/edit', isLogin, upload.single("thubnail"), newsController.edit);


router.delete('/news/api/v1/image_thubnail/:id/news', csrfProt, newsController.removeThubnail);
router.put('/news/api/v1/:id', multipartForm, urlEncodedParser, csrfProt, newsController.edit);

module.exports = router;