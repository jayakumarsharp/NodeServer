var express = require('express');
var moment = require('moment');
var models = require(__base + "Schema");
var uuid = require('node-uuid');
var q = require('q');



var TaskTypeModel={
    GetTaskTypeList : function(TaskTypeId){
        var deferred=q.defer();
        try{
            console.log('TaskType');
            if(TaskTypeId!=null && TaskTypeId!=undefined){
                models.TaskType.findAll({ where:{TaskTypeId:TaskTypeId}}).then(function(roles){
                    deferred.resolve(roles);
                }).catch(function(err){
                    console.log('Error' + err);
                    deferred.reject(err)
                });
            }
            else{
                models.TaskType.findAll().then(function(roles){
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

    AddTaskType:function(opp){
        var deferred=q.defer();
        try{
            models.TaskType.findAndCountAll({where:{TaskName:opp.TaskName}}).then(function(result){
                if(result.count>0)
                {
                    var data={Error:''};
                    data.Error="TaskType already exists";
                    deferred.reject(data);
                }
                else{
                    models.TaskType.create({
                        TaskName:opp.TaskName
                    }).then(function(user){
                        deferred.resolve(user);
                    }).catch(function(err){
                        console.log('AddTaskType'+err);
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

    ModifyTaskType:function(Opp){
        var deferred=q.defer();
        try{
            models.TaskType.update({TaskName:Opp.TaskName},{where:{TaskTypeId:Opp.TaskTypeId}}).then(function(user){
                console.log('Update success TaskTypeList')
                deferred.resolve(user);

            }).catch(function(err){
                console.log('Modify TaskType' +err);
                deferred.reject(err);
            });
        }
        catch(Ex){
            console.log('ex'+Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    DeleteTaskType:function(TaskTypeId){
        var deferred=q.defer();
        try{
            console.log("Deleting TaskType");
            models.TaskType.destroy({where:{TaskTypeId:TaskTypeId},truncate:false}).then(function(user){
                deferred.resolve(user);
                console.log("deleting TaskType success");
            }).catch(function(Error){
                console.log("Error occured when deleting the tasktype");
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

module.exports.TaskTypeModel = TaskTypeModel;



