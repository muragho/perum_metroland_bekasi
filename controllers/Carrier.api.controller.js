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

        let data = JSON.parse(JSON.stringify(reqBody));

        if (req.files.length > 0) {
            data.image = logo.originalname;

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

        // console.log(JSON.stringify(reqBody))
        await carrierService.doSave(data);


        await response(res, 200, 200, 'data berhasil ditambahkan');

    } catch (error) {
        console.error(`err doEditProduct : ${error}`);
        // await t.rollback();
        await response(res, 500, 400, error)
    }
}

module.exports = { doAddCarrier }