var express = require('express');
var models = require(__base + "Models/OEMModel.js");
var router = express.Router();

router.get('/', function (req, res) {
    var user = req.query;
    models.OEMModel.GetOEM().then(function (oemlist) {
        res.status(200).json(oemlist);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

module.exports = router;