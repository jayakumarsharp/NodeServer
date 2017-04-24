var moment = require('moment');
var models = require(__base + "Schema");
var q = require('q');
var logger = require(__base + 'Models/logger');
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var ServionLegalEntityModel = {
    GetAllLegalEntityModel: function () {
        logger.info('Start Fetching GetAllLegalEntityModel');
        var deferred = q.defer();
        try {
            models.ServionLegalEntity.findAll()
                    .then(function (opp) { deferred.resolve(opp); })
                    .catch(function (err) { logger.info('GetRegionalMap ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetCurrencyFromLegalEntity: function (legalEntityId) {
        logger.info('Start Fetching Currency for legal entity: ' + legalEntityId);
        var deferred = q.defer();
        try {
            sequelize.query('Select CM.Currency, CM.CurrencyDescrition as CurrencyDescription,CCM.ConversionRate from TBL_SERVIONLEGALENTITYMAPPING LE inner join TBL_CURRENCY_MASTER CM on LE.CurrencyId = CM.Id join TBL_CURRENCY_CONVERSION_MASTER CCM on CM.Id=CCM.CurrencyId where LE.ServionLegalEntityID = :Id',
                {
                    replacements: { Id: legalEntityId },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (response) {
                    logger.info('success');
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('failure: ' + err);
                    deferred.reject(err)
                });

        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetLegalEntityFromOpp: function (oppId) {
        logger.info('Start legal entity for Opp Id: ' + oppId);
        var deferred = q.defer();
        try {
            sequelize.query('select LE.ServionLegalEntityID,LE.ServionLegalEntity, LE.ServionLegalEntityDesc from TBL_SERVIONLEGALENTITY LE inner join TBL_OPPORTUNITY_ServionLegalEntity OS on OS.ServionLegalEntityID = LE.ServionLegalEntityID where OS.OppID = :Id',
                {
                    replacements: { Id: oppId },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (response) {
                    logger.info('success');
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('failure: ' + err);
                    deferred.reject(err)
                });

        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetDefaultLegalEntity: function (sbuId, regionId) {
        logger.info('Start Fetching default legal entity');
        var deferred = q.defer();
        try {

            if (regionId == '-1') {
                sequelize.query('SELECT top 1 Id FROM [TBL_COUNTRY_MASTER] where SBUId=:SBUId  and [CountryName] =:RegionId',
                 {
                     replacements: {
                         SBUId: sbuId,
                         RegionId: 'OTHER'
                     },
                     type: sequelize.QueryTypes.SELECT
                 }).then(function (response) {
                     if (response != null && response.length > 0) {
                         sequelize.query('select LE.ServionLegalEntityID,LE.ServionLegalEntity, LE.ServionLegalEntityDesc,CM.Id as CurrencyID,CM.Currency,CM.CurrencyDescrition,isnull(CCM.ConversionRate,:Stringpass) as ConversionRate from TBL_SERVIONLEGALENTITY LE inner join TBL_SERVIONLEGALENTITYMAPPING LEM on LE.ServionLegalEntityID = LEM.ServionLegalEntityID inner join TBL_CURRENCY_MASTER CM on CM.Id = LEM.CurrencyId left join TBL_CURRENCY_CONVERSION_MASTER CCM on CCM.CurrencyId = LEM.CurrencyId where LEM.SBUId = :SBUId and LEM.RegionId = :RegionId',
                             {
                                 replacements: {
                                     SBUId: sbuId,
                                     RegionId: response[0].Id,
                                     Stringpass: 'NA'
                                 },
                                 type: sequelize.QueryTypes.SELECT
                             }).then(function (response1) {
                                 logger.info('success');
                                 deferred.resolve(response1);
                             }).error(function (err) {
                                 logger.info('failure: ' + err);
                                 deferred.reject(err)
                             });
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
                sequelize.query('select LE.ServionLegalEntityID,LE.ServionLegalEntity, LE.ServionLegalEntityDesc,CM.Id as CurrencyID,CM.Currency,CM.CurrencyDescrition,isnull(CCM.ConversionRate,:Stringpass) as ConversionRate,LEM.IsDefault from TBL_SERVIONLEGALENTITY LE inner join TBL_SERVIONLEGALENTITYMAPPING LEM on LE.ServionLegalEntityID = LEM.ServionLegalEntityID inner join TBL_CURRENCY_MASTER CM on CM.Id = LEM.CurrencyId left join TBL_CURRENCY_CONVERSION_MASTER CCM on CCM.CurrencyId = LEM.CurrencyId where LEM.SBUId = :SBUId and LEM.RegionId = :RegionId',
                    {
                        replacements: {
                            SBUId: sbuId,
                            RegionId: regionId,
                            Stringpass: 'NA'
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (response) {
                        logger.info('success');
                        deferred.resolve(response);
                    }).error(function (err) {
                        logger.info('failure: ' + err);
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

    GetDefaultcurencybyLegalEntity: function (sbuId, regionId, legalentity) {
        logger.info('Start Fetching default legal entity');
        var deferred = q.defer();
        try {

            sequelize.query('select LE.ServionLegalEntityID,LE.ServionLegalEntity, LE.ServionLegalEntityDesc,CM.Id as CurrencyID,CM.Currency,CM.CurrencyDescrition,CCM.ConversionRate,LEM.IsDefault from TBL_SERVIONLEGALENTITY LE inner join TBL_SERVIONLEGALENTITYMAPPING LEM on LE.ServionLegalEntityID = LEM.ServionLegalEntityID inner join TBL_CURRENCY_MASTER CM on CM.Id = LEM.CurrencyId inner join TBL_CURRENCY_CONVERSION_MASTER CCM on CCM.CurrencyId = LEM.CurrencyId where LEM.SBUId = :SBUId and LEM.RegionId = :RegionId and LE.ServionLegalEntityID=:LegalentityId',
                {
                    replacements: {
                        SBUId: sbuId,
                        RegionId: regionId,
                        LegalentityId: legalentity
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (response1) {
                    logger.info('success');
                    deferred.resolve(response1);
                }).error(function (err) {
                    logger.info('failure: ' + err);
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

module.exports.ServionLegalEntityModel = ServionLegalEntityModel;
