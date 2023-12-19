const response = require('../helpers/Response.js');
const config = require('../services/Config.service.js');

async function getPromo(req, res) {
    console.info(`inside getPromo`);

    try {

        const dataConfig = await config.getPromo();

        const cfg = dataConfig.value;

        const start = new Date(cfg.start);
        start.setDate(start.getDate() + cfg.duration);

        if (start < new Date()) {
            throw new Error('tidak ada promosi');
        }

        await response(res, 200, 200, 'success', dataConfig.value);

    } catch (error) {
        console.error(`err doEditProduct : ${error}`);
        await response(res, 200, 400, error.message)
    }
}

async function doCalculateKPR(req, res) {
    const reqBody = req.body;
    const tenor = reqBody.tenor;
    const bunga = reqBody.bunga;
    const properti = reqBody.properti;

    console.log("properti : " + properti);
    console.log("bungan : " + bunga);
    console.log("tenor : " + tenor);

    try {

        const step1 = (properti * bunga) / 100;
        const step2 = parseInt(properti) + parseInt(step1);
        console.log("step1 : " + step1);
        console.log("step2 : " + step2);

        const step3 = step2 / (tenor * 12);
        console.log("step3 : " + step3);

        await response(res, 200, 200, 'success', { angsuran: Math.round(step3) });
    } catch (error) {
        console.error(error);
        await response(res, 200, 400, error.message)
    }
}

module.exports = { getPromo, doCalculateKPR }