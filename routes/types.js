var express = require('express');
var models = require(__base + "Models/TypeModel.js");
var router = express.Router();

router.get('/', function (req, res) {
  var role = req.query;
  console.log('Get all types');
  /*res.status(200).json({message:'success'});*/
    models.TypeModel.GetTypes().then(function (roles) {
      res.status(200).json(roles);
  })
  .catch(function(err){
      res.status(500).json(err);
  })
});

module.exports = router;