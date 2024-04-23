const express = require('express');
const clusterController = require('../../controllers/Cluster.controller.js');
const clusterApi = require('../../controllers/Cluster.api.controller.js');
const multipartForm = require('../../middlewares/MultipartForm.js');
const router = express.Router();
const csrf = require('csurf');
const bodyParser = require('body-parser');
const csrfProt = csrf({
    cookie: true,
});
const urlEncodedParser = bodyParser.urlencoded({
    extended: false,
});

router.get('/clusters', csrfProt, clusterController.clusterPage);



//------------------- PRODUCT API --------------------
router.post('/clusters', csrfProt, clusterApi.doAddCluster);
router.put('/clusters/:id', multipartForm, urlEncodedParser, csrfProt, clusterApi.doEditCluster);
router.get('/api/v1/clusters', csrfProt, clusterApi.getAllCluster);
router.get('/api/v1/clusters/images/:id/cluster_id', csrfProt, clusterApi.getClusterImages);
router.delete('/api/v1/clusters/images/:id', csrfProt, clusterApi.delClusterImage);
router.get('/api/v1/clusters/access/:id/cluster_id', csrfProt, clusterApi.getClusterAccess);
router.post('/api/v1/clusters/access', csrfProt, clusterApi.addClusterAccess);
router.delete('/api/v1/clusters/access/:id', csrfProt, clusterApi.deleteClusterAccess);
router.delete('/api/v1/clusters/:id', csrfProt, clusterApi.deleteCluster);
router.get('/api/v1/clusters/access_icons', csrfProt, clusterApi.getClusterIcons);


module.exports = router;