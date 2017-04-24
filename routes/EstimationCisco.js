var express = require('express');
var models = require(__base + "Models/EstimationCiscoModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');

router.get('/GetEstimationCisco', function (req, res) {
    var pcs = req.query;
    console.log(pcs);
    models.EstimationCiscoModel.GetEstimationCisco(pcs.oppId).then(function (pcs) {
        res.status(200).json(pcs);
    })

  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddEstimationCisco', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('Application data' + JSON.stringify(Pricemodel))
    models.EstimationCiscoModel.AddEstimationCisco(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/AddEstimationCiscoNewVersion', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('Application data' + JSON.stringify(Pricemodel))
    models.EstimationCiscoModel.AddEstimationCiscoNewVersion(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.post('/UpdateEstimationCisco', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('EstimationCisco data update' + JSON.stringify(Pricemodel))
    models.EstimationCiscoModel.UpdateEstimationCisco(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.get('/FinisdAnyVersionAvailable', function (req, res) {
    console.log('callede find')
    var pcv = req.query;
    models.EstimationCiscoModel.FinisdAnyVersionAvailable(pcv.oppId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllVersionOpportunity', function (req, res) {
    console.log('callede version')
    var pcv = req.query;
    models.EstimationCiscoModel.GetAllVersionOpportunity(pcv.oppId,pcv.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetMaximumGroupEstimationCiscoId', function (req, res) {
    models.EstimationCiscoModel.GetMaximumGroupEstimationCiscoId().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllOpportunityVersion', function (req, res) {
    models.EstimationCiscoModel.GetAllOpportunityVersion().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllEstimationCiscobyOppGroupID', function (req, res) {
    console.log('called GetAllEstimationCiscobyOppGroupID')
    var pcv = req.query;
    models.EstimationCiscoModel.GetAllEstimationCiscobyOppGroupID(pcv.oppId, pcv.PriceGroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetEstimationCiscoMapbyOppGroup', function (req, res) {
    console.log('called GetEstimationCiscoMapbyOppGroup')
    var pcv = req.query;
    models.EstimationCiscoModel.GetEstimationCiscoMapbyOppGroup(pcv.oppId, pcv.PriceGroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetEstimationCiscoVersionsForOpp', function (req, res) {
    console.log('called GetEstimationCiscoVersionsForOpp')
    var pcv = req.query;
    models.EstimationCiscoModel.GetEstimationCiscoVersionsForOpp(pcv.oppId,pcv.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/LocktheSheetByGroupid', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);
  
    models.EstimationCiscoModel.LocktheSheetByGroupid(sheetdetail.OppId, sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp,  sheetdetail.IsEstimationCiscoUpdated).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/IncreaseAdditionalTimeToSheet', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);

    models.EstimationCiscoModel.IncreaseAdditionalTimeToSheet(sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })

 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/GetAllLockedEstimationCisco', function (req, res) {
    var sheetdetail = req.query;
    models.EstimationCiscoModel.GetAllLockedEstimationCisco().then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/ReleaseSheetWhenExpired', function (req, res) {
    var pcs = req.query;
    console.log(pcs);
    models.EstimationCiscoModel.ReleaseSheetWhenExpired(pcs.GroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

module.exports = router;