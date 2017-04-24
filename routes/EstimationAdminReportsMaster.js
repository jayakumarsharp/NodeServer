var express = require('express');
var models = require(__base + "Models/EstimationAdminReportsMasterModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');


router.get('/GetAllEstimationAdminReportsMaster', function (req, res) {
    models.EstimationAdminReportsMasterModel.GetAllEstimationAdminReportsMaster().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.post('/AddEstimationAdminReportsMaster', function (req, res) {
    var MergeOpportunityDetail = req.body;
    // console.log(req);
    models.EstimationAdminReportsMasterModel.AddEstimationAdminReportsMaster(MergeOpportunityDetail).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


module.exports = router;