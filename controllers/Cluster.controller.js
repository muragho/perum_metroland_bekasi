const clusterServ = require('../services/Cluster.service.js');
const facilityService = require('../services/Facility.service.js');
const moment = require('moment');
const { Op } = require("sequelize");
const jsdom = require('jsdom');
const title = "Metroland | Cluster";
const header = "Tipe Produk";
const INTERNAL_SERVER_ERROR = 500;

const { JSDOM } = jsdom;

async function clusterPage(req, res) {
    const page = req.query.page || 1;
    const size = req.query.size || 10;
    const key = req.query.q || null;

    try {
        let where = {};
        if (key != null) {
            where.name = { [Op.substring]: key }
        }
        const { count, rows } = await clusterServ.getAllCluster(where, page, size);
        const facilities = await facilityService.getAllFacilities();
        // console.log("--> " + JSON.stringify(rows))

        res.render("clusters/index", {
            title, header, clusters: rows, moment, csrfToken: req.csrfToken(), JSDOM, facilities
        });
    } catch (error) {
        console.error(`err clusterPage : ${error}`)
        return res.status(INTERNAL_SERVER_ERROR).render("500/index");
    }
}

module.exports = { clusterPage }