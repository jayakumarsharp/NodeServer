var express = require('express');
var moment = require('moment');
var models = require(__base + "Schema");
var uuid = require('node-uuid');
var logger = require(__base + 'Models/logger');
var q = require('q');

var BillingConfigModel = {

    GetBillingConfig: function (year) {
        var deferred = q.defer();
        try {
            logger.info('GetBillingConfig');
            models.BillingConfig.findAll({ where: { Year: year } }).then(function (config) {
                deferred.resolve(config);
            }).catch(function (err) {
                logger.info('Error' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    AddBillingConfig: function (BillingConfig) {
        var deferred = q.defer();
        try {
            logger.info('Adding Billing Config..');
            models.BillingConfig.findAndCountAll({ where: { Year: BillingConfig[0].Year } }).then(function (result) {
                if (result.count > 0) {
                    logger.info("BillingConfig already exists");
                    models.BillingConfig.destroy({ where: { Year: BillingConfig[0].Year }, truncate: false })
                        .then(function (user) {
                            logger.info('Destroyed old data..')
                            models.BillingConfig.bulkCreate(BillingConfig, { omitNull: true }
                            ).then(function (bill) {
                                logger.info('Created new data..')
                                deferred.resolve(bill);
                            }).catch(function (err) {
                                logger.info('AddBillingConfig failed: ' + err);
                                deferred.reject(err);
                            });
                        })
                        .catch(function (destroyError) {
                            logger.info('Error occurred: ' + destroyError)
                            deferred.reject(destroyError);
                        })
                }
                else {
                    logger.info("BillingConfig does not exist");
                    models.BillingConfig.bulkCreate(BillingConfig, { omitNull: true }
                    ).then(function (user) {
                        logger.info('Created new data');
                        deferred.resolve(user);
                    }).catch(function (err) {
                        logger.info('AddBillingConfig error: ' + err);
                        deferred.reject(err);
                    });
                }

            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.resolve(Ex);
        }
        return deferred.promise;
    }  

}

module.exports.BillingConfigModel = BillingConfigModel;
