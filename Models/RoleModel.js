var express = require('express');
var moment = require('moment');
var models = require(__base + "Schema");
var q = require('q');

var RoleModel = {
    GetRoles: function (roleId) {
        var deferred = q.defer();
        try {
            if (roleId != null && roleId != undefined) {
                console.log('Inside get roles ' + roleId);
                models.Role.findAll({ where: { id: roleId } })
                   .then(function (roles) { deferred.resolve(roles); })
                   .catch(function (err) { deferred.reject(err) });
            }
            else {
                console.log('Inside get all roles');
                models.Role.findAll().then(function (roles) {
                    deferred.resolve(roles);
                }).catch(function (err) {
                    console.log('Error' + err);
                    deferred.reject(err)
                });
            }
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetUserRoles: function (roleId) {
        var deferred = q.defer();
        try {
            console.log('Inside GetUserRoles for:  ' + roleId);
            models.User.findAll({ where: { RoleId: roleId } })
               .then(function (userroles) { deferred.resolve(userroles); })
               .catch(function (err) { deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetRights: function (roleId) {
        var deferred = q.defer();
        try {
            if (roleId != null && roleId != undefined) {
                console.log('Inside get Rights for ' + roleId);
                models.Right.findAll({ where: { RightID: roleId } })
                 .then(function (right) { deferred.resolve(right); })
                 .catch(function (err) { deferred.reject(err) });
            }
            else {
                console.log('Inside get all Rights');
                models.Right.findAll().then(function (rights) {
                    deferred.resolve(rights);
                }).catch(function (err) { deferred.reject(err) });
            }
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    AddRole: function (role) {
        console.log('Add role');
        var deferred = q.defer();
        try {
            //var dbdate = new Date();
            //var createdDate = moment(dbdate).add(30, 'days').format('L LT');
            console.log('Creating role: ' + role.selectedRole);
            models.Role.create({
                RoleName: role.selectedRole
            }).then(function (role) {
                console.log('Added role to master table')
                deferred.resolve(role);
            })
                            .catch(function (err) {
                                console.log('Error: ' + err); deferred.reject(err);
                            })
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    ModifyRoleRight: function (roleright) {
        console.log('Modify role-right mapping');
        var deferred = q.defer();
        try {
            //var dbdate = new Date();
            //var createdDate = moment(dbdate).add(30, 'days').format('L LT');
            console.log(JSON.stringify(roleright));
            models.RoleRight.destroy({ where: { RoleID: roleright.id }, truncate: false })
                           .then(function () {
                               for (var i = 0; i < roleright.Rights.length; i++) {
                                   console.log('Mapping Right ' + roleright.Rights[i].RightID + ' to Role ' + roleright.id);
                                   models.RoleRight.create({
                                       RoleID: roleright.id,
                                       RightID: roleright.Rights[i].RightID
                                   }).then(function (role) {
                                       console.log('Added role-right to mapping table')
                                       deferred.resolve(role);
                                   }).catch(function (err) {
                                       console.log('Error: ' + err); deferred.reject(err);
                                   })
                               }
                           })
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    AddRoleRightMapping: function (roleright) {
        console.log('Add role-right mapping');
        var deferred = q.defer();
        try {
            //var dbdate = new Date();
            //var createdDate = moment(dbdate).add(30, 'days').format('L LT');
            for (var i = 0; i < roleright.Rights.length; i++) {
                console.log('Mapping Right ' + roleright.Rights[i].RightID + ' to Role ' + roleright.RoleID);
                models.RoleRight.create({
                    RoleID: roleright.RoleID,
                    RightID: roleright.Rights[i].RightID
                }).then(function (role) {
                    console.log('Added role-right to mapping table')
                    deferred.resolve(role);
                })
                                .catch(function (err) {
                                    console.log('Error: ' + err); deferred.reject(err);
                                })
            }
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    ModifyRole: function (role) {
        var deferred = q.defer();

        return deferred.promise;
    },
    DeleteRole: function (roleright) {
        var deferred = q.defer();
        try {
            console.log('Deleting role-right mapping');
            models.RoleRight.destroy({ where: { RoleID: roleright.id }, truncate: false })
                           .then(function () {
                               console.log('Deleting Role from Role master');
                               models.Role.destroy({ where: { id: roleright.id }, truncate: false });
                           }).then(function (data) {
                               console.log('Deleted role and role-right map successfully');
                               deferred.resolve(data);
                           }).catch(function (error) {
                               console.log('Error occurred when deleting role');
                               deferred.reject(data);
                           });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetRoleRightMapping: function (roleId) {
        console.log('Inside get role-right mapping for: ' + roleId);
        var deferred = q.defer();
        try {
            if (roleId != null && roleId != undefined) {
                console.log('Inside get GetRoleRightMapping for Role ' + roleId);
                models.RoleRight.findAll({ where: { RoleID: roleId } })
                .then(function (roleright) { deferred.resolve(roleright); })
                .catch(function (err) { console.log('GetRoleRightMapping: ' + err); deferred.reject(err) });
            }
            else {
                console.log('Inside get all GetRoleRightMapping');
                models.RoleRight.findAll().then(function (rolerights) {
                    deferred.resolve(rolerights);
                }).catch(function (err) { deferred.reject(err) });
            }
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    }
}

module.exports.RoleModel = RoleModel;
