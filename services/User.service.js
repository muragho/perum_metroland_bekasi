const { db } = require('../configs/Database.js');
const CryptoJS = require('crypto-js');
const joi = require('joi');

async function checkLoginSchema(data) {

    let schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    });
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };
    const { error, value } = schema.validate(data, options);

    if (error) {
        let response = {};
        response.isError = true;
        response.message = error.details.map((x) => x.message).join(", ");
        return response;
    } else {
        let response = {};
        response.isError = false;
        response.message = "";
        return response;
    }
}

async function getByEmail(email) {
    const response = await db.User.findOne({
        where: {
            email: email,
        }
    });
    return response;
};

async function getByRefToken(token) {
    return await db.User.findOne({ where: { refresh_token: token } });
}

async function doDecrypt(value) {
    const key = process.env.SIGNATURE;
    var bytes = CryptoJS.AES.decrypt(value, key);
    return bytes.toString(CryptoJS.enc.Utf8);

}

async function getAllUser(where, page, per_page) {
    return await db.User.findAndCountAll({
        attributes: { exclude: ['deleted_at', 'deleted_by', 'updated_at', 'updated_by', 'created_at', 'created_by'] },
        where,
        order: [["id", "DESC"]],
        offset: (page - 1) * 10,
        limit: per_page,
        distinct: true,
    });
}

async function saveData(data) {
    return await db.User.create(data, { returning: true });
}

async function updateData(data, id) {
    return await db.User.update(data, { where: { id } });
}

module.exports = { checkLoginSchema, getByEmail, getByRefToken, doDecrypt, getAllUser, saveData, updateData }