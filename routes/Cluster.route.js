const express = require('express');
const clusterController = require('../controllers/Cluster.api.controller.js');

const router = express.Router();

router.get('/api/v1/clusters/:id/facility', clusterController.getClusterFacilities);

module.exports = router;