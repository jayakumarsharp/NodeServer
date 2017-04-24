var express = require('express');
var models = require(__base + "Models/SelectionModel.js");
var router = express.Router();


router.get('/GetAllSelection', function (req, res) {
    var Selection = req.query;
    models.SelectionModel.GetSelectionList(Selection.Id).then(function (list) {
        res.status(200).json(list);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddSelection', function (req, res) {
    var SelectionInfo = req.body;
    //console.log(req);
    models.SelectionModel.AddSelection(SelectionInfo).then(function (Selectiondetail) {
        res.status(200).json(Selectiondetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/ModifySelection', function (req, res) {
    var opp = req.body;
    console.log(opp);
    models.SelectionModel.ModifySelection(opp).then(function (Selectiondetail) {
        res.status(200).json(Selectiondetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/DeleteSelection', function (req, res) {
    var opp = req.body;
    console.log('test log' + opp.Id)
    models.SelectionModel.DeleteSelection(opp.Id).then(function (Selectiondetail) {
        res.status(200).json(Selectiondetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});
module.exports = router;