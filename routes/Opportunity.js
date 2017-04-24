var express = require('express');
var models = require(__base + "Models/OpportunityModel.js");
var router = express.Router();

router.get('/', function (req, res) {
  var opp = req.query;
  console.log(opp);
  /*res.status(200).json({message:'success'});*/
  console.log(typeof models.OpportunityModel.GetOpportunity(opp.oppId));
    models.OpportunityModel.GetOpportunity(opp.oppId).then(function (opps) {
      res.status(200).json(opps);
  })
  .catch(function(err){
      res.status(500).json(err);
  })
});
router.post('/SBUCount', function (req, res) {
    console.log('9999999999999999999999999999999999999999999999999999999');
    var user = req.body;
    //console.log(req);      
    models.OpportunityModel.GetOpportunitySBUCount().then(function (SBUCountData) {
      res.status(200).json(SBUCountData);
  })
 .catch(function(err){
      res.status(500).json(err);
  })  
});
router.post('/SBUOpportunity', function (req, res) {
    console.log('88888888888888888888888888888888888888888888888888888888888');
    var user = req.body;
    //console.log(req);
    models.OpportunityModel.GetOpportunityBySBU(user.SBU).then(function (SBUCountData) {
        res.status(200).json(SBUCountData);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

module.exports = router;