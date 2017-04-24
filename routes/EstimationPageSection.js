var express = require('express');
var models = require(__base + "Models/EstimationPageSectionModel.js");
var router = express.Router();


router.get('/GetPageList', function (req, res) {
    var location = req.query;
    models.PageSectionModel.GetPageList(location.Id).then(function (list) {
        res.status(200).json(list);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddPageSection', function (req, res) {
    var locationInfo = req.body;
    //console.log(req);
    models.PageSectionModel.AddPageSection(locationInfo).then(function (locationdetail) {
        res.status(200).json(locationdetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/UpdatePageSection', function (req, res) {
    var locationInfo = req.body;
    //console.log(req);
    models.PageSectionModel.UpdatePageSection(locationInfo).then(function (locationdetail) {
        res.status(200).json(locationdetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.get('/GetAllPageSections', function (req, res) {
    models.PageSectionModel.GetAllPageSections().then(function (list) {
        res.status(200).json(list);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

module.exports = router;