var express = require('express');
var models = require(__base + "Models/EstimationEGainMasterModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');



router.get('/GetAllEstimationEGainMaster', function (req, res) {
    models.EstimationEGainMasterModel.GetAllEstimationEGainMaster().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.post('/AddEstimationEGainMaster', function (req, res) {
    var MergeOpportunityDetail = req.body;
    // console.log(req);
    models.EstimationEGainMasterModel.AddEstimationEGainMaster(MergeOpportunityDetail).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


module.exports = router;