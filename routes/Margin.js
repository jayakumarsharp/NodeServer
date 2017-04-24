var express = require('express');
var models = require(__base + "Models/MarginModel.js");
var router = express.Router();

router.get('/', function (req, res) {
    var disc = req.query;
    models.MarginModel.GetAllMargin(disc.Id).then(function (discs) {
        res.status(200).json(discs);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetMarginbyBU', function (req, res) {
    var disc = req.query;
    models.MarginModel.GetMarginbyBU(disc.BU,disc.Region).then(function (discs) {
        res.status(200).json(discs);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddMargin', function (req, res) {
    console.log('Adding Margin..');
    var disc = req.body;
    models.MarginModel.AddMargin(disc).then(function (Margin) {
        res.status(200).json(Margin);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/ModifyMargin', function (req, res) {
    var disc = req.body;
    models.MarginModel.ModifyMargin(disc).then(function (Margin) {
        res.status(200).json(Margin);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/DeleteMargin', function (req, res) {
    var disc = req.body;
    models.MarginModel.DeleteMargin(disc.Id).then(function (Margin) {
        res.status(200).json(Margin);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

module.exports = router;
