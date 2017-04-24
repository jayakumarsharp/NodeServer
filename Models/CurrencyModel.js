var q = require('q');
var moment = require('moment');
var Sequelize = require('sequelize');
var models = require(__base + "Schema");
var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var CurrencyModel = {
    GetCurrencyConversionForPricing: function (ServionLegalEntityId, SBUId, CountryId, CurrencyId) {
        var deferred = q.defer();
        try {
            models.CurrencyConversion.findAll({
                where: {
                    // SBUId: SBUId,
                    // RegionId: CountryId,
                    CurrencyId: CurrencyId
                    // ServionLegalEntityId: ServionLegalEntityId,
                }
            }).then(function (user) {
                deferred.resolve(user);
            }).catch(function (err) { logger.info('Currency findone error' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetAllCurrencyConversion: function (Id) {
        var deferred = q.defer();
        try {
            if (Id != null && Id != undefined) {
                sequelize.query('select c.Id,CM.Currency,C.ConversionRate,CM.CurrencyDescrition, C.UpdatedBy, C.UpdatedOn from TBL_CURRENCY_CONVERSION_MASTER C inner join TBL_CURRENCY_MASTER CM on C.CurrencyId=CM.Id where c.id=:id', { replacements: { id: Id }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('fail' + err);
                    deferred.reject(err);
                });
            }
            else {
                sequelize.query('select c.Id,CM.Currency,C.ConversionRate, CM.CurrencyDescrition, C.UpdatedBy, C.UpdatedOn from TBL_CURRENCY_CONVERSION_MASTER C inner join TBL_CURRENCY_MASTER CM on C.CurrencyId=CM.Id', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('fail' + err);
                    deferred.reject(err);
                });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    AddCurrencyConversion: function (opp) {
        var deferred = q.defer();
        try {
            var curentdate = moment().format("YYYY-MM-DD HH:mm:ss");
            var createdDate = moment.utc(curentdate).toDate();
            createdDate = moment(createdDate).format('YYYY-MM-DD HH:mm:ss');

            models.CurrencyConversion.create({
                // SBUId: opp.SBUId,
                // RegionId: opp.RegionId,
                CurrencyId: opp.CurrencyId,
                // ServionLegalEntityId: opp.ServionLegalEntityId,
                ConversionRate: opp.ConversionRate,
                UpdatedOn: createdDate,
                UpdatedBy: opp.UpdatedBy
            }).then(function (user) {
                deferred.resolve(user);
            }).catch(function (err) { logger.info('FetchUser' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    ModifyCurrencyConversion: function (Opp) {
        logger.info('ModifyCurrencyConversion');
        var deferred = q.defer();

        var curentdate = moment().format("YYYY-MM-DD HH:mm:ss");
        var createdDate = moment.utc(curentdate).toDate();
        createdDate = moment(createdDate).format('YYYY-MM-DD HH:mm:ss');

        try {
            models.CurrencyConversion.update({
                ConversionRate: Opp.ConversionRate,
                UpdatedOn: createdDate,
                UpdatedBy: Opp.UpdatedBy
            }, { where: { Id: Opp.Id } }).then(function (user) {
                logger.info('Modified successfully');
                deferred.resolve(user);
            }).catch(function (err) { logger.info('Error occurred: ' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    DeleteCurrencyConversion: function (Id) {
        var deferred = q.defer();
        try {
            logger.info('Deleting CurrencyConversion');
            models.CurrencyConversion.destroy({ where: { Id: Id }, truncate: false })
                           .then(function (user) {
                               deferred.resolve(user);
                               logger.info('Deleting DeleteCurrencyConversion success');
                           }).catch(function (error) {
                               logger.info('Error occurred when deleting role');
                               deferred.reject(data);
                           });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetAllCurrency: function () {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT [Id] ,[Currency], [CurrencyDescrition] FROM [TBL_CURRENCY_MASTER]', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err);
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetCountrybySBU: function (Id) {
        var deferred = q.defer();
        try {
            models.Country.findAll({ where: { SBUId: Id } })
            .then(function (currency) { deferred.resolve(currency); })
            .catch(function (err) { logger.info('GetUser ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

}

module.exports.CurrencyModel = CurrencyModel;