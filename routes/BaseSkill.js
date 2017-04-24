var express = require('express');
var models = require(__base + "Models/BaseSkillModel.js");
var router = express.Router();


router.get('/GetAllBaseSkill', function (req, res) {
    var baseskill = req.query;
    models.BaseSkillModel.GetBaseSkillList(baseskill.Id).then(function (list) {
        res.status(200).json(list);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddBaseSkill', function (req, res) {
    var baseskillInfo = req.body;
    //console.log(req);
    models.BaseSkillModel.AddBaseSkill(baseskillInfo).then(function (baseskilldetail) {
        res.status(200).json(baseskilldetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/ModifyBaseSkill', function (req, res) {
    var opp = req.body;
    console.log(opp);
    models.BaseSkillModel.ModifyBaseSkill(opp).then(function (baseskilldetail) {
        res.status(200).json(baseskilldetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/DeleteBaseSkill', function (req, res) {
    var opp = req.body;
    console.log('test log' + opp.Id)
    models.BaseSkillModel.DeleteBaseSkill(opp.Id).then(function (baseskilldetail) {
        res.status(200).json(baseskilldetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});
module.exports = router;