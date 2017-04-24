var express = require('express');
var models = require(__base + "Models/CurrencyModel.js");
var router = express.Router();


router.get('/GetAllCurrencyConversion', function (req, res) {
    var opp = req.query;
    models.CurrencyModel.GetAllCurrencyConversion(opp.Id).then(function (opps) {
        res.status(200).json(opps);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddCurrencyConversion', function (req, res) {
    var oppInfo = req.body;
    //console.log(req);
    models.CurrencyModel.AddCurrencyConversion(oppInfo).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/ModifyCurrencyConversion', function (req, res) {
    var opp = req.body;
    models.CurrencyModel.ModifyCurrencyConversion(opp).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/DeleteCurrencyConversion', function (req, res) {
    var opp = req.body;
    console.log('test log'+opp.Id)

    models.CurrencyModel.DeleteCurrencyConversion(opp.Id).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.get('/GetAllCurrency', function (req, res) {
    var opp = req.query;
    models.CurrencyModel.GetAllCurrency().then(function (opps) {
        res.status(200).json(opps);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetCountrybySBU', function (req, res) {
    var opp = req.query;
    models.CurrencyModel.GetCountrybySBU(opp.Id).then(function (opps) {
        res.status(200).json(opps);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});


router.get('/GetCurrencyConversionForPricing', function (req, res) {
    var opp = req.query;
    models.CurrencyModel.GetCurrencyConversionForPricing(opp.ServionLegalEntityId, opp.SBUId,opp.CountryId,opp.CurrencyId).then(function (opps) {
        res.status(200).json(opps);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

//router.get('/GetRegionbyCountry', function (req, res) { NOT REQUIRED
//    var opp = req.query;
//    models.CurrencyModel.GetRegionbyCountry(opp.Id).then(function (opps) {
//        res.status(200).json(opps);
//    })
//  .catch(function (err) {
//      res.status(500).json(err);
//  })
//});



module.exports = router;
