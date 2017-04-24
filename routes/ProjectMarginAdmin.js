var express = require('express');
var models = require(__base + "Models/ProjectMarginAdminModel.js");
var router = express.Router();

router.get('/', function (req, res) {
    var disc = req.query;
    models.ProjectMarginAdminModel.GetAllProjectMarginAdmin(disc.Id).then(function (discs) {
        res.status(200).json(discs);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetProjectMarginAdminbyBU', function (req, res) {
    var disc = req.query;
    console.log('ProjectMarginAdmin cal')
    models.ProjectMarginAdminModel.GetProjectMarginAdminbyBU(disc.BU,disc.Region).then(function (discs) {
        res.status(200).json(discs);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddProjectMarginAdmin', function (req, res) {
    console.log('Adding ProjectMarginAdmin..');
    var disc = req.body;
    models.ProjectMarginAdminModel.AddProjectMarginAdmin(disc).then(function (ProjectMarginAdmin) {
        res.status(200).json(ProjectMarginAdmin);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/ModifyProjectMarginAdmin', function (req, res) {
    var disc = req.body;
    models.ProjectMarginAdminModel.ModifyProjectMarginAdmin(disc).then(function (ProjectMarginAdmin) {
        res.status(200).json(ProjectMarginAdmin);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/DeleteProjectMarginAdmin', function (req, res) {
    var disc = req.body;
    models.ProjectMarginAdminModel.DeleteProjectMarginAdmin(disc.Id).then(function (ProjectMarginAdmin) {
        res.status(200).json(ProjectMarginAdmin);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

module.exports = router;
