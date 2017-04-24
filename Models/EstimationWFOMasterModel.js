var q = require('q');
var Sequelize = require('sequelize');
var moment = require('moment');
var models = require(__base + "Schema");


var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var EstimationWFOMasterModel = {

    GetAllEstimationWFOMaster: function () {
       
        var deferred = q.defer();
        try {
            models.EstimationWFOMaster.findAll()
                .then(function (opp) { deferred.resolve(opp); })
                .catch(function (err) { logger.info('GetEstimationWFOMaster ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },


    AddEstimationWFOMaster: function (disc) {
        logger.info('Adding Discount');
        var deferred = q.defer();
        try {
            models.EstimationWFOMaster.destroy({ truncate: true }).then(function () {
                models.EstimationWFOMaster.bulkCreate(disc).then(function () {
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

module.exports.EstimationWFOMasterModel = EstimationWFOMasterModel;