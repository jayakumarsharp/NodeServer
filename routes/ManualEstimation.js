var express = require('express');
var models = require(__base + "Models/ManualEstimationModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');

router.get('/GetManualEstimation', function (req, res) {
    var pcs = req.query;
    console.log(pcs);
    models.ManualEstimationModel.GetManualEstimation(pcs.oppId).then(function (pcs) {
        res.status(200).json(pcs);
    })

  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddManualEstimation', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('Application data' + JSON.stringify(Pricemodel))
    models.ManualEstimationModel.AddManualEstimation(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/AddManualEstimationNewVersion', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('Application data' + JSON.stringify(Pricemodel))
    models.ManualEstimationModel.AddManualEstimationNewVersion(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/UpdateManualEstimation', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('ManualEstimation data update' + JSON.stringify(Pricemodel))
    models.ManualEstimationModel.UpdateManualEstimation(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.get('/FinisdAnyVersionAvailable', function (req, res) {
    console.log('callede find')
    var pcv = req.query;
    models.ManualEstimationModel.FinisdAnyVersionAvailable(pcv.oppId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllVersionOpportunity', function (req, res) {
    console.log('callede version')
    var pcv = req.query;
    models.ManualEstimationModel.GetAllVersionOpportunity(pcv.oppId,pcv.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetMaximumGroupManualEstimationId', function (req, res) {
    models.ManualEstimationModel.GetMaximumGroupManualEstimationId().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllOpportunityVersion', function (req, res) {
    models.ManualEstimationModel.GetAllOpportunityVersion().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllManualEstimationbyOppGroupID', function (req, res) {
    console.log('called GetAllManualEstimationbyOppGroupID')
    var pcv = req.query;
    models.ManualEstimationModel.GetAllManualEstimationbyOppGroupID(pcv.oppId, pcv.PriceGroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetManualEstimationMapbyOppGroup', function (req, res) {
    console.log('called GetManualEstimationMapbyOppGroup')
    var pcv = req.query;
    models.ManualEstimationModel.GetManualEstimationMapbyOppGroup(pcv.oppId, pcv.PriceGroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetManualEstimationVersionsForOpp', function (req, res) {
    console.log('called GetManualEstimationVersionsForOpp')
    var pcv = req.query;
    models.ManualEstimationModel.GetManualEstimationVersionsForOpp(pcv.oppId,pcv.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/LocktheSheetByGroupid', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);
  
    models.ManualEstimationModel.LocktheSheetByGroupid(sheetdetail.OppId, sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp,  sheetdetail.IsManualEstimationUpdated).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/IncreaseAdditionalTimeToSheet', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);

    models.ManualEstimationModel.IncreaseAdditionalTimeToSheet(sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })

 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/GetAllLockedManualEstimation', function (req, res) {
    var sheetdetail = req.query;
    models.ManualEstimationModel.GetAllLockedManualEstimation().then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/ReleaseSheetWhenExpired', function (req, res) {
    var pcs = req.query;
    console.log(pcs);
    models.ManualEstimationModel.ReleaseSheetWhenExpired(pcs.GroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

module.exports = router;