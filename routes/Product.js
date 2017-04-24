var express = require('express');
var models = require(__base + "Models/ProductModel.js");
var router = express.Router();

router.get('/GetAllProduct', function (req, res) {
    var vendor = req.query;
    models.ProductModel.GetProductList(vendor.Id).then(function (list) {
        res.status(200).json(list);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddProduct', function (req, res) {
    var oppInfo = req.body;
    //console.log(req);
    models.ProductModel.AddProduct(oppInfo).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/ModifyProduct', function (req, res) {
    var opp = req.body;
    console.log(opp)
    models.ProductModel.ModifyProduct(opp).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/DeleteProduct', function (req, res) {
    var opp = req.body;
    console.log('test log' + opp.Id)
    models.ProductModel.DeleteProduct(opp.Id).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});
module.exports = router;