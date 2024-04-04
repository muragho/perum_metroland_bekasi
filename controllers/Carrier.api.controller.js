const carrierService = require('../services/Carrier.service.js');
const response = require('../helpers/Response.js');
const fs = require('fs').promises;

async function doAddCarrier(req, res) {
    console.info(`inside doAddCarrier`);
    const reqBody = req.body;
    const bearer = req.bearer;

    try {
        const date = new Date();
        const logo = req.files[0];
        console.log("total files : ",req.files.length)
        console.log("original name : ",logo.originalname)

        let data = JSON.parse(JSON.stringify(reqBody));

        if (req.files.length > 0) {
            data.banner_image = logo.originalname.replaceAll(' ', '');

            fs.writeFile('./public/metroland/assets/img_carrier/' + logo.originalname, logo.buffer, function (err) {
                if (err) {
                    throw new Error(err);
                }
            });
        }

        data.created_by = bearer.emailSignIn;
        data.updated_by = bearer.emailSignIn;
        data.created_at = date;
        data.updated_at = date;

        console.log(JSON.stringify(data))
        await carrierService.doSave(data);


        await response(res, 200, 200, 'data berhasil ditambahkan');

    } catch (error) {
        console.error(`err doEditProduct : ${error}`);
        // await t.rollback();
        await response(res, 500, 400, error)
    }
}

async function doEditCarrier(req, res) {
    console.info(`inside doEditCarrier`);
    const id = req.params.id;
    const reqBody = req.body;
    const bearer = req.bearer;

    try {
        const date = new Date();
        const logo = req.files[0];

        let data = JSON.parse(JSON.stringify(reqBody));

        if (req.files.length > 0) {
            const filename = logo.originalname.replaceAll(' ', '');
            data.banner_image = filename;

            fs.writeFile('./public/metroland/assets/img_carrier/' + filename, logo.buffer, function (err) {
                if (err) {
                    throw new Error(err);
                }
            });
        } else {
            data.banner_image = null;
        }

        data.created_by = bearer.emailSignIn;
        data.updated_by = bearer.emailSignIn;
        data.created_at = date;
        data.updated_at = date;

        console.log("id : " + id + " , Data : " + JSON.stringify(data))
        // console.log(JSON.stringify(reqBody))
        await carrierService.doEdit(id, data);


        await response(res, 200, 200, 'data berhasil diubah');

    } catch (error) {
        console.error(`err doEditProduct : ${error}`);
        // await t.rollback();
        await response(res, 500, 400, error)
    }
}

async function doDeleteCarrier(req, res) {
    console.info(`inside doDeleteCarrier`);
    const id = req.params.id;

    try {
        
        await carrierService.doDelete(id);

        await response(res, 200, 200, 'data berhasil dihapus');

    } catch (error) {
        console.error(error);
        // await t.rollback();
        await response(res, 500, 400, error)
    }
}

module.exports = { doAddCarrier, doEditCarrier ,doDeleteCarrier}