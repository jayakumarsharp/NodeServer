var moment = require('moment');
var models = require(__base + "Schema");
var q = require('q');
var logger = require(__base + 'Models/logger');
var Sequelize = require('sequelize');

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);


var PaymentConfigModel = {

    AddPaymentConfig: function (config) {
        var deferred = q.defer();
        try {
            logger.info('Adding payment config for BU: ' + config.BU + ' Region: ' + config.Region)

            models.PAYMENTCONFIG.destroy({ where: { BU: config.BU, Region: config.Region }, truncate: false })
                .then(function () {
                    logger.info(JSON.stringify(config))
                    logger.info('Deleted previous entry. Creating new config..');
                    models.PAYMENTCONFIG.bulkCreate(config.Paymentdata, { omitNull: true }).then(function (paymentconfig) {
                        logger.info('Added Config in table')
                        deferred.resolve(paymentconfig);
                    }).catch(function (error) {
                        logger.info('Failed to add to Config. Error: ' + error);
                        deferred.reject(error);
                    })
                })
                .catch(function (destroyError) {
                    logger.info('destroy ' + destroyError)
                    deferred.reject(destroyError);
                    //t.rollback();
                });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetPaymentConfig: function (BUid, RegionId) {
        logger.info('Start fetching the payment config');
        var deferred = q.defer();
        try {
            logger.info(RegionId)
            if (RegionId == 'null' || RegionId == ''|| RegionId == null) {
                logger.info('Inside country null')
                sequelize.query('SELECT top 1 Id FROM [TBL_COUNTRY_MASTER] where SBUId=:SBUId  and [CountryName] =:RegionId',
                    {
                        replacements: {
                            SBUId: BUid,
                            RegionId: 'OTHER'
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (response) {
                        if (response != null && response.length > 0) {

                            sequelize.query("SELECT D.[PaymentCode],'' as SubPaymentCode,Pm.PercentageType,PM.VendorBreakdown,PM.MilestoneDescription,[Iyear1],[Iyear2],[Iyear3],[Iyear4],[Iyear5],[paymentTerms],[percentageTotal],[OEMHWandSW],[OEMServices],[OEMPS],[OEMOther],[SERVSW],[SERVServices],[SERVPS],[SERVConsulting],[SERVCare],[SERVOther],[SERVResource],[SERVTM],[SERVHosted]  FROM [TBL_PAYMENT_DEFAULTCONFIG] D join TBL_PAYMENT_MILESTONE PM on Pm.PaymentCode=D.[PaymentCode] where [BU]=:bu and Region=:region order by PM.Id", { replacements: { bu: BUid, region: response[0].Id }, type: sequelize.QueryTypes.SELECT })
                                .then(function (codes) { deferred.resolve(codes); })
                                .catch(function (err) { logger.error('GetAllPaymentCode ' + err); deferred.reject(err) });
                        }
                        else {
                            deferred.resolve("data not available");
                        }

                    }).error(function (err) {
                        logger.info('failure: ' + err);
                        deferred.reject(err)
                    });
            }
            else {
                sequelize.query("SELECT D.[PaymentCode],'' as SubPaymentCode,Pm.PercentageType,PM.VendorBreakdown,PM.MilestoneDescription,[Iyear1],[Iyear2],[Iyear3],[Iyear4],[Iyear5],[paymentTerms],[percentageTotal],[OEMHWandSW],[OEMServices],[OEMPS],[OEMOther],[SERVSW],[SERVServices],[SERVPS],[SERVConsulting],[SERVCare],[SERVOther],[SERVResource],[SERVTM],[SERVHosted]  FROM [TBL_PAYMENT_DEFAULTCONFIG] D join TBL_PAYMENT_MILESTONE PM on Pm.PaymentCode=D.[PaymentCode] where [BU]=:bu and Region=:region order by PM.Id", { replacements: { bu: BUid, region: RegionId }, type: sequelize.QueryTypes.SELECT })
                    .then(function (codes) { deferred.resolve(codes); })
                    .catch(function (err) { logger.error('GetAllPaymentCode ' + err); deferred.reject(err) });
            }
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetAllPaymentCode: function () {
        logger.info('Start fetching the payment config');
        var deferred = q.defer();
        try {
            sequelize.query('Select PaymentCode from TBL_PAYMENT_MILESTONE;',
                {
                    type: sequelize.QueryTypes.SELECT
                })
                .then(function (codes) { deferred.resolve(codes); })
                .catch(function (err) { logger.error('GetAllPaymentCode ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetPaymentPeriod: function () {
        logger.info('Start fetching the payment period..');
        logger.info('called the payment period..');
        var deferred = q.defer();
        try {
            models.PaymentPeriod.findAll()
                .then(function (payperiod) { deferred.resolve(payperiod); })
                .catch(function (err) { logger.error('PaymentPeriod: ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    }
}
module.exports.PaymentConfigModel = PaymentConfigModel;


