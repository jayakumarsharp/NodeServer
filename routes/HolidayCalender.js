var express = require('express');
var models = require(__base + "Models/HolidayCalenderUploadModel.js");
var router = express.Router();


router.get('/GetAllHolidayCalenderUpload', function (req, res) {
    var location = req.query;
    models.HolidayCalenderUploadModel.GetAllHolidayCalenderUpload(location.locationid, location.Year).then(function (list) {
        res.status(200).json(list);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});

router.get('/GetHolidayCalender', function (req, res) {
    var hol = req.query;
    models.HolidayCalenderUploadModel.GetHolidayCalender(hol.locationid, hol.fromYear, hol.toYear).then(function (list) {
        res.status(200).json(list);
    })
        .catch(function (err) {
            res.status(500).json(err);
        })
});
module.exports = router;