var express = require('express');
var models = require(__base + "Models/DiscountModel.js");
var router = express.Router();

router.get('/', function (req, res) {
    var disc = req.query;
    models.DiscountModel.GetAllDiscount(disc.Id).then(function (discs) {
        res.status(200).json(discs);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetDiscountbyBU', function (req, res) {
    var disc = req.query;
    console.log('discount cal')
    models.DiscountModel.GetDiscountbyBU(disc.BU,disc.Region).then(function (discs) {
        res.status(200).json(discs);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddDiscount', function (req, res) {
    console.log('Adding discount..');
    var disc = req.body;
    models.DiscountModel.AddDiscount(disc).then(function (discount) {
        res.status(200).json(discount);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/ModifyDiscount', function (req, res) {
    var disc = req.body;
    models.DiscountModel.ModifyDiscount(disc).then(function (discount) {
        res.status(200).json(discount);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/DeleteDiscount', function (req, res) {
    var disc = req.body;
    models.DiscountModel.DeleteDiscount(disc.Id).then(function (discount) {
        res.status(200).json(discount);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

module.exports = router;
