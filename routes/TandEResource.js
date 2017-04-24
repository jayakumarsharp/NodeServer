var express = require('express');
var models = require(__base + "Models/TandEResourceModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');

router.get('/GetTandEResource', function (req, res) {
    var pcs = req.query;
    models.TandEResourceModel.GetTandEResource(pcs.oppId).then(function (pcs) {
        res.status(200).json(pcs);
    })

  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddTandEResource', function (req, res) {
    var resModel = req.body;
    logger.info('Routing to AddTandEResource..');
    models.TandEResourceModel.AddTandEResource(resModel).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/AddTandEResourceNewVersion', function (req, res) {
    var resModel = req.body;
    models.TandEResourceModel.AddTandEResourceNewVersion(resModel).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/UpdateTandEResource', function (req, res) {
    var resModel = req.body;
    models.TandEResourceModel.UpdateTandEResource(resModel).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.get('/FinisdAnyVersionAvailable', function (req, res) {
    var res = req.query;
    models.TandEResourceModel.FinisdAnyVersionAvailable(res.oppId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllVersionOpportunity', function (req, res) {
    var res = req.query;
    models.TandEResourceModel.GetAllVersionOpportunity(res.oppId,res.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetMaximumGroupTandEResourceId', function (req, res) {
    models.TandEResourceModel.GetMaximumGroupTandEResourceId().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllOpportunityVersion', function (req, res) {
    models.TandEResourceModel.GetAllOpportunityVersion().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllTandEResourcebyOppGroupID', function (req, res) {
    console.log('called GetAllTandEResourcebyOppGroupID')
    var pcv = req.query;
    models.TandEResourceModel.GetAllTandEResourcebyOppGroupID(pcv.oppId, pcv.groupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetTandEResourceVersionsForOpp', function (req, res) {
    var res = req.query;
    models.TandEResourceModel.GetTandEResourceVersionsForOpp(res.oppId,res.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/LocktheSheetByGroupid', function (req, res) {
    var sheetdetail = req.query;
    logger.info('Routing to LocktheSheetByGroupid..')
    models.TandEResourceModel.LocktheSheetByGroupid(sheetdetail.OppId, sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp,  sheetdetail.IsTandEResourceUpdated).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/IncreaseAdditionalTimeToSheet', function (req, res) {
    var sheetdetail = req.query;
    models.TandEResourceModel.IncreaseAdditionalTimeToSheet(sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/GetAllLockedTandEResource', function (req, res) {
    var sheetdetail = req.query;
    models.TandEResourceModel.GetAllLockedTandEResource().then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/ReleaseSheetWhenExpired', function (req, res) {
    var pcs = req.query;
    models.TandEResourceModel.ReleaseSheetWhenExpired(pcs.GroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

module.exports = router;