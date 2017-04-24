var express = require('express');
var models = require(__base + "Models/OpportunityConfigurationPriceVersionModel.js");
var router = express.Router();


router.get('/GetOppConfigtbyOppGroup', function (req, res) {
    console.log('called GetOppConfigbyOppGroup')
    var pcv = req.query;
    models.OppConfigModel.GetOppConfigtbyOppGroup(pcv.oppId, pcv.PaymentGroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});


router.post('/AddOppConfig', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    console.log(JSON.stringify(Pricemodel));
    models.OppConfigModel.AddOppConfig(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


module.exports = router;


