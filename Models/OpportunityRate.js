var q = require('q');
var Sequelize = require('sequelize');
var moment = require('moment');
var models = require(__base + "Schema");
var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var OPPORTUNITY_RATE_Model = {

    GetAllOPPORTUNITY_RATE: function () {

        var deferred = q.defer();
        try {
            models.OPPORTUNITY_RATE.findAll()
                .then(function (opp) { deferred.resolve(opp); })
                .catch(function (err) { logger.info('error OPPORTUNITY_RATE ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    AddOPPORTUNITY_RATE: function (disc) {
        logger.info('Adding OPPORTUNITY_RATE');
        var deferred = q.defer();
        try {
            models.OPPORTUNITY_RATE.destroy({ truncate: true }).then(function () {
                models.OPPORTUNITY_RATE.bulkCreate(disc).then(function () {
                    deferred.resolve('Success');
                }).catch(function (err) { logger.error('error occurred when adding OPPORTUNITY_RATE' + err); deferred.reject(err); });

            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    }


}

module.exports.OPPORTUNITY_RATE_Model = OPPORTUNITY_RATE_Model;