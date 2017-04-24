var express = require('express');
var models = require(__base + "Models/EstimationOthersModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');

router.get('/GetEstimationOthers', function (req, res) {
    var pcs = req.query;
    console.log(pcs);
    models.EstimationOthersModel.GetEstimationOthers(pcs.oppId).then(function (pcs) {
        res.status(200).json(pcs);
    })

  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddEstimationOthers', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('Application data' + JSON.stringify(Pricemodel))
    models.EstimationOthersModel.AddEstimationOthers(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/AddEstimationOthersNewVersion', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('Application data' + JSON.stringify(Pricemodel))
    models.EstimationOthersModel.AddEstimationOthersNewVersion(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.post('/UpdateEstimationOthers', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('EstimationOthers data update' + JSON.stringify(Pricemodel))
    models.EstimationOthersModel.UpdateEstimationOthers(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.get('/FinisdAnyVersionAvailable', function (req, res) {
    console.log('callede find')
    var pcv = req.query;
    models.EstimationOthersModel.FinisdAnyVersionAvailable(pcv.oppId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllVersionOpportunity', function (req, res) {
    console.log('callede version')
    var pcv = req.query;
    models.EstimationOthersModel.GetAllVersionOpportunity(pcv.oppId,pcv.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetMaximumGroupEstimationOthersId', function (req, res) {
    models.EstimationOthersModel.GetMaximumGroupEstimationOthersId().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllOpportunityVersion', function (req, res) {
    models.EstimationOthersModel.GetAllOpportunityVersion().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllEstimationOthersbyOppGroupID', function (req, res) {
    console.log('called GetAllEstimationOthersbyOppGroupID')
    var pcv = req.query;
    models.EstimationOthersModel.GetAllEstimationOthersbyOppGroupID(pcv.oppId, pcv.PriceGroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetEstimationOthersMapbyOppGroup', function (req, res) {
    console.log('called GetEstimationOthersMapbyOppGroup')
    var pcv = req.query;
    models.EstimationOthersModel.GetEstimationOthersMapbyOppGroup(pcv.oppId, pcv.PriceGroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetEstimationOthersVersionsForOpp', function (req, res) {
    console.log('called GetEstimationOthersVersionsForOpp')
    var pcv = req.query;
    models.EstimationOthersModel.GetEstimationOthersVersionsForOpp(pcv.oppId,pcv.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/LocktheSheetByGroupid', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);
  
    models.EstimationOthersModel.LocktheSheetByGroupid(sheetdetail.OppId, sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp,  sheetdetail.IsEstimationOthersUpdated).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/IncreaseAdditionalTimeToSheet', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);

    models.EstimationOthersModel.IncreaseAdditionalTimeToSheet(sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })

 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/GetAllLockedEstimationOthers', function (req, res) {
    var sheetdetail = req.query;
    models.EstimationOthersModel.GetAllLockedEstimationOthers().then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/ReleaseSheetWhenExpired', function (req, res) {
    var pcs = req.query;
    console.log(pcs);
    models.EstimationOthersModel.ReleaseSheetWhenExpired(pcs.GroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

module.exports = router;