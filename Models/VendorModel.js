var express = require('express');
var moment = require('moment');
var models = require("../Schema");
var uuid = require('node-uuid');
var q = require('q');
var fs = require('fs');
var VendorModel = {

    GetVendorList: function (Id) {
        var deferred = q.defer();
        try {
            if (Id != null && Id != undefined) {
                models.VendorList.findAll({ where: { Id: Id } }).then(function (roles) {
                    deferred.resolve(roles);
                }).catch(function (err) {
                    console.log('Error' + err);
                    deferred.reject(err)
                });
            }
            else {
                models.VendorList.findAll().then(function (roles) {
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

    AddVendor: function (opp) {
        var deferred = q.defer();
        try {

            models.VendorList.findAndCountAll({ where: { VendorName: opp.VendorName } }).then(function (result) {
                if (result.count > 0) {
                    var data = { Error: '' };
                    data.Error = "Vendor name already exists";
                    deferred.reject(data);
                }
                else {                    
                    models.VendorList.create({
                        VendorName: opp.VendorName
                    }).then(function (user) {
                        deferred.resolve(user);
                    }).catch(function (err) { console.log('AddVendor' + err); deferred.reject(err); });
                }
            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    ModifyVendor: function (Opp) {
        var deferred = q.defer();
        try {
            models.VendorList.update({ VendorName: Opp.VendorName }, { where: { Id: Opp.Id } }).then(function (user) {
                console.log('sucess upd')
                deferred.resolve(user);
            }).catch(function (err) { console.log('ModifyVendor' + err); deferred.reject(err); });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    DeleteVendor: function (Id) {
        var deferred = q.defer();
        try {
            console.log('Deleting CurrencyConversion');
            models.VendorList.destroy({ where: { Id: Id }, truncate: false })
                .then(function (user) {
                    deferred.resolve(user);
                    console.log('Deleting DeleteCurrencyConversion success');
                }).catch(function (error) {
                    console.log('Error occurred when deleting DeleteVendor ');
                    deferred.reject(data);
                });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

}

module.exports.VendorModel = VendorModel;
