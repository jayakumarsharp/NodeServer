var express = require('express');
var models = require(__base + "Models/BillingConfigModel.js");
var logger = require(__base + 'Models/logger');
var router = express.Router();


router.get('/GetBillingConfig', function (req, res) {
    var BillingConfig = req.query;
    models.BillingConfigModel.GetBillingConfig(BillingConfig.Year).then(function (list) {
        res.status(200).json(list);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddBillingConfig', function (req, res) {
    logger.info('Routing to AddBillingConfig..');
    var BillingConfigInfo = req.body;
    models.BillingConfigModel.AddBillingConfig(BillingConfigInfo.BillConfig).then(function (BillingConfigdetail) {
        res.status(200).json(BillingConfigdetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

module.exports = router;