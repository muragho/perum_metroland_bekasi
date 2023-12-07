const { db } = require('../configs/Database.js');

async function getAllFacilities() {
    return await db.Facility.findAll();
}

module.exports = { getAllFacilities }