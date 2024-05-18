const { db } = require('../configs/Database.js');

async function setHeaderImage(req, res, next){
    console.info(`inside setHeaderImage`);

    try {
        const urlPath = req.path == '/' ? '/beranda' : req.path;
        const basepath = urlPath.split("/");
        const basePath_ = `/${basepath[1]}`;
        console.log("basePath_",basePath_)
        const headerImages = await db.Headerpage.findAll({attributes:['id','url','image','productId'],where:{url:basePath_}})
        console.log("headerImages",JSON.stringify(headerImages))
        
        req.header_image = headerImages;
        
    } catch (error) {
        console.log(error);
        req.token = null;
    } finally {
        next();
    }
}

module.exports = setHeaderImage;