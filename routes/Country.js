var express = require('express');
var models = require(__base + "Models/CountryModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');

router.get('/', function (req, res) {
    models.CountryModel.GetCountry().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetCountryById', function (req, res) {
    var country = req.query;
    models.CountryModel.GetCountry(country.Id).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetOppConfiguration', function (req, res) {
    var opp = req.query;
    models.CountryModel.GetOppConfiguration(opp.oppId).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.get('/GetOpportunityByID', function (req, res) {
    var opp = req.query;
    models.CountryModel.GetOpportunityByID(opp.oppId).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.get('/GetAllCSCPersons', function (req, res) {
    models.CountryModel.GetAllCSCPersons().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetAllRSCPersons', function (req, res) {
    models.CountryModel.GetAllRSCPersons().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetOtherUsers', function (req, res) {
    var other = req.query;
    models.CountryModel.GetOtherUsers(other.SbuId).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetCSCOpptype', function (req, res) {
    models.CountryModel.GetCSCOpptype().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});
router.get('/getConfiguration', function (req, res) {
    models.CountryModel.GetConfigurationDetails().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.get('/GetOpportunityType', function (req, res) {
    models.CountryModel.GetOpportunityType().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.get('/getCSCStatus', function (req, res) {
    models.CountryModel.GetCSCStatus().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/getAllSalestatus', function (req, res) {
    models.CountryModel.getAllSalestatus().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.get('/getAllPreSalestatus', function (req, res) {
    models.CountryModel.getAllPreSalestatus().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetOppCategory', function (req, res) {
    models.CountryModel.GetOppCategory().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.get('/GetOpportunityDataCenterLocated', function (req, res) {
    models.CountryModel.GetOpportunityDataCenterLocated().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/spcall', function (req, res) {
    models.CountryModel.Getsp().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/SBUCount', function (req, res) {
    var user = req.body;
    //console.log(req);
    models.CountryModel.GetCountryBySBU(user.SBUId).then(function (SBUCountData) {
        res.status(200).json(SBUCountData);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/MergeManualOpportunity', function (req, res) {
    var MergeOpportunityDetail = req.body;
    // console.log(req);
    models.CountryModel.MergeManualOpportunity(MergeOpportunityDetail).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.post('/SaveManualOpportunity', function (req, res) {
    var ManualOpportunityDetail = req.body;
    //console.log(req);
    models.CountryModel.CreateOpportunityMaster(ManualOpportunityDetail).then(function (OpportunityDetail) {
        models.CountryModel.SaveManualOpportunityDetail(ManualOpportunityDetail).then(function (OpportunityDetail) {
            models.CountryModel.UpdateManualOpportunityConfiguration(ManualOpportunityDetail).then(function (OpportunityDetail) {
                res.status(200).json(OpportunityDetail);
            }).catch(function (err) {
                res.status(500).json(err);
            });
        }).catch(function (err) {
            res.status(500).json(err);
        })
    }).catch(function (err) {
        res.status(500).json(err);
    });
});

router.post('/SaveOpportunityDetail', function (req, res) {
    var oppInfo = req.body;
    //console.log(req);
    models.CountryModel.SaveOpportunityDetail(oppInfo).then(function (OpportunityDetail) {
        res.status(200).json(OpportunityDetail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetServionLegalEntity', function (req, res) {
    var opp = req.query;
    models.CountryModel.GetServionLegalEntity(opp.oppId).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetAllEstimationProduct', function (req, res) {
    var opp = req.query;
    models.CountryModel.GetAllEstimationProduct().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetOpportunityConfigurationByID', function (req, res) {
    var opp = req.query;
    models.CountryModel.GetOpportunityConfigurationByID(opp.oppId).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetAllOpportunityUsers', function (req, res) {
    var opp = req.query;
    models.CountryModel.GetOpportunityUser(opp.oppId).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetOpportunityConfigBySBU', function (req, res) {
    var opp = req.query;
    models.CountryModel.GetOpportunityConfigBySBU(opp.SBUID, opp.CountryId).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/AddOppConfigMaster', function (req, res) {
    logger.info('Calling AddOppConfigMaster from route..');
    var config = req.body;
    models.CountryModel.AddOppConfigMaster(config).then(function (opp) {
        res.status(200).json(opp);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetParentOpportunityID', function (req, res) {
    var opp = req.query;
    models.CountryModel.GetParentOpportunityID(opp.SBUID).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetChildOpportunityID', function (req, res) {
    var opp = req.query;
    models.CountryModel.GetChildOpportunityID(opp.OppID).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetOpportunityHistory', function (req, res) {
    var opp = req.query;
    models.CountryModel.GetOpportunityHistory(opp.oppID).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetOpportunityCustomerType', function (req, res) {
    models.CountryModel.GetOpportunityCustomerType().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetOpportunityServionLegalEntity', function (req, res) {
    var opp = req.query;
    models.CountryModel.GetOpportunityServionLegalEntity(opp.oppId).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/getOpportunityEstimationProduct', function (req, res) {
    var opp = req.query;
    models.CountryModel.getOpportunityEstimationProduct(opp.oppId).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});



router.get('/GetExtendedEfforts', function (req, res) {
    var opp = req.query;
    models.CountryModel.GetExtendedEfforts().then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/AddExtendedEfforts', function (req, res) {
    var config = req.body;
    models.CountryModel.AddExtendedEfforts(config).then(function (opp) {
        res.status(200).json(opp);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

module.exports = router;