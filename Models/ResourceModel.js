var q = require('q');
var Sequelize = require('sequelize');
var moment = require('moment');
var models = require(__base + "Schema");
var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var ResourceModel = {

    //Get PricesheetbyOppId
    GetResource: function (oppId) {
        var deferred = q.defer();
        try {
            logger.info('Manual Estimation called')
            if (oppId != null && oppId != undefined) {

                sequelize.query('select Id,RowNo,OppId,TypeId,MM.TaskName as Description,REQ,Design,DevTest,SysTest,IMPL,UAT,PROD,TRAIN,MANUAL,OH,SQA,GroupId from  dbo.TBL_Resource M join TBL_ResourceType_MASTER MM on M.TypeId=MM.ResourceTypeId where OppId=:oppid', { replacements: { oppid: oppId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('fail' + err);
                    deferred.reject(err)
                });


            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },


    IncreaseAdditionalTimeToSheet: function (GroupId, username, LockedInApp) {
        var deferred = q.defer();
        try {
            logger.info('log  for  IncreaseAdditionalTimeToSheet ' + GroupId)
            var curentdate = moment().format("YYYY-MM-DD HH:mm:ss");
            var localTime = moment.utc(curentdate).toDate();
            localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

            models.PriceVersionMap.findAll({ where: { PriceSheetId: GroupId } })
                .then(function (opp) {
                    if (opp.length > 0) {
                        logger.info("sheet already held by " + opp[0].LockedUser);
                        if (opp[0].LockedUser == username || opp[0].LockedUser == '') {
                            logger.info("Increasing time..");
                            models.PriceVersionMap.update({
                                IsLocked: true,
                                LockedIn: LockedInApp,
                                LockedUser: username,
                                PSUpdatedBy: username,
                                LockStartTime: localTime
                            }, { where: { PriceSheetId: GroupId } }).then(function (result) {
                                logger.info('Successfully increased time!');
                                deferred.resolve(result);
                            }).error(function (err) {
                                logger.info('Error occurred when increasing: ' + err);
                                deferred.reject(err)
                            });
                        }
                        else {
                            var data = { Error: '' };
                            data.Error = "Unable to Increase time user already holding " + opp[0].LockedUser;
                            logger.info('Unable to increase time, sheet got released');
                            deferred.reject(data);
                        }
                    }
                    else {
                        var data = { Error: '' };
                        data.Error = "Unable to Increase time";
                        logger.info('Unable to increase time, sheet got released');
                        deferred.reject(data);
                    }

                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    FinisdAnyVersionAvailable: function (oppId) {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT  COUNT(1) as count FROM TBL_PriceVersionMap where OppId=:oppid', { replacements: { oppid: oppId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
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


    GetAllVersionOpportunity: function (oppId, sheet) {
        var deferred = q.defer();
        try {
            models.PriceVersionMap.findAll({ where: { OppId: oppId, SheetName: sheet } })
                .then(function (comp) {
                    deferred.resolve(comp);
                })
                .catch(function (err) { logger.info('GetAllVersionOpportunity ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },


    GetMaximumGroupResourceId: function () {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT  max(groupId) as count FROM TBL_EstimationOppMapping', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },


    AddResource: function (ResourceModel) {
        var deferred = q.defer();
        try {
            logger.info('ResourceModel: ' + JSON.stringify(ResourceModel));
            models.sequelize.transaction().then(function (t) {
                if (t != null && t != undefined) {
                    logger.info('AddResource: Updating OppAppMap table..');
                    models.PriceVersionMap.update({
                        OppId: ResourceModel.OppId, Comment: ResourceModel.Comment, IsLocked: false, LockedUser: '', LockStartTime: null,
                        LockedIn: ''
                    }, { where: { PriceSheetId: ResourceModel.ApplicationId } }, { transaction: t })
                        .then(function () {
                            logger.info('AddResource: OppAppMap updated');
                            models.Resource.destroy({ where: { GroupId: ResourceModel.ApplicationId }, truncate: false }, { transaction: t })
                                .then(function () {
                                    logger.info('AddResource: Deleted existed groupid from Resource successfully');
                                    Addinternalcall(ResourceModel, t, deferred);
                                })
                                .catch(function (Error) {
                                    t.rollback();
                                    logger.info('AddResource: error1' + Error);
                                    deferred.reject(Error);
                                })
                        }).catch(function (Error) {
                            t.rollback();
                            logger.info('AddResource: error2' + Error);
                            deferred.reject(Error);
                        })
                }
            }).catch(function (err) {
                logger.info('AddResource: error3' + err);
                deferred.reject(err);
            })
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },


    AddResourceNewVersion: function (ResourceModel) {
        var deferred = q.defer();
        try {
            logger.info('Inside AddResourceNewVersion');
            models.sequelize.transaction().then(function (t) {
                models.PriceVersionMap.findAll({ where: { OppId: ResourceModel.OppId } })
                    .then(function (opp) {
                        if (opp.length > 0) {
                            if (opp[0].LockedUser == ResourceModel.Author) {
                                sequelize.query('update TBL_EstimationOppMapping set IsEditable=0 where OppId = :id ', { replacements: { id: ResourceModel.OppId }, type: sequelize.QueryTypes.SELECT, transaction: t })
                                    .then(function () {
                                        models.PriceVersionMap.create({
                                            OppId: ResourceModel.OppId, PriceSheetId: ResourceModel.AppId, Version: ResourceModel.Version, IsEditable: ResourceModel.IsEditable, CreatedBy: ResourceModel.Author, Comment: ResourceModel.Comment, LockedIn: '', SheetName: 'ResourceSheet',  IsLocked: false, LockedUser: '', LockStartTime: null
                                        }, { transaction: t })
                                            .then(function () {
                                                Addinternalcall(ResourceModel, t, deferred);
                                            }).catch(function (err) {
                                                logger.info('fail' + err);
                                                t.rollback();
                                                deferred.reject(err);
                                            });
                                    });
                            }
                            else {
                                var data = { Error: '' };
                                data.Error = "Unable to save. Sheet is locked by" + opp[0].LockedUser;
                                logger.info('Resource sheet is locked by ' + opp[0].LockedUser)
                                deferred.reject(data);
                            }
                        }
                        else {
                            var data = { Error: '' };
                            data.Error = "Unable to save.Sheet is not available ";
                            logger.info('Sheet is not available ')
                            deferred.reject(data);
                        }

                    }).catch(function (err) { logger.info('AddResourceNewVersion ' + err); deferred.reject(err) });

            }).catch(function (err) {

                deferred.reject(err);
            })
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    LocktheSheetByGroupid: function (OppId, GroupId, username, LockedInApp) {
        logger.info('Groupid ' + GroupId + ' : name ' + username)
        var deferred = q.defer();
        try {
            var curentdate = moment().format("YYYY-MM-DD HH:mm:ss");
            var localTime = moment.utc(curentdate).toDate();
            localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
            console.log('GroupId' + GroupId);

            models.PriceVersionMap.findAll({ where: { PriceSheetId: GroupId, OppId: OppId } })
                .then(function (opp) {
                    if (opp.length > 0) {
                        if (opp[0].IsLocked && opp[0].LockedUser != username) {
                            logger.info('locked by' + opp[0].LockedUser)
                            deferred.resolve(opp[0]);
                        }
                        else {
                            if (opp[0].LockedIn == LockedInApp || opp[0].LockedIn == '' || opp[0].LockedIn == null) {
                                logger.info('in esle :' + opp[0].LockedIn + ' pas' + LockedInApp)
                                models.PriceVersionMap.update({
                                    IsLocked: true,
                                    LockedIn: LockedInApp,
                                    LockedUser: username,
                                    LockStartTime: localTime
                                }, { where: { PriceSheetId: GroupId } }).then(function () {
                                    logger.info('Updated the Resource in OppAppMap table');
                                    deferred.resolve(opp[0]);
                                })
                            }
                            else {
                                logger.info('locked by' + opp[0].LockedUser)
                                deferred.resolve(opp[0]);
                            }
                        }
                    }
                    else {
                        logger.info('temporarly initiating version and mapping for sheet')
                        models.PriceVersionMap.findAll({ where: { OppId: OppId } })
                            .then(function (opp) {
                                if (opp.length > 0) {
                                    deferred.resolve(opp[opp.length - 1]);
                                }
                                else {

                                    logger.info('new version is mapped ')
                                    models.sequelize.transaction().then(function (t) {
                                        if (t != null && t != undefined) {

                                            models.Resource.create({ OppId: OppId, PriceSheetId: GroupId }, { transaction: t }).then(function () {

                                                logger.info('Added Pricing in table')
                                                models.PriceVersionMap.create({
                                                    OppId: OppId,
                                                    PriceSheetId: GroupId,
                                                    Version: 'Ver_0.1',
                                                    IsEditable: true,
                                                    IsLocked: true,
                                                    LockedIn: 'ResourceSheet',
                                                    IsPriceSheetUpdated: true,
                                                    LockedUser: username,
                                                    PSUpdatedBy: username,
                                                    LockStartTime: localTime,
                                                    CreatedBy: username


                                                }, { transaction: t }).then(function (objpriceversion) {
                                                    t.commit();
                                                    logger.info('Added Resource in table')
                                                    deferred.resolve(objpriceversion);
                                                });
                                            })
                                                .catch(function (passError) {
                                                    logger.info('PassError', passError);
                                                    t.rollback(); deferred.reject(passError);
                                                })
                                        }
                                    });

                                }
                            });
                    }
                })
                .catch(function (err) { logger.info('LocktheSheetByGroupid ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    GetAllResourcebyOppGroupID: function (oppId, groupId) {
        var deferred = q.defer();
        try {
            logger.info('Getting all resource by opp id ' + oppId + ' and group id ' + groupId);
            var query = 'SELECT * FROM [TBL_Resource] where GroupId = :groupid and OppId = :oppid and RowNo is not null';
            logger.info(query);
            sequelize.query(query,
                { replacements: { oppid: oppId, groupid: groupId }, type: sequelize.QueryTypes.SELECT })
                .then(function (resSheet) {
                    logger.info('Resource Result: ' + JSON.stringify(resSheet));
                    logger.info('Fetched Resource by group id successfully');
                    deferred.resolve(resSheet);
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    }
}

module.exports.ResourceModel = ResourceModel;


function Addinternalcall(ResourceModel, t, deferred) {
    try {

        if (t != null && t != undefined) {
            logger.info('Resource to bulkCreate: ' + JSON.stringify(ResourceModel));
            models.Resource.bulkCreate(ResourceModel.ResourceSheet, { transaction: t }, { omitNull: true }).then(function () {
                t.commit();
                logger.info('Resource bulk created successfully');
                models.PriceVersionMap.findAll({ where: { PriceSheetId: ResourceModel.ApplicationId } })
                    .then(function (opp) {
                        deferred.resolve(opp[0]);
                    }).catch(function (err) {
                        logger.info('unable to get ' + err);
                        deferred.reject(err);
                    });

            }).catch(function (Error) {
                logger.info('Error bulk creating: ' + Error);
                t.rollback();
                deferred.reject(Error);
            })
        }
    }
    catch (ex) {
        deferred.reject(ex);
        logger.info('error occured' + ex)
    }

}