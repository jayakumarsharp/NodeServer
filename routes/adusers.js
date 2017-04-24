var express = require('express');
var models = require(__base + "Models/ADUserModel.js");
var router = express.Router();

router.get('/', function (req, res) {
    var aduser = req.query;
    /*res.status(200).json({message:'success'});*/
    models.ADUserModel.GetADUsers().then(function (aduser) {
        res.status(200).json(aduser);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetAllADUsers', function (req, res) {
    var aduser = req.query;
    /*res.status(200).json({message:'success'});*/
    models.ADUserModel.GetAllADUsers().then(function (aduser) {
        res.status(200).json(aduser);
    }).catch(function (err) {
        res.status(500).json(err);
    })
});


router.post('/DeleteADUser', function (req, res) {
    var aduser = req.body;
    console.log(aduser);
    models.ADUserModel.DeleteUser(aduser).then(function (aduser) {
        res.status(200).json(aduser);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

module.exports = router;