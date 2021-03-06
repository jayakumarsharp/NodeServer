var q = require('q');
var Sequelize = require('sequelize');
var moment = require('moment');
var models = require(__base + "Schema");
var logger = require(__base + 'Models/logger');

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);


var OppConfigModel = {

    AddOppConfig: function (OppConfigModel) {
        var deferred = q.defer();
        try {
            models.sequelize.transaction().then(function (t) {
                if (t != null && t != undefined) {
                    if (OppConfigModel.IsSaveAs) {
                        models.PriceVersionMap.findAll({ where: { OppId: OppConfigModel.OppId, IsEditable: true } })
                            .then(function (opp) {
                                if (opp.length > 0) {
                                    if (opp[0].LockedUser == OppConfigModel.Authour) {
                                        sequelize.query('update TBL_PRICESHEETVERSIONMAP set IsEditable=0 where OppId = :id ', { replacements: { id: OppConfigModel.OppId }, type: sequelize.QueryTypes.SELECT, transaction: t })
                                            .then(function () {
                                                models.PriceVersionMap.create({
                                                    OppId: OppConfigModel.OppId, PriceSheetId: OppConfigModel.SheetId, Version: OppConfigModel.Version, IsEditable: OppConfigModel.IsReadOnly, CreatedBy: OppConfigModel.Authour, GMUpdatedBy: OppConfigModel.Authour, Comment: OppConfigModel.Comment, LockedIn: '',
                                                }, { transaction: t })
                                                    .then(function () {
                                                        sequelize.query('insert into  [TBL_PRICESHEET] ([RowId],[OppId],[OemId],[Component],[ComponenttypeId],[PricetypeId],[LegalEntityId],[CurrencyId],[ProductId],[Cyear1],[Cyear2],[Cyear3],[Cyear4],[Cyear5],[Vyear1],[Vyear2],[Vyear3],[Vyear4],[Vyear5],[Lyear1],[Lyear2],[Lyear3],[Lyear4],[Lyear5],[Oyear1],[Oyear2],[Oyear3],[Oyear4],[Oyear5],[Syear1],[Syear2],[Syear3],[Syear4],[Syear5],[STotal],[VTotal],[OTotal],[CTotal],[LTotal],[forvendordiscount],[distmarginpercent],[distdiscount],[marginpercent],[customerdiscount],[lob],[Dutytax1],[Dutytax2],[Dutytax3],[DTyear1],[DTyear2],[DTyear3],[DTyear4],[DTyear5],[DTTotal],[FCUyear1],[FCUyear2],[FCUyear3],[FCUyear4],[FCUyear5],[FCUTotal],[ConversionRate],[FCLyear1],[FCLyear2],[FCLyear3],[FCLyear4],[FCLyear5],[FCLTotal],[FDLyear1],[FDLyear2],[FDLyear3],[FDLyear4],[FDLyear5],[FDLTotal],[FWDLyear1],[FWDLyear2],[FWDLyear3],[FWDLyear4],[FWDLyear5],[FWDLTotal],[FSLyear1],[FSLyear2],[FSLyear3],[FSLyear4],[FSLyear5],[FSLTotal],[FVLyear1],[FVLyear2],[FVLyear3],[FVLyear4],[FVLyear5],[FVLTotal],[PriceSheetGroupId],[CreatedOn] )SELECT [RowId],[OppId],[OemId],[Component],[ComponenttypeId],[PricetypeId],[LegalEntityId],[CurrencyId],[ProductId],[Cyear1],[Cyear2],[Cyear3],[Cyear4],[Cyear5],[Vyear1],[Vyear2],[Vyear3],[Vyear4],[Vyear5],[Lyear1],[Lyear2],[Lyear3],[Lyear4],[Lyear5],[Oyear1],[Oyear2],[Oyear3],[Oyear4],[Oyear5],[Syear1],[Syear2],[Syear3],[Syear4],[Syear5],[STotal],[VTotal],[OTotal],[CTotal],[LTotal],[forvendordiscount],[distmarginpercent],[distdiscount],[marginpercent],[customerdiscount],[lob],[Dutytax1],[Dutytax2],[Dutytax3],[DTyear1],[DTyear2],[DTyear3],[DTyear4],[DTyear5],[DTTotal],[FCUyear1],[FCUyear2],[FCUyear3],[FCUyear4],[FCUyear5],[FCUTotal],[ConversionRate],[FCLyear1],[FCLyear2],[FCLyear3],[FCLyear4],[FCLyear5],[FCLTotal],[FDLyear1],[FDLyear2],[FDLyear3],[FDLyear4],[FDLyear5],[FDLTotal],[FWDLyear1],[FWDLyear2],[FWDLyear3],[FWDLyear4],[FWDLyear5],[FWDLTotal],[FSLyear1],[FSLyear2],[FSLyear3],[FSLyear4],[FSLyear5],[FSLTotal],[FVLyear1],[FVLyear2],[FVLyear3],[FVLyear4],[FVLyear5],[FVLTotal],:paymentsheetgroupid,GETDATE() FROM  [TBL_PRICESHEET] where [PriceSheetGroupId]=:oldid', { replacements: { oldid: OppConfigModel.ExisitingPriceGroupId, paymentsheetgroupid: OppConfigModel.SheetId }, type: sequelize.QueryTypes.SELECT, transaction: t })
                                                            .then(function () {
                                                                sequelize.query('insert into [TBL_PAYMENTSHEET]([PaymentCode],SubPaymentCode,MilestoneDescription,[Iyear1],[Iyear2],[Iyear3] ,[Iyear4],[Iyear5],[paymentTerms],[percentageTotal],[OEMHWandSW],[OEMServices],[OEMPS],[OEMOther],[SERVSW],[SERVServices],[SERVPS],[SERVConsulting],[SERVCare],[SERVOther],[SERVResource],[SERVTM],[SERVHosted],[PaymentSheetGroupId] )SELECT [PaymentCode],SubPaymentCode,MilestoneDescription,[Iyear1],[Iyear2],[Iyear3] ,[Iyear4],[Iyear5],[paymentTerms],[percentageTotal],[OEMHWandSW],[OEMServices],[OEMPS],[OEMOther],[SERVSW],[SERVServices],[SERVPS],[SERVConsulting],[SERVCare],[SERVOther],[SERVResource],[SERVTM],[SERVHosted],:paymentsheetgroupid FROM [TBL_PAYMENTSHEET] where [PaymentSheetGroupId] =:oldid', { replacements: { oldid: OppConfigModel.ExisitingPriceGroupId, paymentsheetgroupid: OppConfigModel.SheetId }, type: sequelize.QueryTypes.SELECT, transaction: t })
                                                                    .then(function () {
                                                                        Addinternalcall(OppConfigModel, t, deferred);
                                                                    }).catch(function (err) {
                                                                        t.rollback();
                                                                        logger.info('fail' + err);
                                                                        deferred.reject(err)
                                                                    });
                                                            }).catch(function (err) {
                                                                t.rollback();
                                                                logger.info('fail' + err);
                                                                deferred.reject(err)
                                                            });
                                                    }).catch(function (err) {
                                                        t.rollback();
                                                        logger.info('fail' + err);
                                                        deferred.reject(err);
                                                    });

                                            }).catch(function (err) {
                                                t.rollback();
                                                logger.info('fail' + err);
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

                            }).catch(function (err) { logger.error('LocktheSheetByGroupid ' + err); deferred.reject(err) });
                    }
                    else {
                        logger.info('calling existing')
                        models.PriceVersionMap.update({
                            IsLocked: false, LockedUser: '', LockStartTime: null, LockedIn: '', GMUpdatedBy: OppConfigModel.Authour,
                        }, { where: { PriceSheetId: OppConfigModel.SheetId } }, { transaction: t })
                            .then(function () {
                                Addinternalcall(OppConfigModel, t, deferred);
                            }).catch(function (err) {
                                t.rollback();
                                logger.info('Release lock when save data ' + err);
                                deferred.reject(err);
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


    GetOppConfigtbyOppGroup: function (oppId, MarginGroupId) {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT *  FROM TBL_OppConfigPriceVersion P  where P.PriceGroupId=:sheetgroupid', { replacements: { sheetgroupid: MarginGroupId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
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

}

module.exports.OppConfigModel = OppConfigModel;

function Addinternalcall(OppConfigModel, t, deferred) {
    try {
        //logger.info(JSON.stringify(OppConfigModel));
        
        if (t != null && t != undefined) {
            logger.info(JSON.stringify(OppConfigModel));
            models.OppConfigPriceVersion.destroy({ where: { PriceGroupId: OppConfigModel.SheetId }, truncate: false }, { transaction: t })
                .then(function () {
                    logger.info('logged for delete')
                    models.OppConfigPriceVersion.create(OppConfigModel.paymentsheet, { transaction: t }, { omitNull: true })
                        .then(function () {
                            t.commit();
                            logger.info('gross margin commited')
                            models.PriceVersionMap.findAll({ where: { PriceSheetId: OppConfigModel.SheetId } })
                           .then(function (opp) {
                               deferred.resolve(opp[0]);
                           }).catch(function (err) {
                               t.rollback();
                               logger.info('unable to get ' + err);
                               deferred.reject(err);
                           });
                        }).catch(function (passError) {
                            t.rollback();
                            deferred.reject(passError);
                        })
                }).catch(function (destroyError) {
                    t.rollback();
                    deferred.reject(destroyError);
                })
        }
    }
    catch (err) {
        deferred.reject(err);
        logger.info('Error: ' + err);
    }

}


