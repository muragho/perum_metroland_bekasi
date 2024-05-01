const { db } = require('../configs/Database.js');

async function getAllClusterByLimit(limit) {
    return await db.Cluster.findAll({ limit });
}

async function getClusterById(id) {
    return await db.Cluster.findOne({
        where: {
            id: id
        }
    });
}

async function getClusters() {
    return await db.Cluster.findAll({
        attributes: ['id', 'name']
    });
}

async function getAllCluster(where, page, per_page) {
    return await db.Cluster.findAndCountAll({
        where,
        order: [["id", "DESC"]],
        offset: (page - 1) * 10,
        limit: per_page,
        distinct: true,
    });
}

async function doAdd(data) {
    return await db.Cluster.create(data, { returning: true });
}

async function doEdit(id, data, transaction) {
    if (transaction) {
        return await db.Cluster.update(data, { where: { id }, returning: true, transaction });
    } else {
        return await db.Cluster.update(data, { where: { id }, returning: true });
    }
}

async function getClusterImageByCluster(clusterId) {
    return await db.ClusterImage.findAll({
        where: {
            clusterId: clusterId
        }
    })
}

async function delClusterImageById(id) {
    console.log("id will be destroyed : " + id)
    return await db.ClusterImage.destroy({ where: { id: id } })
}

async function upsertCustomerImage(data, transaction) {

    let dataBefore = await db.ClusterImage.findOne({ where: { clusterId: data.clusterId, image: data.image } });
    if (dataBefore) {
        if (transaction) {
            return await db.ClusterImage.update(data, { where: { id: dataBefore.id }, transaction });
        } else {
            return await db.ClusterImage.update(data, { where: { id: dataBefore.id } });
        }

    } else {
        if (transaction) {
            return await db.ClusterImage.create(data, { transaction });
        } else {
            return await db.ClusterImage.create(data);
        }
    }
}

async function getClusterFacilities(clusterId) {
    return await db.Cluster.findOne({
        where: {
            id: clusterId
        }
    })
}

async function delCluster(id) {
    return await db.Cluster.destroy({ where: { id} })
}

module.exports = {
    getAllClusterByLimit, getClusterById, getClusters, getAllCluster, doAdd, doEdit,
    getClusterImageByCluster, delClusterImageById, upsertCustomerImage, getClusterFacilities,delCluster
}
