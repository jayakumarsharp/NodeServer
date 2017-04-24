var express = require('express');
var models = require(__base + "Models/EstimationCiscoMasterModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');



router.get('/GetAllEstimationCiscoMaster', function (req, res) {
    models.EstimationCiscoMasterModel.GetAllEstimationCiscoMaster().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.post('/AddEstimationCiscoMaster', function (req, res) {
    var MergeOpportunityDetail = req.body;
    // console.log(req);
    models.EstimationCiscoMasterModel.AddEstimationCiscoMaster(MergeOpportunityDetail).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


module.exports = router;