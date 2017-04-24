var q = require('q');
var Sequelize = require('sequelize');
var excelbuilder = require('msexcel-builder');
var moment = require('moment');
var _ = require('underscore')._;
var models = require(__base + "Schema");
var logger = require(__base + 'Models/logger');

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var PricingModel = {

    //get all Lob List
    GetAllLOBList: function (oppId) {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT [Id],[LOBName] FROM [TBL_LOBList]', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
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

    //get all pricetype master table data
    GetAllPriceType: function () {
        var deferred = q.defer();
        try {
            models.PriceType.findAll()
                .then(function (result) { deferred.resolve(result); })
                .catch(function (err) { logger.info('GetAllPriceType ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    //get all component type master data
    GetAllComponentType: function () {
        var deferred = q.defer();
        try {
            models.ComponentType.findAll()
                .then(function (comp) { deferred.resolve(comp); })
                .catch(function (err) { logger.info('GetAllComponentType ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    //Get PricesheetbyOppId
    GetPriceSheet: function (oppId) {
        var deferred = q.defer();
        try {
            logger.info('price sheet called')
            if (oppId != null && oppId != undefined) {
                models.PRICESHEET.findAll({ where: { OppId: oppId } })
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

    AddPriceSheet: function (PriceModel) {
        var deferred = q.defer();
        try {
            models.sequelize.transaction().then(function (t) {
                if (t != null && t != undefined) {
                    if (PriceModel.IsSaveAs) {
                        models.PriceVersionMap.findAll({ where: { OppId: PriceModel.OppId, IsEditable: true, IsLocked: true } })
                            .then(function (opp) {
                                if (opp.length > 0) {

                                    if (opp[0].LockedUser == PriceModel.Authour) {
                                        sequelize.query('update TBL_PRICESHEETVERSIONMAP set IsEditable=0,IsLocked=0,LockedIn=NULL where OppId = :id ', { replacements: { id: PriceModel.OppId }, type: sequelize.QueryTypes.SELECT, transaction: t })
                                            .then(function () {
                                                models.PriceVersionMap.create({
                                                    OppId: PriceModel.OppId, PriceSheetId: PriceModel.PriceSheetId, Version: PriceModel.Version, IsEditable: true, CreatedBy: PriceModel.Authour, PSUpdatedBy: PriceModel.Authour, Comment: PriceModel.Comment, LockedIn: '', DaySheetVersionJSON: PriceModel.DaySheetVersionJSON
                                                }, { transaction: t })
                                                    .then(function () {
                                                        Addinternalcall(PriceModel, t, deferred);
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
                        models.PriceVersionMap.findAll({ where: { OppId: PriceModel.OppId, IsEditable: true, IsLocked: true } })
                            .then(function (opp) {
                                if (opp.length > 0) {
                                    if (opp[0].LockedUser == PriceModel.Authour) {

                                        models.PRICESHEET.destroy({ where: { PriceSheetGroupId: PriceModel.PriceSheetId }, truncate: false }, { transaction: t })
                                            .then(function () {
                                                models.PriceVersionMap.update({
                                                    IsLocked: false, LockedUser: '', LockStartTime: null, LockedIn: '', ColStatus: PriceModel.ColStatus, IsPriceSheetUpdated: true, Comment: PriceModel.Comment, DaySheetVersionJSON: PriceModel.DaySheetVersionJSON
                                                }, { where: { PriceSheetId: PriceModel.PriceSheetId } }, { transaction: t })
                                                    .then(function () {

                                                        Addinternalcall(PriceModel, t, deferred);
                                                    })
                                                    .catch(function (err) {
                                                        logger.info('Release lock when save data ' + err); deferred.reject(err);
                                                        deferred.reject(passError);
                                                    });

                                            })
                                            .catch(function (passError) {
                                                logger.info('PassError', passError);
                                                deferred.reject(passError);
                                            })

                                    }
                                    else {
                                        var data = { Error: '' };
                                        data.Error = "Unable to save. Sheet is locked by" + opp[0].LockedUser;
                                        logger.info("Error sheet is expired");
                                        deferred.resolve(data);
                                    }
                                }
                                else {
                                    var data = { Error: '' };
                                    data.Error = "Unable to save. Sheet is not locked in your name";
                                    logger.info("Error sheet is not locked");
                                    deferred.resolve(data);
                                }
                            });

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


    LocktheSheetByGroupid: function (OppId, GroupId, username, LockedInApp, IsPriceSheetUpdated) {
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
                                    IsPriceSheetUpdated: IsPriceSheetUpdated,
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
                                            models.PRICESHEET.create({ OppId: OppId, PriceSheetGroupId: GroupId }, { transaction: t }).then(function () {
                                                logger.info('Added Pricing in table')
                                                models.PriceVersionMap.create({
                                                    OppId: OppId,
                                                    PriceSheetId: GroupId,
                                                    Version: 'Ver_0.1',
                                                    IsEditable: true,
                                                    IsLocked: true,
                                                    LockedIn: 'PriceSheet',
                                                    IsPriceSheetUpdated: true,
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

    ReleaseSheetWhenExpired: function (GroupId) {
        var deferred = q.defer();
        try {
            if (GroupId != null && GroupId != '') {
                logger.info('logged for manual release' + GroupId)
                models.PriceVersionMap.update({
                    IsLocked: false,
                    LockedUser: '',
                    LockedIn: '',
                    LockStartTime: null
                }, { where: { PriceSheetId: GroupId } }).then(function (result) {
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

    IncreaseAdditionalTimeToSheet: function (GroupId, username, LockedInApp) {
        var deferred = q.defer();
        try {
            logger.info('logginh  for  IncreaseAdditionalTimeToSheet' + GroupId)
            var curentdate = moment().format("YYYY-MM-DD HH:mm:ss");
            var localTime = moment.utc(curentdate).toDate();
            localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

            models.PriceVersionMap.findAll({ where: { PriceSheetId: GroupId } })
                .then(function (opp) {
                    if (opp.length > 0) {
                        logger.info("sheet already hold by " + opp[0].LockedUser);
                        if (opp[0].LockedUser == username || opp[0].LockedUser == '') {
                            logger.info("Increasing time");
                            models.PriceVersionMap.update({
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

    PricesheetFeedUpdatebyPayment: function (Sheetid) {
        var deferred = q.defer();
        try {
            models.PriceVersionMap.update({
                IsPriceSheetUpdated: false
            }, { where: { PriceSheetId: Sheetid } }).then(function (objprice) {
                logger.info('Added PricingMap in table');
                //  returndata = objprice;
                deferred.resolve(objprice);
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetAllVersionOpportunity: function (oppId) {
        var deferred = q.defer();
        try {
            models.PriceVersionMap.findAll({ where: { OppId: oppId } })
                .then(function (comp) { deferred.resolve(comp); })
                .catch(function (err) { logger.info('GetAllComponentType ' + err); deferred.reject(err) });
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
            sequelize.query('SELECT  COUNT(1) as count FROM TBL_PRICESHEETVERSIONMAP where OppId=:oppid', { replacements: { oppid: oppId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
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


    GetMaximumGroupPriceSheetId: function () {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT  max(PriceSheetId) as count FROM TBL_PRICESHEETVERSIONMAP', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
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

    GetAllOpportunityVersion: function () {
        var deferred = q.defer();
        try {
            sequelize.query('select O.id,O.OppId,s.SBU,O.OpportunityName,P.Version,p.PriceSheetId,COUNT(P.PriceSheetId) as count, P.Comment, P.CreatedBy, P.CreatedOn from TBL_OPPORTUNITY_MASTER O inner Join  TBL_SBU_MASTER S on O.SBUid=S.id left outer join TBL_PRICESHEETVERSIONMAP P on o.OppId=p.OppId group  by O.OppId,s.SBU,O.OpportunityName,P.Version,p.PriceSheetId,O.id, P.Comment,P.CreatedOn,P.CreatedBy', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
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

    //get pricesheet values by oppid and pricegroup
    GetPriceSheetbyOpportunityPCGroupID: function (oppId, PriceGroupId) {
        var deferred = q.defer();
        try {
            models.PRICESHEET.findAll({ where: { PriceSheetGroupId: PriceGroupId } })
                .then(function (pricesheet) {
                    if (pricesheet.length > 0) {
                        sequelize.query('SELECT P.IsManual,P.[Id],RowId,[OppId],[OemId],O.VendorName AS oem,[Component],[ComponenttypeId],CM.componenttype,[PricetypeId],Pt.pricetype,[LegalEntityId],SL.ServionLegalEntity,P.[CurrencyId],CR.Currency,CR.CurrencyDescrition,[ProductId],PL.ProductName,[Cyear1],[Cyear2],[Cyear3],[Cyear4],[Cyear5],[Vyear1],[Vyear2],[Vyear3],[Vyear4],[Vyear5],[Lyear1],[Lyear2],[Lyear3],[Lyear4],[Lyear5],[Oyear1],[Oyear2],[Oyear3],[Oyear4],[Oyear5],[Syear1],[Syear2],[Syear3],[Syear4],[Syear5],[STotal],[VTotal],[OTotal],[CTotal],[LTotal],[forvendordiscount],[distmarginpercent],[distdiscount],[marginpercent],[customerdiscount],[lob],LOBName,[Dutytax1],[Dutytax2],[Dutytax3],[DTyear1],[DTyear2],[DTyear3],[DTyear4],[DTyear5],[DTTotal],[FCUyear1],[FCUyear2],[FCUyear3],[FCUyear4],[FCUyear5],[FCUTotal],[FDLyear1],[FDLyear2],[FDLyear3],[FDLyear4],[FDLyear5],[FDLTotal],[FWDLyear1],[FWDLyear2],[FWDLyear3],[FWDLyear4],[FWDLyear5],[FWDLTotal],[FSLyear1],[FSLyear2],[FSLyear3],[FSLyear4],[FSLyear5],[FSLTotal],[FVLyear1],[FVLyear2],[FVLyear3],[FVLyear4],[FVLyear5],[FVLTotal],[ConversionRate],[FCLyear1],[FCLyear2],[FCLyear3],[FCLyear4],[FCLyear5],[FCLTotal],[PriceSheetGroupId],[CreatedOn]  FROM [TBL_PRICESHEET] P join TBL_VendorList O on P.OemId=O.Id join TBL_PRICETYPE_MASTER  PT on P.PricetypeId=PT.Id JOIN TBL_COMPONENTTYPE_MASTER CM on p.ComponenttypeId=CM.Id join TBL_SERVIONLEGALENTITY SL on Sl.ServionLegalEntityID=p.LegalEntityId join TBL_CURRENCY_MASTER CR on P.CurrencyId =CR.Id join TBL_ProductList PL on PL.Id=P.ProductId join TBL_LOBList LB on lB.Id=P.lob where PriceSheetGroupId=:pricegroupid order by RowId', { replacements: { pricegroupid: PriceGroupId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                            deferred.resolve(response);
                        }).error(function (err) {
                            logger.info('fail' + err);
                            deferred.reject(err)
                        });
                    }
                    else {
                        var data = { Error: '' };
                        data.Error = "Unable to find Pricing sheet";
                        logger.info('Unable to find Pricing sheet')
                        deferred.resolve(data);
                    }
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    //get pricesheet by oppid and pricegroup
    GetPriceSheetMapbyOppGroup: function (oppId, PriceGroupId) {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT [OppId],[PriceSheetId],[Version],[IsEditable],[CreatedBy] FROM [TBL_PRICESHEETVERSIONMAP] where PriceSheetId=:pricegroupid and OppId=:oppid', { replacements: { pricegroupid: PriceGroupId, oppid: oppId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
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

    GetPriceSheetVersionsForOpp: function (oppId) {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT [OppId],[PriceSheetId],[Version],[IsEditable],[CreatedBy] FROM [TBL_PRICESHEETVERSIONMAP] where OppId=:oppid', { replacements: { oppid: oppId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
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

    GetAllLockedPriceSheet: function () {
        logger.info('Start Fetching the locked sheet');
        var deferred = q.defer();
        try {
            sequelize.query('SELECT P.[id],P.[OppId],O.OpportunityName,[PriceSheetId],LockedIn,[Version],[IsEditable],[IsLocked],[LockedUser],[LockStartTime],[CreatedBy] FROM [TBL_PRICESHEETVERSIONMAP]  P join TBL_OPPORTUNITY_MASTER O  on P.OppId=O.OppId where P.IsLocked=1', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                for (var i = 0; i < response.length; i++) {
                    response[i].LockStartTime = moment.utc(response[i].LockStartTime).format("MM-DD-YYYY HH:mm:ss")
                }

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
    }

}
module.exports.PricingModel = PricingModel;

function Addinternalcall(PriceModel, t, deferred) {
    try {

        logger.info(PriceModel);

        if (t != null && t != undefined) {

            models.PRICESHEET.bulkCreate(PriceModel.pricesheet, { transaction: t }, { omitNull: true }).then(function () {

                models.PAYMENTSHEET.destroy({ where: { PaymentSheetGroupId: PriceModel.PriceSheetId }, truncate: false }, { transaction: t })
                    .then(function () {
                        logger.info('Payment Delete')
                        models.PAYMENTSHEET.bulkCreate(PriceModel.paymentsheet, { transaction: t }, { omitNull: true })
                            .then(function () {
                                logger.info('Payment insert')
                                models.GROSSMARGIN.destroy({ where: { MarginGroupId: PriceModel.PriceSheetId }, truncate: false }, { transaction: t })
                                    .then(function () {
                                        logger.info('Gross margin dele ')

                                        models.GROSSMARGIN.create(PriceModel.GMsheet, { transaction: t }, { omitNull: true })
                                            .then(function () {
                                                logger.info('Gross margin ins ')
                                                models.OppConfigPriceVersion.destroy({ where: { PriceGroupId: PriceModel.PriceSheetId }, truncate: false }, { transaction: t })
                                                    .then(function () {
                                                        logger.info('opp confi dele ')
                                                        models.OppConfigPriceVersion.create(PriceModel.opsheet, { transaction: t }, { omitNull: true })
                                                            .then(function () {
                                                                logger.info('opp confi inser ')

                                                                models.TandEPS.destroy({ where: { GroupId: PriceModel.PriceSheetId }, truncate: false }, { transaction: t })
                                                                    .then(function () {
                                                                        logger.info('T&E del ')

                                                                        models.TandEPS.bulkCreate(PriceModel.TandEPSSheet, { transaction: t }, { omitNull: true })
                                                                            .then(function () {
                                                                                logger.info('T&E ins')
                                                                                models.TandEResource.destroy({ where: { GroupId: PriceModel.PriceSheetId }, truncate: false }, { transaction: t })
                                                                                    .then(function () {
                                                                                        logger.info('T&E Res de  ')
                                                                                        models.TandEResource.bulkCreate(PriceModel.TandEResourceSheet, { transaction: t }, { omitNull: true }).then(function () {
                                                                                            logger.info('T&E Res ins  ')
                                                                                            models.Resource.destroy({ where: { GroupId: PriceModel.PriceSheetId }, truncate: false }, { transaction: t })
                                                                                                .then(function () {
                                                                                                    logger.info('Res de  ')
                                                                                                    models.Resource.bulkCreate(PriceModel.ResourceSheet, { transaction: t }, { omitNull: true }).then(function () {

                                                                                                        logger.info('Res ins ')
                                                                                                        models.DAYSHEET.destroy({ where: { DaySheetGroupId: PriceModel.PriceSheetId }, truncate: false }, { transaction: t })
                                                                                                            .then(function () {
                                                                                                                logger.info('DS de ')
                                                                                                                models.DAYSHEET.bulkCreate(PriceModel.DaySheet, { transaction: t }, { omitNull: true })
                                                                                                                    .then(function () {
                                                                                                                        logger.info('DS ins ')
                                                                                                                        t.commit();
                                                                                                                        logger.info('transaction commit sucess ')


                                                                                                                        // test start

                                                                                                                        models.DaysheetPriceCost.destroy({ where: { DaySheetGroupId: PriceModel.PriceSheetId }, truncate: false })
                                                                                                                            .then(function () {
                                                                                                                                models.DaysheetPriceCost.bulkCreate(PriceModel.DaysheetPriceCost, { omitNull: true })
                                                                                                                                    .then(function () {
                                                                                                                                        console.log('price cost');
                                                                                                                                        models.DaysheetResourceDistribution.destroy({ where: { DaySheetGroupId: PriceModel.PriceSheetId }, truncate: false })
                                                                                                                                            .then(function () {
                                                                                                                                                models.DaysheetResourceDistribution.bulkCreate(PriceModel.DaysheetResourceDistribution, { omitNull: true })
                                                                                                                                                    .then(function () {
                                                                                                                                                        console.log('Resource distribution');
                                                                                                                                                        models.DaysheetFTEHours.destroy({ where: { DaySheetGroupId: PriceModel.PriceSheetId }, truncate: false })
                                                                                                                                                            .then(function () {
                                                                                                                                                                models.DaysheetFTEHours.bulkCreate(PriceModel.DaysheetFTEHours, { omitNull: true })
                                                                                                                                                                    .then(function () {
                                                                                                                                                                        console.log('FTE hours');
                                                                                                                                                                        models.DaysheetExtendedEffort.destroy({ where: { DaySheetGroupId: PriceModel.PriceSheetId }, truncate: false })
                                                                                                                                                                            .then(function () {
                                                                                                                                                                                models.DaysheetExtendedEffort.create({
                                                                                                                                                                                    REQ: PriceModel.DaysheetExtendedEffort.REQ,
                                                                                                                                                                                    Design: PriceModel.DaysheetExtendedEffort.Design,
                                                                                                                                                                                    DevTest: PriceModel.DaysheetExtendedEffort.DevTest,
                                                                                                                                                                                    SysTest: PriceModel.DaysheetExtendedEffort.SysTest,
                                                                                                                                                                                    IMPL: PriceModel.DaysheetExtendedEffort.IMPL,
                                                                                                                                                                                    UAT: PriceModel.DaysheetExtendedEffort.UAT,
                                                                                                                                                                                    PROD: PriceModel.DaysheetExtendedEffort.PROD,
                                                                                                                                                                                    Train: PriceModel.DaysheetExtendedEffort.Train,
                                                                                                                                                                                    Manual: PriceModel.DaysheetExtendedEffort.Manual,
                                                                                                                                                                                    OH: PriceModel.DaysheetExtendedEffort.OH,
                                                                                                                                                                                    SQA: PriceModel.DaysheetExtendedEffort.SQA,
                                                                                                                                                                                    PM: PriceModel.DaysheetExtendedEffort.PM,
                                                                                                                                                                                    DaySheetGroupId: PriceModel.DaysheetExtendedEffort.DaySheetGroupId
                                                                                                                                                                                },
                                                                                                                                                                                    { omitNull: true })
                                                                                                                                                                                    .then(function () {
                                                                                                                                                                                        console.log('DaysheetExtendedEffort ');
                                                                                                                                                                                        models.PriceVersionMap.findAll({ where: { PriceSheetId: PriceModel.PriceSheetId } })
                                                                                                                                                                                            .then(function (opp) {
                                                                                                                                                                                                deferred.resolve(opp[0]);
                                                                                                                                                                                            }).catch(function (err) {
                                                                                                                                                                                                logger.info('unable to get ' + err);
                                                                                                                                                                                                deferred.reject(err);
                                                                                                                                                                                            });

                                                                                                                                                                                    }).catch(function (destroyError) {

                                                                                                                                                                                        deferred.reject(destroyError);
                                                                                                                                                                                    });
                                                                                                                                                                            }).catch(function (destroyError) {

                                                                                                                                                                                deferred.reject(destroyError);
                                                                                                                                                                            });

                                                                                                                                                                    }).catch(function (destroyError) {

                                                                                                                                                                        deferred.reject(destroyError);
                                                                                                                                                                    });
                                                                                                                                                            }).catch(function (destroyError) {

                                                                                                                                                                deferred.reject(destroyError);
                                                                                                                                                            });

                                                                                                                                                    }).catch(function (destroyError) {

                                                                                                                                                        deferred.reject(destroyError);
                                                                                                                                                    });
                                                                                                                                            }).catch(function (destroyError) {

                                                                                                                                                deferred.reject(destroyError);
                                                                                                                                            });
                                                                                                                                    }).catch(function (destroyError) {

                                                                                                                                        deferred.reject(destroyError);
                                                                                                                                    });
                                                                                                                            }).catch(function (destroyError) {

                                                                                                                                deferred.reject(destroyError);
                                                                                                                            });

                                                                                                                        // test end

                                                                                                                    }).catch(function (err) {
                                                                                                                        logger.info('unable to get ' + err);
                                                                                                                        deferred.reject(err);
                                                                                                                    });
                                                                                                            }).catch(function (err) {
                                                                                                                logger.info('unable to get ' + err);
                                                                                                                deferred.reject(err);
                                                                                                            });

                                                                                                    }).catch(function (err) {
                                                                                                        logger.info('unable to get ' + err);
                                                                                                        deferred.reject(err);
                                                                                                    });
                                                                                                }).catch(function (err) {
                                                                                                    logger.info('unable to get ' + err);
                                                                                                    deferred.reject(err);
                                                                                                });

                                                                                        }).catch(function (err) {
                                                                                            logger.info('unable to get ' + err);
                                                                                            deferred.reject(err);
                                                                                        });
                                                                                    }).catch(function (err) {
                                                                                        logger.info('unable to get ' + err);
                                                                                        deferred.reject(err);
                                                                                    });
                                                                            }).catch(function (err) {
                                                                                logger.info('unable to get ' + err);
                                                                                deferred.reject(err);
                                                                            });
                                                                    }).catch(function (err) {
                                                                        logger.info('unable to get ' + err);
                                                                        deferred.reject(err);
                                                                    });


                                                            }).catch(function (err) {
                                                                logger.info('unable to get ' + err);
                                                                deferred.reject(err);
                                                            });
                                                    }).catch(function (err) {
                                                        logger.info('unable to get ' + err);
                                                        deferred.reject(err);
                                                    });

                                            }).catch(function (err) {
                                                logger.info('unable to get ' + err);
                                                deferred.reject(err);
                                            });
                                    }).catch(function (err) {
                                        logger.info('unable to get ' + err);
                                        deferred.reject(err);
                                    });
                            }).catch(function (err) {
                                logger.info('unable to get ' + err);
                                deferred.reject(err);
                            });
                    }).catch(function (err) {
                        logger.info('unable to get ' + err);
                        deferred.reject(err);
                    });

            }).catch(function (err) {
                logger.info('unable to get ' + err);
                deferred.reject(err);
            });
        }
    }
    catch (ex) {
        deferred.reject(ex);
        logger.info('error occured' + ex)
    }

}