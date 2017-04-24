var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');
var path = require('path');
require('events').EventEmitter.defaultMaxListeners = Infinity;

global.__base = __dirname + '/';

var models = require(__base + 'Models/UserModel');
var models = require(__base + 'Models/RoleModel');
var models = require(__base + 'Models/TypeModel');
var users = require(__base + 'routes/users');
var roles = require(__base + 'routes/roles');
var adusers = require(__base + 'routes/adusers');
var auth = require(__base + 'routes/auth');
var opps = require(__base + 'routes/opps');
var myday = require(__base + 'routes/myday');
var types = require(__base + 'routes/types');
var OEM = require(__base + 'routes/OEM');
var Vendor = require(__base + 'routes/Vendor');
var price = require(__base + 'routes/price');
var Payment = require(__base + 'routes/Payment');
var Day = require(__base + 'routes/Day');
var PaymentConfig = require(__base + 'routes/PaymentConfig');
var country = require(__base + 'routes/Country');
var opportunity = require(__base + 'routes/Opportunity');
var ServionLegalEntity = require(__base + 'routes/ServionLegalEntity');
var currency = require(__base + 'routes/Currency');
var Product = require(__base + 'routes/Product');
var Discount = require(__base + 'routes/Discount');
var ProjectMarginAdmin = require(__base + 'routes/ProjectMarginAdmin');
var Margin = require(__base + 'routes/Margin');
var models = require(__base + "Models/UtilityModel");
var Mail = require(__base + 'routes/Mailuser');
var GrossMargin = require(__base + 'routes/GrossMargin');
var EmailList = require(__base + 'routes/EmailList');
var applogger = require(__base + 'Models/logger');
var TaskType = require(__base + 'routes/TaskType');
var ManualEstimationType = require(__base + 'routes/ManualEstimationType');
var Location = require(__base + 'routes/Location');
var BaseSkill = require(__base + 'routes/BaseSkill');
var BillingConfig = require(__base + 'routes/BillingConfig');
var EstimationSDLC = require(__base + 'routes/EstimationSDLC');
var EstimationSDLCResource = require(__base + 'routes/EstimationSDLCResource');
var EstimationApplicationMaster = require(__base + 'routes/EstimationApplicationMaster');
var EstimationApplication = require(__base + 'routes/EstimationApplication');
var EstimationSelfServiceMaster = require(__base + 'routes/EstimationSelfServiceMaster');
var EstimationSelfService = require(__base + 'routes/EstimationSelfService');

var EstimationWFO = require(__base + 'routes/EstimationWFO');

var EstimationWFOMaster = require(__base + 'routes/EstimationWFOMaster');
var EstimationAcqueon = require(__base + 'routes/EstimationAcqueon');
var EstimationAcqueonMaster = require(__base + 'routes/EstimationAcqueonMaster');

var EstimationEGain = require(__base + 'routes/EstimationEGain');
var EstimationEGainMaster = require(__base + 'routes/EstimationEGainMaster');

var EstimationAvaya = require(__base + 'routes/EstimationAvaya');
var EstimationAvayaMaster = require(__base + 'routes/EstimationAvayaMaster');

var EstimationServionProducts = require(__base + 'routes/EstimationServionProducts');
var EstimationServionProductsMaster = require(__base + 'routes/EstimationServionProductsMaster');

var EstimationAdminReportsMaster = require(__base + 'routes/EstimationAdminReportsMaster');
var EstimationAdminReports = require(__base + 'routes/EstimationAdminReports');

var EstimationCisco = require(__base + 'routes/EstimationCisco');
var EstimationCiscoMaster = require(__base + 'routes/EstimationCiscoMaster');
var EstimationOthersMaster = require(__base + 'routes/EstimationOthersMaster');
var EstimationOthers = require(__base + 'routes/EstimationOthers');
var ManualEstimation = require(__base + 'routes/ManualEstimation');
var Resource = require(__base + 'routes/Resource');
var TandEPS = require(__base + 'routes/TandEPS');
var TandEResource = require(__base + 'routes/TandEResource');

var FileUploads = require(__base + 'routes/FileUploads');
var HolidayCalender = require(__base + 'routes/HolidayCalender');
var Selection = require(__base + 'routes/Selection');
var OpportunityRate = require(__base + 'routes/OpportunityRate');
var OpportunityConfigurationPriceVersion = require(__base + 'routes/OpportunityConfigurationPriceVersion');
var EstimationPageSection = require(__base + 'routes/EstimationPageSection');
var Report = require(__base + 'routes/Reports');


