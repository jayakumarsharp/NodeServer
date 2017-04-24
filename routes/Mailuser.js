// var nodemailer = require('nodemailer');
// var smtpTransport = require("nodemailer-smtp-transport");
// var express = require('express');
// var router = express.Router();
// var logger = require(__base + 'Models/logger');
// var models = require(__base + "Models/EmailConfig.js");

// router.post('/sendmail', function (req, res) {
//     logger.info('Sending email..');
//     try {
//         var maildata = req.body;
//         logger.info('MailData: ' + JSON.stringify(maildata));

//         if (maildata.EmailMArginOjectsLevel1.length > 0) {
//             logger.info('Level 1 alert received for Margin');
//             models.EmailConfig.GetEmails("Margin", 1).then(function (emails) {
//                 logger.info('Email groups retrieved: ' + emails);
//                 sendmail(emails, maildata.EmailMArginOjectsLevel1, "Margin");
//             })
//         }
//         if (maildata.EmailMArginOjectsLevel2.length > 0) {
//             logger.info('Level 2 alert received for Margin');
//             models.EmailConfig.GetEmails("Margin", 2).then(function (emails) {
//                 logger.info('Email groups retrieved: ' + emails);
//                 sendmail(emails, maildata.EmailMArginOjectsLevel2, "Margin");
//             })
//         }
//         if (maildata.EmailMArginOjectsLevel3.length > 0) {
//             logger.info('Level 3 alert received for Margin');
//             models.EmailConfig.GetEmails("Margin", 3).then(function (emails) {
//                 logger.info('Email groups retrieved: ' + emails);
//                 sendmail(emails, maildata.EmailMArginOjectsLevel3, "Margin");
//             })
//         }
//         if (maildata.EmailDiscountOjectsLevel1.length > 0) {
//             logger.info('Level 1 alert received for Discount');
//             models.EmailConfig.GetEmails("Discount", 1).then(function (emails) {
//                 logger.info('Email groups retrieved: ' + emails);
//                 sendmail(emails, maildata.EmailDiscountOjectsLevel1, "Discount");
//             })
//         }
//         if (maildata.EmailDiscountOjectsLevel2.length > 0) {
//             logger.info('Level 2 alert received for Discount');
//             models.EmailConfig.GetEmails("Discount", 2).then(function (emails) {
//                 logger.info('Email groups retrieved: ' + emails);
//                 sendmail(emails, maildata.EmailDiscountOjectsLevel2, "Discount");
//             })
//         }
//         if (maildata.EmailDiscountOjectsLevel3.length > 0) {
//             logger.info('Level 3 alert received for Discount');
//             models.EmailConfig.GetEmails("Discount", 3).then(function (emails) {
//                 logger.info('Email groups retrieved: ' + emails);
//                 sendmail(emails, maildata.EmailDiscountOjectsLevel3, "Discount");
//             })
//         }
//         res.status(200).json('success');
//     }
//     catch (e) {
//         logger.info('Error occurred sending mail: ' + e);
//         res.status(500).json('failed' + e);
//     }
// });




// function sendmail(toaddress, data, group) {
//     logger.info('Sending email alert for ' + group);
//     try {

//         if (toaddress != null && toaddress != '') {
//             logger.info('Sending to mail Id: ' + JSON.stringify(toaddress));
//             var smtpOptions = {
//                 host: 'smtp.office365.com',
//                 port: 587,
//                 auth: {
//                     user: 'pricingtool@servion.com',
//                     pass: 'welcome@123'
//                 }
//             };

//             var transporter = nodemailer.createTransport(smtpOptions);
//             logger.info('Created Transporter');

//             var htmlData = '';
//             for (var i = 0; i < data.length; i++) {
//                 if (group == "Margin") {
//                     var margin = parseFloat(data[i].Calmarginpercent).toFixed(2);

//                     htmlData = htmlData + '<table><tr><td><b>Field</b></td><td><b>Value</b></td></tr><tr><td>Opportunity ID</td><td>' + data[i].OppId + '</td></tr><tr><td>OEM</td><td>' + data[i].oem + '</td></tr><tr><td>Component Type</td><td>' + data[i].componenttype + '</td></tr><tr><td>Margin %</td><td>' + margin + '</td></tr></table>';
//                 }
//                 else if (group == "Discount") {
//                     var disc = parseFloat(data[i].Calcustomerdiscount).toFixed(2);
//                     htmlData = htmlData + '<table><tr><td><b>Field</b></td><td><b>Value</b></td></tr><tr><td>Opportunity ID</td><td>' + data[i].OppId + '</td></tr><tr><td>OEM</td><td>' + data[i].oem + '</td></tr><tr><td>Component Type</td><td>' + data[i].componenttype + '</td></tr><tr><td>Discount %</td><td>' + disc + '</td></tr></table>';
//                 }
//             }

