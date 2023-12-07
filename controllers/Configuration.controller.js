const configService = require('../services/Config.service.js');
const moment = require('moment');
const title = "Metroland | Konfigurasi";
const header = "Konfigurasi";
const INTERNAL_SERVER_ERROR = 500;

const CFG_PROMO_CODE = 100;

async function configPage(req, res) {
    try {

        const configs = await configService.getConfigs();

        const promo = configs.find(c => c.code === CFG_PROMO_CODE);


        res.render("config/index", {
            title, header, promo: promo.value, moment
        })
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).render("500/index");
    }
}

module.exports = { configPage }