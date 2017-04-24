var q = require('q');
var Sequelize = require('sequelize');
var moment = require('moment');
var models = require(__base + "Schema");


var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var DiscountModel = {

    GetAllDiscount: function (Id) {
        logger.info('Start Fetching Discount');
        var deferred = q.defer();
        try {
            if (Id != null && Id != undefined) {
                sequelize.query('select DM.Id,DM.BU as SBUID,DM.ComponentType as ComponentId, DM.Region as RegionId, DM.Vendor as VendorId, SM.SBU as BU, CM.CountryName as Region,V.VendorName as Vendor,CT.ComponentType, DM.DefaultVal,DM.Level1,DM.Level2,DM.Level3 from TBL_DISCOUNT_MASTER DM inner join TBL_SBU_MASTER SM on DM.BU = SM.id inner join TBL_COUNTRY_MASTER CM on DM.Region = CM.Id inner join TBL_VendorList V on DM.Vendor = V.Id inner join TBL_COMPONENTTYPE_MASTER CT on DM.ComponentType = CT.Id where DM.Id = :Id',
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
            }
            else {
                sequelize.query('select DM.Id,DM.BU as SBUID,DM.ComponentType as ComponentId, DM.Region as RegionId, DM.Vendor as VendorId, SM.SBU as BU, CM.CountryName as Region,V.VendorName as Vendor,CT.ComponentType, DM.DefaultVal,DM.Level1,DM.Level2,DM.Level3 from TBL_DISCOUNT_MASTER DM inner join TBL_SBU_MASTER SM on DM.BU = SM.id inner join TBL_COUNTRY_MASTER CM on DM.Region = CM.Id inner join TBL_VendorList V on DM.Vendor = V.Id inner join TBL_COMPONENTTYPE_MASTER CT on DM.ComponentType = CT.Id',
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
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetDiscountbyBU: function (BUId, RegionId) {
        logger.info('Start Fetching the GetDiscountbyBU***');
        var deferred = q.defer();
        try {
            models.Discount.findAll({ where: { BU: BUId, Region: RegionId }, raw: true })
                .then(function (opp) {
                    logger.info('In disc tehne')
                    if (opp != null && opp.length > 0) {
                        deferred.resolve(opp);
                    }
                    else {

                        sequelize.query('SELECT top 1 Id FROM [TBL_COUNTRY_MASTER] where SBUId=:SBUId  and [CountryName] =:RegionId',
                            {
                                replacements: {
                                    SBUId: BUId,
                                    RegionId: 'OTHER'
                                },
                                type: sequelize.QueryTypes.SELECT
                            }).then(function (response) {
                                if (response != null && response.length > 0) {

                                    models.Discount.findAll({ where: { BU: BUId, Region: response[0].Id } })
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
                }).catch(function (err) { logger.error('GetDiscountbyBU error' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    AddDiscount: function (disc) {
        logger.info('Adding Discount');
        var deferred = q.defer();
        try {
            models.Discount.findAndCountAll({
                where: {
                    BU: disc.SBUID,
                    Region: disc.CountryId,
                    Vendor: disc.VendorId,
                    ComponentType: disc.ComponentId
                }
            }).then(function (result) {
                if (result.count > 0) {
                    var data = { Error: '' };
                    data.Error = "Discount already exists for this configuration";
                    deferred.reject(data);
                }
                else {
                    models.Discount.create({
                        BU: disc.SBUID,
                        Region: disc.CountryId,
                        Vendor: disc.VendorId,
                        ComponentType: disc.ComponentId,
                        DefaultVal: disc.DefaultVal,
                        Level1: disc.Level1,
                        Level2: disc.Level2,
                        Level3: disc.Level3,
                    }).then(function (discount) {
                        deferred.resolve(discount);
                    }).catch(function (err) { logger.error('Error occurred when adding discount' + err); deferred.reject(err); });
                }
            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    ModifyDiscount: function (disc) {
        var deferred = q.defer();
        try {
            models.Discount.update({
                DefaultVal: disc.DefaultVal,
                Level1: disc.Level1,
                Level2: disc.Level2,
                Level3: disc.Level3
            }, { where: { Id: disc.Id } }).then(function (discount) {
                deferred.resolve(discount);
            }).catch(function (err) { logger.error('Error occurred when modifying discount' + err); deferred.reject(err); });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    DeleteDiscount: function (Id) {
        var deferred = q.defer();
        try {
            logger.info('Deleting Discount');
            models.Discount.destroy({ where: { Id: Id }, truncate: false })
                .then(function (disc) {
                    deferred.resolve(disc);
                    logger.info('Deleting Discount success');
                }).catch(function (error) {
                    logger.error('Error occurred when deleting discount: ' + error);
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

module.exports.DiscountModel = DiscountModel;