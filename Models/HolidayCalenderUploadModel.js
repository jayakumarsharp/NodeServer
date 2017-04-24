var q = require('q');
var Sequelize = require('sequelize');
var moment = require('moment');
var models = require(__base + "Schema");


var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var HolidayCalenderUploadModel = {

    GetHolidayCalender: function (locationid, from, to) {
        var deferred = q.defer();
        try {
            logger.info('GetHolidayCalender for location '+ locationid + ' between '+ from + ' and ' + to);
            sequelize.query('Select Date from TBL_HOLIDAY_CALENDAR where LocationID = :locId and Year between :fromYear and :toYear',
                { replacements: 
                    { 
                        locId: locationid,
                        fromYear: from,
                        toYear: to 
                    }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                    deferred.resolve(response);
                }).error(function (err) {
                    console.log('Error occurred when getting holidat calendar: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },


    GetAllHolidayCalenderUpload: function (LocationID,Year) {

        var deferred = q.defer();
        try {
            models.Holiday.findAll({ where: { LocationID: LocationID, Year: Year } })
                .then(function (opp) { deferred.resolve(opp); })
                .catch(function (err) { logger.info('GetEstimationApplicationMaster ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },


    AddHolidayCalenderUpload: function (disc,year) {
        logger.info('Adding Discount');
        var deferred = q.defer();
        try {
            models.Holiday.destroy({ where: { Year:year }}).then(function () {
                for(var i = 0; i < disc.length; i++){
                    var localTime = moment.utc(disc[i].Date).toDate();
                    disc[i].Date = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
                }

                models.Holiday.bulkCreate(disc).then(function () {
                    deferred.resolve('Success');
                }).catch(function (err) { logger.error('Error occurred when adding discount' + err); deferred.reject(err); });

            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },


}

module.exports.HolidayCalenderUploadModel = HolidayCalenderUploadModel;