//             logger.info('Data: ' + JSON.stringify(data));
//             logger.info('html data: ' + htmlData);
//             logger.info('Mail To: ' + toaddress[0].Emails);

//             var mailOptions = {
//                 from: "pricingtool@servion.com",
//                 to: toaddress[0].Emails,
//                 // cc: 'sid@servion.com',
//                 subject: "Pricing Sheet Mail Notification",
//                 html: htmlData
//             }

//             transporter.sendMail(mailOptions, function (error, response) {
//                 if (error) {
//                     logger.info('Error occurred in mailer: ' + error);
//                 } else {
//                     logger.info("Mail sent: ");
//                 }
//                 transporter.close();
//             });
//         }
//         else {
//             logger.info('To-address is empty');
//         }
//     }
//     catch (e) {
//         logger.info('Error occurred in sendmail: ' + e);
//     }
// }

// module.exports = router;





// router.post('/PMsendmail', function (req, res) {
//     logger.info('Sending email..');
//     try {
//         var maildata = req.body;


//         if (maildata.Level1.length > 0) {
//             logger.info('Level 1 alert received for ProjectMargin');
//             models.EmailConfig.GetEmails("ProjectMargin", 1).then(function (emails) {
//                 logger.info('Email groups retrieved: ' + emails);
//                 sendPMmail(emails, maildata.Level1, "Margin");
//             })
//         }
//         if (maildata.Level2.length > 0) {
//             logger.info('Level 2 alert received for ProjectMargin');
//             models.EmailConfig.GetEmails("ProjectMargin", 2).then(function (emails) {
//                 logger.info('Email groups retrieved: ' + emails);
//                 sendPMmail(emails, maildata.Level2, "Margin");
//             })
//         }
//         if (maildata.Level3.length > 0) {
//             logger.info('Level 3 alert received for ProjectMargin');
//             models.EmailConfig.GetEmails("ProjectMargin", 3).then(function (emails) {
//                 logger.info('Email groups retrieved: ' + emails);
//                 sendPMmail(emails, maildata.Level3, "Margin");
//             })
//         }

//         res.status(200).json('success');
//     }
//     catch (e) {
//         logger.info('Error occurred sending mail: ' + e);
//         res.status(500).json('failed' + e);
//     }
// });


// function sendPMmail(toaddress, data, group) {
//     logger.info('Sending email alert for ' + group);
//     try {

//         if (toaddress != null && toaddress != '') {
//             logger.info('Sending to mail Id: ' + JSON.stringify(toaddress));
//             var smtpOptions = {
//                 host: 'smtp.office365.com',
//                 port: 587,
//                 auth: {
//                     user: 'pricingtool@servion.com',
//                     pass: 'welcome@123'
//                 },

//             };

//             var transporter = nodemailer.createTransport(smtpOptions);
//             logger.info('Created Transporter');

//             var htmlData = '';
//             for (var i = 0; i < data.length; i++) {

//                 htmlData = htmlData + '<table><tr><td><b>Field</b></td><td><b>Value</b></td></tr><tr><td>Opportunity ID</td><td>' + data[i].OppId + '</td></tr><tr><td>LOB</td><td>' + data[i].Type + '</td><tr><td>  %</td><td>' + data[i].value1 + '</td></tr></table>';

//             }

//             logger.info('Data: ' + JSON.stringify(data));
//             logger.info('html data: ' + htmlData);
//             logger.info('Mail To: ' + toaddress[0].Emails);

//             var mailOptions = {
//                 from: "pricingtool@servion.com",
//                 to: toaddress[0].Emails,
//                 // cc: 'sid@servion.com',
//                 subject: "Pricing Sheet Mail Notification",
//                 html: htmlData
//             }

//             transporter.sendMail(mailOptions, function (error, response) {
//                 if (error) {
//                     logger.info('Error occurred in mailer: ' + error);
//                 } else {
//                     logger.info("Mail sent: ");
//                 }
//                 transporter.close();
//             });
//         }
//         else {
//             logger.info('To-address is empty');
//         }
//     }
//     catch (e) {
//         logger.info('Error occurred in sendmail: ' + e);
//     }
// }



