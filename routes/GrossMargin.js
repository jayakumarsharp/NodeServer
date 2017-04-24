var express = require('express');
var models = require(__base + "Models/GrossMarginModel.js");
var router = express.Router();
var excelbuilder = require('msexcel-builder');
var moment = require('moment');

router.get('/GetGrossmargintbyOppGroup', function (req, res) {
    console.log('called GetGrossmarginbyOppGroup')
    var pcv = req.query;
    models.GrossmarginModel.GetGrossmargintbyOppGroup(pcv.oppId, pcv.PaymentGroupId).then(function (result) {
        res.status(200).json(result);
    })
  .catch(function (err) {
      res.status(500).json(err);
  })
});


router.post('/AddGrossmargin', function (req, res) {
    var Pricemodel = req.body;
    //console.log(req);
    console.log(JSON.stringify(Pricemodel));
    models.GrossmarginModel.AddGrossMargin(Pricemodel).then(function (Pricemodel) {
        res.status(200).json(Pricemodel);
    })
 .catch(function (err) {
     res.status(500).json(err);
 })
});




router.post('/ExportToExcelSheet', function (req, res) {
    var data = req.body;
    try {
        var timestamp = moment().format("YYYYMMDDhhmmss")
        var filename = 'GrossMargin' + timestamp + '.xlsx';
        var workbook = excelbuilder.createWorkbook('./ExportFiles/', filename)

        var sheet1 = workbook.createSheet('sheet1', 100, 100);
        console.log('sheet created')
        sheet1.set(1, 1, 'Opp. ID');
        sheet1.set(2, 1, 'LOB');
        sheet1.set(3, 1, 'Gross Margin (%) ');


        sheet1.set(1, 2, data.OppId);
        sheet1.set(2, 2, "MAINTANACE");
        sheet1.set(3, 2, data.MAINTANACE);

        sheet1.set(1, 3, data.OppId);
        sheet1.set(2, 3, "IP");
        sheet1.set(3, 3, data.IP);

        sheet1.set(1, 4, data.OppId);
        sheet1.set(2, 4, "HOSTED");
        sheet1.set(3, 4, data.HOSTED);


        sheet1.set(1, 5, data.OppId);
        sheet1.set(2, 5, "PS");
        sheet1.set(3, 5, data.PS);

        sheet1.set(1, 6, data.OppId);
        sheet1.set(2, 6, "RESOURCING");
        sheet1.set(3, 6, data.RESOURCING);

        sheet1.set(1, 7, data.OppId);
        sheet1.set(2, 7, "TRADING");
        sheet1.set(3, 7, data.TRADING);

        sheet1.set(1, 8, data.OppId);
        sheet1.set(2, 8, "CONSULTING");
        sheet1.set(3, 8, data.CONSULTING);


        workbook.save(function (ok) {
            if (!ok)
                workbook.cancel();
            else
                console.log('congratulations, your workbook created');
        });
        var filedetails = { name: filename }
        res.status(200).json(filedetails);
    }
    catch (ex) {
        console.log('error occured' + ex)
    }

});

module.exports = router;


