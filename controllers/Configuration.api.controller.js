const response = require('../helpers/Response.js');
const configService = require('../services/Config.service.js');
const fs2 = require('fs').promises;

async function doEditConfig(req, res) {
    console.info(`inside doEditConfig`);
    const configId = req.params.id;
    const reqBody = req.body;
    const bearer = req.bearer;
    console.log(`id : ${configId} , body : ${JSON.stringify(reqBody)}`)

    try {
        const date = new Date();
        let data = JSON.parse(JSON.stringify(reqBody))

        if (req.files.length > 0) {

            const filename = req.files[0].originalname.replaceAll(' ', '');
            data.image = filename;

            await fs2.writeFile('./public/metroland/assets/promo/' + filename, req.files[0].buffer);

        }

        let cfg = {};
        cfg.value = data;
        cfg.updated_by = bearer.emailSignIn;
        cfg.updated_at = date;

        await configService.doEditConfig(configId, cfg);

        response(res, 200, 200, 'Data berhasil diubah');
    } catch (error) {
        console.error(`err doEditConfig : ${error}`);
        await response(res, 200, 400, error.message || 'Data gagal diubah')
    }
}

module.exports = { doEditConfig }