var express = require('express');
var models = require(__base + "Models/EstimationSDLCResourceModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');



router.post('/AddEstimationSDLCResource', function (req, res) {
    var responseData = req.body;
    // console.log(req);
    models.EstimationSDLCResourceModel.AddEstimationSDLCResource(responseData).then(function (EstSDLCDetail) {
        res.status(200).json(EstSDLCDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetAllEstimationSDLCResource', function (req, res) {
    models.EstimationSDLCResourceModel.GetAllEstimationSDLCResource().then(function (EstSDLCDetail) {
        res.status(200).json(EstSDLCDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});



router.get('/GetAllEstimationSDLCResourcebyFilter', function (req, res) {
    var reqItem = req.query;
    models.EstimationSDLCResourceModel.GetAllEstimationSDLCResourcebyFilter(reqItem.sbu, reqItem.region, reqItem.oem, reqItem.infra, reqItem.upgrade, reqItem.app, reqItem.complexity).then(function (EstSDLCDetail) {
        res.status(200).json(EstSDLCDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});




module.exports = router;