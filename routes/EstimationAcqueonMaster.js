var express = require('express');
var models = require(__base + "Models/EstimationAcqueonMasterModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');



router.get('/GetAllEstimationAcqueonMaster', function (req, res) {
    models.EstimationAcqueonMasterModel.GetAllEstimationAcqueonMaster().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.post('/AddEstimationAcqueonMaster', function (req, res) {
    var MergeOpportunityDetail = req.body;
    // console.log(req);
    models.EstimationAcqueonMasterModel.AddEstimationAcqueonMaster(MergeOpportunityDetail).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


module.exports = router;