var express = require('express');
var router = express.Router();
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var _ = require('underscore')._;
var moment = require('moment');
var models = require(__base + "Models/LocationModel.js");
var models1 = require(__base + "Models/HolidayCalenderUploadModel.js");

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');
/** API path that will upload the files */
router.post('/upload', function (req, res) {
    var exceltojson;
    upload(req, res, function (err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            res.json({ error_code: 1, err_desc: "No file passed" });
            return;
        }
        /** Check the extension of the incoming file and 
         *  use the appropriate module
         */
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {

            exceltojson = xlsxtojson;
        } else {


            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders: true
            }, function (err, result) {
                if (err) {
                    return res.json({ error_code: 1, err_desc: err, data: null });
                }

                var JSONModel = [];

                models.LocationModel.GetLocationList(null).then(function (list) {

                    _.each(list, function (element, index) {

                        var rs = _.where(result, { country: element['Location'].toUpperCase() });
                        if (rs.length > 0) {

                            for (var i = 0; i < rs.length; i++) {
                                var obj = {};
                                obj.LocationID = element['Id'];
                                obj.Date = rs[i].date;
                                obj.Holiday = rs[i].description
                                obj.Year = moment(rs[i].date).year();
                                JSONModel.push(obj);
                            }
                        }

                    });

                    var resultset = _.uniq(JSONModel, false, function (obj, k, v) {
                        return obj.Year;
                    });
                    if (resultset.length == 1) {

                        models1.HolidayCalenderUploadModel.AddHolidayCalenderUpload(JSONModel, resultset[0].Year).then(function () {
                            res.json({ error_code: 0, err_desc: null, data: result });
                        });

                    }
                    else
                    {
                         res.json({ error_code: 0, err_desc: null, data: 'Invalid file content' });
                    }

                })




            });
        } catch (e) {
            res.json({ error_code: 1, err_desc: "Corupted excel file" });
        }
    })
});

module.exports = router;
