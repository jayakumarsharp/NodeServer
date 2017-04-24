var express = require('express');
var models = require(__base + "Models/ServionLegalEntityModel.js");
var router = express.Router();


router.get('/GetAllServionLegalEntity', function (req, res) {

    models.ServionLegalEntityModel.GetAllLegalEntityModel().then(function (opps) {
        res.status(200).json(opps);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetCurrencyFromLegalEntity', function (req, res) {
    var legalentity = req.query;
    models.ServionLegalEntityModel.GetCurrencyFromLegalEntity(legalentity.Id).then(function (opps) {
        res.status(200).json(opps);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetLegalEntityFromOpp', function (req, res) {
    var opp = req.query;
    models.ServionLegalEntityModel.GetLegalEntityFromOpp(opp.Id).then(function (opps) {
        res.status(200).json(opps);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetDefaultLegalEntity', function (req, res) {
var sburegion = req.query;
    models.ServionLegalEntityModel.GetDefaultLegalEntity(sburegion.SBUId,sburegion.RegionId).then(function (opps) {
        res.status(200).json(opps);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});


router.get('/GetDefaultcurencybyLegalEntity', function (req, res) {
    var sburegion = req.query;
    models.ServionLegalEntityModel.GetDefaultcurencybyLegalEntity(sburegion.SBUId, sburegion.RegionId, sburegion.Legalentity).then(function (opps) {
        res.status(200).json(opps);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});



module.exports = router;