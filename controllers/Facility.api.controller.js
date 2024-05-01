const facilityService = require('../services/Facility.service.js');

async function getAllFacilities(req, res) {
    try {
        const clusters = await facilityService.getAllFacilities();

        res.status(200).send({ code: 200, message: 'success', data: clusters })
    } catch (error) {
        console.error(`err getAllFacilities : ${error}`)
        res.status(500).send({ code: 500, message: error.message })
    }
};

module.exports = { getAllFacilities };