var express = require('express');
var moment = require('moment');
var models = require(__base + "Schema");
var uuid = require('node-uuid');
var q = require('q');

var ProductModel = {
    GetProductList: function (Id) {
        var deferred = q.defer();
        try {
            console.log('Vendor;');
            if (Id != null && Id != undefined) {
                models.ProductList.findAll({ where: { Id: Id } }).then(function (roles) {
                    deferred.resolve(roles);
                }).catch(function (err) {
                    console.log('Error' + err);
                    deferred.reject(err)
                });
            }
            else {
                models.ProductList.findAll().then(function (roles) {
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

    AddProduct: function (opp) {
        var deferred = q.defer();
        try {
            models.ProductList.findAndCountAll({ where: { ProductName: opp.ProductName } }).then(function (result) {
                if (result.count > 0) {
                     var data = { Error: '' };
                    data.Error = "Product name already exists";
                    deferred.reject(data);
                }
                else {
                    models.ProductList.create({
                        ProductName: opp.ProductName
                    }).then(function (user) {
                        deferred.resolve(user);
                    }).catch(function (err) { console.log('AddProduct' + err); deferred.reject(err); });
                }

            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    ModifyProduct: function (Opp) {
        var deferred = q.defer();
        try {
            models.ProductList.update({ ProductName: Opp.ProductName }, { where: { Id: Opp.Id } }).then(function (user) {
                console.log('sucess ProductList')
                deferred.resolve(user);
            }).catch(function (err) { console.log('ModifyProduct' + err); deferred.reject(err); });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    DeleteProduct: function (Id) {
        var deferred = q.defer();
        try {
            console.log('Deleting ProductList');
            models.ProductList.destroy({ where: { Id: Id }, truncate: false })
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

module.exports.ProductModel = ProductModel;
