const carrierService = require('../services/Carrier.service.js');
const pagination = require('../helpers/Pagination.js');
const departmentService = require('../services/Department.service.js');
const moment = require('moment');
const { Op } = require("sequelize");
const jsdom = require('jsdom');
const title = "Metroland | Cluster";
const header = "karir";
const INTERNAL_SERVER_ERROR = 500;

const { JSDOM } = jsdom;

async function carrierPage(req, res) {
    const page = parseInt(req.query.page || 1);
    const size = parseInt(req.query.size || 10);
    const key = req.query.q || null;
    const bearer = req.bearer;

    let num = 0;
    let pageNumber = "";

    try {
        let where = {};
        if (key != null) {
            where.description = { [Op.substring]: key }
        }
        const { count, rows } = await carrierService.getAllCarrier(where, page, size);
        if (count > 0) {
            let { number, pageNumUi } = pagination.setPagination(rows, count, page, size, key, "/metroland/auth/carriers");
            num = number;
            pageNumber = pageNumUi;
        }

        const departments = await departmentService.getAllDepartment();
        console.log(JSON.stringify(departments))

        res.render("carrier/index", {
            title, header, bearer, carriers: rows, departments, moment, csrfToken: req.csrfToken(), JSDOM, pagination: pageNumber, no: num
        });
    } catch (error) {
        console.error(`err clusterPage : ${error}`)
        return res.status(INTERNAL_SERVER_ERROR).render("500/index");
    }
}

module.exports = { carrierPage }