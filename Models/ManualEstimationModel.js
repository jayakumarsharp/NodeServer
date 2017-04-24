var q = require('q');
var Sequelize = require('sequelize');
var moment = require('moment');
var models = require(__base + "Schema");
var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var ManualEstimationModel = {

    //Get PricesheetbyOppId
    GetManualEstimation: function (GroupId) {
        var deferred = q.defer();
        try {
            logger.info('Manual Estimation called')
            if (GroupId != null && GroupId != undefined) {

                sequelize.query('select Id,RowNo,OppId,TypeId,MM.TaskName as Description,REQ,Design,DevTest,SysTest,IMPL,UAT,PROD,TRAIN,MANUAL,OH,SQA,GroupId from  dbo.TBL_ManualEstimation M join TBL_ManualEstimationType_MASTER MM on M.TypeId=MM.ManualEstimationTypeId where GroupId=:GroupId', { replacements: { GroupId: GroupId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
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
            logger.info('logginh  for  IncreaseAdditionalTimeToSheet' + GroupId)
            var curentdate = moment().format("YYYY-MM-DD HH:mm:ss");
            var localTime = moment.utc(curentdate).toDate();
            localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

            models.OppApplicationMap.findAll({ where: { ApplicationId: GroupId } })
                .then(function (opp) {
                    if (opp.length > 0) {
                        logger.info("sheet already hold by " + opp[0].LockedUser);
                        if (opp[0].LockedUser == username || opp[0].LockedUser == '') {
                            logger.info("Increasing time");
                            models.OppApplicationMap.update({
                                IsLocked: true,
                                LockedIn: LockedInApp,
                                LockedUser: username,
                                PSUpdatedBy: username,
                                LockStartTime: localTime
                            }, { where: { PriceSheetId: GroupId } }).then(function (result) {
                                deferred.resolve(result);
                            })
                        }
                        else {
                            var data = { Error: '' };
                            data.Error = "Unable to Increase time user already holding " + opp[0].LockedUser;
                            logger.info('Unable to increase time, sheet got released')
                            deferred.reject(data);
                        }
                    }
                    else {
                        var data = { Error: '' };
                        data.Error = "Unable to Increase time";
                        logger.info('Unable to increase time, sheet got released')
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

    LocktheSheetByGroupid: function (OppId, GroupId, username, LockedInApp) {
        logger.info('Groupid' + GroupId + ' : nmae' + username)
        var deferred = q.defer();
        try {
            var curentdate = moment().format("YYYY-MM-DD HH:mm:ss");
            var localTime = moment.utc(curentdate).toDate();
            localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
            console.log('GroupId' + GroupId);
            models.OppApplicationMap.findAll({ where: { ApplicationId: GroupId, OppId: OppId } })
                .then(function (opp) {
                    if (opp.length > 0) {
                        if (opp[0].IsLocked && opp[0].LockedUser != username) {
                            logger.info('locked by' + opp[0].LockedUser)
                            deferred.resolve(opp[0]);
                        }
                        else {
                            if (opp[0].LockedIn == LockedInApp || opp[0].LockedIn == '' || opp[0].LockedIn == null) {
                                logger.info('in esle :' + opp[0].LockedIn + ' pas' + LockedInApp)
                                models.OppApplicationMap.update({
                                    IsLocked: true,
                                    LockedIn: LockedInApp,
                                    LockedUser: username,
                                    LockStartTime: localTime
                                }, { where: { ApplicationId: GroupId } }).then(function () {
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
                        //temporarly initiating version and mapping for sheet
                        logger.info('temporarly initiating version and mapping for sheet')
                        models.OppApplicationMap.findAll({ where: { OppId: OppId, SheetName: 'ManualEstimationSheet' } })
                            .then(function (opp) {
                                if (opp.length > 0) {
                                    //logger.info('already version available')
                                    //var data = { Error: '' };
                                    //data.Error = "Unable to Create Version. Please Logout and try again";
                                    //logger.info('Unable to Create Version. Please Logout and try again')
                                    deferred.resolve(opp[opp.length - 1]);
                                }
                                else {

                                    logger.info('new version is mapped ')
                                    models.sequelize.transaction().then(function (t) {
                                        if (t != null && t != undefined) {

                                            models.ManualEstimation.create({ OppId: OppId, GroupId: GroupId }, { transaction: t }).then(function () {

                                                logger.info('Added Pricing in table')
                                                models.OppApplicationMap.create({
                                                    OppId: OppId,
                                                    ApplicationId: GroupId,
                                                    Version: 'Ver_0.1',
                                                    IsLocked: true,
                                                    IsEditable: true,
                                                    LockedIn: 'ManualEstimationSheet',
                                                    SheetName: 'ManualEstimationSheet',
                                                    LockedUser: username,
                                                    LockStartTime: localTime,
                                                    CreatedBy: username,
                                                    NumberOfApplication: 2
                                                }, { transaction: t }).then(function (objpriceversion) {
                                                    t.commit();
                                                    logger.info('Added PricingMap in table')
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

    FinisdAnyVersionAvailable: function (oppId) {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT  COUNT(1) as count FROM TBL_OppApplicationMap where OppId=:oppid', { replacements: { oppid: oppId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
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
            models.OppApplicationMap.findAll({ where: { OppId: oppId, SheetName: sheet } })
                .then(function (comp) { deferred.resolve(comp); })
                .catch(function (err) { logger.info('GetAllComponentType ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },


    GetMaximumGroupManualEstimationId: function () {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT  max(ApplicationId) as count FROM TBL_EstimationOppMapping', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
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


    AddManualEstimation: function (EstimationModel) {
        var deferred = q.defer();
        try {

            models.sequelize.transaction().then(function (t) {
                if (t != null && t != undefined) {
                    if (EstimationModel.IsSaveAs) {
                        models.OppApplicationMap.findAll({ where: { OppId: EstimationModel.OppId, SheetName: 'ManualEstimationSheet' } })
                            .then(function (opp) {
                                if (opp.length > 0) {

                                    if (opp[0].LockedUser == EstimationModel.Authour) {

                                        sequelize.query('update TBL_EstimationOppMapping set IsEditable=0,LockedIn=NULL,LockedUser=NULL,LockStartTime=NULL where OppId = :id and SheetName=:sheetname', { replacements: { id: EstimationModel.OppId, sheetname: "ManualEstimationSheet" }, type: sequelize.QueryTypes.SELECT, transaction: t })
                                            .then(function () {
                                                models.OppApplicationMap.create({
                                                    OppId: EstimationModel.OppId, ApplicationId: EstimationModel.ApplicationId, Version: EstimationModel.Version, IsEditable: EstimationModel.IsReadOnly, CreatedBy: EstimationModel.Authour, Comment: EstimationModel.Comment, LockedIn: '', NumberOfApplication: EstimationModel.NumberofApp, SheetName: 'ManualEstimationSheet'
                                                }, { transaction: t })
                                                    .then(function () {

                                                        Addinternalcall(EstimationModel, t, deferred);

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
                                        logger.info('sheet is locked by someone' + opp[0].LockedUser)
                                        deferred.reject(data);
                                    }
                                }
                                else {
                                    var data = { Error: '' };
                                    data.Error = "Unable to save.Sheet is not available ";
                                    logger.info('Sheet is not available ')
                                    deferred.reject(data);
                                }

                            }).catch(function (err) { logger.info('LocktheSheetByGroupid ' + err); deferred.reject(err) });
                    }
                    else {
                        models.OppApplicationMap.update({
                            OppId: EstimationModel.OppId, Comment: EstimationModel.Comment, IsLocked: false, LockedUser: '', LockStartTime: null,
                            LockedIn: '', NumberOfApplication: EstimationModel.NumberofApp
                        }, { where: { ApplicationId: EstimationModel.ApplicationId } }, { transaction: t })
                            .then(function () {
                                models.ManualEstimation.destroy({ where: { GroupId: EstimationModel.ApplicationId }, truncate: false }, { transaction: t })
                                    .then(function () {
                                        Addinternalcall(EstimationModel, t, deferred);
                                    })
                                    .catch(function (Error) {
                                        t.rollback();
                                        deferred.reject(Error);
                                    })
                            }).catch(function (Error) {
                                t.rollback();
                                deferred.reject(Error);
                            })
                    }
                }
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


    AddManualEstimationNewVersion: function (EstimationModel) {
        var deferred = q.defer();
        try {

            models.sequelize.transaction().then(function (t) {

                models.OppApplicationMap.findAll({ where: { OppId: EstimationModel.OppId } })
                    .then(function (opp) {
                        if (opp.length > 0) {

                            //   if (opp[0].LockedUser == EstimationModel.Authour) {

                            models.OppApplicationMap.create({
                                OppId: EstimationModel.OppId, ApplicationId: EstimationModel.ApplicationId, Version: EstimationModel.Version, IsEditable: EstimationModel.IsReadOnly, CreatedBy: EstimationModel.Authour, Comment: EstimationModel.Comment, LockedIn: '', NumberOfApplication: EstimationModel.NumberofApp, SheetName: 'ManualEstimationSheet', IsInitial: true
                            }, { transaction: t })
                                .then(function () {
                                    sequelize.query('insert into [TBL_ManualEstimation](RowNo,[OppId],[Description],[TypeId],[REQ],[Design],[DevTest],[SysTest],[IMPL],[UAT],[PROD],[TRAIN],[MANUAL],[OH],[SQA],[GroupId] )SELECT RowNo,[OppId],[Description],[TypeId],[REQ],[Design],[DevTest],[SysTest],[IMPL],[UAT],[PROD],[TRAIN],[MANUAL],[OH],[SQA],:groupid FROM [TBL_ManualEstimation] where GroupId =:oldid', { replacements: { oldid: EstimationModel.ExisitingPriceGroupId, groupid: EstimationModel.ApplicationId }, type: sequelize.QueryTypes.SELECT, transaction: t })
                                        .then(function () {
                                            t.commit();
                                            deferred.resolve(EstimationModel);
                                        }).catch(function (err) {
                                            logger.info('fail' + err);
                                            t.rollback();
                                            deferred.reject(err);
                                        });

                                }).catch(function (err) {
                                    logger.info('fail' + err);
                                    t.rollback();
                                    deferred.reject(err);
                                });

                            // }
                            // else {
                            //     var data = { Error: '' };
                            //     data.Error = "Unable to save. Sheet is locked by" + opp[0].LockedUser;
                            //     logger.info('sheet is locked by someone' + opp[0].LockedUser)
                            //     deferred.reject(data);
                            // }
                        }
                        else {
                            var data = { Error: '' };
                            data.Error = "Unable to save.Sheet is not available ";
                            logger.info('Sheet is not available ')
                            deferred.reject(data);
                        }

                    }).catch(function (err) { logger.info('LocktheSheetByGroupid ' + err); deferred.reject(err) });

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


    GetAllManualEstimationbyOppGroupID: function (oppId, ApplicationId) {
        var deferred = q.defer();
        try {

            sequelize.query('SELECT M.[Id],RowNo,[OppId],[Description],[TypeId],MM.TaskName as Type,[REQ],[Design],[DevTest],[SysTest],[IMPL],[UAT],[PROD],[TRAIN],[MANUAL],[OH],[SQA],[GroupId] FROM  [TBL_ManualEstimation] M join  TBL_ManualEstimationType_MASTER MM on M.TypeId=MM.ManualEstimationTypeId where M.GroupId =:groupid', { replacements: { groupid: ApplicationId }, type: sequelize.QueryTypes.SELECT })
                .then(function (pricesheet) {
                    deferred.resolve(pricesheet);

                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    ReleaseSheetWhenExpired: function (GroupId) {
        var deferred = q.defer();
        try {
            if (GroupId != null && GroupId != '') {
                logger.info('logged for manual release' + GroupId)
                models.OppApplicationMap.update({
                    IsLocked: false,
                    LockedUser: '',
                    LockedIn: '',
                    LockStartTime: null
                }, { where: { ApplicationId: GroupId } }).then(function (result) {
                    deferred.resolve(result);
                })
            }
            else {
                sequelize.query('sp_ReleaseAllExpiredsheet', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                    logger.info('success');
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('failure: ' + err);
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


}

module.exports.ManualEstimationModel = ManualEstimationModel;


function Addinternalcall(ApplicationModel, t, deferred) {
    try {

        if (t != null && t != undefined) {

            models.ManualEstimation.bulkCreate(ApplicationModel.ManualEstimationSheet, { transaction: t }, { omitNull: true }).then(function () {
                t.commit();

                models.OppApplicationMap.findAll({ where: { ApplicationId: ApplicationModel.ApplicationId } })
                    .then(function (opp) {
                        deferred.resolve(opp[0]);
                    }).catch(function (err) {
                        logger.info('unable to get ' + err);
                        deferred.reject(err);
                    });

            }).catch(function (Error) {
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