var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use('/ExportFiles', express.static(path.join(__dirname, 'ExportFiles')));
app.use('/Snapshot', express.static(path.join(__dirname, 'public')));
app.use(logger('combined'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());

//Enable Cors Karthik B
app.use(cors());
app.all("*", function (req, res, next) {
    // check header or url parameters or post parameters for token     
    if (['/auth/Login', '/auth/Logout/'].indexOf(req.originalUrl) < 0) {
        var bearerHeader = req.body.token || req.query.token || req.headers['Authorization'] || req.headers['authorization'];
        var bearerToken;

        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            // verifies secret and checks exp
            models.UtilityModel.ValidateToken(req.token).then(function (decoded) {
                if (decoded) {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            }).catch(function (ex) {
                console.log(ex);
                return res.status(403).json({ success: false, message: 'Failed to authenticate token.' })
            });
        } else {
            // if there is no token
            res.status(403).json({ error: 403, message: 'authentication is required.' });
        }
    } else {
        next();
    }
});

app.use('/auth', auth);
app.use('/auth/rights', auth);
app.use('/users', users);
app.use('/myday', myday);
app.use('/country', country);
app.use('/opportunity', opportunity);
app.use('/users/adduser', adusers);
app.use('/users/sbu', users);
app.use('/home', opps);
app.use('/OEM', OEM);
app.use('/currency', currency);
app.use('/users/types', types);
app.use('/roles', roles);
app.use('/roles/right', roles);
app.use('/price', price);
app.use('/ServionLegalEntity', ServionLegalEntity);
app.use('/Vendor', Vendor);
app.use('/Product', Product);
app.use('/Discount', Discount);
app.use('/ProjectMarginAdmin', ProjectMarginAdmin);

app.use('/Margin', Margin);
app.use('/Payment', Payment);
app.use('/Day', Day);

app.use('/PaymentConfig', PaymentConfig);
app.use('/Mail', Mail);
app.use('/GrossMargin', GrossMargin);
app.use('/OpportunityConfigurationPriceVersion', OpportunityConfigurationPriceVersion);

app.use('/email', EmailList);
app.use('/TaskType', TaskType);
app.use('/ManualEstimationType', ManualEstimationType);
app.use('/Location', Location);
app.use('/BaseSkill', BaseSkill);
app.use('/BillingConfig', BillingConfig);
app.use('/EstimationApplicationMaster', EstimationApplicationMaster);
app.use('/EstimationApplication', EstimationApplication);
app.use('/EstimationAdminReportsMaster', EstimationAdminReportsMaster);
app.use('/EstimationAdminReports', EstimationAdminReports);
app.use('/EstimationSelfServiceMaster', EstimationSelfServiceMaster);
app.use('/EstimationSelfService', EstimationSelfService);
app.use('/ManualEstimation', ManualEstimation);
app.use('/Resource', Resource);
app.use('/TandEPS', TandEPS);
app.use('/TandEResource', TandEResource);

app.use('/EstimationCisco', EstimationCisco);
app.use('/EstimationCiscoMaster', EstimationCiscoMaster);

app.use('/EstimationWFO', EstimationWFO);
app.use('/EstimationWFOMaster', EstimationWFOMaster);

app.use('/EstimationAcqueon', EstimationAcqueon);
app.use('/EstimationAcqueonMaster', EstimationAcqueonMaster);

app.use('/EstimationEGain', EstimationEGain);
app.use('/EstimationEGainMaster', EstimationEGainMaster);

app.use('/EstimationAvaya', EstimationAvaya);
app.use('/EstimationAvayaMaster', EstimationAvayaMaster);

app.use('/EstimationServionProducts', EstimationServionProducts);
app.use('/EstimationServionProductsMaster', EstimationServionProductsMaster);

app.use('/EstimationOthersMaster', EstimationOthersMaster);
app.use('/EstimationOthers', EstimationOthers);
app.use('/FileUploads', FileUploads);
app.use('/HolidayCalender', HolidayCalender);
app.use('/Selection', Selection);
app.use('/EstimationSDLC', EstimationSDLC);
app.use('/EstimationSDLCResource', EstimationSDLCResource);
app.use('/OPPORTUNITY_RATE', OpportunityRate);
app.use('/EstimationPageSection', EstimationPageSection);
app.use('/Report', Report);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        applogger.info('Unhandled Error in development mode', err);
        res.status(err.status || 500);
        res.send({ message: err.message, error: {} });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    applogger.info('Unhandled error in Production mode', err);
    res.status(err.status || 500);
    res.send({ message: err.message, error: {} });
});


module.exports = app;