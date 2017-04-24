var express = require('express');
var models = require(__base + "Models/EstimationApplicationModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');

router.get('/GetEstimationApplication', function (req, res) {
    var pcs = req.query;
    console.log(pcs);
    models.EstimationApplicationModel.GetEstimationApplication(pcs.oppId).then(function (pcs) {
        res.status(200).json(pcs);
    })

  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddEstimationApplication', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('Application data' + JSON.stringify(Pricemodel))
    models.EstimationApplicationModel.AddEstimationApplication(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/AddEstimationApplicationNewVersion', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('Application data' + JSON.stringify(Pricemodel))
    models.EstimationApplicationModel.AddEstimationApplicationNewVersion(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.post('/UpdateEstimationApplication', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('EstimationApplication data update' + JSON.stringify(Pricemodel))
    models.EstimationApplicationModel.UpdateEstimationApplication(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.get('/FinisdAnyVersionAvailable', function (req, res) {
    console.log('callede find')
    var pcv = req.query;
    models.EstimationApplicationModel.FinisdAnyVersionAvailable(pcv.oppId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllVersionOpportunity', function (req, res) {
    console.log('callede version')
    var pcv = req.query;
    models.EstimationApplicationModel.GetAllVersionOpportunity(pcv.oppId,pcv.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetMaximumGroupEstimationApplicationId', function (req, res) {
    models.EstimationApplicationModel.GetMaximumGroupEstimationApplicationId().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllOpportunityVersion', function (req, res) {
    models.EstimationApplicationModel.GetAllOpportunityVersion().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllEstimationApplicationbyOppGroupID', function (req, res) {
    console.log('called GetAllEstimationApplicationbyOppGroupID')
    var pcv = req.query;
    models.EstimationApplicationModel.GetAllEstimationApplicationbyOppGroupID(pcv.oppId, pcv.PriceGroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetEstimationApplicationMapbyOppGroup', function (req, res) {
    console.log('called GetEstimationApplicationMapbyOppGroup')
    var pcv = req.query;
    models.EstimationApplicationModel.GetEstimationApplicationMapbyOppGroup(pcv.oppId, pcv.PriceGroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetEstimationApplicationVersionsForOpp', function (req, res) {
    console.log('called GetEstimationApplicationVersionsForOpp')
    var pcv = req.query;
    models.EstimationApplicationModel.GetEstimationApplicationVersionsForOpp(pcv.oppId,pcv.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/LocktheSheetByGroupid', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);
  
    models.EstimationApplicationModel.LocktheSheetByGroupid(sheetdetail.OppId, sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp,  sheetdetail.IsEstimationApplicationUpdated).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/IncreaseAdditionalTimeToSheet', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);

    models.EstimationApplicationModel.IncreaseAdditionalTimeToSheet(sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })

 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/GetAllLockedEstimationApplication', function (req, res) {
    var sheetdetail = req.query;
    models.EstimationApplicationModel.GetAllLockedEstimationApplication().then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/dointernalpercentagecalculation', function (req, res) {
    var Pricemodel = req.body;
    models.EstimationApplicationModel.dointernalpercentagecalculation(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.post('/dointernalpercentagecalculationForCiscoGroup', function (req, res) {
    var Pricemodel = req.body;
    models.EstimationApplicationModel.dointernalpercentagecalculationForCiscoGroup(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/dointernalpercentagecalculationForOther', function (req, res) {
    var Pricemodel = req.body;
    models.EstimationApplicationModel.dointernalpercentagecalculationForOther(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.post('/dointernalpercentagecalculationForAdminReport', function (req, res) {
    var Pricemodel = req.body;
    models.EstimationApplicationModel.dointernalpercentagecalculationForAdminReport(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});





router.post('/dointernalpercentagecalculationForEgainGroup', function (req, res) {
    var Pricemodel = req.body;
    models.EstimationApplicationModel.dointernalpercentagecalculationForEgainGroup(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.post('/GetAllInternalCalculation', function (req, res) {
    var Pricemodel = req.body;
    models.EstimationApplicationModel.GetAllInternalCalculation(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.post('/GetAllInternalCalculationTotalMulti', function (req, res) {
    var Pricemodel = req.body;
    models.EstimationApplicationModel.GetAllInternalCalculationTotalMulti(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/GetAllInternalCalculationTotalSingle', function (req, res) {
    var Pricemodel = req.body;
    models.EstimationApplicationModel.GetAllInternalCalculationTotalSingle(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.post('/getsdlcpercentage', function (req, res) {
    var Pricemodel = req.body;
    models.EstimationApplicationModel.getsdlcpercentage(Pricemodel).then(function (model) {
        res.status(200).json(model);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/ReleaseSheetWhenExpired', function (req, res) {
    var pcs = req.query;
    console.log(pcs);
    models.EstimationApplicationModel.ReleaseSheetWhenExpired(pcs.GroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

module.exports = router;