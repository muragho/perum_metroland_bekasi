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

module.exports = { getPromo, getConfigs }