var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
var express = require('express');
var router = express.Router();
var logger = require(__base + 'Models/logger');
var models = require(__base + "Models/EmailConfig.js");

router.post('/sendmail', function (req, res) {
    logger.info('Sending email..');
    try {
        var maildata = req.body;
        logger.info('MailData: ' + JSON.stringify(maildata));

        if (maildata.EmailMArginOjectsLevel1.length > 0) {
            logger.info('Level 1 alert received for Margin');
            models.EmailConfig.GetEmails("Margin", 1).then(function (emails) {
                logger.info('Email groups retrieved: ' + emails);
                maildata.EmailMArginOjectsLevel1[0].OpportunityName = maildata.OpportunityName;
                maildata.EmailMArginOjectsLevel1[0].AccountName = maildata.AccountName;
                res.status(200).json(sendmail(emails, maildata.EmailMArginOjectsLevel1, "Margin"));
            })
        }
        if (maildata.EmailMArginOjectsLevel2.length > 0) {
            logger.info('Level 2 alert received for Margin');
            models.EmailConfig.GetEmails("Margin", 2).then(function (emails) {
                logger.info('Email groups retrieved: ' + emails);
                maildata.EmailMArginOjectsLevel2[0].OpportunityName = maildata.OpportunityName;
                maildata.EmailMArginOjectsLevel2[0].AccountName = maildata.AccountName;
                res.status(200).json(sendmail(emails, maildata.EmailMArginOjectsLevel2, "Margin"));
            })
        }
        if (maildata.EmailMArginOjectsLevel3.length > 0) {
            logger.info('Level 3 alert received for Margin');
            models.EmailConfig.GetEmails("Margin", 3).then(function (emails) {
                logger.info('Email groups retrieved: ' + emails);
                maildata.EmailMArginOjectsLevel3[0].OpportunityName = maildata.OpportunityName;
                maildata.EmailMArginOjectsLevel3[0].AccountName = maildata.AccountName;
                res.status(200).json(sendmail(emails, maildata.EmailMArginOjectsLevel3, "Margin"));
            })
        }
        if (maildata.EmailDiscountOjectsLevel1.length > 0) {
            logger.info('Level 1 alert received for Discount');
            models.EmailConfig.GetEmails("Discount", 1).then(function (emails) {
                logger.info('Email groups retrieved: ' + emails);
                maildata.EmailDiscountOjectsLevel1[0].OpportunityName = maildata.OpportunityName;
                maildata.EmailDiscountOjectsLevel1[0].AccountName = maildata.AccountName;
                res.status(200).json(sendmail(emails, maildata.EmailDiscountOjectsLevel1, "Discount"));
            })
        }
        if (maildata.EmailDiscountOjectsLevel2.length > 0) {
            logger.info('Level 2 alert received for Discount');
            models.EmailConfig.GetEmails("Discount", 2).then(function (emails) {
                logger.info('Email groups retrieved: ' + emails);
                maildata.EmailDiscountOjectsLevel2[0].OpportunityName = maildata.OpportunityName;
                maildata.EmailDiscountOjectsLevel2[0].AccountName = maildata.AccountName;
                res.status(200).json(sendmail(emails, maildata.EmailDiscountOjectsLevel2, "Discount"));
            })
        }
        if (maildata.EmailDiscountOjectsLevel3.length > 0) {
            logger.info('Level 3 alert received for Discount');
            models.EmailConfig.GetEmails("Discount", 3).then(function (emails) {
                logger.info('Email groups retrieved: ' + emails);
                maildata.EmailDiscountOjectsLevel3[0].OpportunityName = maildata.OpportunityName;
                maildata.EmailDiscountOjectsLevel3[0].AccountName = maildata.AccountName;
                res.status(200).json(sendmail(emails, maildata.EmailDiscountOjectsLevel3, "Discount"));
            })
        }
        //res.status(200).json('success');
    }
    catch (e) {
        logger.info('Error occurred sending mail: ' + e);
        res.status(500).json('failed' + e);
    }
});




// function sendmail(toaddress, data, group) {
//     logger.info('Sending email alert for ' + group);
//     try {

