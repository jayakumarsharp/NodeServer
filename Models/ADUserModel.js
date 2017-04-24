var moment = require('moment');
var models = require(__base + "Schema");
var uuid = require('node-uuid');
var q = require('q');
var jwt = require('jsonwebtoken');
var fs = require('fs');

var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var logger = require(__base + 'Models/logger');

//var Utility = require('./UtilityModel');
var ADUserModel = {
    GetADUsers: function (userId) {
        var deferred = q.defer();
        if (userId != null && userId != undefined) {
            logger.info('Inside get AD user');
            models.ADUser.findOne({ where: { userId: userId } })
                .then(function (user) { deferred.resolve(user); })
                .catch(function (err) { logger.info('GetADUser ' + err); deferred.reject(err) });
        }
        else {
            try {
                logger.info('Inside get all AD users');
                sequelize.query('USP_GetAllADUsers', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                    logger.info('success');
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('failure: ' + err);
                    deferred.reject(err)
                });
            }
            catch (Ex) {
                logger.info('ex' + Ex);
                deferred.reject(Ex)
            }
        }
        return deferred.promise;
    },
    GetAllADUsers: function () {
        var deferred = q.defer();

        logger.info('Inside get AD user');
        models.ADUser.findAll()
            .then(function (user) { deferred.resolve(user); })
            .catch(function (err) { logger.info('GetADUser ' + err); deferred.reject(err) });


        return deferred.promise;
    }
    // ,
    //DeleteADUser: function (user) {
    //    logger.info('Invoked DeleteADUser ');
    //    var deferred = q.defer();
    //    logger.info('Deleting user ' + user.userId + ' from AD master');
    //    this.GetADUsers(user.userId)
    //     .then(function (userdtl) {
    //         models.sequelize.transaction().then(function (t) {
    //             if (t != null && t != undefined) {
    //                 // models.UserRoles.destroy({ where: { userId: user.userId }, truncate: false },{transaction:t})
    //                 //    .then(function(userrole){
    //                 models.ADUser.destroy({ where: { userId: user.userId }, truncate: false }, { transaction: t })
    //                      .then(function (user) {
    //                          t.commit(); deferred.resolve(user);
    //                      })
    //                  .catch(function (destroyError) {
    //                      logger.info('destroy ' + destroyError)
    //                      t.rollback(); deferred.reject(destroyError);
    //                  })
    //                 // })
    //                 // .catch(function(userRoleError){
    //                 // logger.info('userRoleError ' + userRoleError)
    //                 // t.rollback(); deferred.reject(userRoleError);
    //                 // });            
    //             }
    //         }).catch(function (transerror) { logger.info('transerror ' + transerror); });
    //     })
    //     .catch(function (err) { logger.info('error ' + err); deferred.reject(err); });
    //    return deferred.promise;
    //}
}
module.exports.ADUserModel = ADUserModel;