const { db } = require('../configs/Database.js');
const CODE_PROMO = 100;

async function getPromo() {
    return await db.Config.findOne({
        where: {
            code: CODE_PROMO
        }
    });
}

async function getConfigs() {
    return await db.Config.findAll();
}

async function doEditConfig(id, data) {
    return await db.Config.update(data, { where: { id } })
}

async function getAbout() {
    return await db.AboutUs.findOne({ limit: 1, order: [['created_at', 'DESC']] });
}

module.exports = { getPromo, getConfigs, doEditConfig, getAbout }