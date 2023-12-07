const response = require('../helpers/Response.js');
const productService = require('../services/Product.service.js');
const clusterService = require('../services/Cluster.service.js');
const fs = require('fs');
const fs2 = require('fs').promises;
const { db } = require('../configs/Database.js');

async function doEditProduct(req, res) {
    console.info(`inside doEditProduct`);
    const productId = req.params.id;
    const reqBody = req.body;
    const bearer = req.bearer;
    console.log(`id : ${productId} , body : ${JSON.stringify(reqBody)}`)

    // const t = await db.conn.transaction();
    try {
        const date = new Date();
        let data = {};

        data.title = reqBody.title
        data.content = reqBody.description;
        data.updated_by = bearer.emailSignIn;
        data.updated_at = date;

        await productService.doEdit(productId, data);

        console.log(req.files[1])
        if (req.files.length > 0) {

            await Promise.all(req.files.map(async (img) => {
                const filename = img.originalname.replaceAll(' ', '');

                if (img.fieldname == 'file_site_plan') {

                    await productService.doEdit(productId, { image_site_plan: filename });
                    await fs2.writeFile('./public/metroland/assets/img_site_plan/' + filename, img.buffer);

                } else {
                    await productService.doEdit(productId, { image: filename });
                    await fs2.writeFile('./public/metroland/assets/img/' + filename, img.buffer);
                }
            }));
        }



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

async function doAddProduct(req, res) {
    console.info(`inside doAddProduct`);
    const reqBody = req.body;
    const bearer = req.bearer;

    // const t = await db.conn.transaction();
    try {
        const date = new Date();
        const logo = req.files[0];

        let data = {};
        if (req.files.length > 0) {
            data.image = logo.originalname;

            fs.writeFile('./public/metroland/assets/img/' + logo.originalname, logo.buffer, function (err) {
                if (err) {
                    throw new Error(err);
                }
            });
        }
        data.title = reqBody.title
        data.content = reqBody.description;
        data.created_by = bearer.emailSignIn;
        data.updated_by = bearer.emailSignIn;
        data.created_at = date;
        data.updated_at = date;

        // console.log(JSON.stringify(reqBody))
        const newProduct = await productService.addProduct(data, null);
        console.log("new product : " + JSON.stringify(newProduct))

        const clusters_ = reqBody.clusters.split(',');
        await Promise.all(clusters_.map(async (element) => {
            console.log("element : " + element)

            // await clusterService.getClusterById(element).then(async (cluster) => {
            //     console.log("----> " + cluster.id)
            //     await cluster.addProducts(newProduct.id)
            // })
            const c = await clusterService.getClusterById(element);
            await c.addProducts(newProduct.id);
        }))


        // await t.commit()
        await response(res, 200, 200);

    } catch (error) {
        console.error(`err doEditProduct : ${error}`);
        // await t.rollback();
        await response(res, 500, 400, error)
    }
}

async function getClusterByProduct(req, res) {
    console.info(`inside getClusterByProduct`)

    const productId = req.params.id;

    try {

        const data = await productService.getProductCluster(productId);
        await response(res, 200, 200, 'success', data);
    } catch (error) {
        console.error(error);
        await response(res, 200, 400, error.message || 'Data tidak ditemukan');
    }
}

async function removeLogoOrSitePlanImage(req, res) {
    console.info(`inside removeLogoOrSitePlanImage`);
    const productId = req.params.id;
    const isLogo = req.params.logo == 'logo' ? true : false;
    const bearer = req.bearer;
    try {

        let data = {};
        if (isLogo) {
            data.image = null;
        } else {
            data.image_site_plan = null;
        }
        data.updated_by = bearer.emailSignIn;
        data.updated_at = new Date();

        await productService.updateProduct(productId, data);

        await response(res, 200, 200, 'data berhasil dihapus');
    } catch (error) {
        console.error(error);
        await response(res, 500, 400, error)
    }
}

module.exports = { doEditProduct, doAddProduct, getClusterByProduct, removeLogoOrSitePlanImage }