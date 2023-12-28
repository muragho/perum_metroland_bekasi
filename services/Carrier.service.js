const { db } = require('../configs/Database.js');

async function getAllCarrier(where, page, per_page) {
    return await db.Carrier.findAndCountAll({
        attributes: { exclude: ['deleted_at', 'deleted_by', 'updated_at', 'updated_by', 'created_at', 'created_by'] },
        include: [{ model: db.Department, required: true, attributes: ['id', 'name'] }],
        where,
        order: [["id", "DESC"]],
        offset: (page - 1) * 10,
        limit: per_page,
        distinct: true,
    });
}

async function doSave(data) {
    return await db.Carrier.create(data);
}

module.exports = { getAllCarrier, doSave }