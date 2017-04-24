var moment = require('moment');
var models = require(__base + "Schema");
var q = require('q');
var Sequelize = require('sequelize');
var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var MarginModel = {

    GetAllMargin: function (Id) {
        logger.info('Start Fetching Margin');

        var deferred = q.defer();

        try {
            if (Id != null && Id != undefined) {
                sequelize.query('select DM.Id,DM.BU as SBUID,DM.ComponentType as ComponentId, DM.Region as RegionId, DM.Vendor as VendorId, SM.SBU as BU, CM.CountryName as Region,V.VendorName as Vendor,CT.ComponentType, DM.DefaultVal,DM.Level1,DM.Level2,DM.Level3 from TBL_MARGIN_MASTER DM inner join TBL_SBU_MASTER SM on DM.BU = SM.id inner join TBL_COUNTRY_MASTER CM on DM.Region = CM.Id inner join TBL_VendorList V on DM.Vendor = V.Id inner join TBL_COMPONENTTYPE_MASTER CT on DM.ComponentType = CT.Id where DM.Id = :Id',
                    {
                        replacements: { Id: Id },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (response) {
                        console.log('success');
                        deferred.resolve(response);
                    }).error(function (err) {
                        console.log('failure: ' + err);
                        deferred.reject(err)
                    });
                //    models.Margin.findOne({ where: { Id: Id } })
                // .then(function (marg) { deferred.resolve(marg); })
                // .catch(function (err) { logger.error('Error occurred when getting Margin: ' + err); deferred.reject(err) });
            }
            else {
                sequelize.query('select DM.Id,DM.BU as SBUID,DM.ComponentType as ComponentId, DM.Region as RegionId, DM.Vendor as VendorId, SM.SBU as BU, CM.CountryName as Region,V.VendorName as Vendor,CT.ComponentType, DM.DefaultVal,DM.Level1,DM.Level2,DM.Level3 from TBL_MARGIN_MASTER DM inner join TBL_SBU_MASTER SM on DM.BU = SM.id inner join TBL_COUNTRY_MASTER CM on DM.Region = CM.Id inner join TBL_VendorList V on DM.Vendor = V.Id inner join TBL_COMPONENTTYPE_MASTER CT on DM.ComponentType = CT.Id',
                    {
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (response) {
                        console.log('success');
                        deferred.resolve(response);
                    }).error(function (err) {
                        console.log('failure: ' + err);
                        deferred.reject(err)
                    });
            }
            //     models.Margin.findAll().then(function (margs) {
            //     deferred.resolve(margs);
            // }).catch(function (err) { logger.error('Error occurred when getting all Margins: ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },


    GetMarginbyBU: function (BUId, RegionId) {
        logger.info('Start Fetching the GetMarginbyBU***');
        var deferred = q.defer();
        try {
            models.Margin.findAll({ where: { BU: BUId, Region: RegionId }, raw: true })
                .then(function (opp) {
                    logger.info('In margin tehne')
                    if (opp != null && opp.length > 0) {
                        logger.info('In margin if part')
                        deferred.resolve(opp);
                    }
                    else {
                        logger.info('In margin else part')
                        sequelize.query('SELECT top 1 Id FROM [TBL_COUNTRY_MASTER] where SBUId=:SBUId  and [CountryName] =:RegionId',
                            {
                                replacements: {
                                    SBUId: BUId,
                                    RegionId: 'OTHER'
                                },
                                type: sequelize.QueryTypes.SELECT
                            }).then(function (response) {
                                if (response != null && response.length > 0) {
                                    logger.info('got record for default margin')
                                    models.Margin.findAll({ where: { BU: BUId, Region: response[0].Id } })
                                        .then(function (opp) {
                                            deferred.resolve(opp);
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
                }).error(function (err) {
                    logger.info('failure: ' + err);
                    deferred.reject(err)
                }).catch(function (err) { logger.error('GetMarginbyBU errorrrrrrrr' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    AddMargin: function (marg) {
        logger.info('Adding Margin');
        var deferred = q.defer();
        try {
            models.Margin.findAndCountAll({
                where: {
                    BU: marg.SBUID,
                    Region: marg.CountryId,
                    Vendor: marg.VendorId,
                    ComponentType: marg.ComponentId
                }
            }).then(function (result) {
                if (result.count > 0) {
                    var data = { Error: '' };
                    data.Error = "Margin already exists for this configuration";
                    deferred.reject(data);
                }
                else {
                    models.Margin.create({
                        BU: marg.SBUID,
                        Region: marg.CountryId,
                        Vendor: marg.VendorId,
                        ComponentType: marg.ComponentId,
                        DefaultVal: marg.DefaultVal,
                        Level1: marg.Level1,
                        Level2: marg.Level2,
                        Level3: marg.Level3,
                    }).then(function (Margin) {
                        deferred.resolve(Margin);
                    }).catch(function (err) { logger.error('Error occurred when adding Margin' + err); deferred.reject(err); });
                }
            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    ModifyMargin: function (marg) {
        var deferred = q.defer();
        try {
            models.Margin.update({
                DefaultVal: marg.DefaultVal,
                Level1: marg.Level1,
                Level2: marg.Level2,
                Level3: marg.Level3
            }, { where: { Id: marg.Id } }).then(function (Margin) {
                deferred.resolve(Margin);
            }).catch(function (err) { logger.error('Error occurred when modifying Margin' + err); deferred.reject(err); });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    DeleteMargin: function (Id) {
        var deferred = q.defer();
        try {
            logger.info('Deleting Margin');
            models.Margin.destroy({ where: { Id: Id }, truncate: false })
                .then(function (marg) {
                    deferred.resolve(marg);
                    logger.info('Deleting Margin success');
                }).catch(function (error) {
                    logger.error('Error occurred when deleting Margin: ' + error);
                    deferred.reject(error);
                });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    }
}

module.exports.MarginModel = MarginModel;