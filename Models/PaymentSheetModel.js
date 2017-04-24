var moment = require('moment');
var models = require(__base + "Schema");
var q = require('q');
var logger = require(__base + 'Models/logger');
var Sequelize = require('sequelize');

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);


var PaymentModel = {

    GetPaymentDefaultConfiguration: function () {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT D.[Id],MilestoneDescription,D.[PaymentCode],[Iyear1],[Iyear2],[Iyear3],[Iyear4],[Iyear5],[paymentTerms],[percentageTotal],[OEMHWandSW],[OEMServices],[OEMPS],[OEMOther],[SERVSW],[SERVServices],[SERVPS],[SERVConsulting],[SERVCare],[SERVOther],[SERVResource],[SERVTM],[SERVHosted],[VendorBreakDown] FROM [TBL_PAYMENT_DEFAULTCONFIG] D Join TBL_PAYMENT_MILESTONE M on M.PaymentCode=D.PaymentCode', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
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

    AddPaymentSheet: function (PaymentModel) {
        var deferred = q.defer();
        try {

            models.sequelize.transaction().then(function (t) {
                if (t != null && t != undefined) {
                    if (PaymentModel.IsSaveAs) {
                        models.PriceVersionMap.findAll({ where: { OppId: PaymentModel.OppId, IsEditable: true } })
                            .then(function (opp) {
                                if (opp.length > 0) {
                                    if (opp[0].LockedUser == PaymentModel.Authour) {

                                        models.PriceVersionMap.update({ IsLocked: false, IsEditable: false, IsPriceSheetUpdated: false }, { where: { OppId: PaymentModel.OppId } }, { transaction: t })
                                            .then(function () {
                                                logger.info('passed condition');
                                                models.PriceVersionMap.create({
                                                    OppId: PaymentModel.OppId, PriceSheetId: PaymentModel.SheetId, Version: PaymentModel.Version, IsEditable: PaymentModel.IsReadOnly, CreatedBy: PaymentModel.Authour,
                                                    PYUpdatedBy: PaymentModel.Authour, Comment: PaymentModel.Comment, LockedIn: '', IsPriceSheetUpdated: false
                                                }, { transaction: t }).then(function () {
                                                    sequelize.query('insert into  [TBL_PRICESHEET] ([RowId],[OppId],[OemId],[Component],[ComponenttypeId],[PricetypeId],[LegalEntityId],[CurrencyId],[ProductId],[Cyear1],[Cyear2],[Cyear3],[Cyear4],[Cyear5],[Vyear1],[Vyear2],[Vyear3],[Vyear4],[Vyear5],[Lyear1],[Lyear2],[Lyear3],[Lyear4],[Lyear5],[Oyear1],[Oyear2],[Oyear3],[Oyear4],[Oyear5],[Syear1],[Syear2],[Syear3],[Syear4],[Syear5],[STotal],[VTotal],[OTotal],[CTotal],[LTotal],[forvendordiscount],[distmarginpercent],[distdiscount],[marginpercent],[customerdiscount],[lob],[Dutytax1],[Dutytax2],[Dutytax3],[DTyear1],[DTyear2],[DTyear3],[DTyear4],[DTyear5],[DTTotal],[FCUyear1],[FCUyear2],[FCUyear3],[FCUyear4],[FCUyear5],[FCUTotal],[ConversionRate],[FCLyear1],[FCLyear2],[FCLyear3],[FCLyear4],[FCLyear5],[FCLTotal],[FDLyear1],[FDLyear2],[FDLyear3],[FDLyear4],[FDLyear5],[FDLTotal],[FWDLyear1],[FWDLyear2],[FWDLyear3],[FWDLyear4],[FWDLyear5],[FWDLTotal],[FSLyear1],[FSLyear2],[FSLyear3],[FSLyear4],[FSLyear5],[FSLTotal],[FVLyear1],[FVLyear2],[FVLyear3],[FVLyear4],[FVLyear5],[FVLTotal],[PriceSheetGroupId],[CreatedOn] )SELECT [RowId],[OppId],[OemId],[Component],[ComponenttypeId],[PricetypeId],[LegalEntityId],[CurrencyId],[ProductId],[Cyear1],[Cyear2],[Cyear3],[Cyear4],[Cyear5],[Vyear1],[Vyear2],[Vyear3],[Vyear4],[Vyear5],[Lyear1],[Lyear2],[Lyear3],[Lyear4],[Lyear5],[Oyear1],[Oyear2],[Oyear3],[Oyear4],[Oyear5],[Syear1],[Syear2],[Syear3],[Syear4],[Syear5],[STotal],[VTotal],[OTotal],[CTotal],[LTotal],[forvendordiscount],[distmarginpercent],[distdiscount],[marginpercent],[customerdiscount],[lob],[Dutytax1],[Dutytax2],[Dutytax3],[DTyear1],[DTyear2],[DTyear3],[DTyear4],[DTyear5],[DTTotal],[FCUyear1],[FCUyear2],[FCUyear3],[FCUyear4],[FCUyear5],[FCUTotal],[ConversionRate],[FCLyear1],[FCLyear2],[FCLyear3],[FCLyear4],[FCLyear5],[FCLTotal],[FDLyear1],[FDLyear2],[FDLyear3],[FDLyear4],[FDLyear5],[FDLTotal],[FWDLyear1],[FWDLyear2],[FWDLyear3],[FWDLyear4],[FWDLyear5],[FWDLTotal],[FSLyear1],[FSLyear2],[FSLyear3],[FSLyear4],[FSLyear5],[FSLTotal],[FVLyear1],[FVLyear2],[FVLyear3],[FVLyear4],[FVLyear5],[FVLTotal],:paymentsheetgroupid,GETDATE() FROM  [TBL_PRICESHEET] where [PriceSheetGroupId]=:oldid',
                                                        { replacements: { oldid: PaymentModel.ExisitingPriceGroupId, paymentsheetgroupid: PaymentModel.SheetId }, type: sequelize.QueryTypes.SELECT, transaction: t })
                                                        .then(function () {
                                                            sequelize.query('insert into [TBL_GROSSMARGIN]([MAINTANACEvalue],[IPvalue],[HOSTEDvalue],[PSvalue],[RESOURCINGvalue],[TRADINGvalue],[CONSULTINGvalue],[MAINTANACE],[IP],[HOSTED],[PS],[RESOURCING],[TRADING],[CONSULTING],[MarginGroupId]) SELECT [MAINTANACEvalue],[IPvalue],[HOSTEDvalue],[PSvalue],[RESOURCINGvalue],[TRADINGvalue],[CONSULTINGvalue],[MAINTANACE],[IP],[HOSTED],[PS],[RESOURCING],[TRADING],[CONSULTING],:paymentsheetgroupid FROM [TBL_GROSSMARGIN] where MarginGroupId =:oldid', { replacements: { oldid: PaymentModel.ExisitingPriceGroupId, paymentsheetgroupid: PaymentModel.SheetId }, type: sequelize.QueryTypes.SELECT, transaction: t })
                                                                .then(function () {
                                                                    Addinternalcall(PaymentModel, t, deferred);
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
                            IsLocked: false, LockedUser: '', LockStartTime: null, LockedIn: '', PYUpdatedBy: PaymentModel.Authour, IsPriceSheetUpdated: false
                        }, { where: { PriceSheetId: PaymentModel.SheetId } }, { transaction: t })
                            .then(function () {
                                logger.info('reached here');
                                models.PAYMENTSHEET.destroy({ where: { PaymentSheetGroupId: PaymentModel.SheetId }, truncate: false }, { transaction: t })
                                    .then(function () {
                                        logger.info('destroyed');
                                        Addinternalcall(PaymentModel, t, deferred);
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



    GetPaymentSheetbyOppGroup: function (oppId, PaymentGroupId) {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT P.[Id],P.[PaymentCode],P.SubPaymentCode,P.MilestoneDescription,PM.VendorBreakdown,PM.PercentageType,[Iyear1],[Iyear2],[Iyear3],[Iyear4],[Iyear5],[paymentTerms],[percentageTotal],[OEMHWandSW],[OEMServices],[OEMPS],[OEMOther],[SERVSW],[SERVServices],[SERVPS],[SERVConsulting],[SERVCare],[SERVOther] ,[SERVResource],[SERVTM],[SERVHosted],[PaymentSheetGroupId] FROM [dbo].[TBL_PAYMENTSHEET] P join TBL_PAYMENT_MILESTONE PM on P.PaymentCode = PM.PaymentCode where P.PaymentSheetGroupId=:paymentsheetgroupid Order by PM.Id', { replacements: { paymentsheetgroupid: PaymentGroupId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
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

    GetPaymentSheetbyOppGroupforExcel: function (oppId, PaymentGroupId) {
        var deferred = q.defer();
        try {
            sequelize.query('SELECT P.[Id],P.[PaymentCode],P.SubPaymentCode,P.MilestoneDescription,PM.VendorBreakdown,PM.PercentageType,[Iyear1],[Iyear2],[Iyear3],[Iyear4],[Iyear5],[paymentTerms],[percentageTotal],[OEMHWandSW],[OEMServices],[OEMPS],[OEMOther],[SERVSW],[SERVServices],[SERVPS],[SERVConsulting],[SERVCare],[SERVOther] ,[SERVResource],[SERVTM],[SERVHosted],[PaymentSheetGroupId] FROM [dbo].[TBL_PAYMENTSHEET] P left join TBL_PAYMENT_MILESTONE PM on P.PaymentCode = PM.PaymentCode where P.PaymentSheetGroupId= :paymentsheetgroupid Order by PM.Id', { replacements: { paymentsheetgroupid: PaymentGroupId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
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

    //payment milestone data
    GetPaymentMilestone: function (milesId) {
        logger.info('Start fetching the payment milestone');
        var deferred = q.defer();
        try {
            if (milesId != null || milesId != undefined) {
                logger.info('Start fetching the payment milestone for Id ' + milesId);
                models.PaymentMilestone.findOne({ where: { Id: milesId } })
                    .then(function (milestone) { deferred.resolve(milestone); })
                    .catch(function (err) { logger.error('GetPaymentMilestone ' + err); deferred.reject(err) });
            }
            else {
                models.PaymentMilestone.findAll()
                    .then(function (milestone) { deferred.resolve(milestone); })
                    .catch(function (err) { logger.error('GetPaymentMilestone ' + err); deferred.reject(err) });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    ModifyPaymentMilestone: function (milestone) {
        logger.info('Updating payment milestone..');
        var deferred = q.defer();
        try {
            if (milestone != null) {
                models.PaymentMilestone.update({
                    MilestoneDescription: milestone.MilestoneDescription,
                    VendorBreakdown: milestone.VendorBreakdown,
                    PercentageType: milestone.PercentageType
                }, { where: { PaymentCode: milestone.PaymentCode } })
                    .then(function (milestone) { deferred.resolve(milestone); })
                    .catch(function (err) { logger.error('ModifyPaymentMilestone ' + err); deferred.reject(err) });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    }
    //payment milestone data
}

module.exports.PaymentModel = PaymentModel;

function Addinternalcall(PaymentModel, t, deferred) {
    try {
        if (t != null && t != undefined) {
            models.PAYMENTSHEET.bulkCreate(PaymentModel.paymentsheet, { transaction: t }, { omitNull: true })
                .then(function () {
                    t.commit();
                    models.PriceVersionMap.findAll({ where: { PriceSheetId: PaymentModel.SheetId } })
                        .then(function (opp) {
                            deferred.resolve(opp[0]);
                        }).catch(function (err) {
                            logger.info('unable to get ' + err);
                            deferred.reject(err);
                        });

                    logger.info('Payment data locked in payment map table')
                }).catch(function (err) {
                    t.rollback();
                    logger.info('unable to save ' + err);
                    deferred.reject(err);
                });

        }
    }
    catch (Ex) {
        logger.info('ex' + Ex);
        deferred.reject(Ex);
    }
}