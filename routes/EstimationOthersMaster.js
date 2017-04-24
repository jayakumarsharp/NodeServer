var express = require('express');
var models = require(__base + "Models/EstimationOthersMasterModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');


router.get('/GetAllEstimationOthersMaster', function (req, res) {
    models.EstimationOthersMasterModel.GetAllEstimationOthersMaster().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.post('/AddEstimationOthersMaster', function (req, res) {
    var MergeOpportunityDetail = req.body;
    // console.log(req);
    models.EstimationOthersMasterModel.AddEstimationOthersMaster(MergeOpportunityDetail).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


module.exports = router;