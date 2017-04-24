var express = require('express');
var models = require(__base + "Models/OpportunityRate.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');

router.get('/GetAllOPPORTUNITY_RATE', function (req, res) {
    models.OPPORTUNITY_RATE_Model.GetAllOPPORTUNITY_RATE().then(function (EstSDLCDetail) {
        res.status(200).json(EstSDLCDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/AddOPPORTUNITY_RATE', function (req, res) {
    var responseData = req.body;
    // console.log(req);
    models.OPPORTUNITY_RATE_Model.AddOPPORTUNITY_RATE(responseData).then(function (EstSDLCDetail) {
        res.status(200).json(EstSDLCDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

module.exports = router;