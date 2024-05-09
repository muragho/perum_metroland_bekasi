const response = require('../helpers/Response.js');
const accessService = require('../services/Access.service.js');

async function getAccessByProduct(req, res) {
    const productId = req.params.id;
    try {
        console.log("product id : ",productId)
        const access = await accessService.getAccessByProduct(productId);
        const accessIcons = await accessService.getAccessIcons();

        const data = { access, accessIcons }

        await response(res, 200, 200, 'success', data);
    } catch (error) {
        console.error(error)
        await response(res, 200, 400, error.message || 'cannot geting access')
    }
}

module.exports = { getAccessByProduct }