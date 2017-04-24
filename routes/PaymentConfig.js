var express = require('express');
var models = require(__base + "Models/PaymentConfigModel.js");
var router = express.Router();

router.get('/GetAllPaymentCode', function (req, res) {
    var pcs = req.query;
    models.PaymentConfigModel.GetAllPaymentCode().then(function (codes) {
        res.status(200).json(codes);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetPaymentConfig', function (req, res) {
    var pms = req.query;
    models.PaymentConfigModel.GetPaymentConfig(pms.BU,pms.Region).then(function (config) {
        res.status(200).json(config);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddPaymentConfig', function (req, res) {
    var pms = req.body;
    models.PaymentConfigModel.AddPaymentConfig(pms).then(function (config) {
        res.status(200).json(config);
    })
  .catch(function (err) {
      res.status(500).json(err);
  }); 
});

 router.get('/GetPaymentPeriod', function (req, res) {
    var pms = req.query;
    console.log('PaymentConfig..');
    models.PaymentConfigModel.GetPaymentPeriod().then(function (period) {
        res.status(200).json(period);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});
module.exports = router;


