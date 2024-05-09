const configService = require('../services/Config.service.js');
const accessService = require('../services/Access.service.js');
const FacilityService = require('../services/Facility.service.js');
const moment = require('moment');
const title = "Metroland | Konfigurasi";
const header = "Konfigurasi";
const INTERNAL_SERVER_ERROR = 500;

const CFG_PROMO_CODE = 100;

async function configPage(req, res) {
    const bearer = req.bearer;
    try {

        const configs = await configService.getConfigs();
        const about = await configService.getAbout();

        const promo = configs.find(c => c.code === CFG_PROMO_CODE);

        const iconAkses = await accessService.getAccessIconsIncludeTipe();
        const facilities = await FacilityService.getAllFacilitiesCluster();
        console.log("facilities",JSON.stringify(facilities))

        const headerPages = await configService.getHeaderPages();
        console.log("header page : ",JSON.stringify(headerPages))
        res.render("config/index", {
            title, header, bearer, csrfToken: req.csrfToken(), promo: promo.value, 
            promo_id: promo.id, moment, about,iconAkses,facilities,headerPages
        })
    } catch (error) {
        console.error(error)
        return res.status(INTERNAL_SERVER_ERROR).render("500/index");
    }
}

module.exports = { configPage }