//         if (toaddress != null && toaddress != '') {
//             logger.info('Sending to mail Id: ' + JSON.stringify(toaddress));
//             var smtpOptions = {
//                 host: 'smtp.office365.com',
//                 port: 587,
//                 auth: {
//                     user: 'jayakumar.t@servion.com',
//                     pass: 'welcome@12345'
//                 }
//             };

//             var transporter = nodemailer.createTransport(smtpOptions);
//             logger.info('Created Transporter');

//             var htmlData = '';
//             for (var i = 0; i < data.length; i++) {
//                 if (group == "Margin") {
//                     var margin = parseFloat(data[i].Calmarginpercent).toFixed(2);

//                     htmlData = htmlData + '<table><tr><td><b>Field</b></td><td><b>Value</b></td></tr><tr><td>Opportunity ID</td><td>' + data[i].OppId + '</td></tr><tr><td>OEM</td><td>' + data[i].oem + '</td></tr><tr><td>Component Type</td><td>' + data[i].componenttype + '</td></tr><tr><td>Margin %</td><td>' + margin + '</td></tr></table>';
//                 }
//                 else if (group == "Discount") {
//                     var disc = parseFloat(data[i].Calcustomerdiscount).toFixed(2);
//                     htmlData = htmlData + '<table><tr><td><b>Field</b></td><td><b>Value</b></td></tr><tr><td>Opportunity ID</td><td>' + data[i].OppId + '</td></tr><tr><td>OEM</td><td>' + data[i].oem + '</td></tr><tr><td>Component Type</td><td>' + data[i].componenttype + '</td></tr><tr><td>Discount %</td><td>' + disc + '</td></tr></table>';
//                 }
//             }

//             logger.info('Data: ' + JSON.stringify(data));
//             logger.info('html data: ' + htmlData);
//             logger.info('Mail To: ' + toaddress[0].Emails);

//             var mailOptions = {
//                 from: "jayakumar.t@servion.com",
//                 to: toaddress[0].Emails,
//                 subject: "mail test by jay.. pls reply if u see this",
//                 html: htmlData
//             }

//             logger.info('Calling sendmail');

//             transporter.sendMail(mailOptions, function (error, response) {
//                 if (error) {
//                     logger.info('Error occurred in mailer: ' + error);

//                 } else {
//                     logger.info("Mail sent: ");

//                 }
//                 transporter.close();
//             });
//         }
//         else {
//             logger.info('To-address is empty');
//             return "To-address is empty";
//         }
//     }
//     catch (e) {
//         logger.info('Error occurred in sendmail: ' + e);
//         return e;
//     }
// }


function sendmail(toaddress, data, group) {
    logger.info('Sending email alert for ' + group);
    try {

        if (toaddress != null && toaddress != '') {
            logger.info('Sending to mail Id: ' + JSON.stringify(toaddress));
            var smtpOptions = {
                host: 'smtp.office365.com',
                port: 587,
                auth: {
                    user: 'pricingtool@servion.com',
                    pass: 'welcome@123'
                }
            };

            var transporter = nodemailer.createTransport(smtpOptions);
            logger.info('Created Transporter');

            var htmlData = '';
            if (group == "Margin")
                htmlData = '<b>Alert Type  : Margin</b> <br />';
            else
                htmlData = '<b>Alert Type : Discount </b><br />';

            htmlData = htmlData + ' <b>Opp ID : ' + data[0].OppId + '</b><br />';
            htmlData = htmlData + ' <b>Opp Name : ' + data[0].OpportunityName + '</b><br />';
            htmlData = htmlData + ' <b>Account Name : ' + data[0].AccountName + '</b><br /><br />';

            for (var i = 0; i < data.length; i++) {
                if (group == "Margin") {
                    var margin = parseFloat(data[i].Calmarginpercent).toFixed(2);
                    htmlData = htmlData + '<table><tr><td><b>Field</b></td><td><b>Value</b></td></tr><tr><td>OEM</td><td>' + data[i].oem + '</td></tr><tr><td>Component Type</td><td>' + data[i].componenttype + '</td></tr><tr><td>Margin %</td><td>' + margin + '</td></tr></table>';
                }
                else if (group == "Discount") {
                    var disc = parseFloat(data[i].Calcustomerdiscount).toFixed(2);
                    htmlData = htmlData + '<table><tr><td><b>Field</b></td><td><b>Value</b></td></tr><tr><td>OEM</td><td>' + data[i].oem + '</td></tr><tr><td>Component Type</td><td>' + data[i].componenttype + '</td></tr><tr><td>Discount %</td><td>' + disc + '</td></tr></table>';
                }
            }

            logger.info('Data: ' + JSON.stringify(data));
            logger.info('html data: ' + htmlData);
            logger.info('Mail To: ' + toaddress[0].Emails);

            var mailOptions = {
                from: "pricingtool@servion.com",
                to: toaddress[0].Emails,
                // cc: 'sid@servion.com',
                subject: "Pricing Sheet Mail Notification (" + group + ") - Opp Name : " + data[0].OpportunityName + " - Account Name : " + data[0].AccountName,
                html: htmlData
            }

            transporter.sendMail(mailOptions, function (error, response) {
                if (error) {
                    logger.info('Error occurred in mailer: ' + error);
                } else {
                    logger.info("Mail sent: ");
                }
                transporter.close();
            });
        }
        else {
            logger.info('To-address is empty');
        }
    }
    catch (e) {
        logger.info('Error occurred in sendmail: ' + e);
    }
}

