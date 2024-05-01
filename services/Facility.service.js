const { db } = require('../configs/Database.js');

async function getFasilityById(id) {
    return await db.Facility.findOne({
        where: {
            id: id
        }
    });
}

async function getAllFacilities() {
    return await db.Facility.findAll();
}

async function getAllFacilitiesCluster() {
    return await db.Facility.findAll({ include: { model: db.Cluster, attributes: ['id', 'name', 'created_by', 'created_at'] } });
}

async function doAddFacility(data) {
    return await db.Facility.create(data);
}

async function doDeleteFacility(id) {
    return await db.Facility.destroy({ where: { id } });
}

async function doEditFacility(data, id) {
    return await db.Facility.update(data, { where: { id } })
}

module.exports = { getFasilityById, getAllFacilities, getAllFacilitiesCluster, doAddFacility, doDeleteFacility, doEditFacility }