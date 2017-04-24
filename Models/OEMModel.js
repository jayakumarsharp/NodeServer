var express = require('express');
var models = require(__base + "Schema");
var q = require('q');

var OEMModel = {
    GetOEM: function () {
        var deferred = q.defer();
        try {
            console.log('OEM;');
            models.OEM.findAll().then(function (roles) {
                deferred.resolve(roles);
            }).catch(function (err) {
                console.log('Error' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    }

}

module.exports.OEMModel = OEMModel;
