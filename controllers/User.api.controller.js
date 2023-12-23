const response = require('../helpers/Response.js');
const userService = require('../services/User.service.js');
const { db } = require('../configs/Database.js');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const randomstring = require('randomstring');
const fs = require('fs').promises;

async function doReset(req, res) {
    console.info(`inside doReset`);
    const userId = req.params.id;
    const bearer = req.bearer;

    try {
        const date = new Date();
        const newPassword = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        });
        const salt = await bcrypt.genSalt(10);
        const pwd = await bcrypt.hash(newPassword, salt);

        let data = {};
        data.updated_by = bearer.emailSignIn;
        data.updated_at = date;
        data.password = pwd;

        await userService.updateData(data, userId);

        response(res, 200, 200, 'Password berhasil diubah', { password: newPassword });

    } catch (error) {
        console.error(`err doEditProduct : ${error}`);
        // await t.rollback();
        await response(res, 200, 400, error.message || 'Data gagal diubah')
    }
}

async function doSave(req, res) {
    console.info(`inside doSave`);
    const reqBody = req.body;
    const bearer = req.bearer;

    console.log("req : " + JSON.stringify(reqBody))
    try {
        const date = new Date();
        const salt = await bcrypt.genSalt(10);
        const pwd = await bcrypt.hash(reqBody.password, salt);
        console.log("pass : " + pwd)
        let data = JSON.parse(JSON.stringify(reqBody));

        data.updated_by = bearer.emailSignIn;
        data.updated_at = date;
        data.join_date = date;
        data.password = pwd;
        data.username = reqBody.username + "_" + moment(date).format('DDMMYYHmmss');

        console.log("new Data : " + JSON.stringify(data))

        const newData = userService.saveData(data);
        console.log(newData)

        response(res, 200, 200, 'Data berhasil disimpan');

    } catch (error) {
        console.error(`err doSave : ${error}`);
        // await t.rollback();
        await response(res, 200, 400, error.message || 'Data gagal disimpan')
    }
}

async function doChangePassword(req, res) {
    console.info(`inside doChangePassword`);
    const userId = req.params.id;
    const reqBody = req.body;
    const bearer = req.bearer;

    try {
        const date = new Date();

        const salt = await bcrypt.genSalt(10);
        const pwd = await bcrypt.hash(reqBody.password, salt);

        let data = {};
        data.updated_by = bearer.emailSignIn;
        data.updated_at = date;
        data.password = pwd;

        await userService.updateData(data, userId);

        response(res, 200, 200, 'Password berhasil diubah');

    } catch (error) {
        console.error(`err doEditProduct : ${error}`);
        await response(res, 200, 400, error.message || 'Data gagal diubah')
    }
}

async function doChangeProfile(req, res) {
    console.info(`inside doChangeProfile`);
    const userId = req.params.id;
    const reqBody = req.body;
    const bearer = req.bearer;
    console.log("userId : " + userId + " | " + JSON.stringify(reqBody))
    try {

        const date = new Date();

        let data = JSON.parse(JSON.stringify(reqBody))
        data.updated_by = bearer.emailSignIn;
        data.updated_at = date;
        console.log("is edit : " + reqBody.isEdit)
        if (reqBody.isEdit) {
            console.log("tot   : " + req.files.length)
            if (req.files.length > 0) {

                const filename = req.files[0].originalname.replaceAll(' ', '');
                if (filename != 'nopic.png') {
                    data.image = filename;

                    await fs.writeFile('./public/metroland/assets/profile/' + filename, req.files[0].buffer);
                }
            }
        }
        console.log(data)
        await db.User.update(data, {
            where: {
                id: userId
            }
        });

        response(res, 200, 200, 'Data berhasil diubah');
    } catch (error) {
        console.error(error);
        await response(res, 200, 400, error.message || 'Data gagal diubah')
    }
}

module.exports = { doReset, doSave, doChangePassword, doChangeProfile }