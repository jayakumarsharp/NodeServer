var express = require('express');
var excelbuilder = require('msexcel-builder');
var models = require(__base + "Models/PaymentSheetModel.js");
var model1 = require(__base + "Models/PricingSheetModel.js");
var model2 = require(__base + "Models/GrossMarginModel.js");

var router = express.Router();
var _ = require('underscore')._;
var moment = require('moment');
var logger = require(__base + 'Models/logger');

router.get('/GetPaymentSheetbyOppGroup', function (req, res) {
    console.log('called GetPaymentSheetbyOppGroup')
    var pcv = req.query;
    models.PaymentModel.GetPaymentSheetbyOppGroup(pcv.oppId, pcv.PaymentGroupId).then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.get('/GetPaymentDefaultConfiguration', function (req, res) {
    var pcs = req.query;
    models.PaymentModel.GetPaymentDefaultConfiguration().then(function (pcs) {
        res.status(200).json(pcs);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetMilestone', function (req, res) {
    var pms = req.query;
    models.PaymentModel.GetPaymentMilestone(pms.Id).then(function (milestone) {
        res.status(200).json(milestone);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.post('/AddPaymentSheet', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    models.PaymentModel.AddPaymentSheet(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.post('/ModifyPaymentMilestone', function (req, res) {
    var pms = req.body;
    models.PaymentModel.ModifyPaymentMilestone(pms).then(function (milestone) {
        res.status(200).json(milestone);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })

});


router.get('/GetPaymentPeriod', function (req, res) {

    models.PaymentConfigModel.GetPaymentPeriod().then(function (milestone) {
        res.status(200).json(milestone);
    }).catch(function (err) {
        res.status(500).json(err);
    })
});



router.post('/ExportToExcelSheet', function (req, res) {
    var data = req.body;
    try {

        var PricingsheetData = [];
        var PaymentsheetData = [];
        var GrossmarginData = [];
        var GlobalOppid;
        var timestamp = moment().format("YYYYMMDDhhmmss")
        var filename = 'PriceSheet' + timestamp + '.xlsx';
        var workbook = excelbuilder.createWorkbook('./ExportFiles/', filename)


        models.PaymentModel.GetPaymentSheetbyOppGroupforExcel(data.oppId, data.PaymentGroupId).then(function (result) {
            PaymentsheetData = result;

            model1.PricingModel.GetPriceSheetbyOpportunityPCGroupID(data.oppId, data.PaymentGroupId).then(function (result1) {
                PricingsheetData = result1;

                model2.GrossmarginModel.GetGrossmargintbyOppGroup(data.oppId, data.PaymentGroupId).then(function (result2) {

                    GrossmarginData = result2;

                    logger.info(JSON.stringify(GrossmarginData));
                    logger.info(JSON.stringify(PaymentsheetData));
                    logger.info(JSON.stringify(PricingsheetData));

                    //pricing excel
                    var len = PricingsheetData.length;
                    var excelmaxrow = len;
                    if (len == 0) {
                        excelmaxrow = 1;
                    }
                    else {
                        excelmaxrow += 10;
                    }
                    var sheet1 = workbook.createSheet('Pricing Sheet', 100, excelmaxrow);
                    console.log('sheet created')
                    sheet1.set(1, 1, 'Opp. ID');
                    sheet1.set(2, 1, 'Servion Legal Entity');
                    sheet1.set(3, 1, 'Vendor');
                    sheet1.set(4, 1, 'LOB');
                    sheet1.set(5, 1, 'Component');
                    sheet1.set(6, 1, 'Component Type');
                    sheet1.set(7, 1, 'List/Transfer (Year 1)');
                    sheet1.set(8, 1, 'List/Transfer (Year 2)');
                    sheet1.set(9, 1, 'List/Transfer (Year 3)');
                    sheet1.set(10, 1, 'List/Transfer (Year 4)');
                    sheet1.set(11, 1, 'List/Transfer (Year 5)');
                    sheet1.set(12, 1, 'Cost (Year 1)');
                    sheet1.set(13, 1, 'Cost (Year 2)');
                    sheet1.set(14, 1, 'Cost (Year 3)');
                    sheet1.set(15, 1, 'Cost (Year 4)');
                    sheet1.set(16, 1, 'Cost (Year 5)');
                    sheet1.set(17, 1, 'ACV (Gross) (Year 1)');
                    sheet1.set(18, 1, 'ACV (Gross) (Year 2)');
                    sheet1.set(19, 1, 'ACV (Gross) (Year 3)');
                    sheet1.set(20, 1, 'ACV (Gross) (Year 4)');
                    sheet1.set(21, 1, 'ACV (Gross) (Year 5)');
                    sheet1.set(22, 1, 'ACV (VAD) (Year 1)');
                    sheet1.set(23, 1, 'ACV (VAD) (Year 2)');
                    sheet1.set(24, 1, 'ACV (VAD) (Year 3)');
                    sheet1.set(25, 1, 'ACV (VAD) (Year 4)');
                    sheet1.set(26, 1, 'ACV (VAD) (Year 5)');
                    sheet1.set(27, 1, 'PO Currency');
                    sheet1.set(28, 1, 'USD to PO Currency Convertion Rate');
                    sheet1.set(29, 1, 'Top Line_(PO Currency)_(Year 1)');
                    sheet1.set(30, 1, 'Top Line_(PO Currency)_(Year 2)');
                    sheet1.set(31, 1, 'Top Line_(PO Currency)_(Year 3)');
                    sheet1.set(32, 1, 'Top Line_(PO Currency)_(Year 4)');
                    sheet1.set(33, 1, 'Top Line_(PO Currency)_(Year 5)');
                    sheet1.set(34, 1, 'Cost_(PO Currency)_(Year 1)');
                    sheet1.set(35, 1, 'Cost_(PO Currency)_(Year 2)');
                    sheet1.set(36, 1, 'Cost_(PO Currency)_(Year 3)');
                    sheet1.set(37, 1, 'Cost_(PO Currency)_(Year 4)');
                    sheet1.set(38, 1, 'Cost_(PO Currency)_(Year 5)');

                    sheet1.set(39, 1, 'VAD_(PO Currency)_(Year 1)');
                    sheet1.set(40, 1, 'VAD_(PO Currency)_(Year 2)');
                    sheet1.set(41, 1, 'VAD_(PO Currency)_(Year 3)');
                    sheet1.set(42, 1, 'VAD_(PO Currency)_(Year 4)');
                    sheet1.set(43, 1, 'VAD_(PO Currency)_(Year 5)');


                    //sheet1.fill(1, 1, { type: 'solid', fgColor: 'FFFF0000', bgColor: '64' });
                    //sheet1.fill(1, 2, { type: 'solid', fgColor: 'FFFF0000', bgColor: '64' });


                    if (len > 0)
                        len++;
                    for (var i = 2; i <= len; i++) {
                        GlobalOppid = PricingsheetData[i - 2].OppId;
                        sheet1.set(1, i, PricingsheetData[i - 2].OppId);
                        sheet1.set(2, i, PricingsheetData[i - 2].ServionLegalEntity);
                        sheet1.set(3, i, PricingsheetData[i - 2].oem);
                        sheet1.set(4, i, PricingsheetData[i - 2].LOBName);
                        sheet1.set(5, i, PricingsheetData[i - 2].Component);
                        sheet1.set(6, i, PricingsheetData[i - 2].componenttype);
                        sheet1.set(7, i, PricingsheetData[i - 2].Lyear1);
                        sheet1.set(8, i, PricingsheetData[i - 2].Lyear2);
                        sheet1.set(9, i, PricingsheetData[i - 2].Lyear3);
                        sheet1.set(10, i, PricingsheetData[i - 2].Lyear4);
                        sheet1.set(11, i, PricingsheetData[i - 2].Lyear5);
                        sheet1.set(12, i, PricingsheetData[i - 2].Syear1);
                        sheet1.set(13, i, PricingsheetData[i - 2].Syear2);
                        sheet1.set(14, i, PricingsheetData[i - 2].Syear3);
                        sheet1.set(15, i, PricingsheetData[i - 2].Syear4);
                        sheet1.set(16, i, PricingsheetData[i - 2].Syear5);
                        sheet1.set(17, i, PricingsheetData[i - 2].Cyear1);
                        sheet1.set(18, i, PricingsheetData[i - 2].Cyear2);
                        sheet1.set(19, i, PricingsheetData[i - 2].Cyear3);
                        sheet1.set(20, i, PricingsheetData[i - 2].Cyear4);
                        sheet1.set(21, i, PricingsheetData[i - 2].Cyear5);
                        sheet1.set(22, i, PricingsheetData[i - 2].Vyear1);
                        sheet1.set(23, i, PricingsheetData[i - 2].Vyear2);
                        sheet1.set(24, i, PricingsheetData[i - 2].Vyear3);
                        sheet1.set(25, i, PricingsheetData[i - 2].Vyear4);
                        sheet1.set(26, i, PricingsheetData[i - 2].Vyear5);
                        sheet1.set(27, i, PricingsheetData[i - 2].Currency);
                        sheet1.set(28, i, PricingsheetData[i - 2].ConversionRate);
                        sheet1.set(29, i, PricingsheetData[i - 2].FWDLyear1);
                        sheet1.set(30, i, PricingsheetData[i - 2].FWDLyear2);
                        sheet1.set(31, i, PricingsheetData[i - 2].FWDLyear3);
                        sheet1.set(32, i, PricingsheetData[i - 2].FWDLyear4);
                        sheet1.set(33, i, PricingsheetData[i - 2].FWDLyear5);
                        sheet1.set(34, i, PricingsheetData[i - 2].FSLyear1);
                        sheet1.set(35, i, PricingsheetData[i - 2].FSLyear2);
                        sheet1.set(36, i, PricingsheetData[i - 2].FSLyear3);
                        sheet1.set(37, i, PricingsheetData[i - 2].FSLyear4);
                        sheet1.set(38, i, PricingsheetData[i - 2].FSLyear5);
                        sheet1.set(39, i, PricingsheetData[i - 2].FVLyear1);
                        sheet1.set(40, i, PricingsheetData[i - 2].FVLyear2);
                        sheet1.set(41, i, PricingsheetData[i - 2].FVLyear3);
                        sheet1.set(42, i, PricingsheetData[i - 2].FVLyear4);
                        sheet1.set(43, i, PricingsheetData[i - 2].FVLyear5);
                    }

                    //pricesheet excel export




                    //grossmargin excel


                    var sheet3 = workbook.createSheet('Gross Margin', 100, 100);

                    sheet3.set(1, 1, 'Opp. ID');
                    sheet3.set(2, 1, 'LOB');
                    sheet3.set(3, 1, 'Gross Margin (%) ');


                    sheet3.set(1, 2, GlobalOppid);
                    sheet3.set(2, 2, "MAINTENANCE");


                    sheet3.set(1, 3, GlobalOppid);
                    sheet3.set(2, 3, "IP");


                    sheet3.set(1, 4, GlobalOppid);
                    sheet3.set(2, 4, "HOSTED");


                    sheet3.set(1, 5, GlobalOppid);
                    sheet3.set(2, 5, "PS");

                    sheet3.set(1, 6, GlobalOppid);
                    sheet3.set(2, 6, "RESOURCING");

                    sheet3.set(1, 7, GlobalOppid);
                    sheet3.set(2, 7, "TRADING");


                    sheet3.set(1, 8, GlobalOppid);
                    sheet3.set(2, 8, "CONSULTING");
                    if (GrossmarginData.length > 0) {
                        sheet3.set(3, 2, GrossmarginData[0].MAINTENANCE);
                        sheet3.set(3, 3, GrossmarginData[0].IP);
                        sheet3.set(3, 4, GrossmarginData[0].HOSTED);
                        sheet3.set(3, 5, GrossmarginData[0].PS);
                        sheet3.set(3, 6, GrossmarginData[0].RESOURCING);
                        sheet3.set(3, 7, GrossmarginData[0].TRADING);
                        sheet3.set(3, 8, GrossmarginData[0].CONSULTING);
                    }

                    //grossmargin excel

                    //Staff Hours
                    var sheet4 = workbook.createSheet('Staff Hours', 100, 100);
                    sheet4.set(1, 1, 'Opp. ID');
                    sheet4.set(2, 1, 'Phase');
                    sheet4.set(3, 1, 'BU Senior Staff Hours');
                    sheet4.set(4, 1, 'BU Junior Staff Hours');
                    sheet4.set(5, 1, 'CDO Senior Staff Hours');
                    sheet4.set(6, 1, 'CDO Junior Staff Hours');
                    sheet4.set(7, 1, 'BU Cost (USD)');
                    sheet4.set(8, 1, 'CDO Cost (USD)');
                    sheet4.set(9, 1, 'T&E (USD)');
                    sheet4.set(10, 1, 'Business Days');


                    // sheet4.set(1, 2, 0);
                    // sheet4.set(2, 2, 0);
                    // sheet4.set(3, 2, 0);
                    // sheet4.set(4, 2, 0);
                    // sheet4.set(5, 2, 0);
                    // sheet4.set(6, 2, 0);
                    // sheet4.set(7, 2, 0);
                    // sheet4.set(8, 2, 0);
                    // sheet4.set(9, 2, 0);
                    // sheet4.set(10, 2, 0);


                    //Staff Hours


                    //payment sheet export



                    var sheet2 = workbook.createSheet('Invoice Milestone', 100, 100);

                    sheet2.set(1, 1, 'Opp. ID');
                    sheet2.set(2, 1, 'Milestone Description');
                    sheet2.set(3, 1, 'Vendor');
                    sheet2.set(4, 1, 'Milestone Value (USD) - Year 1');
                    sheet2.set(5, 1, 'Milestone Value (USD) - Year 2');
                    sheet2.set(6, 1, 'Milestone Value (USD) - Year 3');
                    sheet2.set(7, 1, 'Milestone Value (USD) - Year 4');
                    sheet2.set(8, 1, 'Milestone Value (USD) - Year 5');
                    sheet2.set(9, 1, 'Milestone (%)');
                    sheet2.set(10, 1, 'Payment Terms');

                    var dynamicrowId = 2;
                    var dynamcicolId = 1;
                    //  sheet2.set(dynamicrowId, 1, 'Advance with PO');
                    for (var l = 0; l < PaymentsheetData.length; l++) {
                        if (PaymentsheetData[l].PaymentCode == 'S1') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'S1');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }
                        if (PaymentsheetData[l].PaymentCode == 'S2') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'S2');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }
                        if (PaymentsheetData[l].PaymentCode == 'S3') {
                            var result = directdata(GlobalOppid, PaymentsheetData, 'S3');
                            for (var i = 0; i < result.length; i++) {
                                sheet2.set(1, dynamicrowId, result[i].Oppid);
                                sheet2.set(2, dynamicrowId, result[i].MilestoneDescription);
                                sheet2.set(3, dynamicrowId, result[i].Vendor);
                                sheet2.set(4, dynamicrowId, result[i].MilestonevalueYear1);
                                sheet2.set(5, dynamicrowId, result[i].MilestonevalueYear2);
                                sheet2.set(6, dynamicrowId, result[i].MilestonevalueYear3);
                                sheet2.set(7, dynamicrowId, result[i].MilestonevalueYear4);
                                sheet2.set(8, dynamicrowId, result[i].MilestonevalueYear5);
                                sheet2.set(9, dynamicrowId, result[i].MilestonePercent);
                                sheet2.set(10, dynamicrowId, result[i].PaymentTerms);

                                dynamicrowId++;
                            }
                        }
                        if (PaymentsheetData[l].PaymentCode == 'S4') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'S4');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }
                        if (PaymentsheetData[l].PaymentCode == 'S5') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'S5');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }
                        if (PaymentsheetData[l].PaymentCode == 'S6') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'S6');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }
                        if (PaymentsheetData[l].PaymentCode == 'S7') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'S7');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }
                        if (PaymentsheetData[l].PaymentCode == 'S8') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'S8');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }
                        if (PaymentsheetData[l].PaymentCode == 'SC1') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'SC1');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }

                        if (PaymentsheetData[l].PaymentCode == 'SC2') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'SC2');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }

                        if (PaymentsheetData[l].PaymentCode == 'SC3') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'SC3');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }

                        if (PaymentsheetData[l].PaymentCode == 'C1') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'C1');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }

                        if (PaymentsheetData[l].PaymentCode == 'C2') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'C2');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }

                        if (PaymentsheetData[l].PaymentCode == 'C3') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'C3');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }

                        if (PaymentsheetData[l].PaymentCode == 'C4') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'C4');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }
                        if (PaymentsheetData[l].PaymentCode == 'C5') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'C5');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }
                        if (PaymentsheetData[l].PaymentCode == 'S9') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'S9');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }
                        if (PaymentsheetData[l].PaymentCode == 'S10') {
                            var result = calculatedata(GlobalOppid, PaymentsheetData, 'S10');
                            sheet2.set(1, dynamicrowId, result.Oppid);
                            sheet2.set(2, dynamicrowId, result.MilestoneDescription);
                            sheet2.set(3, dynamicrowId, result.Vendor);
                            sheet2.set(4, dynamicrowId, result.MilestonevalueYear1);
                            sheet2.set(5, dynamicrowId, result.MilestonevalueYear2);
                            sheet2.set(6, dynamicrowId, result.MilestonevalueYear3);
                            sheet2.set(7, dynamicrowId, result.MilestonevalueYear4);
                            sheet2.set(8, dynamicrowId, result.MilestonevalueYear5);
                            sheet2.set(9, dynamicrowId, result.MilestonePercent);
                            sheet2.set(10, dynamicrowId, result.PaymentTerms);
                            dynamicrowId++;
                        }


                    }
                    //payment sheet export


                    //LOB_CLOB_GLOB
                    var sheet5 = workbook.createSheet('LOB_CLOB_GLOB', 100, 100);
                    sheet5.set(1, 1, 'Opp. ID');
                    sheet5.set(2, 1, 'PRINCIPAL');
                    sheet5.set(3, 1, 'SOURCE');
                    sheet5.set(4, 1, 'LOB');
                    sheet5.set(5, 1, 'CLOB');
                    sheet5.set(6, 1, 'GLOB');
                    sheet5.set(7, 1, 'List/Transfer Price (Year 1)');
                    sheet5.set(8, 1, 'List/Transfer Price (Year 2)');
                    sheet5.set(9, 1, 'List/Transfer Price (Year 3)');
                    sheet5.set(10, 1, 'List/Transfer Price (Year 4)');
                    sheet5.set(11, 1, 'List/Transfer Price (Year 5)');
                    sheet5.set(12, 1, 'Cost Price (Year 1)');
                    sheet5.set(13, 1, 'Cost Price (Year 2)');
                    sheet5.set(14, 1, 'Cost Price (Year 3)');
                    sheet5.set(15, 1, 'Cost Price (Year 4)');
                    sheet5.set(16, 1, 'Cost Price (Year 5)');
                    sheet5.set(17, 1, 'ACV (Gross) (Year 1)');
                    sheet5.set(18, 1, 'ACV (Gross) (Year 2)');
                    sheet5.set(19, 1, 'ACV (Gross) (Year 3)');
                    sheet5.set(20, 1, 'ACV (Gross) (Year 4)');
                    sheet5.set(21, 1, 'ACV (Gross) (Year 5)');
                    sheet5.set(22, 1, 'ACV (VAD) (Year 1)');
                    sheet5.set(23, 1, 'ACV (VAD) (Year 2)');
                    sheet5.set(24, 1, 'ACV (VAD) (Year 3)');
                    sheet5.set(25, 1, 'ACV (VAD) (Year 4)');
                    sheet5.set(26, 1, 'ACV (VAD) (Year 5)');
                    // sheet5.set(27, 1, 'T&E (USD)');
                    // sheet5.set(28, 1, 'Business Days');
                    sheet5.set(27, 1, 'PS BU Senior Staff Days');
                    sheet5.set(28, 1, 'PS BU Junior Staff Days');
                    sheet5.set(29, 1, 'PS CDO Senior Staff Days');
                    sheet5.set(30, 1, 'PS CDO Junior Staff Days');
                    sheet5.set(31, 1, 'PS-BU Cost (USD)');
                    sheet5.set(32, 1, 'PS-CDO Cost (USD)');


                    // sheet5.set(1, 2, 0);
                    // sheet5.set(2, 2, 0);
                    // sheet5.set(3, 2, 0);
                    // sheet5.set(4, 2, 0);
                    // sheet5.set(5, 2, 0);
                    // sheet5.set(6, 2, 0);
                    // sheet5.set(7, 2, 0);
                    // sheet5.set(8, 2, 0);
                    // sheet5.set(9, 2, 0);
                    // sheet5.set(10, 2, 0);
                    // sheet5.set(11, 2, 0);
                    // sheet5.set(12, 2, 0);
                    // sheet5.set(13, 2, 0);
                    // sheet5.set(14, 2, 0);
                    // sheet5.set(15, 2, 0);
                    // sheet5.set(16, 2, 0);
                    // sheet5.set(17, 2, 0);
                    // sheet5.set(18, 2, 0);
                    // sheet5.set(19, 2, 0);
                    // sheet5.set(20, 2, 0);
                    // sheet5.set(21, 2, 0);
                    // sheet5.set(22, 2, 0);
                    // sheet5.set(23, 2, 0);
                    // sheet5.set(24, 2, 0);
                    // sheet5.set(25, 2, 0);
                    // sheet5.set(26, 2, 0);
                    // sheet5.set(27, 2, 0);
                    // sheet5.set(28, 2, 0);
                    // sheet5.set(29, 2, 0);
                    // sheet5.set(30, 2, 0);
                    // sheet5.set(31, 2, 0);
                    // sheet5.set(32, 2, 0);



                    //Staff Hours

                    workbook.save(function (ok) {
                        if (!ok)
                            workbook.cancel();
                        else
                            console.log('congratulations, your workbook created');
                        var filedetails = { name: filename }
                        res.status(200).json(filedetails);
                        console.log('congratulations, your workbook created');
                    });


                }).catch(function (err) {
                    logger.info('err' + err);
                    res.status(500).json(err);
                })

            }).catch(function (err) {
                logger.info('err' + err);
                res.status(500).json(err);
            })
        }).catch(function (err) {
            logger.info('err' + err);
            res.status(500).json(err);
        })

    }
    catch (ex) {
        logger.info('err' + err);
        console.log('error occured' + ex)
    }

});

