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

async function getHeaderPages(){
    return await db.Headerpage.findAll();
}
async function getHeaderPagesExcludeVideo(){
    return await db.Headerpage.findAll({where:{
        productId:null
    }});
}

async function doEditHeader(id, data) {
    return await db.Headerpage.update(data, { where: { id } })
}

module.exports = { getPromo, getConfigs, doEditConfig, getAbout,getHeaderPages,doEditHeader,getHeaderPagesExcludeVideo }