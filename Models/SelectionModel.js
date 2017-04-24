var express = require('express');
var moment = require('moment');
var models = require(__base + "Schema");
var uuid = require('node-uuid');
var q = require('q');



var SelectionModel={
    GetSelectionList : function(Id){
        var deferred=q.defer();
        try{
            console.log('Selection');
            if(Id!=null && Id!=undefined){
                models.Selection.findAll({ where:{Id:Id}}).then(function(roles){
                    deferred.resolve(roles);
                }).catch(function(err){
                    console.log('Error' + err);
                    deferred.reject(err)
                });
            }
            else{
                models.Selection.findAll().then(function(roles){
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

    AddSelection:function(opp){
        var deferred=q.defer();
        try{
            models.Selection.findAndCountAll({where:{Key:opp.Key}}).then(function(result){
                if(result.count>0)
                {
                    var data={Error:''};
                    data.Error="Selection Key already exists";
                    deferred.reject(data);
                }
                else{
                    models.Selection.create({
                        Key:opp.Key,
                        Selection:opp.Selection
                    }).then(function(user){
                        deferred.resolve(user);
                    }).catch(function(err){
                        console.log('AddSelection'+err);
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

    ModifySelection:function(Opp){
        var deferred=q.defer();
        try{
            models.Selection.update({Selection:Opp.Selection},{where:{Id:Opp.Id}}).then(function(user){
                console.log('Update success SelectionList')
                deferred.resolve(user);

            }).catch(function(err){
                console.log('Modify Selection' +err);
                deferred.reject(err);
            });
        }
        catch(Ex){
            console.log('ex'+Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    DeleteSelection: function (Id) {
        var deferred = q.defer();
        try {
            console.log("Deleting Selection");
            models.Selection.destroy({ where: { Id: Id }, truncate: false }).then(function (user) {
                deferred.resolve(user);
                console.log("deleting Selection success");
            }).catch(function (Error) {
                console.log("Error occured when deleting the Selection");
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

module.exports.SelectionModel = SelectionModel;
