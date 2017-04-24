var express = require('express');
var models = require(__base + "Models/RoleModel.js");
var router = express.Router();

router.get('/GetUserRoles', function (req, res) {
    var userrole = req.query;
    models.RoleModel.GetUserRoles(userrole.roleId).then(function (userroles) {
        res.status(200).json(userroles);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});
router.get('/GetRoleRightMappings', function (req, res) {
    var roleright = req.query;
    models.RoleModel.GetRoleRightMapping().then(function (rolerights) {
        res.status(200).json(rolerights);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});
router.get('/GetRoleRightMapping', function (req, res) {
    console.log(req.query);
    var query = req.query;
    console.log('Getting role-right map for role: ' + query.roleId);
    models.RoleModel.GetRoleRightMapping(query.roleId).then(function (rolerights) {
        console.log(JSON.stringify(rolerights));
        res.status(200).json(rolerights);
    })
  .catch(function (err) {
      console.log('Error: ' + err);
      res.status(500).json(err);
  })
});
router.get('/roles', function (req, res) {
  var role = req.query;
    models.RoleModel.GetRoles().then(function (roles) {
      res.status(200).json(roles);
  })
  .catch(function(err){
      res.status(500).json(err);
  })
});
router.get('/', function (req, res) {
    var right = req.query;
    console.log(right);
    models.RoleModel.GetRights(right.rightId).then(function (rights) {
        res.status(200).json(rights);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});

router.post('/AddRole', function (req, res) {
    console.log('adding role');
    var role = req.body;
    //console.log(req);      
    models.RoleModel.AddRole(role).then(function (role) {
      res.status(200).json(role);
  })
 .catch(function(err){
      res.status(500).json(err);
  })  
});
router.post('/AddRoleRightMapping', function (req, res) {
    console.log('adding role-menu map');
    var rolemenu = req.body;
    //console.log(req);
    models.RoleModel.AddRoleRightMapping(rolemenu).then(function (rolemenu) {
        res.status(200).json(rolemenu);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});
router.post('/ModifyRoleRight', function (req, res) {
    console.log('modifying role-right mapping');
    var roleright = req.body;
    models.RoleModel.ModifyRoleRight(roleright).then(function (roleright) {
        res.status(200).json(roleright);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })

});
router.post('/DeleteRole', function (req, res){
  var role = req.body;
  console.log(role);
    models.RoleModel.DeleteRole(role).then(function (roles) {
      res.status(200).json(roles);
  })
  .catch(function(err){
      res.status(500).json(err);
  })
});

module.exports = router;