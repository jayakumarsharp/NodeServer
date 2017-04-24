var q = require('q');
var Sequelize = require('sequelize');
var moment = require('moment');
var models = require(__base + "Schema");


var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var EstimationSDLCResourceModel = {


    GetAllEstimationSDLCResourcebyFilter: function (sbu, region, oem, infra, upgrade, app, complexity) {

        var deferred = q.defer();
        try {

            sequelize.query('SELECT  * from TBL_SDLCResourceDistribution where  SBU= :sbu and Region= :region and OEM= :oem and  Infra=:infra and Apps=:app  and Upgrade=:upgrade and Complexity = :complexity',
                { replacements: { sbu: sbu, region: region, oem: oem, infra: infra, upgrade: upgrade, app: app, complexity: complexity }, type: sequelize.QueryTypes.SELECT }).then(function (response) {

                    if (response != null && response.length > 0) {
                        deferred.resolve(response);
                    }
                    else {
                        sequelize.query('SELECT  * from TBL_SDLCResourceDistribution where  SBU= :sbu and Region= :region and OEM= :oem and  Infra=:infra and Apps=:app  and Upgrade=:upgrade and Complexity = :complexity',
                            { replacements: { sbu: sbu, region: region, oem: oem, infra: infra, upgrade: upgrade, app: app, complexity: 'Simple' }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                                deferred.resolve(response);
                            }).error(function (err) {
                                logger.info('fail' + err);
                                deferred.reject(err)
                            });

                    }
                }).error(function (err) {
                    logger.info('fail' + err);
                    deferred.reject(err)
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    GetAllEstimationSDLCResource: function () {

        var deferred = q.defer();
        try {
            sequelize.query('SELECT SM.SBU as SBUName,CM.CountryName,O.OEMName,M.SBU,[Region],[OEM],[Infra],[Apps],[Upgrade],[Complexity],[REQ] ,[Design],[DevTest],[SysTest],[IMPL],[UAT],[PROD],[Train],[Manual],[OH],[SQA],[PM],[CE] ,[description]FROM [TBL_SDLCResourceDistribution] M inner join TBL_SBU_MASTER SM on M.SBU = SM.id inner join TBL_COUNTRY_MASTER CM on CM.SBUId= M.SBU and CM.Id=M.Region inner join TBL_OEMList O on O.Id=M.OEM').then(function (response) {
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    AddEstimationSDLCResource: function (disc) {
        logger.info('Adding SDLC Percentage');
        var deferred = q.defer();
        try {
            models.EstimationSDLCResource.destroy({ truncate: true }).then(function () {
                models.EstimationSDLCResource.bulkCreate(disc).then(function () {
                    deferred.resolve('Success');
                }).catch(function (err) { logger.error('Error occurred when adding SDLC Percentage' + err); deferred.reject(err); });

            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    }
}

module.exports.EstimationSDLCResourceModel = EstimationSDLCResourceModel;