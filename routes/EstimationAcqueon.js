var express = require('express');
var models = require(__base + "Models/EstimationAcqueonModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');

router.get('/GetEstimationAcqueon', function (req, res) {
    var pcs = req.query;
    console.log(pcs);
    models.EstimationAcqueonModel.GetEstimationAcqueon(pcs.oppId).then(function (pcs) {
        res.status(200).json(pcs);
    })

  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddEstimationAcqueon', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('Application data' + JSON.stringify(Pricemodel))
    models.EstimationAcqueonModel.AddEstimationAcqueon(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/AddEstimationAcqueonNewVersion', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('Application data' + JSON.stringify(Pricemodel))
    models.EstimationAcqueonModel.AddEstimationAcqueonNewVersion(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.post('/UpdateEstimationAcqueon', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('EstimationAcqueon data update' + JSON.stringify(Pricemodel))
    models.EstimationAcqueonModel.UpdateEstimationAcqueon(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.get('/FinisdAnyVersionAvailable', function (req, res) {
    console.log('callede find')
    var pcv = req.query;
    models.EstimationAcqueonModel.FinisdAnyVersionAvailable(pcv.oppId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllVersionOpportunity', function (req, res) {
    console.log('callede version')
    var pcv = req.query;
    models.EstimationAcqueonModel.GetAllVersionOpportunity(pcv.oppId,pcv.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetMaximumGroupEstimationAcqueonId', function (req, res) {
    models.EstimationAcqueonModel.GetMaximumGroupEstimationAcqueonId().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllOpportunityVersion', function (req, res) {
    models.EstimationAcqueonModel.GetAllOpportunityVersion().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllEstimationAcqueonbyOppGroupID', function (req, res) {
    console.log('called GetAllEstimationAcqueonbyOppGroupID')
    var pcv = req.query;
    models.EstimationAcqueonModel.GetAllEstimationAcqueonbyOppGroupID(pcv.oppId, pcv.PriceGroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetEstimationAcqueonMapbyOppGroup', function (req, res) {
    console.log('called GetEstimationAcqueonMapbyOppGroup')
    var pcv = req.query;
    models.EstimationAcqueonModel.GetEstimationAcqueonMapbyOppGroup(pcv.oppId, pcv.PriceGroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetEstimationAcqueonVersionsForOpp', function (req, res) {
    console.log('called GetEstimationAcqueonVersionsForOpp')
    var pcv = req.query;
    models.EstimationAcqueonModel.GetEstimationAcqueonVersionsForOpp(pcv.oppId,pcv.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/LocktheSheetByGroupid', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);
  
    models.EstimationAcqueonModel.LocktheSheetByGroupid(sheetdetail.OppId, sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp,  sheetdetail.IsEstimationAcqueonUpdated).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/IncreaseAdditionalTimeToSheet', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);

    models.EstimationAcqueonModel.IncreaseAdditionalTimeToSheet(sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })

 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/GetAllLockedEstimationAcqueon', function (req, res) {
    var sheetdetail = req.query;
    models.EstimationAcqueonModel.GetAllLockedEstimationAcqueon().then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/ReleaseSheetWhenExpired', function (req, res) {
    var pcs = req.query;
    console.log(pcs);
    models.EstimationAcqueonModel.ReleaseSheetWhenExpired(pcs.GroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

module.exports = router;