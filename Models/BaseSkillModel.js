var express = require('express');
var moment = require('moment');
var models = require(__base + "Schema");
var uuid = require('node-uuid');
var q = require('q');



var BaseSkillModel={
    GetBaseSkillList : function(Id){
        var deferred=q.defer();
        try{
            console.log('BaseSkill');
            if(Id!=null && Id!=undefined){
                models.BaseSkill.findAll({ where:{Id:Id}}).then(function(roles){
                    deferred.resolve(roles);
                }).catch(function(err){
                    console.log('Error' + err);
                    deferred.reject(err)
                });
            }
            else{
                models.BaseSkill.findAll().then(function(roles){
                    deferred.resolve(roles);
                }).catch(function(err){
                    console.log('Error' +err);
                    deferred.reject(err)
                });
            }
        }
        catch(Ex)
        {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    AddBaseSkill:function(opp){
        var deferred=q.defer();
        try{
            models.BaseSkill.findAndCountAll({where:{BaseSkill:opp.BaseSkill}}).then(function(result){
                if(result.count>0)
                {
                    var data={Error:''};
                    data.Error="BaseSkill already exists";
                    deferred.reject(data);
                }
                else{
                    models.BaseSkill.create({
                        BaseSkill:opp.BaseSkill
                    }).then(function(user){
                        deferred.resolve(user);
                    }).catch(function(err){
                        console.log('AddBaseSkill'+err);
                        deferred.reject(err);
                    });
                }
            
            });
        }
            
        catch(Ex)
        {
            console.log('ex' +Ex);
            deferred.resolve(Ex);
        }
        return deferred.promise;
    },

    ModifyBaseSkill:function(Opp){
        var deferred=q.defer();
        try{
            models.BaseSkill.update({BaseSkill:Opp.BaseSkill},{where:{Id:Opp.Id}}).then(function(user){
                console.log('Update success BaseSkillList')
                deferred.resolve(user);

            }).catch(function(err){
                console.log('Modify BaseSkill' +err);
                deferred.reject(err);
            });
        }
        catch(Ex){
            console.log('ex'+Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    DeleteBaseSkill: function (Id) {
        var deferred = q.defer();
        try {
            console.log("Deleting BaseSkill");
            models.BaseSkill.destroy({ where: { Id: Id }, truncate: false }).then(function (user) {
                deferred.resolve(user);
                console.log("deleting BaseSkill success");
            }).catch(function (Error) {
                console.log("Error occured when deleting the BaseSkill");
                deferred.reject(Error);
            });
        }
        catch (Ex) {
            console.log('Error' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

}

module.exports.BaseSkillModel = BaseSkillModel;
