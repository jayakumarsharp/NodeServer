var express = require('express');
var models = require(__base + "Models/LocationModel.js");
var router = express.Router();


router.get('/GetLocationList', function (req, res) {
    var location = req.query;
    models.LocationModel.GetLocationList(location.Id).then(function (list) {
        res.status(200).json(list);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddLocation', function (req, res) {
    var locationInfo = req.body;
    //console.log(req);
    models.LocationModel.AddLocation(locationInfo).then(function (locationdetail) {
        res.status(200).json(locationdetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/ModifyLocation', function (req, res) {
    var opp = req.body;
    console.log(opp);
    models.LocationModel.ModifyLocation(opp).then(function (locationdetail) {
        res.status(200).json(locationdetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/DeleteLocation', function (req, res) {
    var opp = req.body;
    console.log('test log' + opp.Id)
    models.LocationModel.DeleteLocation(opp.Id).then(function (locationdetail) {
        res.status(200).json(locationdetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});
module.exports = router;