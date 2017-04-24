var express = require('express');
var moment = require('moment');
var models = require(__base + "Schema");
var uuid = require('node-uuid');
var q = require('q');



var ManualEstimationTypeModel={
    GetManualEstimationTypeList : function(ManualEstimationTypeId){
        var deferred=q.defer();
        try{
            console.log('ManualEstimationType');
            if(ManualEstimationTypeId!=null && ManualEstimationTypeId!=undefined){
                models.ManualEstimationType.findAll({ where:{ManualEstimationTypeId:ManualEstimationTypeId}}).then(function(roles){
                    deferred.resolve(roles);
                }).catch(function(err){
                    console.log('Error' + err);
                    deferred.reject(err)
                });
            }
            else{
                models.ManualEstimationType.findAll().then(function(roles){
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

    AddManualEstimationType:function(opp){
        var deferred=q.defer();
        try{
            models.ManualEstimationType.findAndCountAll({where:{TaskName:opp.TaskName}}).then(function(result){
                if(result.count>0)
                {
                    var data={Error:''};
                    data.Error="ManualEstimationType already exists";
                    deferred.reject(data);
                }
                else{
                    models.ManualEstimationType.create({
                        TaskName:opp.TaskName
                    }).then(function(user){
                        deferred.resolve(user);
                    }).catch(function(err){
                        console.log('AddManualEstimationType'+err);
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

    ModifyManualEstimationType:function(Opp){
        var deferred=q.defer();
        try{
            models.ManualEstimationType.update({TaskName:Opp.TaskName},{where:{ManualEstimationTypeId:Opp.ManualEstimationTypeId}}).then(function(user){
                console.log('Update success ManualEstimationTypeList')
                deferred.resolve(user);

            }).catch(function(err){
                console.log('Modify ManualEstimationType' +err);
                deferred.reject(err);
            });
        }
        catch(Ex){
            console.log('ex'+Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    DeleteManualEstimationType:function(ManualEstimationTypeId){
        var deferred=q.defer();
        try{
            console.log("Deleting ManualEstimationType");
            models.ManualEstimationType.destroy({where:{ManualEstimationTypeId:ManualEstimationTypeId},truncate:false}).then(function(user){
                deferred.resolve(user);
                console.log("deleting ManualEstimationType success");
            }).catch(function(Error){
                console.log("Error occured when deleting the ManualEstimationType");
                deferred.reject(Error);
            });
        }
        catch(Ex){
            console.log('Error'+Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

}

module.exports.ManualEstimationTypeModel = ManualEstimationTypeModel;



