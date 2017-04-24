var express = require('express');
var models = require(__base + "Models/EstimationSDLCModel.js");
var modelsResource = require(__base + "Models/EstimationSDLCResourceModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');



router.get('/GetAllEstimationSDLC', function (req, res) {
    models.EstimationSDLCPercentageModel.GetAllEstimationSDLCPercentage().then(function (EstSDLCDetail) {
        res.status(200).json(EstSDLCDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetAllEstimationSDLCPercentageBytype', function (req, res) {
    
    models.EstimationSDLCPercentageModel.GetAllEstimationSDLCPercentageBytype(type).then(function (EstSDLCDetail) {
        res.status(200).json(EstSDLCDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});
router.post('/AddEstimationSDLC', function (req, res) {
    var responseData = req.body;
    // console.log(req);
    models.EstimationSDLCPercentageModel.AddEstimationSDLCPercentage(responseData).then(function (EstSDLCDetail) {
        res.status(200).json(EstSDLCDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetAllOpportunityEstimationSDLCPercentage', function (req, res) {
    var reqItem = req.query;
    models.EstimationSDLCPercentageModel.GetAllOpportunityEstimationSDLCPercentage(reqItem.OppID).then(function (EstSDLCDetail) {
        res.status(200).json(EstSDLCDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/AddEstimationSDLCResource', function (req, res) {
    var responseData = req.body;
    // console.log(req);
    modelsResource.EstimationSDLCResourceModel.AddEstimationSDLCResource(responseData).then(function (EstSDLCDetail) {
        res.status(200).json(EstSDLCDetail);
    })
    .catch(function (err) {
        res.status(500).json(err);
    })    
});

router.get('/GetAllEstimationSDLCResource', function (req, res) {
    modelsResource.EstimationSDLCResourceModel.GetAllEstimationSDLCResource().then(function (EstSDLCDetail) {
        res.status(200).json(EstSDLCDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});



module.exports = router;