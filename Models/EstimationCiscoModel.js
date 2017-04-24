var path = require('path');
var q = require('q');
var Sequelize = require('sequelize');
var moment = require('moment');
var models = require(__base + "Schema");
var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var MSdbconfig = require(__base + "Config/MSSQLConfig")
var sql = require('mssql');
var EstimationCiscoModel = {

    //Get PricesheetbyOppId
    GetEstimationCisco: function (oppId) {
        var deferred = q.defer();
        try {
            logger.info('price sheet called')
            if (oppId != null && oppId != undefined) {
                models.EstimationCisco.findAll({ where: { OppId: oppId } })
                    .then(function (opp) { deferred.resolve(opp); })
                    .catch(function (err) { logger.info('GetOpportunity ' + err); deferred.reject(err) });
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
                        models.OppApplicationMap.findAll({ where: { OppId: OppId, SheetName: 'CiscoSheet' } })
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

                                            sequelize.query('insert into TBL_EstimationCisco (OppId,GroupType,Name,col1,col2,col3,Name1,Fcol1,Fcol2,Fcol3,Fcol4,Fcol5,Fcol6,RowId,GroupId) select :OppId,EM.GroupType,EM.Name,EM.col1,EM.col2,EM.col3,EM.Name1,EM.Fcol1,EM.Fcol2,EM.Fcol3,EM.Fcol4,EM.Fcol5,EM.Fcol6,EM.RowId,:groupid from TBL_EstimationCiscoMaster EM left outer join TBL_EstimationCisco EA on EM.RowId=EA.Rowid and (EA.GroupId = :groupid or EA.GroupId is null)', { replacements: { OppId: OppId, groupid: GroupId }, type: sequelize.QueryTypes.SELECT, transaction: t })
                                                .then(function () {
                                                    logger.info('Added Pricing in table')
                                                    models.OppApplicationMap.create({
                                                        OppId: OppId,
                                                        ApplicationId: GroupId,
                                                        Version: 'Ver_0.1',
                                                        IsLocked: true,
                                                        IsEditable: true,
                                                        LockedIn: 'CiscoSheet',
                                                        SheetName: 'CiscoSheet',
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


    GetMaximumGroupEstimationCiscoId: function () {
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


    AddEstimationCisco: function (EstimationModel) {
        var deferred = q.defer();
        try {

            models.sequelize.transaction().then(function (t) {
                if (t != null && t != undefined) {
                    if (EstimationModel.IsSaveAs) {
                        models.OppApplicationMap.findAll({ where: { OppId: EstimationModel.OppId, SheetName: 'CiscoSheet', IsEditable: true, IsLocked: true } })
                            .then(function (opp) {
                                if (opp.length > 0) {

                                    if (opp[0].LockedUser == EstimationModel.Authour) {

                                        sequelize.query('update TBL_EstimationOppMapping set IsEditable=0,IsLocked=0,LockedIn=NULL,LockedUser=NULL,LockStartTime=NULL where OppId = :id and SheetName=:sheetname', { replacements: { id: EstimationModel.OppId, sheetname: "CiscoSheet" }, type: sequelize.QueryTypes.SELECT, transaction: t })
                                            .then(function () {
                                                models.OppApplicationMap.create({
                                                    OppId: EstimationModel.OppId, ApplicationId: EstimationModel.ApplicationId, Version: EstimationModel.Version, IsEditable: EstimationModel.IsReadOnly, CreatedBy: EstimationModel.Authour, Comment: EstimationModel.Comment, LockedIn: '', NumberOfApplication: EstimationModel.NumberofApp, SheetName: 'CiscoSheet'
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

                        var filename = '';
                        // if (EstimationModel.Content != undefined && EstimationModel.Content != null && EstimationModel.Content.length > 0) {
                        //     var base64Data = EstimationModel.Content.replace(/^data:image\/png;base64,/, "");
                        //     filename = EstimationModel.OppId + new Date().getTime() + '.png';
                        //     var file = path.join('public', filename);

                        //     require("fs").writeFile(file, base64Data, 'base64', function (err) {
                        //         console.log(err);
                        //     });

                        // }

                        models.OppApplicationMap.update({
                            OppId: EstimationModel.OppId, Comment: EstimationModel.Comment, IsLocked: false, LockedUser: '', LockStartTime: null,
                            LockedIn: '', NumberOfApplication: EstimationModel.NumberofApp, IsInitial: false, Content: filename
                        }, { where: { ApplicationId: EstimationModel.ApplicationId } }, { transaction: t })
                            .then(function () {
                                models.EstimationCisco.destroy({ where: { GroupId: EstimationModel.ApplicationId }, truncate: false }, { transaction: t })
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


    AddEstimationCiscoNewVersion: function (EstimationModel) {
        var deferred = q.defer();
        try {

            models.sequelize.transaction().then(function (t) {

                models.OppApplicationMap.findAll({ where: { OppId: EstimationModel.OppId } })
                    .then(function (opp) {
                        if (opp.length > 0) {

                            //   if (opp[0].LockedUser == EstimationModel.Authour) {

                            models.OppApplicationMap.create({
                                OppId: EstimationModel.OppId, ApplicationId: EstimationModel.ApplicationId, Version: EstimationModel.Version, IsEditable: EstimationModel.IsReadOnly, CreatedBy: EstimationModel.Authour, Comment: EstimationModel.Comment, LockedIn: '', NumberOfApplication: EstimationModel.NumberofApp, SheetName: 'CiscoSheet', IsInitial: true
                            }, { transaction: t })
                                .then(function () {
                                    sequelize.query('insert into TBL_EstimationCisco (OppId,GroupType,Name,col1,col2,col3,Name1,Fcol1,Fcol2,Fcol3,Fcol4,Fcol5,Fcol6,RowId,A1col1,A1col2,A1col3,A1Fcol1,A1Fcol2,A1Fcol3,A1Fcol4,A1Fcol5,A1Fcol6,GroupId) select EA.OppId,EM.GroupType,EM.Name,EM.col1,EM.col2,EM.col3,EM.Name1,EM.Fcol1,EM.Fcol2,EM.Fcol3,EM.Fcol4,EM.Fcol5,EM.Fcol6,EM.RowId,A1col1,A1col2,A1col3,A1Fcol1,A1Fcol2,A1Fcol3,A1Fcol4,A1Fcol5,A1Fcol6,:groupid from TBL_EstimationCiscoMaster EM left outer join TBL_EstimationCisco EA on EM.RowId=EA.Rowid  and (EA.GroupId = :oldid or EA.GroupId is null)', { replacements: { oldid: EstimationModel.ExisitingPriceGroupId, groupid: EstimationModel.ApplicationId }, type: sequelize.QueryTypes.SELECT, transaction: t })
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


    GetAllEstimationCiscobyOppGroupID: function (oppId, ApplicationId) {
        var deferred = q.defer();
        try {

            models.OppApplicationMap.findAll({ where: { ApplicationId: ApplicationId } })
                .then(function (opp) {
                    if (opp.length > 0) {
                        if (opp[0].IsEditable) {
                            sequelize.query('SELECT EC.[Id],[OppId],ECM.[GroupType],ECM.[Name],ECM.[col1],ECM.[col2],ECM.[col3],ECM.[Name1],ECM.[Fcol1],ECM.[Fcol2],ECM.[Fcol3],ECM.[Fcol4],ECM.[Fcol5],ECM.[Fcol6],ECM.[RowId],[A1col1],[A1col2],[A1col3],[A1Fcol1],[A1Fcol2],[A1Fcol3],[A1Fcol4],[A1Fcol5],[A1Fcol6],[GroupId]  FROM TBL_EstimationCiscoMaster ECM left outer join [dbo].[TBL_EstimationCisco] EC   on EC.RowId=ECM.RowId where GroupId= :groupid or GroupId is null', { replacements: { groupid: ApplicationId }, type: sequelize.QueryTypes.SELECT })
                                .then(function (result) {
                                    deferred.resolve(result);
                                }).catch(function (err) {
                                    logger.info('fail' + err);
                                    deferred.reject(err);
                                });


                        }
                        else {

                            models.EstimationCisco.findAll({ where: { GroupId: ApplicationId } })
                                .then(function (pricesheet) {
                                    deferred.resolve(pricesheet);

                                });

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

module.exports.EstimationCiscoModel = EstimationCiscoModel;


function Addinternalcall(ApplicationModel, t, deferred) {
    try {

        if (t != null && t != undefined) {

            models.EstimationCisco.bulkCreate(ApplicationModel.CiscoSheet, { transaction: t }, { omitNull: true }).then(function () {
                t.commit();
                if (ApplicationModel.IsSaveAs) {
                    UpdateFormuleusingSP(ApplicationModel.ApplicationId, deferred);
                }
                else {
                    models.OppApplicationMap.findAll({ where: { ApplicationId: ApplicationModel.ApplicationId } })
                        .then(function (opp) {
                            deferred.resolve(opp[0]);
                        }).catch(function (err) {
                            logger.info('unable to get ' + err);
                            deferred.reject(err);
                        });
                }

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


function UpdateFormuleusingSP(GroupId, deferred) {
    var connection = new sql.Connection(MSdbconfig);
    connection.connect(function (err) {
        if (err) {
            logger.info('Error in sql connection');
            logger.info('ex' + err);
            deferred.reject(err)
        }
        var request = new sql.Request(connection);

        request.input('GroupId', sql.VarChar(100), GroupId);
        request.output('o_errorcode', sql.Int);
        request.output('o_errordesc', sql.VarChar(100));
        request.execute('proc_UpdateEstimationCisco', function (err, recordsets, returnValue) {
            if (err) {
                logger.info('SP Execution Error on proc_UpdateEstimationCisco');
                closeConnection(connection, 'proc_UpdateEstimationCisco');
                logger.info('ex' + err);
                deferred.reject(err)
            }
            closeConnection(connection, 'proc_UpdateEstimationCisco');
            deferred.resolve(GroupId);
        });
    });
    connection.on('error', function (err) {
        if (err) {
            logger.info('Error Event received in sql connection');
            logger.info('ex' + err);
            deferred.reject(err)
        }
    });
}

function closeConnection(connection, reqName) {

    try {
        if (connection.connected) {
            connection.close();
            logger.debug('Connection Closed : ' + reqName);
        }

    } catch (cerror) {
        logger.error('Close Connection Error : ' + reqName, { error: cerror });
    }
}