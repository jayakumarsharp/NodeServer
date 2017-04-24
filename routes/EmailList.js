var express = require('express');
var models = require(__base + "Models/EmailConfig.js");
var router = express.Router();

router.get('/', function (req, res) {
  var email = req.query;
    models.EmailConfig.GetEmails(email.bu,email.group, email.level).then(function (emails) {
        res.status(200).json(emails);
  })
  .catch(function(err){
      res.status(500).json(err);
  })
});

router.post('/Add', function (req, res) {
    var email = req.body;
    models.EmailConfig.UpdateEmails(email.emails).then(function (emails) {
        res.status(200).json(emails);
    })
    .catch(function (err) {
        res.status(500).json(err);
    })
});

module.exports = router;