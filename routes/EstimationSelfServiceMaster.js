var express = require('express');
var models = require(__base + "Models/EstimationSelfServiceMasterModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');



router.get('/GetAllEstimationSelfServiceMaster', function (req, res) {
    models.EstimationSelfServiceMasterModel.GetAllEstimationSelfServiceMaster().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.post('/AddEstimationSelfServiceMaster', function (req, res) {
    var MergeOpportunityDetail = req.body;
    // console.log(req);
    models.EstimationSelfServiceMasterModel.AddEstimationSelfServiceMaster(MergeOpportunityDetail).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


module.exports = router;