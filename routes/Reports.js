var express = require('express');
var models = require(__base + "Models/ReportModel.js");
var router = express.Router();
var logger = require(__base + 'Models/logger');
var moment = require('moment');
var excelbuilder = require('msexcel-builder');

router.post('/GetOpportunityReport', function (req, res) {
    var config = req.body;
    models.ReportModel.GetOpportunityReport(config).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.post('/UpdateAction', function (req, res) {
    var config = req.body;
    models.ReportModel.UpdateAction(config).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.post('/ExportToExcelSheetOpp', function (req, res) {
    var data = req.body;
    try {
        logger.info('Exporting Opportunity Report.. ');

        var timestamp = moment().format("YYYYMMDDhhmmss")
        var filename = 'OpportunityWiseReport' + timestamp + '.xlsx';
        var workbook = excelbuilder.createWorkbook('./ExportFiles/', filename)
        var len = data.length;
        var excelmaxrow = len;
        if (len == 0) {
            excelmaxrow = 1;
        }
        else {
            excelmaxrow += 10;
        }
        var sheet1 = workbook.createSheet('OpportunityReport', 100, excelmaxrow);
        sheet1.set(1, 1, 'SBU');
        sheet1.set(2, 1, 'Region');
        sheet1.set(3, 1, 'Opportunity ID');
        sheet1.set(4, 1, 'Opportunity Name');
        sheet1.set(5, 1, 'Account Name');
        sheet1.set(6, 1, 'Sales Name');
        sheet1.set(7, 1, 'RSC Team');
        sheet1.set(8, 1, 'CSC Team');
        sheet1.set(9, 1, 'Sales Status');
        sheet1.set(10, 1, 'Opportunity Type');
        sheet1.set(11, 1, 'Customer Type');
        sheet1.set(12, 1, 'Pre Bid Estimated TCV');
        sheet1.set(13, 1, 'TCV - VAD');
        sheet1.set(14, 1, 'ACV - VAD');
        sheet1.set(15, 1, 'TCV - Topline');
        sheet1.set(16, 1, 'Cycle');
        sheet1.set(17, 1, 'Pre Sales Man Hours');
        sheet1.set(18, 1, 'Action');
        sheet1.set(19, 1, 'Pre Sales Expected Closure Date');
        sheet1.set(20, 1, 'Pre Sales Actual Closure Date');
        sheet1.set(21, 1, 'Partner / Direct');
        sheet1.set(22, 1, 'Principal');
        sheet1.set(23, 1, 'Vertical');
        sheet1.set(24, 1, 'Opportunity Creation Date');

        logger.info('Sheet headers created');

        if (len > 0)
            len++;
        logger.info('length: ' + len)
        for (var i = 2; i <= len; i++) {            
            sheet1.set(1, i, data[i - 2].SBU);
            sheet1.set(2, i, data[i - 2].CountryName);
            sheet1.set(3, i, data[i - 2].OppId);
            sheet1.set(4, i, data[i - 2].OpportunityName);
            sheet1.set(5, i, data[i - 2].AccountName);
            sheet1.set(6, i, data[i - 2].AccountSalesManager);
            sheet1.set(7, i, data[i - 2].RSCUser);
            sheet1.set(8, i, data[i - 2].CSCUser);
            sheet1.set(9, i, data[i - 2].SalesStatus);
            sheet1.set(10, i, data[i - 2].opportunitytype);
            sheet1.set(11, i, data[i - 2].CustomerType);
            sheet1.set(12, i, data[i - 2].OpportunityValue);
            sheet1.set(13, i, data[i - 2].TotalCusPrice);
            sheet1.set(14, i, data[i - 2].TotalVAD);
            sheet1.set(15, i, data[i - 2].VAD1Year);
            sheet1.set(16, i, data[i - 2].Cycle);
            sheet1.set(17, i, data[i - 2].INHours);
            sheet1.set(18, i, data[i - 2].Action);
            sheet1.set(19, i, data[i - 2].ExpectedClosureDate);
            sheet1.set(20, i, data[i - 2].ActualCloseDate);
            sheet1.set(21, i, data[i - 2].OpportunityCategory);
            sheet1.set(22, i, data[i - 2].OEMName);
            sheet1.set(23, i, data[i - 2].Vertical);
            sheet1.set(24, i, data[i - 2].CreatedOn);
        }
        logger.info('Data provided');

        workbook.save(function (ok) {
            if (!ok) {
                logger.info('Failed to create worksheet: ' + ok);
                workbook.cancel();
            }
            else
                logger.info('congratulations, your workbook created');
        });

        var filedetails = { name: filename }
        res.status(200).json(filedetails);
    }
    catch (ex) {
        logger.info('Error occured: ' + ex)
    }

});


module.exports = router;