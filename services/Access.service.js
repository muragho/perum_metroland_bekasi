const { db } = require('../configs/Database.js');

async function getAccessByCluster(clusterId) {
    return await db.Access.findAll({ where: { clusterId } });
}

async function addCluster(data) {
    return await db.Access.create(data);
}

async function deleteAccess(id) {
    return await db.Access.destroy({ where: { id } });
}

module.exports = { getAccessByCluster, addCluster, deleteAccess }