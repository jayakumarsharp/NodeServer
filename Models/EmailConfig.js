var moment = require('moment');
var models = require(__base + "Schema");
var q = require('q');
var logger = require(__base + 'Models/logger');
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var EmailConfig = {
    GetEmails: function (bu, group, level) {
        var deferred = q.defer();
        try {
            logger.info('Inside get Emails list');
            logger.info('Group: ' + group + '\nLevel: ' + level);
            models.EmailConfig.findAll({ where: { BU: bu, Group: group, Level: level } })
                .then(function (email) { deferred.resolve(email); })
                .catch(function (err) { logger.error('GetEmails errorrrrrrrr' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    UpdateEmails: function (email) {
        var deferred = q.defer();
        try {
            logger.info('Updating emails..');
            logger.info(JSON.stringify(email));

            models.EmailConfig.destroy({ where: { BU: email.BU, Group: email.Group, Level: email.Level }, truncate: false })
                .then(function () {
                    models.EmailConfig.create({
                        Emails: email.EmailIDs,
                        BU: email.BU, Group: email.Group, Level: email.Level
                    }).then(function (response) {
                        logger.info('Email list added successfully' + JSON.stringify(response));
                        deferred.resolve(response);
                    }).catch(function (updateEmailError) {
                        logger.info('Error occurred when updating email: ' + updateEmailError);
                        deferred.reject(updateEmailError);
                    });

                })
                .catch(function (destroyError) {
                    logger.info('Error occurred: ' + destroyError)
                    deferred.reject(destroyError);
                })
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    }
}
module.exports.EmailConfig = EmailConfig;