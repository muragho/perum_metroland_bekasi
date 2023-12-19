const response = require('../helpers/Response.js');
const productService = require('../services/Product.service.js');
const clusterService = require('../services/Cluster.service.js');
const fs = require('fs');
const fs2 = require('fs').promises;
const { db } = require('../configs/Database.js');

async function doReset(req, res) {
    console.info(`inside doReset`);
    const userId = req.params.id;
    const bearer = req.bearer;

    // const t = await db.conn.transaction();
    try {
        const date = new Date();
        let data = {};

        data.updated_by = bearer.emailSignIn;
        data.updated_at = date;

        db.Product.findByPk(productId).then(product => {

            const clusters_ = reqBody.clusters.split(',');

            if (product) {
                product.setClusters(clusters_).then(() => {
                    response(res, 200, 200, 'Data berhasil diubah');
                })
            }
        })

    } catch (error) {
        console.error(`err doEditProduct : ${error}`);
        // await t.rollback();
        await response(res, 200, 400, error.message || 'Data gagal diubah')
    }
}