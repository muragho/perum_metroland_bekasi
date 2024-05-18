const productService = require('../services/Product.service.js');
const moment = require('moment');
const jsdom = require('jsdom');
const { NOT_FOUND } = require('../helpers/ErrorCodes.js');
const AppError = require('../helpers/AppError.js');

const { JSDOM } = jsdom;
const INTERNAL_SERVER_ERROR = 500;

async function allProductPage(req, res) {
    const products = req.products;
    try {
        const prd = await productService.getAllProductByLimit(20);
        console.log(JSON.stringify(products))

        res.render("f_product/all_product", { products, prd, moment, JSDOM });
    } catch (error) {
        console.error(error);
        return res.status(INTERNAL_SERVER_ERROR).render("500/index");
    }
}

async function productPage(req, res) {

    const productId = req.params.id;
    const products = req.products;
    const header_images =await req.header_image;
    let videoProduct = 'vgr_1.mp4';

    if(header_images.length > 0){
        
        header_images.forEach(element => {
            if(element.productId == productId){
                videoProduct = element.image;
            }
        });
        
    }
    console.log(productId+" | "+videoProduct);

    const data = await productService.getProductCluster(productId);
    if (!data) {
        throw new AppError(NOT_FOUND,'data not found',404);
    }
    
    // console.log(JSON.stringify(data))
    res.render("f_product/index", { products, data, moment, JSDOM,videoProduct });

}



module.exports = { allProductPage, productPage }