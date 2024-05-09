const express = require('express');
const berandaController = require('../controllers/General.beranda.controller.js');
const berandaAPI = require('../controllers/General.api.beranda.controller.js');
const headerPage = require('../middlewares/Headerpage.js');
const router = express.Router();



router.get('/',headerPage, berandaController.berandaPage);
router.get('/beranda',headerPage,berandaController.berandaPage);

// -------------- API
router.get('/beranda/api/v1/promo', berandaAPI.getPromo);
router.post('/beranda/api/v1/kpr', berandaAPI.doCalculateKPR);

module.exports = router;