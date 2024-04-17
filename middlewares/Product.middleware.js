const productServ = require('../services/Product.service.js');

async function menuProduct(req, res, next) {
    try {
        const products = await productServ.getAllProducts();

        req.products = products;
        next();
    } catch (error) {
        console.error(error);
        return res.redirect("/auth")
    }
}


module.exports = menuProduct