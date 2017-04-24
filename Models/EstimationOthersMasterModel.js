var q = require('q');
var Sequelize = require('sequelize');
var moment = require('moment');
var models = require(__base + "Schema");

var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var EstimationOthersMasterModel = {

    GetAllEstimationOthersMaster: function () {

        var deferred = q.defer();
        try {
            models.EstimationOthersMaster.findAll()
                .then(function (opp) { deferred.resolve(opp); })
                .catch(function (err) { logger.info('GetEstimationOthersMaster ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },


    AddEstimationOthersMaster: function (disc) {
        logger.info('Adding Discount');
        var deferred = q.defer();
        try {
            models.EstimationOthersMaster.destroy({ truncate: true }).then(function () {
                models.EstimationOthersMaster.bulkCreate(disc).then(function () {
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

module.exports.EstimationOthersMasterModel = EstimationOthersMasterModel;