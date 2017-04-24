var express = require('express');
var models = require(__base + "Models/UserModel.js");
var router = express.Router();

router.get('/', function (req, res) {
  var user = req.query;
  console.log(user);
  /*res.status(200).json({message:'success'});*/
  console.log(typeof  models.UserModel.GetUser(user.userId));
 models.UserModel.GetUser(user.userId).then(function(users){
      res.status(200).json(users);
  })
  .catch(function(err){
      res.status(500).json(err);
  })
});
router.get('/profile/', function (req, res) {
    var user = req.query;
    models.UserModel.GetUserProfile(user.userId).then(function (profile) {
        res.status(200).json(profile);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/GetUserSessionInfo/', function (req, res) {
    var user = req.query;
    models.UserModel.GetUserSessionInfo(user.createdOn).then(function (userSession) {
        res.status(200).json(userSession);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/GetInactiveUsers/', function (req, res) {
    models.UserModel.GetInactiveUsers().then(function (users) {
        res.status(200).json(users);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/UserSBU/', function (req, res) {
    var user = req.query;
    models.UserModel.GetUserSBU(user.userId).then(function (sbus) {
        res.status(200).json(sbus);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/AllUserSBU/', function (req, res) {
    models.UserModel.GetUserSBU().then(function (sbus) {
        res.status(200).json(sbus);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/UserBillingSBU/', function (req, res) {
    var user = req.query;
    models.UserModel.GetUserBillingSBU(user.userId).then(function (sbus) {
        res.status(200).json(sbus);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/AllUserBillingSBU/', function (req, res) {
    models.UserModel.GetUserBillingSBU().then(function (sbus) {
        res.status(200).json(sbus);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/GetUsersToAddInHierarchy/', function (req, res) {
    models.UserModel.GetUsersToAddInHierarchy().then(function (users) {
        res.status(200).json(users);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/sbu', function (req, res) {
    var sbu = req.query;
    /*res.status(200).json({message:'success'});*/
    models.UserModel.GetAllSBU().then(function (sbu) {
        res.status(200).json(sbu);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});
router.get('/email', function (req, res) {
    models.UserModel.GetAllEmail().then(function (email) {
        res.status(200).json(email);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});
router.post('/CreateUser', function (req, res){
    var user = req.body;
    //console.log(req);      
    models.UserModel.CreateUser(user).then(function(users){
      res.status(200).json(users);
  })
 .catch(function(err){
      res.status(500).json(err);
  })  
});
router.post('/GetUsersByTypes', function (req, res){
    var types = req.body;
    models.UserModel.GetUsersByTypes(types).then(function(users){
      res.status(200).json(users);
  })
 .catch(function(err){
      res.status(500).json(err);
  })  
});
router.post('/CreateTempUser', function (req, res) {
    var user = req.body;
    console.log('calling CreateTempUser..');
    models.UserModel.CreateTempUser(user).then(function (users) {
        res.status(200).json(users);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});
router.post('/ModifyUser', function (req, res){    
  var user = req.body;
  models.UserModel.ModifyUser(user).then(function(users){
      res.status(200).json(users);
  })
  .catch(function(err){
      res.status(500).json(err);
  })  
});
router.post('/DeleteUser', function (req, res){
  var user = req.body;
  console.log(user);
  models.UserModel.DeleteUser(user).then(function(users){
      res.status(200).json(users);
  })
  .catch(function(err){
      res.status(500).json(err);
  })
});
router.get('/GetAllUserHierarchy', function (req, res) {
    models.UserModel.GetUserHierarchy().then(function (userHierarchy) {
        res.status(200).json(userHierarchy);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/GetUserHierarchy/', function (req, res) {
    var user = req.query;
    models.UserModel.CallUserHierarchy(user.UserId).then(function (hierarchy) {
        res.status(200).json(hierarchy);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/GetHierarchyJSON/', function (req, res) {
    models.UserModel.GetHierarchyJSON().then(function (hierarchy) {
        res.status(200).json(hierarchy);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.post('/DeleteUserHierarchy', function (req, res){
    var user = req.body;
    models.UserModel.DeleteUserHierarchy(user).then(function(users){
      res.status(200).json(users);
  })
 .catch(function(err){
      res.status(500).json(err);
  })  
});
router.post('/AddUserHierarchy', function (req, res){
    var user = req.body;
    models.UserModel.AddUserHierarchy(user).then(function(users){
      res.status(200).json(users);
  })
 .catch(function(err){
      res.status(500).json(err);
  })  
});
router.post('/UpdateHierarchyJSON', function (req, res){
  var user = req.body;
  console.log(user);
  models.UserModel.UpdateHierarchyJSON(user).then(function(users){
      res.status(200).json(users);
  })
  .catch(function(err){
      res.status(500).json(err);
  })
});
router.post('/ModifyUserHierarchy', function (req, res){    
  var user = req.body;
  models.UserModel.ModifyUserHierarchy(user).then(function(users){
      res.status(200).json(users);
  })
  .catch(function(err){
      res.status(500).json(err);
  })  
});
router.get('/GetAllBillingOptions', function (req, res) {
    models.UserModel.GetBillingOptions().then(function (billing) {
        res.status(200).json(billing);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/GetBillingForUser/', function (req, res) {
    var user = req.query;
    models.UserModel.GetBillingOptions(user.UserId).then(function (userBilling) {
        res.status(200).json(userBilling);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/GetAllBaseSkillOptions', function (req, res) {
    models.UserModel.GetBaseSkillOptions().then(function (skill) {
        res.status(200).json(skill);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/GetBaseSkillForUser/', function (req, res) {
    var user = req.query;
    models.UserModel.GetBaseSkillOptions(user.UserId).then(function (userSkill) {
        res.status(200).json(userSkill);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/GetAllLocations', function (req, res) {
    models.UserModel.GetLocation().then(function (locs) {
        res.status(200).json(locs);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.get('/GetLocationForUser/', function (req, res) {
    var user = req.query;
    models.UserModel.GetLocation(user.UserId).then(function (loc) {
        res.status(200).json(loc);
    })
     .catch(function (err) {
         res.status(500).json(err);
     })
});
router.post('/ChangePassword', function (req, res){
  var user = req.body;
  models.UserModel.ChangePassword(user).then(function(users){
      res.status(200).json(users);
  })
  .catch(function(err){
      res.status(500).json(err);
  })
});

module.exports = router;