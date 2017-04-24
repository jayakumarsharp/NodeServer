var express = require('express');
var models = require(__base + "Models/EstimationAdminReportsModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');

router.get('/GetEstimationAdminReports', function (req, res) {
    var pcs = req.query;
    console.log(pcs);
    models.EstimationAdminReportsModel.GetEstimationAdminReports(pcs.oppId).then(function (pcs) {
        res.status(200).json(pcs);
    })

  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddEstimationAdminReports', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('Application data' + JSON.stringify(Pricemodel))
    models.EstimationAdminReportsModel.AddEstimationAdminReports(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/AddEstimationAdminReportsNewVersion', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('Application data' + JSON.stringify(Pricemodel))
    models.EstimationAdminReportsModel.AddEstimationAdminReportsNewVersion(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.post('/UpdateEstimationAdminReports', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('EstimationAdminReports data update' + JSON.stringify(Pricemodel))
    models.EstimationAdminReportsModel.UpdateEstimationAdminReports(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.get('/FinisdAnyVersionAvailable', function (req, res) {
    console.log('callede find')
    var pcv = req.query;
    models.EstimationAdminReportsModel.FinisdAnyVersionAvailable(pcv.oppId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});



router.get('/GetMaximumGroupEstimationAdminReportsId', function (req, res) {
    models.EstimationAdminReportsModel.GetMaximumGroupEstimationAdminReportsId().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllOpportunityVersion', function (req, res) {
    models.EstimationAdminReportsModel.GetAllOpportunityVersion().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllEstimationAdminReportsbyOppGroupID', function (req, res) {
    console.log('called GetAllEstimationAdminReportsbyOppGroupID')
    var pcv = req.query;
    models.EstimationAdminReportsModel.GetAllEstimationAdminReportsbyOppGroupID(pcv.oppId, pcv.PriceGroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetEstimationAdminReportsMapbyOppGroup', function (req, res) {
    console.log('called GetEstimationAdminReportsMapbyOppGroup')
    var pcv = req.query;
    models.EstimationAdminReportsModel.GetEstimationAdminReportsMapbyOppGroup(pcv.oppId, pcv.PriceGroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetEstimationAdminReportsVersionsForOpp', function (req, res) {
    console.log('called GetEstimationAdminReportsVersionsForOpp')
    var pcv = req.query;
    models.EstimationAdminReportsModel.GetEstimationAdminReportsVersionsForOpp(pcv.oppId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/LocktheSheetByGroupid', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);
  
    models.EstimationAdminReportsModel.LocktheSheetByGroupid(sheetdetail.OppId, sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp,  sheetdetail.IsEstimationAdminReportsUpdated).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/IncreaseAdditionalTimeToSheet', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);

    models.EstimationAdminReportsModel.IncreaseAdditionalTimeToSheet(sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })

 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/GetAllLockedEstimationAdminReports', function (req, res) {
    var sheetdetail = req.query;
    models.EstimationAdminReportsModel.GetAllLockedEstimationAdminReports().then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/ReleaseSheetWhenExpired', function (req, res) {
    var pcs = req.query;
    console.log(pcs);
    models.EstimationAdminReportsModel.ReleaseSheetWhenExpired(pcs.GroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

module.exports = router;