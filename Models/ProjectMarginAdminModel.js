var q = require('q');
var Sequelize = require('sequelize');
var moment = require('moment');
var models = require(__base + "Schema");


var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var ProjectMarginAdminModel = {

    GetAllProjectMarginAdmin: function (Id) {
        logger.info('Start Fetching ProjectMarginAdmin');
        var deferred = q.defer();
        try {
            if (Id != null && Id != undefined) {
                sequelize.query('select DM.Id,DM.BU as SBUID,DM.LOBType as LOBId, DM.Region as RegionId, DM.Vendor as VendorId, SM.SBU as BU, CM.CountryName as Region,V.VendorName as Vendor,CT.LOBName, DM.DefaultVal,DM.Level1,DM.Level2,DM.Level3 from TBL_ProjectMarginAdmin_MASTER DM inner join TBL_SBU_MASTER SM on DM.BU = SM.id inner join TBL_COUNTRY_MASTER CM on DM.Region = CM.Id inner join TBL_VendorList V on DM.Vendor = V.Id inner join TBL_LOBList CT on DM.LOBType = CT.Id where DM.Id = :Id',
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
                sequelize.query('select DM.Id,DM.BU as SBUID,DM.LOBType as LOBId, DM.Region as RegionId, DM.Vendor as VendorId, SM.SBU as BU, CM.CountryName as Region,V.VendorName as Vendor,CT.LOBName, DM.DefaultVal,DM.Level1,DM.Level2,DM.Level3 from TBL_ProjectMarginAdmin_MASTER DM inner join TBL_SBU_MASTER SM on DM.BU = SM.id inner join TBL_COUNTRY_MASTER CM on DM.Region = CM.Id inner join TBL_VendorList V on DM.Vendor = V.Id inner join TBL_LOBList CT on DM.LOBType = CT.Id',
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

    GetProjectMarginAdminbyBU: function (BUId, RegionId) {
        logger.info('Start Fetching the GetProjectMarginAdminbyBU***');
        var deferred = q.defer();
        try {
            models.ProjectMarginAdmin.findAll({ where: { BU: BUId, Region: RegionId }, raw: true })
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

                                    models.ProjectMarginAdmin.findAll({ where: { BU: BUId, Region: response[0].Id } })
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
                }).catch(function (err) { logger.error('GetProjectMarginAdminbyBU error' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    AddProjectMarginAdmin: function (disc) {
        logger.info('Adding ProjectMarginAdmin');
        var deferred = q.defer();
        try {
            models.ProjectMarginAdmin.findAndCountAll({
                where: {
                    BU: disc.SBUID,
                    Region: disc.CountryId,
                    Vendor: disc.VendorId,
                    LOBType: disc.LOBId
                }
            }).then(function (result) {
                if (result.count > 0) {
                    var data = { Error: '' };
                    data.Error = "ProjectMarginAdmin already exists for this configuration";
                    deferred.reject(data);
                }
                else {
                    models.ProjectMarginAdmin.create({
                        BU: disc.SBUID,
                        Region: disc.CountryId,
                        Vendor: disc.VendorId,
                        LOBType: disc.LOBId,
                        DefaultVal: disc.DefaultVal,
                        Level1: disc.Level1,
                        Level2: disc.Level2,
                        Level3: disc.Level3,
                    }).then(function (ProjectMarginAdmin) {
                        deferred.resolve(ProjectMarginAdmin);
                    }).catch(function (err) { logger.error('Error occurred when adding ProjectMarginAdmin' + err); deferred.reject(err); });
                }
            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    ModifyProjectMarginAdmin: function (disc) {
        var deferred = q.defer();
        try {
            models.ProjectMarginAdmin.update({
                DefaultVal: disc.DefaultVal,
                Level1: disc.Level1,
                Level2: disc.Level2,
                Level3: disc.Level3
            }, { where: { Id: disc.Id } }).then(function (ProjectMarginAdmin) {
                deferred.resolve(ProjectMarginAdmin);
            }).catch(function (err) { logger.error('Error occurred when modifying ProjectMarginAdmin' + err); deferred.reject(err); });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    DeleteProjectMarginAdmin: function (Id) {
        var deferred = q.defer();
        try {
            logger.info('Deleting ProjectMarginAdmin');
            models.ProjectMarginAdmin.destroy({ where: { Id: Id }, truncate: false })
                .then(function (disc) {
                    deferred.resolve(disc);
                    logger.info('Deleting ProjectMarginAdmin success');
                }).catch(function (error) {
                    logger.error('Error occurred when deleting ProjectMarginAdmin: ' + error);
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

module.exports.ProjectMarginAdminModel = ProjectMarginAdminModel;