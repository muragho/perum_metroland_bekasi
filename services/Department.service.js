const { db } = require('../configs/Database.js');

async function getAllDepartment() {
    return await db.Department.findAll();
}

module.exports = { getAllDepartment }