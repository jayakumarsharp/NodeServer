var express = require('express');
var excelbuilder = require('msexcel-builder');
var models = require(__base + "Models/PricingSheetModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');
var moment = require('moment');

router.get('/GetAllLOBList', function (req, res) {
    var pcs = req.query;
    models.PricingModel.GetAllLOBList().then(function (pcs) {
        res.status(200).json(pcs);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/getpricesheetbyOppId', function (req, res) {
    var pcs = req.query;
    console.log(pcs);
    models.PricingModel.GetPriceSheet(pcs.oppId).then(function (pcs) {
        res.status(200).json(pcs);
    })

        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/AddPriceSheet', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('PRicesheet data' + JSON.stringify(Pricemodel))
    models.PricingModel.AddPriceSheet(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/UpdatePriceSheet', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    logger.info('PRicesheet data update' + JSON.stringify(Pricemodel))
    models.PricingModel.UpdatePriceSheet(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/ExportToExcelSheet', function (req, res) {
    var data = req.body;
    try {

        // get json from pricing 
        

        var timestamp = moment().format("YYYYMMDDhhmmss")
        var filename = 'PriceSheet' + timestamp + '.xlsx';
        var workbook = excelbuilder.createWorkbook('./ExportFiles/', filename)
        var len = data.length;
        var excelmaxrow = len;
        if (len == 0) {
            excelmaxrow = 1;
        }
        else {
            excelmaxrow += 10;
        }
        var sheet1 = workbook.createSheet('sheet1', 100, excelmaxrow);
        console.log('sheet created')
        sheet1.set(1, 1, 'Opp. ID');
        sheet1.set(2, 1, 'Servion Legal Entity');
        sheet1.set(3, 1, 'Vendor');
        sheet1.set(4, 1, 'LOB');
        sheet1.set(5, 1, 'Component');
        sheet1.set(6, 1, 'Component Type');
        sheet1.set(7, 1, 'List/Transfer (Year 1)');
        sheet1.set(8, 1, 'List/Transfer (Year 1)');
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
        console.log('length' + len)
        for (var i = 2; i <= len; i++) {
            console.log(i + 'start')
            sheet1.set(1, i, data[i - 2].OppId);
            sheet1.set(2, i, data[i - 2].ServionLegalEntity);
            sheet1.set(3, i, data[i - 2].oem);
            sheet1.set(4, i, data[i - 2].LOBName);
            sheet1.set(5, i, data[i - 2].Component);
            sheet1.set(6, i, data[i - 2].componenttype);
            sheet1.set(7, i, data[i - 2].Lyear1);
            sheet1.set(8, i, data[i - 2].Lyear2);
            sheet1.set(9, i, data[i - 2].Lyear3);
            sheet1.set(10, i, data[i - 2].Lyear4);
            sheet1.set(11, i, data[i - 2].Lyear5);
            sheet1.set(12, i, data[i - 2].Syear1);
            sheet1.set(13, i, data[i - 2].Syear2);
            sheet1.set(14, i, data[i - 2].Syear3);
            sheet1.set(15, i, data[i - 2].Syear4);
            sheet1.set(16, i, data[i - 2].Syear5);
            sheet1.set(17, i, data[i - 2].Cyear1);
            sheet1.set(18, i, data[i - 2].Cyear2);
            sheet1.set(19, i, data[i - 2].Cyear3);
            sheet1.set(20, i, data[i - 2].Cyear4);
            sheet1.set(21, i, data[i - 2].Cyear5);
            sheet1.set(22, i, data[i - 2].Vyear1);
            sheet1.set(23, i, data[i - 2].Vyear2);
            sheet1.set(24, i, data[i - 2].Vyear3);
            sheet1.set(25, i, data[i - 2].Vyear4);
            sheet1.set(26, i, data[i - 2].Vyear5);
            sheet1.set(27, i, data[i - 2].Currency);
            sheet1.set(28, i, data[i - 2].ConversionRate);
            sheet1.set(29, i, data[i - 2].FWDLyear1);
            sheet1.set(30, i, data[i - 2].FWDLyear2);
            sheet1.set(31, i, data[i - 2].FWDLyear3);
            sheet1.set(32, i, data[i - 2].FWDLyear4);
            sheet1.set(33, i, data[i - 2].FWDLyear5);
            sheet1.set(34, i, data[i - 2].FSLyear1);
            sheet1.set(35, i, data[i - 2].FSLyear2);
            sheet1.set(36, i, data[i - 2].FSLyear3);
            sheet1.set(37, i, data[i - 2].FSLyear4);
            sheet1.set(38, i, data[i - 2].FSLyear5);
            sheet1.set(39, i, data[i - 2].FVLyear1);
            sheet1.set(40, i, data[i - 2].FVLyear2);
            sheet1.set(41, i, data[i - 2].FVLyear3);
            sheet1.set(42, i, data[i - 2].FVLyear4);
            sheet1.set(43, i, data[i - 2].FVLyear5);
            console.log(i + 'end')
        }

        //create sheet 2
        var sheet2 = workbook.createSheet('sheet2', 100, 100);


        var sheet3 = workbook.createSheet('sheet2', 100, 100);


        workbook.save(function (ok) {
            if (!ok)
                workbook.cancel();
            else
                console.log('congratulations, your workbook created');
        });

        //var file = './ExportFiles/' + filename;
        //res.download(file); // Set disposition and send it.

        //res.status(200).json('PriceSheet-' + timestamp);
        //workbook.generate(function (err, jszip) {
        //    if (err)
        //        throw err;
        //    else {
        //        var buffer = jszip.generate({ type: "nodebuffer" });
        //        //require('fs').writeFile(workbook.fpath + '/' + workbook.fname, buffer, function (err) {

        //        //});
        //res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        //res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        //res.end(workbook, 'binary');
        //    }
        //});
        var filedetails = { name: filename }
        res.status(200).json(filedetails);
    }
    catch (ex) {
        console.log('error occured' + ex)
    }

});

router.get('/GetAllPriceType', function (req, res) {
    models.PricingModel.GetAllPriceType().then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetAllComponentType', function (req, res) {
    models.PricingModel.GetAllComponentType().then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/FinisdAnyVersionAvailable', function (req, res) {
    console.log('callede find')
    var pcv = req.query;
    models.PricingModel.FinisdAnyVersionAvailable(pcv.oppId).then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetAllVersionOpportunity', function (req, res) {
    console.log('callede version')
    var pcv = req.query;
    models.PricingModel.GetAllVersionOpportunity(pcv.oppId).then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetMaximumGroupPriceSheetId', function (req, res) {
    models.PricingModel.GetMaximumGroupPriceSheetId().then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetAllOpportunityVersion', function (req, res) {
    models.PricingModel.GetAllOpportunityVersion().then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetPriceSheetbyOpportunityPCGroupID', function (req, res) {
    console.log('called GetPriceSheetbyOpportunityPCGroupID')
    var pcv = req.query;
    models.PricingModel.GetPriceSheetbyOpportunityPCGroupID(pcv.oppId, pcv.PriceGroupId).then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetPriceSheetMapbyOppGroup', function (req, res) {
    console.log('called GetPriceSheetMapbyOppGroup')
    var pcv = req.query;
    models.PricingModel.GetPriceSheetMapbyOppGroup(pcv.oppId, pcv.PriceGroupId).then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetPriceSheetVersionsForOpp', function (req, res) {
    console.log('called GetPriceSheetVersionsForOpp')
    var pcv = req.query;
    models.PricingModel.GetPriceSheetVersionsForOpp(pcv.oppId).then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/LocktheSheetByGroupid', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);
    console.log(moment().format("YYYY MM DD hh:mm:ss"))
    models.PricingModel.LocktheSheetByGroupid(sheetdetail.OppId, sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp, sheetdetail.IsPriceSheetUpdated).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/IncreaseAdditionalTimeToSheet', function (req, res) {
    var sheetdetail = req.query;
    //console.log(req);

    models.PricingModel.IncreaseAdditionalTimeToSheet(sheetdetail.GroupId, sheetdetail.username, sheetdetail.LockedInApp).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })

        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetAllLockedPriceSheet', function (req, res) {
    var sheetdetail = req.query;
    models.PricingModel.GetAllLockedPriceSheet().then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/ReleaseSheetWhenExpired', function (req, res) {
    var pcs = req.query;
    console.log(pcs);
    models.PricingModel.ReleaseSheetWhenExpired(pcs.GroupId).then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/PricesheetFeedUpdatebyPayment', function (req, res) {
    var pcs = req.query;
    models.PricingModel.PricesheetFeedUpdatebyPayment(pcs.SheetId).then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

module.exports = router;


// var TimerJob = require('timer-jobs');
// var someTimer = new TimerJob({ interval: 60000 }, function (done) {
//    console.log('hey logged for a minute');
//    models.PricingModel.ReleaseSheetWhenExpired('');
//    done();
// });
// someTimer.start();


