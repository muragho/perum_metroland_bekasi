const response = require('../helpers/Response.js');
const { db } = require('../configs/Database.js');
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

async function doEditConfigAbout(req, res) {
    console.log(`inside doEditConfigAbout`)
    const reqBody = req.body;
    const id = req.params.id;
    const bearer = req.bearer;
    console.info("edit about : " + JSON.stringify(reqBody));
    try {
        console.log("id : " + id)

        const date = new Date();
        let data = {};
        data.description = reqBody.description.replaceAll('<img', '<img class="img-fluid rounded mx-auto d-block"');
        data.created_by = bearer.emailSignIn;
        data.updated_by = bearer.emailSignIn;
        data.created_at = date;
        data.updated_at = date;

        if (id == '' || id == 0) {
            await db.AboutUs.create(data);
        } else {
            await db.AboutUs.update(data, { where: { id } });
        }

        await response(res, 200, 200, 'data berhasil diubah');
    } catch (error) {
        console.error(error);
        await response(res, 200, 400, error.message || 'data gagal diubah');
    }
}

module.exports = { doEditConfig, doEditConfigAbout }