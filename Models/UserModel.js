var moment = require('moment');
var models = require(__base + "Schema");
var uuid = require('node-uuid');
var q = require('q');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var Utility = require('./UtilityModel');
var logger = require(__base + 'Models/logger');
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
const crypto = require('crypto');
var hierlist = [];
var userHierList = [];

var UserModel = {
    GetAllEmail: function () {
        logger.info('Start fetching Emails..');
        var deferred = q.defer();
        try {
            sequelize.query('Select EmailId from TBL_USER_MASTER',
                {
                    type: sequelize.QueryTypes.SELECT
                }).then(function (response) {
                    logger.info('success');
                    logger.info('response: ' + JSON.stringify(response));
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('failure: ' + err);
                    deferred.reject(err)
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetUserProfile: function (userId) {
        logger.info('Start fetching the User profile for user ' + userId);
        var deferred = q.defer();
        try {
            logger.info('Inside get User profile');
            models.ADUser.findOne({ where: { userId: userId } })
                .then(function (aduser) { deferred.resolve(aduser); })
                .catch(function (err) { deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetAllSBU: function () {
        logger.info('Start fetching the SBUs');
        var deferred = q.defer();
        try {
            logger.info('Inside get all SBUs');
            models.SBU.findAll({
                where: { 'SBU': { $ne: 'All' } },
                order: [
                    ['SBU', 'ASC']]
            }).then(function (sbus) {
                sbus.push({ 'id': 6, 'SBU': 'All' });
                logger.info(JSON.stringify(sbus));
                deferred.resolve(sbus);
            }).catch(function (err) { deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetUserSBU: function (userId) {
        logger.info('Start fetching the User SBU');
        var deferred = q.defer();
        try {

            if (userId != null && userId != undefined) {
                logger.info('Inside get user SBU for user:  ' + userId);
                models.UserSBU.findAll({ where: { UserID: userId } })
                    .then(function (sbus) { deferred.resolve(sbus); })
                    .catch(function (err) { logger.info('GetUserSBU ' + err); deferred.reject(err) });
            }
            else {
                logger.info('Inside get all users');
                models.UserSBU.findAll().then(function (users) {
                    deferred.resolve(users);
                }).catch(function (err) { deferred.reject(err) });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetUserBillingSBU: function (userId) {
        logger.info('Start fetching the User Billing SBU');
        var deferred = q.defer();
        try {

            if (userId != null && userId != undefined) {
                logger.info('Inside get user Billing SBU for user:  ' + userId);
                models.UserBillingSBU.findAll({ where: { UserID: userId } })
                    .then(function (sbus) { deferred.resolve(sbus); })
                    .catch(function (err) { logger.info('GetUserBillingSBU ' + err); deferred.reject(err) });
            }
            else {
                logger.info('Inside get all user sbu billings');
                models.UserBillingSBU.findAll().then(function (users) {
                    deferred.resolve(users);
                }).catch(function (err) { deferred.reject(err) });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetUser: function (userId) {
        logger.info('Start fetching the User');
        var deferred = q.defer();
        try {
            if (userId != null && userId != undefined) {
                logger.info('Inside get all users ' + userId);
                models.User.findOne({ where: { userId: userId } })
                    .then(function (user) { deferred.resolve(user); })
                    .catch(function (err) { logger.info('GetUser ' + err); deferred.reject(err) });
            }
            else {
                logger.info('Inside get all users');
                models.User.findAll().then(function (users) {
                    deferred.resolve(users);
                }).catch(function (err) { deferred.reject(err) });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetUsersByTypes: function (typeids) {
        logger.info('GetUsersByTypes - Start fetching the User');
        var deferred = q.defer();
        try {

            var typearray = '';

            for (var i = 0; i < typeids.length; i++) {
                typearray = typearray + typeids[i].TypeId;
                if (i != typeids.length - 1) {
                    typearray = typearray + ',';
                }
            }

            sequelize.query('select Userid as userId, UserName,EmailId,BillingId,LastWorkingDate, FirstWorkingDate, LocationId from TBL_USER_MASTER where TypeId in (' + typearray + ') and Userid != \'OTHER\'',

                {
                    type: sequelize.QueryTypes.SELECT
                }).then(function (response) {
                    logger.info('Retrieved users successfully');
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('Failed to retrieve users: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetUsersToAddInHierarchy: function () {
        logger.info('GetUsersToAddInHierarchy');
        var deferred = q.defer();
        try {
            //            sequelize.query('Select Userid, UserName, EmailId from TBL_USER_MASTER where Status=\'Active\' and Userid not in (select Reportee from TBL_USERHIERARCHY)',
            sequelize.query('Select Userid, UserName, EmailId from TBL_USER_MASTER',
                {
                    type: sequelize.QueryTypes.SELECT
                }).then(function (response) {
                    logger.info('Retrieved users successfully');
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('Failed to retrieve users: ' + err);
                    deferred.reject(err)
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    CreateTempUser: function (user) {
        logger.info('Inside CreateTempUser');
        var deferred = q.defer();
        try {
            var dbdate = new Date();
            var createdDate = moment(dbdate).add(30, 'days').format('L LT');
            //var hash_parts = Utility.UtilityModel.create_password(user.password);
            //var hashedpwd = hash_parts.method + "$" + hash_parts.salt + "$" + hash_parts.hash;
            var encryptedPwd = Utility.UtilityModel.encryptStringWithRsaPublicKey(user.password);
            models.sequelize.transaction().then(function (t) {
                if (t != null && t != undefined) {
                    var userExpiryDate = moment(dbdate).add(30, 'days').format('L LT');
                    var passwordExpiryDate = moment(dbdate).add(30, 'days').format('L LT');
                    var userBlockDate = moment(dbdate).add(30, 'days').format('L LT');
                    logger.info('Type: ' + JSON.stringify(user.selectedType));
                    logger.info('Role: ' + JSON.stringify(user.Role));
                    logger.info('Creating temp user: \nUserId: ' + user.userId + '\nUserType: ' + user.selectedType.TypeID + '\nUserRole:' + user.Role.id);
                    models.User.create({
                        userId: user.userId, UserName: user.userId, TypeId: user.selectedType.TypeID, RoleId: user.Role.id, Password: encryptedPwd, EmailId: user.emailId,
                        CustomData: 'NA', Status: 'Active', UserExpiryDate: userExpiryDate, IsADUser: 'No',
                        PasswordExpiryDate: passwordExpiryDate, UserBlockDate: userBlockDate, AttemptedTries: 0,
                        LastUsedDate: createdDate, CreatedDate: createdDate, CreatedBy: '', ModifiedDate: createdDate,
                        ModifiedBy: '', ApprovedDate: createdDate, Approvedby: '', MakerComment: '',
                        CheckerComment: ''
                    }, { transaction: t })
                        .then(function (usercreate) {
                            models.UserPasswordHistory.create({
                                SessionTokenId: uuid.v1(), UserId: user.userId,
                                Password: encryptedPwd, CreatedDate: createdDate
                            })
                                .then(function (usercreated) {
                                    logger.info('temp user created successfully');
                                    logger.info('SBUs:\n' + JSON.stringify(user.SBU));

                                    var tempArr = [];
                                    for (var i = 0; i < user.SBU.length; i++) {
                                        tempArr.push({ 'UserID': user.userId, 'SBUID': user.SBU[i] });
                                    }
                                    models.UserSBU.bulkCreate(tempArr, { omitNull: true }).then(function (sbu) {
                                        logger.info('Added SBUs');
                                        models.UserBillingSBU.destroy({ where: { userId: user.userId }, truncate: false }, { transaction: t })
                                            .then(function (usersbus) {
                                                var tempArr2 = [];
                                                for (var i = 0; i < user.BillingSBU.length; i++) {
                                                    tempArr2.push({ 'UserID': user.userId, 'SBUID': user.BillingSBU[i].id });
                                                }
                                                logger.info('SBUs:\n' + JSON.stringify(user.SBU));
                                                models.UserBillingSBU.bulkCreate(tempArr2, { omitNull: true }).then(function (billsbu) {
                                                    logger.info('Added Billing SBUs');
                                                    t.commit();
                                                    deferred.resolve(billsbu);
                                                }).catch(function (temperr) {
                                                    logger.info('Error: ' + temperr); t.rollback(); deferred.reject(temperr);
                                                })
                                            }).catch(function (usersbuEDestroy) { logger.info(usersbuEDestroy); t.rollback(); deferred.reject(usersbuEDestroy); })

                                    })
                                        .catch(function (usersbuerr) {
                                            logger.info('UserSBUError: ' + err); deferred.reject(usersbuerr);
                                        })
                                }).catch(function (err) {
                                    logger.info('Error: ' + err); deferred.reject(err);
                                })
                                .catch(function (passError) {
                                    logger.info('PassError', passError);
                                    t.rollback(); deferred.reject(passError);
                                })
                        })
                        .catch(function (error) {
                            logger.info('CreateUserError', error);
                            t.rollback(); deferred.reject(error);
                        });
                }
            }).catch(function (transError) { logger.info('Transaction Error ' + transError); deferred.reject(transError); })
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    CreateUser: function (user) {
        var deferred = q.defer();
        try {
            var dbdate = new Date();
            var createdDate = moment(dbdate).add(30, 'days').format('L LT');
            var hash_parts = Utility.UtilityModel.create_password(user.password);
            var hashedpwd = hash_parts.method + "$" + hash_parts.salt + "$" + hash_parts.hash;
            this.GetUser(user.userId)
                .then(function (userdtl) {
                    models.sequelize.transaction().then(function (t) {
                        if (t != null && t != undefined) {
                            var userExpiryDate = moment(dbdate).add(30, 'days').format('L LT');
                            var passwordExpiryDate = moment(dbdate).add(30, 'days').format('L LT');
                            var userBlockDate = moment(dbdate).add(30, 'days').format('L LT');

                            var fwd = moment.utc(user.FirstWorkingDate).toDate();
                            user.FirstWorkingDate = moment(fwd).format('YYYY-MM-DD HH:mm:ss');

                            if (user.LastWorkingDate != null) {
                                var lwd = moment.utc(user.LastWorkingDate).toDate();
                                user.LastWorkingDate = moment(lwd).format('YYYY-MM-DD HH:mm:ss');
                            }
                            logger.info('Creating user: \nUserId: ' + user.userId + '\nUserName: ' + user.UserName + '\nUserType: ' + user.selectedType + '\nUSerSBU: ' + user.SBU + '\nUserRole:' + user.Role +
                                '\nBillingId: ' + (user.Billing == undefined ? null : user.Billing) + '\nBaseSkillId: ' + (user.BaseSkill == undefined ? null : user.BaseSkill) + '\nLocationId: ' + (user.Location == undefined ? null : user.Location) + '\nFWD: ' + user.FirstWorkingDate + '\nLastWorkingDate: ' + user.LastWorkingDate);
                            models.User.create({
                                userId: user.userId, UserName: user.UserName, TypeId: user.selectedType, RoleId: user.Role, Password: hashedpwd, EmailId: user.EmailId,
                                BillingId: (user.Billing == undefined ? null : user.Billing), BaseSkillId: (user.BaseSkill == undefined ? null : user.BaseSkill), LocationId: (user.Location == undefined ? null : user.Location), FirstWorkingDate: user.FirstWorkingDate, LastWorkingDate: user.LastWorkingDate,
                                MobileNumber: user.mobileNumber, CustomData: 'NA', Status: 'Active', UserExpiryDate: userExpiryDate, IsADUser: 'Yes',
                                PasswordExpiryDate: passwordExpiryDate, UserBlockDate: userBlockDate, AttemptedTries: 0,
                                LastUsedDate: createdDate, CreatedDate: createdDate, CreatedBy: '', ModifiedDate: createdDate,
                                ModifiedBy: '', ApprovedDate: createdDate, Approvedby: '', MakerComment: '',
                                CheckerComment: ''
                            }, { transaction: t })
                                .then(function (usercreate) {
                                    models.UserPasswordHistory.create({
                                        SessionTokenId: uuid.v1(), UserId: user.userId,
                                        Password: hashedpwd, CreatedDate: createdDate
                                    })
                                        .then(function (usercreated) {
                                            logger.info('user created successfully');

                                            var tempArr = [];
                                            for (var i = 0; i < user.SBU.length; i++) {
                                                tempArr.push({ 'UserID': user.userId, 'SBUID': user.SBU[i].id });
                                            }
                                            logger.info('SBUs:\n' + JSON.stringify(user.SBU));
                                            models.UserSBU.bulkCreate(tempArr, { omitNull: true }).then(function (sbu) {
                                                logger.info('Added SBUs');
                                                if (user.BillingSBU != undefined) {
                                                    models.UserBillingSBU.destroy({ where: { userId: user.userId }, truncate: false }, { transaction: t })
                                                        .then(function (usersbus) {
                                                            var tempArr2 = [];
                                                            for (var i = 0; i < user.BillingSBU.length; i++) {
                                                                tempArr2.push({ 'UserID': user.userId, 'SBUID': user.BillingSBU[i].id });
                                                            }
                                                            logger.info('Billing SBUs:\n' + JSON.stringify(user.BillingSBU));
                                                            models.UserBillingSBU.bulkCreate(tempArr2, { omitNull: true }).then(function (billsbu) {
                                                                logger.info('Added Billing SBUs');
                                                                t.commit();
                                                                deferred.resolve(billsbu);
                                                            }).catch(function (temperr) {
                                                                logger.info('Billing SBU Error: ' + temperr); t.rollback(); deferred.reject(temperr);
                                                            })
                                                        }).catch(function (usersbuEDestroy) { logger.info(usersbuEDestroy); t.rollback(); deferred.reject(usersbuEDestroy); })
                                                }
                                                else {
                                                    t.commit();
                                                    logger.info('No Billing SBUs');
                                                    t.commit();
                                                    deferred.resolve(sbu);
                                                }
                                            }).catch(function (temperr) {
                                                logger.info('Error: ' + temperr); t.rollback(); deferred.reject(temperr);
                                            })
                                        }).catch(function (err) {
                                            logger.info('Error: ' + err); deferred.reject(err);
                                        })
                                        .catch(function (passError) {
                                            logger.info('PassError', passError);
                                            t.rollback(); deferred.reject(passError);
                                        })
                                })
                                .catch(function (error) {
                                    logger.info('CreateUserError', error);
                                    t.rollback(); deferred.reject(error);
                                });
                        }
                    }).catch(function (transError) { logger.info('Transaction Error ' + transError); deferred.reject(transError); })
                })
                .catch(function (err) { logger.info('FetchUser Error' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    ModifyUser: function (user) {
        var deferred = q.defer();
        try {
            var dbdate = new Date();
            //var hash_parts = Utility.UtilityModel.create_password(user.password);
            //var hashedpwd = hash_parts.method + "$" + hash_parts.salt + "$" + hash_parts.hash;
            var createdDate = moment(dbdate).add(30, 'days').format('L LT');
            this.GetUser(user.userId)
                .then(function (userdtl) {
                    models.sequelize.transaction().then(function (t) {
                        if (t != null && t != undefined) {
                            var userExpiryDate = moment(dbdate).add(30, 'days').format('L LT');
                            var passwordExpiryDate = moment(dbdate).add(30, 'days').format('L LT');
                            var userBlockDate = moment(dbdate).add(30, 'days').format('L LT');
                            //logger.info(JSON.stringify(user));
                            var fwd = moment.utc(user.FirstWorkingDate).toDate();
                            user.FirstWorkingDate = moment(fwd).format('YYYY-MM-DD HH:mm:ss');

                            if (user.LastWorkingDate != null) {
                                var lwd = moment.utc(user.LastWorkingDate).toDate();
                                user.LastWorkingDate = moment(lwd).format('YYYY-MM-DD HH:mm:ss');
                            }
                            logger.info('Modifying user: \n' + user.userId + '\n' + user.userName + '\n' + user.selectedType.TypeID + '\n' + user.SBU + '\nStatus: ' + user.selectedStatus +
                                '\nBillingId: ' + (user.selectedBilling == undefined ? null : user.selectedBilling.Id) +
                                '\nBaseSkillId: ' + (user.selectedBaseSkill == undefined ? null : user.selectedBaseSkill.Id) +
                                '\nLocationId: ' + (user.selectedLocation == undefined ? null : user.selectedLocation.Id) + '\nFWD: ' + user.FirstWorkingDate + '\nLastWorkingDate: ' + user.LastWorkingDate);

                            models.User.update({
                                UserName: user.userName, TypeId: user.selectedType.TypeID, RoleId: user.Role.id, EmailId: user.emailId,
                                BillingId: (user.selectedBilling == undefined ? null : user.selectedBilling.Id), BaseSkillId: (user.selectedBaseSkill == undefined ? null : user.selectedBaseSkill.Id), LocationId: (user.selectedLocation == undefined ? null : user.selectedLocation.Id), FirstWorkingDate: user.FirstWorkingDate, LastWorkingDate: user.LastWorkingDate,
                                MobileNumber: user.mobileNumber, CustomData: 'NA', Status: user.selectedStatus, UserExpiryDate: userExpiryDate,
                                PasswordExpiryDate: passwordExpiryDate, UserBlockDate: userBlockDate, AttemptedTries: 0,
                                LastUsedDate: createdDate, CreatedDate: createdDate, CreatedBy: '', ModifiedDate: createdDate,
                                ModifiedBy: '', ApprovedDate: createdDate, Approvedby: '', MakerComment: '',
                                CheckerComment: ''
                            }, { where: { userId: user.userId } }, { transaction: t })
                                .then(function (user) {
                                    deferred.resolve(user);
                                })
                                .then(function (userdtl) {
                                    models.UserSBU.destroy({ where: { userId: user.userId }, truncate: false }, { transaction: t })
                                        .then(function (usersbus) {
                                            var tempArr = [];
                                            for (var i = 0; i < user.SBU.length; i++) {
                                                tempArr.push({ 'UserID': user.userId, 'SBUID': user.SBU[i] });
                                            }
                                            logger.info('SBUs:\n' + JSON.stringify(user.SBU));
                                            models.UserSBU.bulkCreate(tempArr, { omitNull: true }).then(function (sbu) {
                                                logger.info('Added SBUs');
                                                if (user.BillingSBU != undefined) {
                                                    models.UserBillingSBU.destroy({ where: { userId: user.userId }, truncate: false }, { transaction: t })
                                                        .then(function (usersbus) {
                                                            var tempArr2 = [];
                                                            for (var i = 0; i < user.BillingSBU.length; i++) {
                                                                tempArr2.push({ 'UserID': user.userId, 'SBUID': user.BillingSBU[i] });
                                                            }
                                                            logger.info('Billing SBUs:\n' + JSON.stringify(user.BillingSBU));
                                                            models.UserBillingSBU.bulkCreate(tempArr2, { omitNull: true }).then(function (billsbu) {
                                                                logger.info('Added Billing SBUs');
                                                                t.commit();
                                                                deferred.resolve(billsbu);
                                                            }).catch(function (temperr) {
                                                                logger.info('Billing SBU Error: ' + temperr); t.rollback(); deferred.reject(temperr);
                                                            })
                                                        }).catch(function (usersbuEDestroy) { logger.info(usersbuEDestroy); t.rollback(); deferred.reject(usersbuEDestroy); })
                                                }
                                                else {
                                                    logger.info('No Billing SBUs');
                                                    deferred.resolve(sbu);
                                                }
                                            }).catch(function (temperr) {
                                                logger.info('Error: ' + temperr); t.rollback(); deferred.reject(temperr);
                                            })
                                        }).catch(function (usersbuEDestroy) { logger.info(usersbuEDestroy); t.rollback(); deferred.reject(usersbuEDestroy); });
                                })
                                .catch(function (updateUserError) {
                                    logger.info(updateUserError);
                                    t.rollback(); deferred.reject(updateUserError);
                                });
                        }
                    }).catch(function (transerror) { logger.info(transerror); deferred.reject(transerror); });
                })
                .catch(function (err) { logger.info('FetchUser' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    DeleteUser: function (user) {
        logger.info('Deleting user ');
        var deferred = q.defer();
        try {
            logger.info('Deleting user ' + user.userId);
            this.GetUser(user.userId)
                .then(function (userdtl) {
                    models.sequelize.transaction().then(function (t) {
                        if (t != null && t != undefined) {
                            // models.UserRoles.destroy({ where: { userId: user.userId }, truncate: false },{transaction:t})
                            //    .then(function(userrole){
                            logger.info('Deleting user 123');
                            models.User.destroy({ where: { userId: user.userId }, truncate: false }, { transaction: t })
                                .then(function (user) {
                                    t.commit(); deferred.resolve(user);
                                })
                                .catch(function (destroyError) {
                                    logger.info('destroy ' + destroyError)
                                    t.rollback(); deferred.reject(destroyError);
                                })
                            // })
                            // .catch(function(userRoleError){
                            // logger.info('userRoleError ' + userRoleError)
                            // t.rollback(); deferred.reject(userRoleError);
                            // });            
                        }
                    }).catch(function (transerror) { logger.info('transerror ' + transerror); deferred.reject(transerror); });
                })
                .catch(function (err) { logger.info('error ' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    ChangePassword: function (user) {
        var deferred = q.defer();
        try {
            var dbdate = new Date();
            var createdDate = moment(dbdate).add(30, 'days').format('L LT');
            var hash_parts = Utility.UtilityModel.create_password(user.newpassword);
            var hashedpwd = hash_parts.method + "$" + hash_parts.salt + "$" + hash_parts.hash;

            this.GetUser(user.userId)
                .then(function (userdtl) {
                    var currenthashedpwd = userdtl.Password;

                    var checkStatus = Utility.UtilityModel.check_password(currenthashedpwd, user.oldPassword);
                    if (checkStatus.status === true) {
                        logger.info('password matched for user ' + user.userId);
                        models.UserPasswordHistory.findAll({ where: { userId: user.userId }, limit: 5, order: 'CreatedDate DESC' })
                            .then(function (userPasswords) {
                                logger.info(userPasswords);
                                for (var i = 0; i > userPasswords.length; i++) {
                                    var verifyPassword = Utility.UtilityModel.check_password(userPasswords[i].Password, user.newpassword);
                                    if (verifyPassword.status === true) {
                                        deferred.reject({ error: 1001, errorMsg: 'last 5 Password can not be used' });
                                    }
                                }

                                models.sequelize.transaction().then(function (t) {
                                    if (t != null && t != undefined) {
                                        var userExpiryDate = moment(dbdate).add(30, 'days').format('L LT');
                                        var passwordExpiryDate = moment(dbdate).add(30, 'days').format('L LT');
                                        var userBlockDate = moment(dbdate).add(30, 'days').format('L LT');

                                        models.User.update({
                                            Password: hashedpwd, UserExpiryDate: userExpiryDate,
                                            PasswordExpiryDate: passwordExpiryDate, UserBlockDate: userBlockDate, AttemptedTries: 0,
                                            ModifiedDate: createdDate, ModifiedBy: '', ApprovedDate: createdDate, Approvedby: '',
                                            MakerComment: '', CheckerComment: ''
                                        }, { where: { userId: user.userId } }, { transaction: t })
                                            .then(function (userupdatedtl) {
                                                models.UserPasswordHistory.create({
                                                    SessionTokenId: user.sessionId, UserId: user.userId,
                                                    Password: hashedpwd, CreatedDate: createdDate
                                                }, { transaction: t })
                                                    .then(function (pass) { t.commit(); deferred.resolve(userdtl); })
                                                    .catch(function (passError) {
                                                        t.rollback(); deferred.reject(passError);
                                                    });
                                            }).catch(function (userUpdateError) {
                                                t.rollback();
                                                deferred.reject(userUpdateError);
                                            });
                                    }
                                }).catch(function (transerror) { logger.info('transaction error'); });
                            });
                    }
                    else {
                        logger.info('old Password does not match')
                        deferred.reject({ error: 400, message: 'old Password does not match.' });
                    }
                })
                .catch(function (err) { logger.info(err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    UserLogin: function (user) {
        var deferred = q.defer();
        try {

            var curentdate = moment().format("YYYY-MM-DD HH:mm:ss");
            var createdDate = moment.utc(curentdate).toDate();
            createdDate = moment(createdDate).format('YYYY-MM-DD HH:mm:ss');
            // var dbdate = new Date();
            // var createdDate = moment(dbdate).format('L LT');

            this.GetUser(user.userId)
                .then(function (userdtl) {
                    if (userdtl != null && userdtl != undefined) {
                        if (userdtl.Status != 'Inactive') {
                            var currenthashedpwd = userdtl.Password;
                            // var verifyPwd = Utility.UtilityModel.check_password(currenthashedpwd,user.password);
                            Utility.UtilityModel.Authenticate(user.userId, user.password).then(function (data) {
                                logger.info('check ' + data);
                                if (data === true) {
                                    logger.info('password matched for user ' + user.userId);
                                    var expireAt = moment().add(90000, 'seconds').format('L LT');
                                    var token = Utility.UtilityModel.generateToken(user, 90000);
                                    logger.info(token.length);
                                    models.sequelize.transaction().then(function (t) {
                                        if (t != null && t != undefined) {
                                            models.UserSession.create({
                                                SessionTokenId: token, UserId: user.userId, Tokendetail: token,
                                                CreatedDate: createdDate, ExpiredDate: expireAt, RequestIPAddress: user.requestIPAddress
                                            }, { transaction: t })
                                                .then(function (userSession) {
                                                    models.User.update({ LastAuthenticatedDate: createdDate }, { where: { userId: user.userId } }, { transaction: t })
                                                        .then(function (userupdate) {
                                                            t.commit();
                                                            deferred.resolve({
                                                                token: token, expires: expireAt, user: {
                                                                    userId: userdtl.userId,
                                                                    UserName: userdtl.UserName, EmailId: userdtl.EmailId, MobileNumber: userdtl.MobileNumber,
                                                                    CustomData: userdtl.CustomData, Status: userdtl.Status, UserExpiryDate: userdtl.UserExpiryDate,
                                                                    PasswordExpiryDate: userdtl.PasswordExpiryDate, UserBlockDate: userdtl.UserBlockDate,
                                                                    AttemptedTries: userdtl.AttemptedTries, LastUsedDate: userdtl.LastUsedDate,
                                                                    CreatedDate: userdtl.CreatedDate, CreatedBy: userdtl.CreatedBy,
                                                                    ModifiedDate: userdtl.ModifiedDate, ModifiedBy: userdtl.ModifiedBy, ApprovedDate: userdtl.ModifiedBy,
                                                                    Approvedby: userdtl.Approvedby, MakerComment: userdtl.MakerComment,
                                                                    CheckerComment: userdtl.CheckerComment
                                                                }
                                                            });
                                                        })
                                                        .catch(function (userupdateerror) {
                                                            t.rollback();
                                                            logger.info(userupdateerror);
                                                            deferred.reject(userupdateerror);
                                                        });
                                                }).catch(function (userSessionerror) {
                                                    t.rollback();
                                                    logger.info(userSessionerror);
                                                    deferred.reject(userSessionerror);
                                                });
                                        }
                                    }).catch(function (transerror) {
                                        logger.info(transerror);
                                        deferred.reject({ error: 'Failed to sign-in. Please check the UserID/Password.' });
                                    });
                                } else {
                                    logger.info('Invalid password');
                                    deferred.reject({ error: 402, message: 'Failed to sign-in. Please check the UserID/Password.' });
                                }
                            }).catch(function (error) {
                                logger.info(error);
                                deferred.reject({ error: 402, message: 'Failed to sign-in. Please check the UserID/Password.' });
                            });
                        }
                        else {
                            logger.info('Inactive User');
                            deferred.reject({ error: 402, message: 'Failed to sign-in as the user is no longer Active.' });
                        }
                    } else {
                        logger.info('No transaction');
                        deferred.reject({ error: 402, message: 'Failed to sign-in. Please check the UserID.' });
                    }
                })
                .catch(function (err) { logger.info(err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    UserLogout: function (user) {
        var deferred = q.defer();
        try {
            var dbdate = new Date();
            var createdDate = moment(dbdate).add(30, 'day').format('L LT');
            this.GetUser(user.userId)
                .then(function (userdtl) {
                    models.sequelize.transaction().then(function (t) {
                        if (t != null && t != undefined) {
                            models.UserSession.update({ LogoutDate: createdDate },
                                { where: { userId: user.userId, SessionTokenId: user.token, LogoutDate: null } }, { transaction: t })
                                .then(function (userSession) {
                                    models.User.update({ LastUsedDate: createdDate }, { where: { userId: user.userId } }, { transaction: t })
                                        .then(function (userupdate) {
                                            t.commit();
                                            deferred.resolve({ error: 200, msg: 'Logout Successfully' });
                                        })
                                        .catch(function (userupdateerror) {
                                            t.rollback();
                                            deferred.reject({ error: 500, msg: userupdateerror });
                                        });
                                }).catch(function (userSessionerror) {
                                    t.rollback();
                                    deferred.reject({ error: 500, msg: userSessionerror });
                                });
                        }
                    }).catch(function (transerr) { deferred.reject(transerr); });;
                })
                .catch(function (err) { deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetMenuList: function (userId) {
        logger.info('Start fetching menu..');
        var deferred = q.defer();
        try {
            logger.info('query' + userId);
            sequelize.query('select distinct MenuName, Path, RM.RightID, RM.ShowMenu, RM.Icon from TBL_RIGHT_MASTER RM inner join TBL_ROLERIGHT_MAPPING RR on RM.RightID=RR.RightID inner join TBL_USER_MASTER UM on RR.RoleID=UM.RoleId where UM.Userid = :UserId order by RM.RightID',
                {
                    replacements: { UserId: userId },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (response) {
                    logger.info('success');
                    logger.info('response: ' + response);
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('failure: ' + err);
                    deferred.reject(err);
                });

        }
        catch (Ex) {
            logger.info('Exception: ' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    GetRightsList: function (userId) {
        logger.info('Start fetching rights..');
        var deferred = q.defer();
        try {
            logger.info('query' + userId);
            sequelize.query('select distinct RightName, Path from TBL_RIGHT_MASTER RM inner join TBL_ROLERIGHT_MAPPING RR on RM.RightID=RR.RightID inner join TBL_USER_MASTER UM on RR.RoleID=UM.RoleId where UM.Userid = :UserId',
                {
                    replacements: { UserId: userId },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (response) {
                    logger.info('success');
                    logger.info('response: ' + response);
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('failure: ' + err);
                    deferred.reject(err);
                });

        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetUserSessionInfo: function (createdDate) {
        logger.info('Start fetching Users session info..');
        var deferred = q.defer();
        try {
            logger.info('query ' + createdDate);
            sequelize.query('Select UserId, CreatedDate from TBL_USER_SESSION where CONVERT(date, CreatedDate) = :CreatedOn',
                {
                    replacements: { CreatedOn: createdDate },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (response) {
                    logger.info('success');
                    logger.info('response: ' + response);
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('failure: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    decryptStringWithRsaPrivateKey: function (toDecrypt) {
        var privateKey = fs.readFileSync('./certificate/server.key', "utf8");
        var buffer = new Buffer(toDecrypt, "base64");
        var decrypted = crypto.privateDecrypt(privateKey, buffer);
        return decrypted.toString("utf8");
    },

    AddUserHierarchy: function (hier) {
        logger.info('Add User Hierarchy');
        var deferred = q.defer();
        try {
            models.UserHierarchy.bulkCreate(hier, { omitNull: true })
                .then(function (added) { deferred.resolve(added); })
                .catch(function (err) {
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    UpdateHierarchyJSON: function (hier) {
        logger.info('Update User Hierarchy');
        var deferred = q.defer();
        try {
            models.UserHierarchyJSON.destroy({ truncate: true })
                .then(function (del) {
                    if (hier != undefined && hier.TreeJSON != undefined && hier.TreeJSON != '') {
                        models.UserHierarchyJSON.create({ TreeJSON: hier.TreeJSON })
                            .then(function (hier) {
                                deferred.resolve(hier);
                            })
                            .catch(function (err) {
                                logger.info('ex creating JSON: ' + err);
                                deferred.reject(err);
                            });
                    }
                    else {
                        logger.info('hier is empty');
                        deferred.resolve(del);
                    }
                })
                .catch(function (err) {
                    logger.info('ex deleting JSON: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    DeleteUserHierarchy: function (mainuser) {
        logger.info('DeleteUserHierarchy.');
        var deferred = q.defer();
        try {
            var userId = mainuser.UserId;
            logger.info('User id to delete: ' + userId);
            models.UserHierarchy.destroy({ where: { UserId: userId } }, { truncate: false })
                .then(function () {
                    logger.info('Deleted the user: ' + userId);
                    models.UserHierarchy.destroy({ where: { Reportee: userId } }, { truncate: false })
                        .then(function (response) {
                            logger.info('Deleted the Reportee: ' + userId);

                            logger.info('Deleting parentless nodes..');
                            sequelize.query('WHILE (Select Count(UserId) from TBL_USERHIERARCHY where UserId not in (Select Reportee from TBL_USERHIERARCHY) and UserId != \'\') > 0 BEGIN Delete from TBL_USERHIERARCHY where UserId not in (Select Reportee from TBL_USERHIERARCHY) and UserId != \'\' END',
                                {
                                    type: sequelize.QueryTypes.SELECT
                                }).then(function (res) {
                                    deferred.resolve('success');
                                }).error(function (err) {
                                    logger.info('failure in finding broken users: ' + err);
                                    brokenUsersExist = false;
                                    deferred.reject(err);
                                });

                        }).error(function (err) {
                            logger.info('failure in deleting the mainreportee: ' + err);
                            deferred.reject(err);
                        });
                }).error(function (err) {
                    logger.info('failure in deleting the mainuser: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetHierarchyJSON: function () {
        logger.info('GetHierarchyJSON');
        var deferred = q.defer();
        try {
            models.UserHierarchyJSON.findOne({ where: { id: 1 } }).then(function (json) {
                deferred.resolve(json);
            }).catch(function (err) { logger.info('GetHierarchyJSON error: ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    LoopHierarchy: function (userId) {
        var deferred = q.defer();
        try {
            models.UserHierarchy.findAll({ where: { UserId: userId } })
                .then(function (user) {
                    for (var i = 0; i < user.length; i++) {
                        hierlist.push(user[i].Reportee);
                        if (userHierList.indexOf(user[i].Reportee) < 0)
                            userHierList.push(user[i].Reportee);
                    }
                    deferred.resolve(user);
                })
                .catch(function (err) { logger.info('LoopHierarchy error: ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    CallUserHierarchy: function (userId) {
        var deferred = q.defer();
        try {
            hierlist = [];
            userHierList = [];
            UserModel.GetUserHierarchy(userId).then(function (user) {
                deferred.resolve(user);
            })
                .catch(function (err) { logger.info('CallUserHierarchy error: ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetUserHierarchy: function (userId) {
        logger.info('Start fetching the User Hierarchy');
        var deferred = q.defer();
        try {
            if (userId != null && userId != undefined) {
                logger.info('Inside get hierarchy for user ' + userId);
                UserModel.LoopHierarchy(userId).then(function (response) {
                    logger.info('HierList: ' + JSON.stringify(hierlist));
                    logger.info('UserHierList: ' + JSON.stringify(userHierList));
                    if (hierlist.length > 0) {
                        UserModel.GetUserHierarchy(hierlist[0]).then(function (bill) {
                            deferred.resolve(userHierList);
                        }).catch(function (err) { logger.info('GetUserHierarchy error: ' + err); deferred.reject(err) });
                        hierlist.splice(0, 1);
                    }
                    else {
                        logger.info('Retrieved User Hierarchy: ' + JSON.stringify(userHierList));
                        deferred.resolve(userHierList);
                    }
                }).catch(function (err) {
                    logger.info('Error occurred when looping hierarchy: ' + err);
                    deferred.reject(err);
                });
            }
            else {
                logger.info('Inside get all users');
                sequelize.query('select UH.UserId, UM.UserName, Reportee from TBL_USERHIERARCHY UH left join TBL_USER_MASTER UM on UM.Userid = UH.UserId',
                    { type: sequelize.QueryTypes.SELECT })
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetBillingOptions: function (userId) {
        logger.info('Start Fetching the Billing options');
        var deferred = q.defer();
        try {
            if (userId != null && userId != undefined) {
                logger.info('Inside get billing for user ' + userId);
                models.Billing.findOne({ where: { Id: userId } })
                    .then(function (bill) { deferred.resolve(bill); })
                    .catch(function (err) { logger.info('GetBillingOptions error: ' + err); deferred.reject(err) });
            }
            else {
                logger.info('Inside get all billing');
                models.Billing.findAll().then(function (bill) {
                    deferred.resolve(bill);
                }).catch(function (err) { logger.info('GetAllBillingOptions error: ' + err); deferred.reject(err) });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetBaseSkillOptions: function (userId) {
        logger.info('Start Fetching the Base Skill options');
        var deferred = q.defer();
        try {
            if (userId != null && userId != undefined) {
                logger.info('Inside get Base Skill for user ' + userId);
                models.BaseSkill.findOne({ where: { Id: userId } })
                    .then(function (skill) { deferred.resolve(skill); })
                    .catch(function (err) { logger.info('GetBaseSkillOptions error: ' + err); deferred.reject(err) });
            }
            else {
                logger.info('Inside get all billing');
                models.BaseSkill.findAll().then(function (skill) {
                    deferred.resolve(skill);
                }).catch(function (err) { logger.info('GetAllBaseSkillOptions error: ' + err); deferred.reject(err) });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetLocation: function (userId) {
        logger.info('Start Fetching the Locations');
        var deferred = q.defer();
        try {
            if (userId != null && userId != undefined) {
                logger.info('Inside get Location for user ' + userId);
                models.Location.findOne({ where: { Id: userId } })
                    .then(function (loc) { deferred.resolve(loc); })
                    .catch(function (err) { logger.info('GetLocation error: ' + err); deferred.reject(err) });
            }
            else {
                logger.info('Inside get all billing');
                models.Location.findAll().then(function (locs) {
                    deferred.resolve(locs);
                }).catch(function (err) { logger.info('GetAllLocations error: ' + err); deferred.reject(err) });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetInactiveUsers: function () {
        logger.info('Start Fetching the Inactive users');
        var deferred = q.defer();
        try {
            models.User.findAll({ where: { Status: 'Inactive' } }).then(function (users) {
                deferred.resolve(users);
            }).catch(function (err) { logger.info('GetInactiveUsers error: ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    ADFSUserLogin: function (email) {
        var deferred = q.defer();
        try {

            var curentdate = moment().format("YYYY-MM-DD HH:mm:ss");
            var createdDate = moment.utc(curentdate).toDate();
            createdDate = moment(createdDate).format('YYYY-MM-DD HH:mm:ss');
            // var dbdate = new Date();
            // var createdDate = moment(dbdate).format('L LT');

            models.User.findOne({ where: { EmailId: email } })
                .then(function (user) {
                    if (user != null && user != undefined) {
                        if (user.Status != 'Inactive') {

                            var expireAt = moment().add(90000, 'seconds').format('L LT');
                            var token = Utility.UtilityModel.generateToken(user, 90000);
                            logger.info(token.length);
                            models.sequelize.transaction().then(function (t) {
                                if (t != null && t != undefined) {
                                    models.UserSession.create({
                                        SessionTokenId: token, UserId: user.userId, Tokendetail: token,
                                        CreatedDate: createdDate, ExpiredDate: expireAt, RequestIPAddress: user.requestIPAddress
                                    }, { transaction: t })
                                        .then(function (userSession) {
                                            models.User.update({ LastAuthenticatedDate: createdDate }, { where: { userId: user.userId } }, { transaction: t })
                                                .then(function (userupdate) {
                                                    t.commit();
                                                    deferred.resolve({
                                                        token: token, expires: expireAt, user: {
                                                            userId: user.userId,
                                                            UserName: user.UserName, EmailId: user.EmailId, MobileNumber: user.MobileNumber,
                                                            CustomData: user.CustomData, Status: user.Status, UserExpiryDate: user.UserExpiryDate,
                                                            PasswordExpiryDate: user.PasswordExpiryDate, UserBlockDate: user.UserBlockDate,
                                                            AttemptedTries: user.AttemptedTries, LastUsedDate: user.LastUsedDate,
                                                            CreatedDate: user.CreatedDate, CreatedBy: user.CreatedBy,
                                                            ModifiedDate: user.ModifiedDate, ModifiedBy: user.ModifiedBy, ApprovedDate: user.ModifiedBy,
                                                            Approvedby: user.Approvedby, MakerComment: user.MakerComment,
                                                            CheckerComment: user.CheckerComment
                                                        }
                                                    });
                                                })
                                                .catch(function (userupdateerror) {
                                                    t.rollback();
                                                    logger.info(userupdateerror);
                                                    deferred.reject(userupdateerror);
                                                });
                                        }).catch(function (userSessionerror) {
                                            t.rollback();
                                            logger.info(userSessionerror);
                                            deferred.reject(userSessionerror);
                                        });
                                }
                            }).catch(function (transerror) {
                                logger.info(transerror);
                                deferred.reject({ error: 'Failed to sign-in. Please check the UserID/Password.' });
                            });

                        }
                        else {
                            logger.info('Inactive User');
                            deferred.reject({ error: 402, message: 'Failed to sign-in as the user is no longer Active.' });
                        }
                    } else {
                        logger.info('No transaction');
                        deferred.reject({ error: 402, message: 'Failed to sign-in. Please check the UserID.' });
                    }
                })
                .catch(function (err) { logger.info(err); deferred.reject(err); });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    }
}
module.exports.UserModel = UserModel;