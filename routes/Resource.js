var express = require('express');
var models = require(__base + "Models/ResourceModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');

router.get('/GetResource', function (req, res) {
    var pcs = req.query;
    models.ResourceModel.GetResource(pcs.oppId).then(function (pcs) {
        res.status(200).json(pcs);
    })

  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddResource', function (req, res) {
    var resModel = req.body;
    logger.info('Routing to AddResource..');
    models.ResourceModel.AddResource(resModel).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/AddResourceNewVersion', function (req, res) {
    var resModel = req.body;
    models.ResourceModel.AddResourceNewVersion(resModel).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});


router.post('/UpdateResource', function (req, res) {
    var resModel = req.body;
    models.ResourceModel.UpdateResource(resModel).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});



router.get('/FinisdAnyVersionAvailable', function (req, res) {
    var res = req.query;
    models.ResourceModel.FinisdAnyVersionAvailable(res.oppId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllVersionOpportunity', function (req, res) {
    var res = req.query;
    models.ResourceModel.GetAllVersionOpportunity(res.oppId,res.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetMaximumGroupResourceId', function (req, res) {
    models.ResourceModel.GetMaximumGroupResourceId().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllOpportunityVersion', function (req, res) {
    models.ResourceModel.GetAllOpportunityVersion().then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetAllResourcebyOppGroupID', function (req, res) {
    console.log('called GetAllResourcebyOppGroupID')
    var pcv = req.query;
    models.ResourceModel.GetAllResourcebyOppGroupID(pcv.oppId, pcv.groupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/GetResourceVersionsForOpp', function (req, res) {
    var res = req.query;
    models.ResourceModel.GetResourceVersionsForOpp(res.oppId,res.sheet).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.get('/LocktheSheetByGroupid', function (req, res) {
    var sheetdetail = req.query;
    logger.info('Routing to LocktheSheetByGroupid..')
    models.ResourceModel.LocktheSheetByGroupid(sheetdetail.OppId, sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp,  sheetdetail.IsResourceUpdated).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/IncreaseAdditionalTimeToSheet', function (req, res) {
    var sheetdetail = req.query;
    models.ResourceModel.IncreaseAdditionalTimeToSheet(sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp).then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/GetAllLockedResource', function (req, res) {
    var sheetdetail = req.query;
    models.ResourceModel.GetAllLockedResource().then(function (resModel) {
        res.status(200).json(resModel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});

router.get('/ReleaseSheetWhenExpired', function (req, res) {
    var pcs = req.query;
    models.ResourceModel.ReleaseSheetWhenExpired(pcs.GroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

module.exports = router;