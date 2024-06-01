const productService = require('../services/Product.service.js');
const moment = require('moment');
const jsdom = require('jsdom');
const { NOT_FOUND } = require('../helpers/ErrorCodes.js');
const AppError = require('../helpers/AppError.js');
const fs =require('fs');

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

async function productV2Page(req, res) {

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
    res.render("f_product/index_v2", { products, data, moment, JSDOM,videoProduct });

}

async function getStreamVideo(req,res){

    const videoName = req.params.video;
    console.log("videoName : ",videoName)

    const filePath = "public/metroland/assets/video/"+videoName;

    const options = {};

    let start;
    let end;

    const range = req.headers.range;
    if (range) {
        const bytesPrefix = "bytes=";
        if (range.startsWith(bytesPrefix)) {
            const bytesRange = range.substring(bytesPrefix.length);
            const parts = bytesRange.split("-");
            if (parts.length === 2) {
                const rangeStart = parts[0] && parts[0].trim();
                if (rangeStart && rangeStart.length > 0) {
                    options.start = start = parseInt(rangeStart);
                }
                const rangeEnd = parts[1] && parts[1].trim();
                if (rangeEnd && rangeEnd.length > 0) {
                    options.end = end = parseInt(rangeEnd);
                }
            }
        }
    }

    res.setHeader("content-type", "video/mp4");

    fs.stat(filePath, (err, stat) => {
        if (err) {
            console.error(`File stat error for ${filePath}.`);
            console.error(err);
            res.sendStatus(500);
            return;
        }

        let contentLength = stat.size;

        if (req.method === "HEAD") {
            res.statusCode = 200;
            res.setHeader("accept-ranges", "bytes");
            res.setHeader("content-length", contentLength);
            res.end();
        }
        else {        
            let retrievedLength;
            if (start !== undefined && end !== undefined) {
                retrievedLength = (end+1) - start;
            }
            else if (start !== undefined) {
                retrievedLength = contentLength - start;
            }
            else if (end !== undefined) {
                retrievedLength = (end+1);
            }
            else {
                retrievedLength = contentLength;
            }

            res.statusCode = start !== undefined || end !== undefined ? 206 : 200;

            res.setHeader("content-length", retrievedLength);

            if (range !== undefined) {  
                res.setHeader("content-range", `bytes ${start || 0}-${end || (contentLength-1)}/${contentLength}`);
                res.setHeader("accept-ranges", "bytes");
            }

            const fileStream = fs.createReadStream(filePath, options);
            fileStream.on("error", error => {
                console.log(`Error reading file ${filePath}.`);
                console.log(error);
                res.sendStatus(500);
            });
            
            fileStream.pipe(res);
        }
    });
}



module.exports = { allProductPage, productPage,productV2Page,getStreamVideo }