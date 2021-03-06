var express = require('express');
var models = require(__base + "Models/OppModel.js");
var modelUser = require(__base + "Models/UserModel.js");
var router = express.Router();

router.get('/', function (req, res) {
  var opp = req.query;
  console.log(opp);
  /*res.status(200).json({message:'success'});*/
 // console.log(typeof  models.OppModel.GetOpportunity(opp.oppId));
 models.OppModel.GetOpportunity(opp.oppId).then(function(opps){
      res.status(200).json(opps);
  })
  .catch(function(err){
      res.status(500).json(err);
  })
});
router.get('/GetOppForMyDay', function (req, res) {
    models.OppModel.GetOppForMyDay().then(function (opps) {
        res.status(200).json(opps);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/GetAllSBU', function (req, res) {
    modelUser.UserModel.GetAllSBU().then(function (opps) {
        res.status(200).json(opps);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.post('/SBUCount', function (req, res) {
    var user = req.body;
    //console.log(req);      
    models.OppModel.GetOpportunitySBUCount(user).then(function (SBUCountData) {
      res.status(200).json(SBUCountData);
  })
 .catch(function(err){
      res.status(500).json(err);
  })  
});
router.post('/SBUOpportunity', function (req, res) {
    var user = req.body;
    //console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:'+req);
    models.OppModel.GetOpportunityBySBU(user).then(function (SBUCountData) {
        res.status(200).json(SBUCountData);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});
router.post('/opportunityForUser', function (req, res) {
    var user = req.body;
    //console.log(req);
    models.OppModel.GetOpportunityForUser(user).then(function (SBUCountData) {
        res.status(200).json(SBUCountData);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});
router.get('/GetUnassignedOpportunities', function (req, res) {
    console.log('Routing to GetUnassignedOpportunities');
    models.OppModel.GetUnassignedOpportunities().then(function (unassignedOpps) {
        res.status(200).json(unassignedOpps);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});
router.get('/GetMyAssignedOpportunities/', function (req, res) {
    console.log('Routing to GetMyAssignedOpportunities------------>');
    var query = req.query;
    models.OppModel.GetMyAssignedOpportunities(query.userId).then(function (myOpps) {
        res.status(200).json(myOpps);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});
router.get('/GetTypeID/', function (req, res) {
    var query = req.query;
    console.log('Routing to GetTypeID--------------->' + query.userId);
    models.OppModel.GetTypeID(query.userId).then(function (typeId) {
        res.status(200).json(typeId);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
module.exports = router;