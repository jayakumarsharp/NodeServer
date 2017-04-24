var express = require('express');
var models = require(__base + "Models/MyDayModel.js");
var moment = require('moment');
var router = express.Router();
var logger = require(__base + 'Models/logger');
var excelbuilder = require('msexcel-builder');

router.get('/GetTaskTypes', function (req, res) {
    logger.info('Routing to GetTaskTypes..');
    models.MyDayModel.GetTaskTypes().then(function (types) {
        res.status(200).json(types);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetLockedDate', function (req, res) {
    logger.info('Routing to GetLockedDate..');
    models.MyDayModel.GetLockedDate().then(function (date) {
        res.status(200).json(date);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/SetReleaseLock', function (req, res) {
    var lockdate = req.body;
    models.MyDayModel.SetReleaseLock(lockdate).then(function (myday) {
        res.status(200).json(myday);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetNewOpps', function (req, res) {
    logger.info('Routing to GetNewOpps..');
    var day = req.query;
    models.MyDayModel.GetNewOpps(day.userid).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/UpdateNewOpp', function (req, res) {
    var newopp = req.body;
    models.MyDayModel.UpdateNewOpp(newopp).then(function (myday) {
        res.status(200).json(myday);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetMyDay', function (req, res) {
    logger.info('Routing to GetMyDay..');
    var day = req.query;
    models.MyDayModel.GetMyDay(day.userid).then(function (myday) {
        res.status(200).json(myday);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetHRMISLeave', function (req, res) {
    logger.info('Routing to GetHRMISLeave..');
    var day = req.query;
    logger.info('query: ' + JSON.stringify(day));
    models.MyDayModel.GetHRMISLeave(day.UserId,day.Month,day.Year).then(function (hrmis) {
        res.status(200).json(hrmis);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});
router.post('/SetHRMISLeave', function (req, res) {
    var hrmis = req.body;
    models.MyDayModel.SetHRMISLeave(hrmis).then(function (myday) {
        res.status(200).json(myday);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});
router.get('/GetAllDays', function (req, res) {
    logger.info('Routing to GetAllDays..');
    models.MyDayModel.GetAllDays().then(function (days) {
        res.status(200).json(days);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});
router.get('/GetYears', function (req, res) {
    logger.info('Routing to GetYears..');
    models.MyDayModel.GetYears().then(function (hols) {
        res.status(200).json(hols);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});
router.get('/GetHolidays', function (req, res) {
    logger.info('Routing to GetHolidays..');
    var day = req.query;
    models.MyDayModel.GetHolidays(day.locationId, day.year).then(function (hols) {
        res.status(200).json(hols);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});
router.post('/SaveHolidays', function (req, res) {
    logger.info('Routing to SaveHolidays..');
    var hols = req.body;
    models.MyDayModel.SaveHolidays(hols).then(function (myday) {
        res.status(200).json(myday);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});
router.get('/GetWeekends', function (req, res) {
    logger.info('Routing to GetWeekends..');
    var day = req.query;
    models.MyDayModel.GetWeekends(day.locationId).then(function (hrmis) {
        res.status(200).json(hrmis);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});
router.post('/SaveWeekends', function (req, res) {
    var weekends = req.body;
    models.MyDayModel.SaveWeekends(weekends).then(function (myday) {
        res.status(200).json(myday);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetMyDayFromTaskId', function (req, res) {
    logger.info('Routing to GetMyDayFromTaskId..');
    var day = req.query;
    models.MyDayModel.GetMyDayFromTaskId(day.taskId).then(function (myday) {
        res.status(200).json(myday);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/SaveSubmitMyDay', function (req, res) {
    var myday = req.body;
    models.MyDayModel.SaveSubmitMyDay(myday).then(function (myday) {
        res.status(200).json(myday);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/EditTask', function (req, res) {
    var task = req.body;
    models.MyDayModel.EditTask(task).then(function (myday) {
        res.status(200).json(myday);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/DeleteTask', function (req, res) {
    var task = req.body;
    models.MyDayModel.DeleteTask(task.Id).then(function (myday) {
        res.status(200).json(myday);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetMyDayOppIDsForUsers', function (req, res) {
    logger.info('Routing to GetMyDayOppsForUsers..');
    var Users = req.query;
    models.MyDayModel.GetMyDayOppIDsForUsers(Users).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetMyDayOppNamesForUsers', function (req, res) {
    logger.info('Routing to GetMyDayOppNamesForUsers..');
    var Users = req.query;
    models.MyDayModel.GetMyDayOppNamesForUsers(Users).then(function (opps) {
        res.status(200).json(opps);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/GetTaskDetailsReport', function (req, res) {
    logger.info('Routing to GetTaskDetailsReport..');
    var obj = req.body;
    models.MyDayModel.GetTaskDetailsReport(obj).then(function (detail) {
        res.status(200).json(detail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/GetSCUtilizationReport', function (req, res) {
    logger.info('Routing to GetSCUtilizationReport..');
    var obj = req.body;
    models.MyDayModel.GetSCUtilizationReport(obj).then(function (detail) {
        res.status(200).json(detail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
}); 

router.post('/GetSCUtilizationWeeklyReport', function (req, res) {
    logger.info('Routing to GetSCUtilizationWeeklyReport..');
    var obj = req.body;
    models.MyDayModel.GetSCUtilizationWeeklyReport(obj).then(function (detail) {
        logger.info('Sending result: ' + JSON.stringify(detail));
        res.status(200).json(detail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.post('/GetHolidaybetweendate', function (req, res) {
    logger.info('Routing to GetSCUtilizationReport..');
    var obj = req.body;
    models.MyDayModel.GetHolidaybetweendate(obj).then(function (detail) {
        res.status(200).json(detail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
}); 


router.post('/GetUsersBillingID', function (req, res) {
    logger.info('Routing to GetUsersBillingID..');
    var date = req.body;
    models.MyDayModel.GetUsersBillingID(date).then(function (myday) {
        res.status(200).json(myday);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/GetSCBillingNewReport', function (req, res) {
    logger.info('Routing to GetSCBillingNewReport..');
    var obj = req.body;
    models.MyDayModel.GetSCBillingNewReport(obj).then(function (detail) {
        res.status(200).json(detail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.post('/GetSCBillingReport', function (req, res) {
    logger.info('Routing to GetSCBillingReport..');
    var obj = req.body;
    models.MyDayModel.GetSCBillingReport(obj).then(function (detail) {
        res.status(200).json(detail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
}); 
router.post('/GetSCBillingTotal', function (req, res) {
    logger.info('Routing to GetSCBillingTotal..');
    var obj = req.body;
    models.MyDayModel.GetSCBillingTotal(obj).then(function (detail) {
        res.status(200).json(detail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});
router.post('/GetTaskummaryReportTotal', function (req, res) {
    logger.info('Routing to GetTaskummaryReportTotal..');
    var obj = req.body;
    models.MyDayModel.GetTaskummaryReportTotal(obj).then(function (detail) {
        res.status(200).json(detail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});
router.post('/GetTaskSummaryReport', function (req, res) {
    logger.info('Routing to GetTaskSummaryReport..');
    var obj = req.body;
    models.MyDayModel.GetTaskSummaryReport(obj).then(function (detail) {
        res.status(200).json(detail);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});


router.post('/ExportToExcelSheet', function (req, res) {
    var data = req.body;
    try {
        logger.info('Exporting SC Billing Report.. ');

        var timestamp = moment().format("YYYYMMDDhhmmss")
        var filename = 'SCBilling_' + timestamp + '.xlsx';
        var workbook = excelbuilder.createWorkbook('./ExportFiles/', filename)
        var len = data.length;
        var excelmaxrow = len;
        if (len == 0) {
            excelmaxrow = 1;
        }
        else {
            excelmaxrow += 10;
        }
        var sheet1 = workbook.createSheet('SCBillingReport', 100, excelmaxrow);
        sheet1.set(1, 1, 'Name');
        sheet1.set(2, 1, 'Email ID');
        sheet1.set(3, 1, 'APR_APAC');
        sheet1.set(4, 1, 'APR_EUR');
        sheet1.set(5, 1, 'APR_IND');
        sheet1.set(6, 1, 'APR_MEA');
        sheet1.set(7, 1, 'APR_USA');
        sheet1.set(8, 1, 'APR_PED');
        sheet1.set(9, 1, 'APR_ACQ');
        sheet1.set(10, 1, 'MAY_APAC');
        sheet1.set(11, 1, 'MAY_EUR');
        sheet1.set(12, 1, 'MAY_IND');
        sheet1.set(13, 1, 'MAY_MEA');
        sheet1.set(14, 1, 'MAY_USA');
        sheet1.set(15, 1, 'MAY_PED');
        sheet1.set(16, 1, 'MAY_ACQ');
        sheet1.set(17, 1, 'JUN_APAC');
        sheet1.set(18, 1, 'JUN_EUR');
        sheet1.set(19, 1, 'JUN_IND');
        sheet1.set(20, 1, 'JUN_MEA');
        sheet1.set(21, 1, 'JUN_USA');
        sheet1.set(22, 1, 'JUN_PED');
        sheet1.set(23, 1, 'JUN_ACQ');
        sheet1.set(24, 1, 'JUL_APAC');
        sheet1.set(25, 1, 'JUL_EUR');
        sheet1.set(26, 1, 'JUL_IND');
        sheet1.set(27, 1, 'JUL_MEA');
        sheet1.set(28, 1, 'JUL_USA');
        sheet1.set(29, 1, 'JUL_PED');
        sheet1.set(30, 1, 'JUL_ACQ');
        sheet1.set(31, 1, 'AUG_APAC');
        sheet1.set(32, 1, 'AUG_EUR');
        sheet1.set(33, 1, 'AUG_IND');
        sheet1.set(34, 1, 'AUG_MEA');
        sheet1.set(35, 1, 'AUG_USA');
        sheet1.set(36, 1, 'AUG_PED');
        sheet1.set(37, 1, 'AUG_ACQ');
        sheet1.set(38, 1, 'SEP_APAC');
        sheet1.set(39, 1, 'SEP_EUR');
        sheet1.set(40, 1, 'SEP_IND');
        sheet1.set(41, 1, 'SEP_MEA');
        sheet1.set(42, 1, 'SEP_USA');
        sheet1.set(43, 1, 'SEP_PED');
        sheet1.set(44, 1, 'SEP_ACQ');
        sheet1.set(45, 1, 'OCT_APAC');
        sheet1.set(46, 1, 'OCT_EUR');
        sheet1.set(47, 1, 'OCT_IND');
        sheet1.set(48, 1, 'OCT_MEA');
        sheet1.set(49, 1, 'OCT_USA');
        sheet1.set(50, 1, 'OCT_PED');
        sheet1.set(51, 1, 'OCT_ACQ');
        sheet1.set(52, 1, 'NOV_APAC');
        sheet1.set(53, 1, 'NOV_EUR');
        sheet1.set(54, 1, 'NOV_IND');
        sheet1.set(55, 1, 'NOV_MEA');
        sheet1.set(56, 1, 'NOV_USA');
        sheet1.set(57, 1, 'NOV_PED');
        sheet1.set(58, 1, 'NOV_ACQ');
        sheet1.set(59, 1, 'DEC_APAC');
        sheet1.set(60, 1, 'DEC_EUR');
        sheet1.set(61, 1, 'DEC_IND');
        sheet1.set(62, 1, 'DEC_MEA');
        sheet1.set(63, 1, 'DEC_USA');
        sheet1.set(64, 1, 'DEC_PED');
        sheet1.set(65, 1, 'DEC_ACQ');
        sheet1.set(66, 1, 'JAN_APAC');
        sheet1.set(67, 1, 'JAN_EUR');
        sheet1.set(68, 1, 'JAN_IND');
        sheet1.set(69, 1, 'JAN_MEA');
        sheet1.set(70, 1, 'JAN_USA');
        sheet1.set(71, 1, 'JAN_PED');
        sheet1.set(72, 1, 'JAN_ACQ');
        sheet1.set(73, 1, 'FEB_APAC');
        sheet1.set(74, 1, 'FEB_EUR');
        sheet1.set(75, 1, 'FEB_IND');
        sheet1.set(76, 1, 'FEB_MEA');
        sheet1.set(77, 1, 'FEB_USA');
        sheet1.set(78, 1, 'FEB_PED');
        sheet1.set(79, 1, 'FEB_ACQ');
        sheet1.set(80, 1, 'MAR_APAC');
        sheet1.set(81, 1, 'MAR_EUR');
        sheet1.set(82, 1, 'MAR_IND');
        sheet1.set(83, 1, 'MAR_MEA');
        sheet1.set(84, 1, 'MAR_USA');
        sheet1.set(85, 1, 'MAR_PED');
        sheet1.set(86, 1, 'MAR_ACQ');
        logger.info('Sheet headers created');

        if (len > 0)
            len++;
        logger.info('length: ' + len)
        for (var i = 2; i <= len; i++) {
            sheet1.set(1, i, data[i - 2].UserName);
            sheet1.set(2, i, data[i - 2].EmailId);
            sheet1.set(3, i, data[i - 2].Apr_APA);
            sheet1.set(4, i, data[i - 2].Apr_EUR);
            sheet1.set(5, i, data[i - 2].Apr_IND);
            sheet1.set(6, i, data[i - 2].Apr_MEA);
            sheet1.set(7, i, data[i - 2].Apr_US);
            sheet1.set(8, i, data[i - 2].Apr_PED);
            sheet1.set(9, i, data[i - 2].Apr_ACQ);
            sheet1.set(10, i, data[i - 2].May_APA);
            sheet1.set(11, i, data[i - 2].May_EUR);
            sheet1.set(12, i, data[i - 2].May_IND);
            sheet1.set(13, i, data[i - 2].May_MEA);
            sheet1.set(14, i, data[i - 2].May_US);
            sheet1.set(15, i, data[i - 2].May_PED);
            sheet1.set(16, i, data[i - 2].May_ACQ);
            sheet1.set(17, i, data[i - 2].Jun_APA);
            sheet1.set(18, i, data[i - 2].Jun_EUR);
            sheet1.set(19, i, data[i - 2].Jun_IND);
            sheet1.set(20, i, data[i - 2].Jun_MEA);
            sheet1.set(21, i, data[i - 2].Jun_US);
            sheet1.set(22, i, data[i - 2].Jun_PED);
            sheet1.set(23, i, data[i - 2].Jun_ACQ);
            sheet1.set(24, i, data[i - 2].Jul_APA);
            sheet1.set(25, i, data[i - 2].Jul_EUR);
            sheet1.set(26, i, data[i - 2].Jul_IND);
            sheet1.set(27, i, data[i - 2].Jul_MEA);
            sheet1.set(28, i, data[i - 2].Jul_US);
            sheet1.set(29, i, data[i - 2].Jul_PED);
            sheet1.set(30, i, data[i - 2].Jul_ACQ);
            sheet1.set(31, i, data[i - 2].Aug_APA);
            sheet1.set(32, i, data[i - 2].Aug_EUR);
            sheet1.set(33, i, data[i - 2].Aug_IND);
            sheet1.set(34, i, data[i - 2].Aug_MEA);
            sheet1.set(35, i, data[i - 2].Aug_US);
            sheet1.set(36, i, data[i - 2].Aug_PED);
            sheet1.set(37, i, data[i - 2].Aug_ACQ);
            sheet1.set(38, i, data[i - 2].Sep_APA);
            sheet1.set(39, i, data[i - 2].Sep_EUR);
            sheet1.set(40, i, data[i - 2].Sep_IND);
            sheet1.set(41, i, data[i - 2].Sep_MEA);
            sheet1.set(42, i, data[i - 2].Sep_US);
            sheet1.set(43, i, data[i - 2].Sep_PED);
            sheet1.set(44, i, data[i - 2].Sep_ACQ);
            sheet1.set(45, i, data[i - 2].Oct_APA);
            sheet1.set(46, i, data[i - 2].Oct_EUR);
            sheet1.set(47, i, data[i - 2].Oct_IND);
            sheet1.set(48, i, data[i - 2].Oct_MEA);
            sheet1.set(49, i, data[i - 2].Oct_US);
            sheet1.set(50, i, data[i - 2].Oct_PED);
            sheet1.set(51, i, data[i - 2].Oct_ACQ);
            sheet1.set(52, i, data[i - 2].Nov_APA);
            sheet1.set(53, i, data[i - 2].Nov_EUR);
            sheet1.set(54, i, data[i - 2].Nov_IND);
            sheet1.set(55, i, data[i - 2].Nov_MEA);
            sheet1.set(56, i, data[i - 2].Nov_US);
            sheet1.set(57, i, data[i - 2].Nov_PED);
            sheet1.set(58, i, data[i - 2].Nov_ACQ);
            sheet1.set(59, i, data[i - 2].Dec_APA);
            sheet1.set(60, i, data[i - 2].Dec_EUR);
            sheet1.set(61, i, data[i - 2].Dec_IND);
            sheet1.set(62, i, data[i - 2].Dec_MEA);
            sheet1.set(63, i, data[i - 2].Dec_US);
            sheet1.set(64, i, data[i - 2].Dec_PED);
            sheet1.set(65, i, data[i - 2].Dec_ACQ);
            sheet1.set(66, i, data[i - 2].Jan_APA);
            sheet1.set(67, i, data[i - 2].Jan_EUR);
            sheet1.set(68, i, data[i - 2].Jan_IND);
            sheet1.set(69, i, data[i - 2].Jan_MEA);
            sheet1.set(70, i, data[i - 2].Jan_US);
            sheet1.set(71, i, data[i - 2].Jan_PED);
            sheet1.set(72, i, data[i - 2].Jan_ACQ);
            sheet1.set(73, i, data[i - 2].Feb_APA);
            sheet1.set(74, i, data[i - 2].Feb_EUR);
            sheet1.set(75, i, data[i - 2].Feb_IND);
            sheet1.set(76, i, data[i - 2].Feb_MEA);
            sheet1.set(77, i, data[i - 2].Feb_US);
            sheet1.set(78, i, data[i - 2].Feb_PED);
            sheet1.set(79, i, data[i - 2].Feb_ACQ);
            sheet1.set(80, i, data[i - 2].Mar_APA);
            sheet1.set(81, i, data[i - 2].Mar_EUR);
            sheet1.set(82, i, data[i - 2].Mar_IND);
            sheet1.set(83, i, data[i - 2].Mar_MEA);
            sheet1.set(84, i, data[i - 2].Mar_US);
            sheet1.set(85, i, data[i - 2].Mar_PED);
            sheet1.set(86, i, data[i - 2].Mar_ACQ);
        }
        logger.info('Data provided');

        workbook.save(function (ok) {
            if (!ok){
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