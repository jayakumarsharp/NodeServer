var express = require('express');
var excelbuilder = require('msexcel-builder');
var models = require(__base + "Models/DaySheetModel.js");


var router = express.Router();
var _ = require('underscore')._;
var moment = require('moment');
var logger = require(__base + 'Models/logger');

router.get('/GetDaySheetbyOppGroup', function (req, res) {
    console.log('called GetDaySheetbyOppGroup')
    var pcv = req.query;
    models.DayModel.GetDaySheetbyOppGroup(pcv.oppId, pcv.DayGroupId).then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});



router.get('/GetDaysheetPriceCostbyOppGroup', function (req, res) {
    console.log('called GetDaysheetPriceCostbyOppGroup')
    var pcv = req.query;
    models.DayModel.GetDaysheetPriceCostbyOppGroup(pcv.oppId, pcv.DayGroupId).then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});



router.get('/GetDaysheetResourceDistributionbyOppGroup', function (req, res) {
    console.log('called GetDaysheetResourceDistributionbyOppGroup')
    var pcv = req.query;
    models.DayModel.GetDaysheetResourceDistributionbyOppGroup(pcv.oppId, pcv.DayGroupId).then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});



router.get('/GetDaysheetFTEHoursbyOppGroup', function (req, res) {
    console.log('called GetDaysheetFTEHoursbyOppGroup')
    var pcv = req.query;
    models.DayModel.GetDaysheetFTEHoursbyOppGroup(pcv.oppId, pcv.DayGroupId).then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});



router.get('/GetDaysheetExtendedEffortbyOppGroup', function (req, res) {
    console.log('called GetDaysheetExtendedEffortbyOppGroup')
    var pcv = req.query;
    models.DayModel.GetDaysheetExtendedEffortbyOppGroup(pcv.oppId, pcv.DayGroupId).then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.post('/AddDaySheet', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    models.DayModel.AddDaySheet(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    }).catch(function (err) {
        res.status(500).json(err);
    })
});


router.get('/LocktheSheetByGroupid', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);

    models.DayModel.LocktheSheetByGroupid(sheetdetail.OppId, sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    }).catch(function (err) {
        res.status(500).json(err);
    })
});

module.exports = router;

