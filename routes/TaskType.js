var express = require('express');
var models = require(__base + "Models/TaskTypeModel.js");
var router = express.Router();


router.get('/GetAllTaskType', function (req, res) {
    var task = req.query;
    models.TaskTypeModel.GetTaskTypeList(task.TaskTypeId).then(function (list) {
        res.status(200).json(list);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddTaskType', function (req, res) {
    var taskInfo = req.body;
    //console.log(req);
    models.TaskTypeModel.AddTaskType(taskInfo).then(function (taskdetail) {
        res.status(200).json(taskdetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/ModifyTaskType', function (req, res) {
    var opp = req.body;
    console.log(opp);
    models.TaskTypeModel.ModifyTaskType(opp).then(function (taskdetail) {
        res.status(200).json(taskdetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/DeleteTaskType', function (req, res) {
    var opp = req.body;
    console.log('test log' + opp.TaskTypeId)
    models.TaskTypeModel.DeleteTaskType(opp.TaskTypeId).then(function (taskdetail) {
        res.status(200).json(taskdetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});
module.exports = router;






