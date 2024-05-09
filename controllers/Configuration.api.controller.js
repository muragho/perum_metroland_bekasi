const response = require('../helpers/Response.js');
const { db } = require('../configs/Database.js');
const configService = require('../services/Config.service.js');
const accessService = require("../services/Access.service.js");
const facilityService = require("../services/Facility.service.js");
const sharp = require('sharp');
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

async function doAddConfigAksesIcon(req, res) {
    console.info(`inside doAddConfigAksesIcon`);
    const reqBody = req.body;
    const bearer = req.bearer;
    console.log(` body : ${JSON.stringify(reqBody)}`)

    try {
        const date = new Date();
        let data = JSON.parse(JSON.stringify(reqBody))

        if (req.files.length > 0) {

            const filename = req.files[0].originalname.replaceAll(' ', '');
            data.icon = filename;

            const resizedImageBuffer = await sharp(req.files[0].buffer)
            .resize(80, 80) // Resize to 300x300 pixels
            .toBuffer();

            await fs2.writeFile('./public/metroland/assets/img/' + filename, resizedImageBuffer);

        }
        data.created_by = bearer.emailSignIn;
        data.updated_by = bearer.emailSignIn;
        data.created_at = date;
        data.updated_at = date;

        await accessService.doAddAccessIcon(data);

        response(res, 200, 200, 'Data berhasil ditambahkan');
    } catch (error) {
        console.error(`err doEditConfig : ${error}`);
        await response(res, 200, 400, error.message || 'Data gagal diubah')
    }
}

async function doEditConfigAksesIcon(req, res) {
    console.info(`inside doEditConfigAksesIcon`);
    const id = req.params.id;
    const reqBody = req.body;
    const bearer = req.bearer;
    console.log(`id : ${id} , body : ${JSON.stringify(reqBody)}`)

    try {
        const date = new Date();
        let data = JSON.parse(JSON.stringify(reqBody))

        if (req.files.length > 0) {

            const filename = req.files[0].originalname.replaceAll(' ', '');
            data.icon = filename;

            const resizedImageBuffer = await sharp(req.files[0].buffer)
            .resize(80, 80) // Resize to 300x300 pixels
            .toBuffer();

            await fs2.writeFile('./public/metroland/assets/img/' + filename, resizedImageBuffer);

        }

        data.updated_by = bearer.emailSignIn;
        data.updated_at = date;

        await accessService.doEditAccessIcon(id , data);

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

async function deleteAccessIcon(req, res) {
    console.info(`inside deleteAccessIcon`)
    const accessIconId = req.params.id
    try {

        await accessService.doDeleteAccessIcon(accessIconId);
        await response(res, 200, 200, 'data berhasil dihapus');
    } catch (error) {
        console.error(error)
        await response(res, 200, 400, error.message || 'gagal menghapus data')
    }
}

async function deleteFasilityIcon(req, res) {
    console.info(`inside deleteFasilityIcon`)
    const facilityId = req.params.id
    try {

        await facilityService.doDeleteFacility(facilityId);
        await response(res, 200, 200, 'data berhasil dihapus');
    } catch (error) {
        console.error(error)
        await response(res, 200, 400, error.message || 'gagal menghapus data')
    }
}

async function doAddConfigFacilityIcon(req, res) {
    console.info(`inside doAddConfigFacilityIcon`);
    const reqBody = req.body;
    const bearer = req.bearer;
    console.log(` body : ${JSON.stringify(reqBody)}`)

    try {
        const date = new Date();
        let data = JSON.parse(JSON.stringify(reqBody))
        console.log("total img ",req.files.length)
        if (req.files.length > 0) {

            const filename = req.files[0].originalname.replaceAll(' ', '');
            data.image = filename;

            const resizedImageBuffer = await sharp(req.files[0].buffer)
            .resize(139, 250) // Resize to 300x300 pixels
            .toBuffer();

            await fs2.writeFile('./public/metroland/assets/img/' + filename, resizedImageBuffer);

        }
        data.created_by = bearer.emailSignIn;
        data.updated_by = bearer.emailSignIn;
        data.created_at = date;
        data.updated_at = date;

        await facilityService.doAddFacility(data);

        response(res, 200, 200, 'Data berhasil ditambahkan');
    } catch (error) {
        console.error(`err doEditConfig : ${error}`);
        await response(res, 200, 400, error.message || 'Data gagal diubah')
    }
}

async function doEditConfigFacilityIcon(req, res) {
    console.info(`inside doEditConfigFacilityIcon`);
    const id = req.params.id;
    const reqBody = req.body;
    const bearer = req.bearer;
    console.log(`id : ${id} , body : ${JSON.stringify(reqBody)}`)

    try {
        const date = new Date();
        let data = JSON.parse(JSON.stringify(reqBody))

        if (req.files.length > 0) {

            const filename = req.files[0].originalname.replaceAll(' ', '');
            data.image = filename;

            const resizedImageBuffer = await sharp(req.files[0].buffer)
            .resize(80, 80) // Resize to 300x300 pixels
            .toBuffer();

            await fs2.writeFile('./public/metroland/assets/img/' + filename, resizedImageBuffer);

        }

        data.updated_by = bearer.emailSignIn;
        data.updated_at = date;

        await facilityService.doEditFacility(data , id);

        response(res, 200, 200, 'Data berhasil diubah');
    } catch (error) {
        console.error(`err doEditConfig : ${error}`);
        await response(res, 200, 400, error.message || 'Data gagal diubah')
    }
}

async function doEditConfigHeaderIcon(req, res) {
    console.info(`inside doEditConfigHeaderIcon`);
    const id = req.params.id;
    const reqBody = req.body;
    const bearer = req.bearer;
    console.log(`id : ${id} , body : ${JSON.stringify(reqBody)}`)

    try {
        const date = new Date();
        let data = {};

        if (req.files.length > 0) {

            const filename = req.files[0].originalname.replaceAll(' ', '');
            data.image = filename;

            const resizedImageBuffer = await sharp(req.files[0].buffer)
            .resize(1920, 1080) // Resize to 300x300 pixels
            .toBuffer();

            await fs2.writeFile('./public/metroland/assets/img/' + filename, resizedImageBuffer);

        }else{
            throw new Error('image header is required');
        }

        data.updated_by = bearer.emailSignIn;
        data.updated_at = date;
        console.log("data header : ",data)

        await configService.doEditHeader(id,data)

        response(res, 200, 200, 'Data berhasil diubah');
    } catch (error) {
        console.error(`err doEditConfig : ${error}`);
        await response(res, 200, 400, error.message || 'Data gagal diubah')
    }
}

module.exports = { doEditConfig, doEditConfigAbout,doAddConfigAksesIcon,doEditConfigAksesIcon ,
    deleteAccessIcon,deleteFasilityIcon,doAddConfigFacilityIcon,doEditConfigFacilityIcon,doEditConfigHeaderIcon}