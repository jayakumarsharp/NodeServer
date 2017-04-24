var moment = require('moment');
var models = require(__base + "Schema");
var q = require('q');
var logger = require(__base + 'Models/logger');
var Sequelize = require('sequelize');

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);


var DayModel = {


    AddDaySheet: function (DayModel) {
        var deferred = q.defer();
        try {

            models.sequelize.transaction().then(function (t) {
                if (t != null && t != undefined) {
                    if (DayModel.IsSaveAs) {
                        models.PriceVersionMap.findAll({ where: { OppId: DayModel.OppId, IsEditable: true } })
                            .then(function (opp) {
                                if (opp.length > 0) {
                                    if (opp[0].LockedUser == DayModel.Authour) {

                                        models.PriceVersionMap.update({ IsLocked: false, IsEditable: false, DaySheetVersionJSON: DayModel.DaySheetVersionJSON }, { where: { OppId: DayModel.OppId } }, { transaction: t })
                                            .then(function () {
                                                logger.info('passed condition');
                                                models.PriceVersionMap.create({
                                                    OppId: DayModel.OppId, PriceSheetId: DayModel.SheetId, Version: DayModel.Version, IsEditable: DayModel.IsReadOnly, CreatedBy: DayModel.Authour,
                                                    PYUpdatedBy: DayModel.Authour, Comment: DayModel.Comment, LockedIn: '', DaySheetVersionJSON: DayModel.DaySheetVersionJSON
                                                }, { transaction: t }).then(function () {
                                                    sequelize.query('insert into  [TBL_PRICESHEET] ([RowId],[OppId],[OemId],[Component],[ComponenttypeId],[PricetypeId],[LegalEntityId],[CurrencyId],[ProductId],[Cyear1],[Cyear2],[Cyear3],[Cyear4],[Cyear5],[Vyear1],[Vyear2],[Vyear3],[Vyear4],[Vyear5],[Lyear1],[Lyear2],[Lyear3],[Lyear4],[Lyear5],[Oyear1],[Oyear2],[Oyear3],[Oyear4],[Oyear5],[Syear1],[Syear2],[Syear3],[Syear4],[Syear5],[STotal],[VTotal],[OTotal],[CTotal],[LTotal],[forvendordiscount],[distmarginpercent],[distdiscount],[marginpercent],[customerdiscount],[lob],[Dutytax1],[Dutytax2],[Dutytax3],[DTyear1],[DTyear2],[DTyear3],[DTyear4],[DTyear5],[DTTotal],[FCUyear1],[FCUyear2],[FCUyear3],[FCUyear4],[FCUyear5],[FCUTotal],[ConversionRate],[FCLyear1],[FCLyear2],[FCLyear3],[FCLyear4],[FCLyear5],[FCLTotal],[FDLyear1],[FDLyear2],[FDLyear3],[FDLyear4],[FDLyear5],[FDLTotal],[FWDLyear1],[FWDLyear2],[FWDLyear3],[FWDLyear4],[FWDLyear5],[FWDLTotal],[FSLyear1],[FSLyear2],[FSLyear3],[FSLyear4],[FSLyear5],[FSLTotal],[FVLyear1],[FVLyear2],[FVLyear3],[FVLyear4],[FVLyear5],[FVLTotal],[PriceSheetGroupId],[CreatedOn] )SELECT [RowId],[OppId],[OemId],[Component],[ComponenttypeId],[PricetypeId],[LegalEntityId],[CurrencyId],[ProductId],[Cyear1],[Cyear2],[Cyear3],[Cyear4],[Cyear5],[Vyear1],[Vyear2],[Vyear3],[Vyear4],[Vyear5],[Lyear1],[Lyear2],[Lyear3],[Lyear4],[Lyear5],[Oyear1],[Oyear2],[Oyear3],[Oyear4],[Oyear5],[Syear1],[Syear2],[Syear3],[Syear4],[Syear5],[STotal],[VTotal],[OTotal],[CTotal],[LTotal],[forvendordiscount],[distmarginpercent],[distdiscount],[marginpercent],[customerdiscount],[lob],[Dutytax1],[Dutytax2],[Dutytax3],[DTyear1],[DTyear2],[DTyear3],[DTyear4],[DTyear5],[DTTotal],[FCUyear1],[FCUyear2],[FCUyear3],[FCUyear4],[FCUyear5],[FCUTotal],[ConversionRate],[FCLyear1],[FCLyear2],[FCLyear3],[FCLyear4],[FCLyear5],[FCLTotal],[FDLyear1],[FDLyear2],[FDLyear3],[FDLyear4],[FDLyear5],[FDLTotal],[FWDLyear1],[FWDLyear2],[FWDLyear3],[FWDLyear4],[FWDLyear5],[FWDLTotal],[FSLyear1],[FSLyear2],[FSLyear3],[FSLyear4],[FSLyear5],[FSLTotal],[FVLyear1],[FVLyear2],[FVLyear3],[FVLyear4],[FVLyear5],[FVLTotal],:DaySheetgroupid,GETDATE() FROM  [TBL_PRICESHEET] where [PriceSheetGroupId]=:oldid',
                                                        { replacements: { oldid: DayModel.ExisitingPriceGroupId, DaySheetgroupid: DayModel.SheetId }, type: sequelize.QueryTypes.SELECT, transaction: t })
                                                        .then(function () {
                                                            sequelize.query('insert into [TBL_GROSSMARGIN]([MAINTANACEvalue],[IPvalue],[HOSTEDvalue],[PSvalue],[RESOURCINGvalue],[TRADINGvalue],[CONSULTINGvalue],[MAINTANACE],[IP],[HOSTED],[PS],[RESOURCING],[TRADING],[CONSULTING],[MarginGroupId]) SELECT [MAINTANACEvalue],[IPvalue],[HOSTEDvalue],[PSvalue],[RESOURCINGvalue],[TRADINGvalue],[CONSULTINGvalue],[MAINTANACE],[IP],[HOSTED],[PS],[RESOURCING],[TRADING],[CONSULTING],:DaySheetgroupid FROM [TBL_GROSSMARGIN] where MarginGroupId =:oldid', { replacements: { oldid: DayModel.ExisitingPriceGroupId, DaySheetgroupid: DayModel.SheetId }, type: sequelize.QueryTypes.SELECT, transaction: t })
                                                                .then(function () {
                                                                    Addinternalcall(DayModel, t, deferred);
                                                                }).catch(function (err) {
                                                                    logger.info('fail' + err);
                                                                    t.rollback();
                                                                    deferred.reject(err)
                                                                });
                                                        }).catch(function (err) {
                                                            logger.info('fail' + err);
                                                            t.rollback();
                                                            deferred.reject(err)
                                                        });
                                                }).catch(function (err) {
                                                    logger.info('error', err);
                                                    t.rollback();
                                                    deferred.reject(err);
                                                });
                                            }).catch(function (err) {
                                                logger.info('fail' + err);
                                                t.rollback();
                                                deferred.reject(err);
                                            });
                                        logger.info('started to add version in maptable 1 step over')
                                    }
                                    else {
                                        var data = { Error: '' };
                                        data.Error = "Unable to save. Sheet is locked by" + opp[0].LockedUser;
                                        logger.info('sheet is locked by someone' + opp[0].LockedUser)
                                        //returndata
                                        deferred.reject(data);
                                    }
                                }
                                else {
                                    var data = { Error: '' };
                                    data.Error = "Unable to save.Sheet is not available ";
                                    logger.info('Sheet is not available ')
                                    deferred.reject(data);
                                }
                            }).catch(function (err) {
                                logger.error('LocktheSheetByGroupid ' + err); deferred.reject(err)
                            });
                    }
                    else {
                        logger.info('in else part')
                        models.PriceVersionMap.update({
                            IsLocked: false, LockedUser: '', LockStartTime: null, LockedIn: '', PYUpdatedBy: DayModel.Authour, DaySheetVersionJSON: DayModel.DaySheetVersionJSON
                        }, { where: { PriceSheetId: DayModel.SheetId } }, { transaction: t })
                            .then(function () {
                                logger.info('reached here');
                                models.DAYSHEET.destroy({ where: { DaySheetGroupId: DayModel.SheetId }, truncate: false }, { transaction: t })
                                    .then(function () {
                                        logger.info('destroyed');
                                        Addinternalcall(DayModel, t, deferred);
                                    }).catch(function (destroyError) {
                                        t.rollback();
                                        deferred.reject(destroyError);
                                    });
                            }).catch(function (passError) {
                                t.rollback();
                                logger.info('PassError', passError);
                                deferred.reject(passError);
                            });
                    }
                }
            }).catch(function (err) {
                deferred.reject(err);
            })
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },


    GetDaySheetbyOppGroup: function (oppId, PaymentGroupId) {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT *  FROM [TBL_DAYSHEET] where DaySheetGroupId=:DaySheetgroupid', { replacements: { DaySheetgroupid: PaymentGroupId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },


    GetDaysheetPriceCostbyOppGroup: function (oppId, PaymentGroupId) {
        var deferred = q.defer();
        try {

            sequelize.query('SELECT *  FROM [TBL_DaysheetPriceCost] where DaySheetGroupId=:DaySheetgroupid', { replacements: { DaySheetgroupid: PaymentGroupId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;

    },

    GetDaysheetResourceDistributionbyOppGroup: function (oppId, PaymentGroupId) {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT *  FROM [TBL_DaysheetResourceDistribution] where DaySheetGroupId=:DaySheetgroupid', { replacements: { DaySheetgroupid: PaymentGroupId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });

        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;

    },

    GetDaysheetFTEHoursbyOppGroup: function (oppId, PaymentGroupId) {
        var deferred = q.defer();
        try {

            sequelize.query('SELECT [Id],[SDLCStage],[Tool],[Manual],[Extend],[CalculatedEfforts],[Total],[Change],[EffortAuthourize],[FTEHours],[Resources],[Days],[Daychange],[DaysAuthourize],[BusinessDays],[OnsitePercentage],[Daychange] as [PrevvalueFTE],[BusinessDays] as [PrevvalueBD],[FTEChangeStatus],[BDChangeStatus],[DaySheetGroupId]  FROM [TBL_DaysheetFTEHours] where DaySheetGroupId=:DaySheetgroupid', { replacements: { DaySheetgroupid: PaymentGroupId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });


        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetDaysheetExtendedEffortbyOppGroup: function (oppId, PaymentGroupId) {
        var deferred = q.defer();
        try {

            sequelize.query('SELECT *  FROM [TBL_DaysheetExtendedEffort] where DaySheetGroupId=:DaySheetgroupid', { replacements: { DaySheetgroupid: PaymentGroupId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });

        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;

    },
    //payment milestone data


    LocktheSheetByGroupid: function (OppId, GroupId, username, LockedInApp) {
        logger.info('Groupid' + GroupId + ' : nmae' + username)
        var deferred = q.defer();
        try {
            var curentdate = moment().format("YYYY-MM-DD HH:mm:ss");
            var localTime = moment.utc(curentdate).toDate();
            localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

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
                                    PSUpdatedBy: username,
                                    LockStartTime: localTime
                                }, { where: { PriceSheetId: GroupId } }).then(function () {
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
                        models.PriceVersionMap.findAll({ where: { OppId: OppId } })
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
                                            models.DAYSHEET.create({ OppId: OppId, DaySheetGroupId: GroupId }, { transaction: t }).then(function () {
                                                logger.info('Added Day in table')
                                                models.PriceVersionMap.create({
                                                    OppId: OppId,
                                                    PriceSheetId: GroupId,
                                                    Version: 'Ver_0.1',
                                                    IsEditable: true,
                                                    IsLocked: true,
                                                    LockedIn: 'DaySheet',
                                                    LockedUser: username,
                                                    PSUpdatedBy: username,
                                                    LockStartTime: localTime,
                                                    CreatedBy: username
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

}

module.exports.DayModel = DayModel;

function Addinternalcall(DayModel, t, deferred) {
    try {
        if (t != null && t != undefined) {
            models.DAYSHEET.bulkCreate(DayModel.DaySheet, { transaction: t }, { omitNull: true })
                .then(function () {
                    t.commit();

                    models.PriceVersionMap.findAll({ where: { PriceSheetId: DayModel.SheetId } })
                        .then(function (opp) {
                            deferred.resolve(opp[0]);
                        }).catch(function (err) {
                            logger.info('unable to get ' + err);
                            deferred.reject(err);
                        });

                }).catch(function (err) {

                    logger.info('unable to save ' + err);
                    deferred.reject(err);
                });


            models.DaysheetPriceCost.destroy({ where: { DaySheetGroupId: DayModel.SheetId }, truncate: false })
                .then(function () {
                    models.DaysheetPriceCost.bulkCreate(DayModel.DaysheetPriceCost, { omitNull: true })
                        .then(function () {
                            console.log('pricelist')
                        }).catch(function (destroyError) {

                            deferred.reject(destroyError);
                        });
                }).catch(function (destroyError) {

                    deferred.reject(destroyError);
                });


            models.DaysheetResourceDistribution.destroy({ where: { DaySheetGroupId: DayModel.SheetId }, truncate: false })
                .then(function () {
                    models.DaysheetResourceDistribution.bulkCreate(DayModel.DaysheetResourceDistribution, { omitNull: true })
                        .then(function () {
                            console.log('Resource distribution')
                        }).catch(function (destroyError) {

                            deferred.reject(destroyError);
                        });
                }).catch(function (destroyError) {

                    deferred.reject(destroyError);
                });

            models.DaysheetFTEHours.destroy({ where: { DaySheetGroupId: DayModel.SheetId }, truncate: false })
                .then(function () {
                    models.DaysheetFTEHours.bulkCreate(DayModel.DaysheetFTEHours, { omitNull: true })
                        .then(function () {
                            console.log('FTE hours')
                        }).catch(function (destroyError) {

                            deferred.reject(destroyError);
                        });
                }).catch(function (destroyError) {

                    deferred.reject(destroyError);
                });

            models.DaysheetExtendedEffort.destroy({ where: { DaySheetGroupId: DayModel.SheetId }, truncate: false })
                .then(function () {
                    models.DaysheetExtendedEffort.create({
                        REQ: DayModel.DaysheetExtendedEffort.REQ,
                        Design: DayModel.DaysheetExtendedEffort.Design, DevTest: DayModel.DaysheetExtendedEffort.DevTest, SysTest: DayModel.DaysheetExtendedEffort.SysTest, IMPL: DayModel.DaysheetExtendedEffort.IMPL, UAT: DayModel.DaysheetExtendedEffort.UAT, PROD: DayModel.DaysheetExtendedEffort.PROD, Train: DayModel.DaysheetExtendedEffort.Train, Manual: DayModel.DaysheetExtendedEffort.Manual, OH: DayModel.DaysheetExtendedEffort.OH, SQA: DayModel.DaysheetExtendedEffort.SQA, PM: DayModel.DaysheetExtendedEffort.PM, DaySheetGroupId: DayModel.DaysheetExtendedEffort.DaySheetGroupId
                    },
                        { omitNull: true })
                        .then(function () {
                            console.log('DaysheetExtendedEffort ')
                        }).catch(function (destroyError) {

                            deferred.reject(destroyError);
                        });
                }).catch(function (destroyError) {

                    deferred.reject(destroyError);
                });

        }
    }
    catch (Ex) {
        logger.info('ex' + Ex);
        deferred.reject(Ex);
    }
}