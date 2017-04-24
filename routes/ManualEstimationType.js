var express = require('express');
var models = require(__base + "Models/ManualEstimationTypeModel.js");
var router = express.Router();


router.get('/GetAllManualEstimationType', function (req, res) {
    var task = req.query;
    models.ManualEstimationTypeModel.GetManualEstimationTypeList(task.ManualEstimationTypeId).then(function (list) {
        res.status(200).json(list);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddManualEstimationType', function (req, res) {
    var taskInfo = req.body;
    //console.log(req);
    models.ManualEstimationTypeModel.AddManualEstimationType(taskInfo).then(function (taskdetail) {
        res.status(200).json(taskdetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/ModifyManualEstimationType', function (req, res) {
    var opp = req.body;
    console.log(opp);
    models.ManualEstimationTypeModel.ModifyManualEstimationType(opp).then(function (taskdetail) {
        res.status(200).json(taskdetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/DeleteManualEstimationType', function (req, res) {
    var opp = req.body;
    console.log('test log' + opp.ManualEstimationTypeId)
    models.ManualEstimationTypeModel.DeleteManualEstimationType(opp.ManualEstimationTypeId).then(function (taskdetail) {
        res.status(200).json(taskdetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});
module.exports = router;






