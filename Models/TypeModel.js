var express = require('express');
var moment = require('moment');
var models = require(__base + "Schema");
var q = require('q');

var TypeModel = {
    GetTypes: function (typeId) {
        var deferred = q.defer();
        try {
            if (typeId != null && typeId != undefined) {
                console.log('Inside get types ' + typeId);
                models.Type.findAll({ where: { TypeID: typeId } })
                   .then(function (type) { deferred.resolve(type); })
                   .catch(function (err) { deferred.reject(err) });
            }
            else {
                console.log('Inside get all types');
                models.Type.findAll().then(function (types) {
                    deferred.resolve(types);
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

module.exports.TypeModel = TypeModel;
