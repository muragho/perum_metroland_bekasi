const userService = require('../services/User.service.js');
const pagination = require('../helpers/Pagination.js');
const moment = require('moment');
const { Op } = require("sequelize");
const jsdom = require('jsdom');
const title = "Metroland | User";
const header = "Pengguna";
const INTERNAL_SERVER_ERROR = 500;

const { JSDOM } = jsdom;

async function userPage(req, res) {
    const page = req.query.page || 1;
    const size = req.query.size || 10;
    const key = req.query.q || null;

    try {
        console.log("key : " + key)
        let where = {};
        if (key != null) {
            where = {
                [Op.or]: [
                    { name: { [Op.substring]: key } }, { email: { [Op.substring]: key } }
                ]
            }
        }
        const { count, rows } = await userService.getAllUser(where, page, size);
        console.log(JSON.stringify(rows))
        let { number, pageNumUi } = pagination.setPagination(rows, count, page, size, key, "/metroland/auth/users");

        res.render("users/index", {
            title, header, users: rows, moment, csrfToken: req.csrfToken(), JSDOM, pagination: pageNumUi
        });
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).render("500/index");
    }
}

module.exports = { userPage }