module.exports = router;



router.post('/PMsendmail', function (req, res) {
    logger.info('Sending email..');
    try {
        var maildata = req.body;

        if (maildata.Level1.length > 0) {
            logger.info('Level 1 alert received for ProjectMargin');
            models.EmailConfig.GetEmails("ProjectMargin", 1).then(function (emails) {
                logger.info('Email groups retrieved: ' + emails);
                sendPMmail(emails, maildata.Level1, "Margin");
            })
        }
        if (maildata.Level2.length > 0) {
            logger.info('Level 2 alert received for ProjectMargin');
            models.EmailConfig.GetEmails("ProjectMargin", 2).then(function (emails) {
                logger.info('Email groups retrieved: ' + emails);
                sendPMmail(emails, maildata.Level2, "Margin");
            })
        }
        if (maildata.Level3.length > 0) {
            logger.info('Level 3 alert received for ProjectMargin');
            models.EmailConfig.GetEmails("ProjectMargin", 3).then(function (emails) {
                logger.info('Email groups retrieved: ' + emails);
                sendPMmail(emails, maildata.Level3, "Margin");
            })
        }

        res.status(200).json('success');
    }
    catch (e) {
        logger.info('Error occurred sending mail: ' + e);
        res.status(500).json('failed' + e);
    }
});

function sendPMmail(toaddress, data, group) {
    logger.info('Sending email alert for ' + group);
    try {
        if (toaddress != null && toaddress != '') {
            logger.info('Sending to mail Id: ' + JSON.stringify(toaddress));
            var smtpOptions = {
                host: 'smtp.office365.com',
                port: 587,
                auth: {
                    user: 'pricingtool@servion.com',
                    pass: 'welcome@123'
                },
            };

            var transporter = nodemailer.createTransport(smtpOptions);
            logger.info('Created Transporter');

            var htmlData = '';
            htmlData = '<b>Alert Type : Project Margin </b><br />';

            htmlData = htmlData + '<b> Opp ID : ' + data[0].OppId + '</b><br />';
            htmlData = htmlData + ' <b>Opp Name : ' + data[0].OpportunityName + '</b><br />';
            htmlData = htmlData + ' <b>Account Name : ' + data[0].AccountName + '</b><br /><br />';

            for (var i = 0; i < data.length; i++) {
                htmlData = htmlData + '<table><tr><td><b>Field</b></td><td><b>Value</b></td></tr><tr><td>LOB</td><td>' + data[i].Type + '</td><tr><td>  %</td><td>' + data[i].value1 + '</td></tr></table>';
            }

            logger.info('Data: ' + JSON.stringify(data));
            logger.info('html data: ' + htmlData);
            logger.info('Mail To: ' + toaddress[0].Emails);

            var mailOptions = {
                from: "pricingtool@servion.com",
                to: toaddress[0].Emails,
                // cc: 'sid@servion.com',
                subject: "Pricing Sheet Mail Notification (Project Margin) - Opp Name : " + data[0].OpportunityName + " - Account Name : " + data[0].AccountName,
                html: htmlData
            }

            transporter.sendMail(mailOptions, function (error, response) {
                if (error) {
                    logger.info('Error occurred in mailer: ' + error);
                } else {
                    logger.info("Mail sent: ");
                }
                transporter.close();
            });
        }
        else {
            logger.info('To-address is empty');
        }
    }
    catch (e) {
        logger.info('Error occurred in sendmail: ' + e);
    }
}


