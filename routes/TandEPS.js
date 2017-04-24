var express = require('express');
var models = require(__base + "Models/TandEPSModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');

router.get('/GetTandEPS', function (req, res) {
    var pcs = req.query;
    models.TandEPSModel.GetTandEPS(pcs.oppId).then(function (pcs) {
        res.status(200).json(pcs);
    })

  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddTandEPS', function (req, res) {
    var resModel = req.body;
    logger.info('Routing to AddTandEPS..');
    models.TandEPSModel.AddTandEPS(resModel).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/AddTandEPSNewVersion', function (req, res) {
    var resModel = req.body;
    models.TandEPSModel.AddTandEPSNewVersion(resModel).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/UpdateTandEPS', function (req, res) {
    var resModel = req.body;
    models.TandEPSModel.UpdateTandEPS(resModel).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.get('/FinisdAnyVersionAvailable', function (req, res) {
    var res = req.query;
    models.TandEPSModel.FinisdAnyVersionAvailable(res.oppId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllVersionOpportunity', function (req, res) {
    var res = req.query;
    models.TandEPSModel.GetAllVersionOpportunity(res.oppId,res.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetMaximumGroupTandEPSId', function (req, res) {
    models.TandEPSModel.GetMaximumGroupTandEPSId().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllOpportunityVersion', function (req, res) {
    models.TandEPSModel.GetAllOpportunityVersion().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllTandEPSbyOppGroupID', function (req, res) {
    console.log('called GetAllTandEPSbyOppGroupID')
    var pcv = req.query;
    models.TandEPSModel.GetAllTandEPSbyOppGroupID(pcv.oppId, pcv.groupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetTandEPSVersionsForOpp', function (req, res) {
    var res = req.query;
    models.TandEPSModel.GetTandEPSVersionsForOpp(res.oppId,res.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/LocktheSheetByGroupid', function (req, res) {
    var sheetdetail = req.query;
    logger.info('Routing to LocktheSheetByGroupid..')
    models.TandEPSModel.LocktheSheetByGroupid(sheetdetail.OppId, sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp,  sheetdetail.IsTandEPSUpdated).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/IncreaseAdditionalTimeToSheet', function (req, res) {
    var sheetdetail = req.query;
    models.TandEPSModel.IncreaseAdditionalTimeToSheet(sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/GetAllLockedTandEPS', function (req, res) {
    var sheetdetail = req.query;
    models.TandEPSModel.GetAllLockedTandEPS().then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/ReleaseSheetWhenExpired', function (req, res) {
    var pcs = req.query;
    models.TandEPSModel.ReleaseSheetWhenExpired(pcs.GroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

module.exports = router;