module.exports = router;


function calculatedata(Oppid, data, MilestoneKey) {
    var Json = { Oppid: '', MilestoneDescription: '', Vendor: '', MilestonePercent: '', MilestonevalueYear1: 0, MilestonevalueYear2: 0, MilestonevalueYear3: 0, MilestonevalueYear4: 0, MilestonevalueYear5: 0, PaymentTerms: '' };

    _.each(data, function (element, index) {
        if (element['PaymentCode'] == MilestoneKey || element['SubPaymentCode'] == MilestoneKey) {
            if (element['PaymentCode'] == MilestoneKey) {
                Json.Oppid = Oppid;
                Json.MilestoneDescription = element['MilestoneDescription'];
                Json.PaymentTerms = element['paymentTerms'];
            }

            //Json.Vendor
            Json.MilestonePercent = element['percentageTotal'];
            Json.MilestonevalueYear1 += parseFloat(element['Iyear1']);
            Json.MilestonevalueYear2 += parseFloat(element['Iyear2']);
            Json.MilestonevalueYear3 += parseFloat(element['Iyear3']);
            Json.MilestonevalueYear4 += parseFloat(element['Iyear4']);
            Json.MilestonevalueYear5 += parseFloat(element['Iyear5']);
        }
    });

    return Json;
}


