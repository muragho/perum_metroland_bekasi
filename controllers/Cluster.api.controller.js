const response = require('../helpers/Response.js');
const clusterService = require('../services/Cluster.service.js');
const accessServices = require('../services/Access.service.js');
const fs = require('fs').promises;
const { db } = require('../configs/Database.js');

async function doAddCluster(req, res) {
    console.info(`inside doAddCluster`);
    let reqBody = req.body;
    const bearer = req.bearer;
    console.log(`body : ${JSON.stringify(reqBody)}`)
    try {

        const date = new Date();
        reqBody.created_by = bearer.emailSignIn;
        reqBody.updated_by = bearer.emailSignIn;
        reqBody.created_at = date;
        reqBody.updated_at = date;

        if (reqBody.latitude == '') {
            await delete reqBody.latitude
        }
        if (reqBody.longitude == '') {
            await delete reqBody.longitude
        }

        await clusterService.doAdd(reqBody);

        await response(res, 200, 200, 'success', reqBody);

    } catch (error) {
        console.error(`err doAddCluster : ${error}`);
        await response(res, 200, 400, error)
    }
}

async function doEditCluster(req, res) {
    console.info(`inside doEditProduct`);
    const clusterId = req.params.id;
    let reqBody = req.body;
    const bearer = req.bearer;


    const t = await db.conn.transaction();
    try {

        if (reqBody.hasOwnProperty('latitude') && reqBody.latitude == '') {
            await delete reqBody.latitude;
        }
        if (reqBody.hasOwnProperty('longitude') && reqBody.longitude == '') {
            await delete reqBody.longitude;
        }
        console.log(`id : ${clusterId} , body : ${JSON.stringify(reqBody)}`)

        await clusterService.doEdit(clusterId, reqBody, t);

        reqBody.id = clusterId;
        reqBody.latitude = parseFloat(reqBody.latitude);
        reqBody.longitude = parseFloat(reqBody.longitude);

        if (reqBody.isEditImage) {

            console.log("total img : " + req.files.length)

            if (req.files.length > 0) {

                const date = new Date();
                await Promise.all(req.files.map(async (img) => {
                    let data = {};

                    const filename = img.originalname.replaceAll(' ', '');

                    data.clusterId = clusterId;
                    data.image = filename;
                    data.created_by = bearer.emailSignIn;
                    data.updated_by = bearer.emailSignIn;
                    data.created_at = date;
                    data.updated_at = date;

                    await clusterService.upsertCustomerImage(data, t);

                    await fs.writeFile('./public/metroland/assets/img_cluster/' + filename, img.buffer);
                }))
            }
        }

        if (reqBody.facilities != '') {

            const facilities = reqBody.facilities.split(',');

            const cluster = await db.Cluster.findByPk(clusterId);
            await cluster.setFacilities(facilities, { transaction: t });
        }

        await t.commit();
        await response(res, 200, 200, 'success', reqBody);

    } catch (error) {
        console.error(`err doEditProduct : ${error}`);
        await t.rollback();
        await response(res, 200, 400, error)
    }
}

async function getAllCluster(req, res) {

    try {

        const clusters = await clusterService.getClusters();

        res.status(200).send({ code: 200, message: 'success', data: clusters })

    } catch (error) {
        console.error(`err getAllCluster : ${error}`)
        res.status(500).send({ code: 500, message: error.message })
    }
};

async function getClusterImages(req, res) {
    console.info(`inside getClusterImages`)
    const clusterId = req.params.id;

    try {
        const clusterImg = await clusterService.getClusterImageByCluster(clusterId);

        const facilies = await clusterService.getClusterFacilities(clusterId);

        let data = {};
        data.cluster_img = clusterImg;
        data.facilities = facilies.facilities;
        console.log(JSON.stringify(data))

        await response(res, 200, 200, 'success', data)
    } catch (error) {
        console.error(error);
        await response(res, 200, 400, error.message || 'tidak mendapatkan file')
    }
}

async function delClusterImage(req, res) {
    console.info(`inside delClusterImage`);
    const clusterImageId = req.params.id;
    console.log("cluster image id : " + clusterImageId)
    try {
        await clusterService.delClusterImageById(clusterImageId);

        await response(res, 200, 200, 'data berhasil dihapus')
    } catch (error) {
        console.error(error)
        await response(res, 200, 400, error.message || 'data gagal dihapus')
    }
}

async function getClusterFacilities(req, res) {
    console.info(`inside getClusterFacilities`)
    const clusterId = req.params.id;
    try {

        const cluster_images = await clusterService.getClusterImageByCluster(clusterId);

        let data = {};
        data.cluster_images = cluster_images;

        await response(res, 200, 200, 'success', data);

    } catch (error) {
        console.error(error)
        await response(res, 200, 400, error.message || 'cannot geting facility data')
    }
}

async function getClusterAccess(req, res) {
    console.info(`inside getClusterAccess`)
    const clusterId = req.params.id;
    try {
        console.log("cluster id : ",clusterId)
        const access = await accessServices.getAccessByCluster(clusterId);
        const accessIcons = await accessServices.getAccessIcons();

        const data = {access,accessIcons}

        await response(res, 200, 200, 'success', data);
    } catch (error) {
        console.error(error)
        await response(res, 200, 400, error.message || 'cannot geting access')
    }
}

async function addClusterAccess(req, res) {
    console.info(`inside addClusterAccess`,req.body)
    let reqBody = req.body;
    const bearer = req.bearer;
    try {
        const date = new Date();
        reqBody.created_by = bearer.emailSignIn;
        reqBody.updated_by = bearer.emailSignIn;
        reqBody.created_at = date;
        reqBody.updated_at = date;

        const access = await accessServices.addCluster(reqBody);
        await response(res, 200, 200, 'data berhasil ditambahkan');
    } catch (error) {
        console.error(error)
        await response(res, 200, 400, error.message || 'gagal menambahkan data')
    }
}

async function deleteClusterAccess(req, res) {
    console.info(`inside deleteClusterAccess`)
    const accessId = req.params.id
    try {

        await accessServices.deleteAccess(accessId);
        await response(res, 200, 200, 'data berhasil dihapus');
    } catch (error) {
        console.error(error)
        await response(res, 200, 400, error.message || 'gagal menghapus data')
    }
}

async function deleteCluster(req, res) {
    console.info(`inside deleteCluster`)
    const clusterId = req.params.id
    try {
        await clusterService.delCluster(clusterId);
        await response(res, 200, 200, 'data berhasil dihapus');
    } catch (error) {
        console.error(error)
        await response(res, 200, 400, error.message || 'gagal menghapus data')
    }
}

async function getClusterIcons(req, res) {
    console.info(`inside getClusterIcons`)

    try {
        const data = await accessServices.getAccessIcons();

        await response(res, 200, 200, 'success', data)
    } catch (error) {
        console.error(error);
        await response(res, 200, 400, error.message || 'tidak mendapatkan file')
    }
}

module.exports = {
    doAddCluster, doEditCluster, getAllCluster, getClusterImages, delClusterImage, getClusterFacilities,
    getClusterAccess, addClusterAccess, deleteClusterAccess,deleteCluster,getClusterIcons
}