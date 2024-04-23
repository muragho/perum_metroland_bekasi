const { db } = require('../configs/Database.js');

async function getAccessByCluster(clusterId) {
    return await db.Access.findAll({ where: { clusterId },include:{model:db.AccessIcon} });
}

async function addCluster(data) {
    return await db.Access.create(data);
}

async function deleteAccess(id) {
    return await db.Access.destroy({ where: { id } });
}

async function getAccessIcons() {
    return await db.AccessIcon.findAll({attributes:['id','type','icon']});
}

async function getAccessIconsIncludeTipe() {
    return await db.AccessIcon.findAll({attributes:['id','type','icon','created_at'],
    include:{model:db.Access , required : false,attributes:['id','title','description'],include:{model:db.Cluster,attributes:['id','name']}}});
}

async function doAddAccessIcon(data){
    return await db.AccessIcon.create(data);
}

async function doEditAccessIcon(id,data){
    return await db.AccessIcon.update(data, { where: { id } })
}

async function doDeleteAccessIcon(id){
    return await db.AccessIcon.destroy({ where: { id } });
}

module.exports = { getAccessByCluster, addCluster, deleteAccess,getAccessIcons,getAccessIconsIncludeTipe,doAddAccessIcon,doEditAccessIcon ,doDeleteAccessIcon}