function directdata(Oppid, data, MilestoneKey) {
    var array = [];

    _.each(data, function (element, index) {
        var Json = { Oppid: '', MilestoneDescription: '', Vendor: '', MilestonePercent: '', MilestonevalueYear1: 0, MilestonevalueYear2: 0, MilestonevalueYear3: 0, MilestonevalueYear4: 0, MilestonevalueYear5: 0, PaymentTerms: '' };

        if (element['PaymentCode'] == MilestoneKey || element['SubPaymentCode'] == MilestoneKey) {
            var PaymentTerms = '';
            var MilestoneDescription = '';
            if (element['PaymentCode'] == MilestoneKey) {
                MilestoneDescription = element['MilestoneDescription']
                PaymentTerms = element['paymentTerms'];
            }
            else {
                Json.PaymentTerms = PaymentTerms;
                Json.MilestoneDescription = "Delivery of Hardware & Software License components (First Delivery of a multi-vendor scenario)";
                Json.Vendor = element['MilestoneDescription'];
                Json.Oppid = Oppid;
                Json.MilestonePercent = element['percentageTotal'];
                Json.MilestonevalueYear1 = parseFloat(element['Iyear1']);
                Json.MilestonevalueYear2 = parseFloat(element['Iyear2']);
                Json.MilestonevalueYear3 = parseFloat(element['Iyear3']);
                Json.MilestonevalueYear4 = parseFloat(element['Iyear4']);
                Json.MilestonevalueYear5 = parseFloat(element['Iyear5']);
                array.push(Json);
            }
        }

    });
    //logger.info(JSON.stringify('arra' + JSON.stringify(array)));
    return array;
}