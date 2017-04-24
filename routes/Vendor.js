var express = require('express');
var models = require(__base + "Models/VendorModel.js");
var router = express.Router();

router.get('/GetAllVendor', function (req, res) {
    var vendor = req.query;
    models.VendorModel.GetVendorList(vendor.Id).then(function (list) {
        res.status(200).json(list);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddVendor', function (req, res) {
    var oppInfo = req.body;
    //console.log(req);
    models.VendorModel.AddVendor(oppInfo).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/ModifyVendor', function (req, res) {
    var opp = req.body;
    console.log(opp)
    models.VendorModel.ModifyVendor(opp).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/DeleteVendor', function (req, res) {
    var opp = req.body;
    console.log('test log' + opp.Id)
    models.VendorModel.DeleteVendor(opp.Id).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

module.exports = router;

