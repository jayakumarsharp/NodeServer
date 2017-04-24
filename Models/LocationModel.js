var express = require('express');
var moment = require('moment');
var models = require(__base + "Schema");
var uuid = require('node-uuid');
var q = require('q');

var LocationModel = {
    GetLocationList: function (Id) {
        var deferred=q.defer();
        try {
            console.log('Location');
            if (Id != null && Id != undefined) {
                models.Location.findAll({ where: { Id: Id } }).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (err) {
                    console.log('Error' + err);
                    deferred.reject(err)
                });
            }
            else {
                models.Location.findAll().then(function (result) {
                    deferred.resolve(result);
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

    AddLocation:function(opp){
    var deferred=q.defer();
    try{
        models.Location.findAndCountAll({ where: { Location: opp.Location } }).then(function (result) {
            if(result.count>0)
            {
                var data={Error:''};
                data.Error="Location already exists";
                deferred.reject(data);
            }
            else{
                models.Location.create({
                    Location: opp.Location
                }).then(function(response){
                    deferred.resolve(response);
                }).catch(function(err){
                    console.log('AddLocation '+err);
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

    ModifyLocation: function (Opp) {
        var deferred = q.defer();
        try {
            models.Location.update({ Location: Opp.Location }, { where: { Id: Opp.Id } }).then(function (result) {
                console.log('Update success LocationList')
                deferred.resolve(result);

            }).catch(function (err) {
                console.log('Modify Location' + err);
                deferred.reject(err);
            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    DeleteLocation: function (Id) {
        var deferred = q.defer();
        try {
            console.log("Deleting Location");
            models.Location.destroy({ where: { Id: Id }, truncate: false }).then(function (response) {
                deferred.resolve(response);
                console.log("deleting Location success");
            }).catch(function (Error) {
                console.log("Error occured when deleting the Location");
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
module.exports.LocationModel = LocationModel;
