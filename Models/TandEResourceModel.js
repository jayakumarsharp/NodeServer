var q = require('q');
var Sequelize = require('sequelize');
var moment = require('moment');
var models = require(__base + "Schema");
var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var TandEResourceModel = {

    //Get PricesheetbyOppId
    GetTandEResource: function (oppId) {
        var deferred = q.defer();
        try {
            logger.info('Get T and E called for oppid: ' + oppId);
            if (oppId != null && oppId != undefined) {
                sequelize.query('select * from  dbo.TBL_TandEResource where OppId=:oppid', { replacements: { oppid: oppId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
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

    GetMaximumGroupTandEResourceId: function () {
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

    AddTandEResource: function (TandEResourceModel) {
        var deferred = q.defer();
        try {
            logger.info('TandEResourceModel: ' + JSON.stringify(TandEResourceModel));
            models.sequelize.transaction().then(function (t) {
                if (t != null && t != undefined) {
                    logger.info('AddTandEResource: Updating OppAppMap table..');
                    models.PriceVersionMap.update({
                        OppId: TandEResourceModel.OppId, Comment: TandEResourceModel.Comment, IsLocked: false, LockedUser: '', LockStartTime: null,
                        LockedIn: ''
                    }, { where: { PriceSheetId: TandEResourceModel.ApplicationId } }, { transaction: t })
                        .then(function () {
                            logger.info('AddTandEResource: OppAppMap updated');
                            models.TandEResource.destroy({ where: { GroupId: TandEResourceModel.ApplicationId }, truncate: false }, { transaction: t })
                                .then(function () {
                                    logger.info('AddTandEResource: Deleted existed groupid from TandEResource successfully');
                                    Addinternalcall(TandEResourceModel, t, deferred);
                                })
                                .catch(function (Error) {
                                    t.rollback();
                                    logger.info('AddTandEResource: error1' + Error);
                                    deferred.reject(Error);
                                })
                        }).catch(function (Error) {
                            t.rollback();
                            logger.info('AddTandEResource: error2' + Error);
                            deferred.reject(Error);
                        })
                }
            }).catch(function (err) {
                logger.info('AddTandEResource: error3' + err);
                deferred.reject(err);
            })
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    AddTandEResourceNewVersion: function (TandEResourceModel) {
        var deferred = q.defer();
        try {
            logger.info('Inside AddTandEResourceNewVersion');
            models.sequelize.transaction().then(function (t) {
                models.PriceVersionMap.findAll({ where: { OppId: TandEResourceModel.OppId } })
                    .then(function (opp) {
                        if (opp.length > 0) {
                            if (opp[0].LockedUser == TandEResourceModel.Author) {
                                sequelize.query('update TBL_EstimationOppMapping set IsEditable=0 where OppId = :id ', { replacements: { id: TandEResourceModel.OppId }, type: sequelize.QueryTypes.SELECT, transaction: t })
                                    .then(function () {
                                        models.PriceVersionMap.create({
                                            OppId: TandEResourceModel.OppId, PriceSheetId: TandEResourceModel.AppId, Version: TandEResourceModel.Version, IsEditable: TandEResourceModel.IsEditable, CreatedBy: TandEResourceModel.Author, Comment: TandEResourceModel.Comment, LockedIn: '',  SheetName: 'TandEResourceSheet', IsLocked: false, LockedUser: '', LockStartTime: null
                                        }, { transaction: t })
                                            .then(function () {
                                                Addinternalcall(TandEResourceModel, t, deferred);
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
                                logger.info('TandEResource sheet is locked by ' + opp[0].LockedUser)
                                deferred.reject(data);
                            }
                        }
                        else {
                            var data = { Error: '' };
                            data.Error = "Unable to save.Sheet is not available ";
                            logger.info('Sheet is not available ')
                            deferred.reject(data);
                        }

                    }).catch(function (err) { logger.info('AddTandEResourceNewVersion ' + err); deferred.reject(err) });

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
                                                    LockedIn: 'TandEResourceSheet',
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

    GetAllTandEResourcebyOppGroupID: function (oppId, groupId) {
        var deferred = q.defer();
        try {
            logger.info('Getting all T & E by opp id ' + oppId + ' and group id ' + groupId);
            var query = 'SELECT * FROM [TBL_TandEResource] where GroupId = :groupid and OppId = :oppid and RowNo is not null';
            logger.info(query);
            sequelize.query(query,
                { replacements: { oppid: oppId, groupid: groupId }, type: sequelize.QueryTypes.SELECT })
                .then(function (resSheet) {
                    logger.info('TandEResource Result: ' + JSON.stringify(resSheet));
                    logger.info('Fetched TandEResource by group id successfully');
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

module.exports.TandEResourceModel = TandEResourceModel;

function Addinternalcall(TandEResourceModel, t, deferred) {
    try {

        if (t != null && t != undefined) {
            logger.info('TandEResource to bulkCreate: ' + JSON.stringify(TandEResourceModel));
            models.TandEResource.bulkCreate(TandEResourceModel.TandEResourceSheet, { transaction: t }, { omitNull: true }).then(function () {
                t.commit();
                logger.info('TandEResource bulk created successfully');
                models.PriceVersionMap.findAll({ where: { PriceSheetId: TandEResourceModel.ApplicationId } })
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