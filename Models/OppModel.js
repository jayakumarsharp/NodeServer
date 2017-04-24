var LevelOneUserType = [3, 6];
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var logger = require(__base + 'Models/logger');
var models = require(__base + "Schema");
var uuid = require('node-uuid');
var q = require('q');

var OppModel = {
    GetOpportunity: function (oppId) {
        logger.info('Start Fetching the Opportunity');
        var deferred = q.defer();
        try {
            if (oppId != null && oppId != undefined) {
                logger.info('Inside get opportunity ' + oppId);
                models.OPPORTUNITY.findOne({ where: { id: oppId } })
                .then(function (opp) { deferred.resolve(opp); })
                .catch(function (err) { logger.info('GetOpportunity ' + err); deferred.reject(err) });
            }
            else {
                logger.info('Inside get all opportunities');
                models.OPPORTUNITY.findAll({ where: { IsActive: true } }).then(function (opps) {
                    deferred.resolve(opps);
                }).catch(function (err) { deferred.reject(err) });
            }
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetOppForMyDay: function () {
        logger.info('Start Fetching the Opportunity for My Day');
        var deferred = q.defer();
        try {
            logger.info('querying..');
            sequelize.query('Select SM.SBU, OM.AccountName, OM.OpportunityName, OM.OppId from TBL_OPPORTUNITY_MASTER OM inner join TBL_SBU_MASTER SM on SM.id = OM.SBUId where OM.IsActive = \'true\'',
                {
                    type: sequelize.QueryTypes.SELECT
                }).then(function (response) {
                    logger.info('successfully retrieved');
                    logger.info('response: ' + response);
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('failure: ' + err);
                    deferred.reject(err)
                });
        }
        catch (Ex) {
            logger.info('Exception: ' + Ex);
        }
        return deferred.promise;
    },
    GetOpportunityBySBU: function (user) {
        logger.info('Start fetching the GetOpportunityBySBU..');
        var deferred = q.defer();
        try {
            var SBUData = [];

            var UserArray = this.GetOpportunityForUser({ 'userID': user.userID }).then(function (result) {
                logger.info(JSON.stringify(result));
                for (var i = 0; i < result.length; i++) {
                    if (result[i].SBUId == user.SBUId) {
                        SBUData.push(result[i]);
                    }
                }
                deferred.resolve(SBUData);
            }).catch(function (err) { logger.info('GetOpportunityBySBU error' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetUserSBU: function (userId) {
        logger.info('Start fetching the User SBU');
        var deferred = q.defer();
        try {
            logger.info('Inside get user SBU for user:  ' + userId);
            models.UserSBU.findAll({ where: { UserID: userId } })
            .then(function (sbus) { deferred.resolve(sbus); })
            .catch(function (err) { logger.info('GetUserSBU ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetOpportunitySBUCount: function (userID) {
        logger.info('Start Fetching the GetOpportunitySBUCount');
        logger.info('For User: ' + JSON.stringify(userID.userId));
        var deferred = q.defer();
        try {
            var SBUCountData = [];
            var tempSBUCountData = [];
            var IndiaCount = 0;
            var USCount = 0;
            var MEACount = 0;
            var EuropeCount = 0
            var APACCount = 0;
            var PEDCount = 0;
            var AcqueonCount = 0;

            var UserArray = this.GetOpportunityForUser({ 'userID': userID.userId }).then(function (result) {

                // logger.info(JSON.stringify(result));
                // logger.info(result.length);
                for (var i = 0; i < result.length; i++) {
                    //logger.info('result.length' + result.SBUId);
                    if (result[i].SBUId == 1) {
                        IndiaCount = IndiaCount + 1;
                    }
                    else if (result[i].SBUId == 2) {
                        USCount = USCount + 1;
                    }
                    else if (result[i].SBUId == 3) {
                        MEACount = MEACount + 1;
                    }
                    else if (result[i].SBUId == 4) {
                        EuropeCount = EuropeCount + 1;
                    }
                    else if (result[i].SBUId == 5) {
                        APACCount = APACCount + 1;
                    }
                    else if (result[i].SBUId == 7) {
                        PEDCount = PEDCount + 1;
                    }
                    else if (result[i].SBUId == 8) {
                        AcqueonCount = AcqueonCount + 1;
                    }
                }
                logger.info('IndiaCount' + IndiaCount);
                logger.info('MEACount' + MEACount);
                logger.info('USCount' + USCount);
                logger.info('EuropeCount' + EuropeCount);
                logger.info('APACCount' + APACCount);
                logger.info('PEDCount' + PEDCount);
                logger.info('AcqueonCount' + AcqueonCount);

                SBUCountData.push({ 'SBUId': '1', 'SBU': 'India', 'COUNT': IndiaCount });
                SBUCountData.push({ 'SBUId': '5', 'SBU': 'APAC', 'COUNT': APACCount });
                SBUCountData.push({ 'SBUId': '2', 'SBU': 'US', 'COUNT': USCount });
                SBUCountData.push({ 'SBUId': '4', 'SBU': 'Europe', 'COUNT': EuropeCount });
                SBUCountData.push({ 'SBUId': '3', "SBU": "MEA", "COUNT": MEACount });
                SBUCountData.push({ 'SBUId': '7', "SBU": "PED", "COUNT": PEDCount });
                SBUCountData.push({ 'SBUId': '8', "SBU": "Acqueon", "COUNT": AcqueonCount });



                models.UserSBU.findAll({ where: { UserID: userID.userId } }).then(
                function (userData) {
                    logger.info('-------------------- user data: ------------------\n' + JSON.stringify(userData));
                    for (var count = 0; count < userData.length; count++) {
                        logger.info("SBU id:" + userData[count].SBUID);
                        if (userData[count].SBUID != '6') {
                            for (i = 0; i < SBUCountData.length; i++) {
                                if (SBUCountData[i].SBUId == userData[count].SBUID)
                                    tempSBUCountData.push(SBUCountData[i]);
                            }
                            deferred.resolve(tempSBUCountData);
                        }
                        else {
                            deferred.resolve(SBUCountData);
                        }
                    }
                }
                ).catch(function (err) { logger.info('Find User ' + err); });



                // deferred.resolve(SBUCountData);
            }).catch(function (err) { logger.info('Find User ' + err); });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetOpportunityForUser: function (userID) {
        logger.info('Start Fetching the GetOpportunityForUser');
        logger.info('GetOpportunityForUser:' + JSON.stringify(userID));
        var deferred = q.defer();
        try {
            var queryAssignedToMe = 'SELECT distinct(OM.id),OM.SBUId,SM.SBU as SBU, CountryId,AccountName,OpportunityName,ParentOppId,OppId,AccManagerName,IsManual, CS.StatusName as CSCStatus FROM TBL_OPPORTUNITY_MASTER OM inner join TBL_SBU_MASTER SM on OM.SBUId=SM.id inner join TBL_CSCStatus CS on isnull(OM.CSCStatusId,1)=CS.Id inner join TBL_OPPORTUNITYUSER OU on OM.id = OU.OpportunityID inner join TBL_USERSBU_MAPPING USM on USM.UserID =  OU.UserID and  OU.UserID = :UserId where OM.IsActive = \'true\'';
            var queryAssignedToAllInMySBU = 'SELECT distinct(OM.id),OM.SBUId,SM.SBU as SBU,CountryId,AccountName,OpportunityName,ParentOppId,OppId,AccManagerName,IsManual, CS.StatusName as CSCStatus FROM TBL_OPPORTUNITY_MASTER OM left join TBL_SBU_MASTER SM on OM.SBUId=SM.id left join TBL_CSCStatus CS on isnull(OM.CSCStatusId,1)=CS.Id inner join TBL_USERSBU_MAPPING USM on USM.UserID = :UserId and OM.SBUId = USM.SBUID where OM.IsActive = \'true\''

            models.UserSBU.findAll({ where: { UserID: userID.userID } }).then(function (userSbu) {
                var AllSBU = false;
                logger.info('-----------------usersbu mapping---------------\n' + JSON.stringify(userSbu));
                for (var i = 0; i < userSbu.length; i++) {
                    if (userSbu.length == 1 && userSbu[i].SBUID == 6) {
                        logger.info('User has privileges to ALL sbu');
                        AllSBU = true;
                        break;
                    }
                    else {
                        logger.info('User has NO privileges to ALL sbu');
                        AllSBU = false;
                        break;
                    }
                }
                models.User.findOne({ where: { userId: userID.userID } }).then(
                    function (userData) {
                        logger.info("user TypeId :" + userData.TypeId);
                        if (userData.TypeId == 1 || userData.TypeId == 2 || userData.TypeId == 3 || userData.TypeId == 6 || userData.TypeId == 10 || userData.TypeId == 12 || userData.TypeId == 13) {

                            logger.info('Get User specific user');
                            try {
                                logger.info('query' + userID.userID);
                                sequelize.query(queryAssignedToMe,
                                {
                                    replacements: { UserId: userID.userID },
                                    type: sequelize.QueryTypes.SELECT
                                }).then(function (response) {
                                    logger.info('success');
                                    logger.info('response: ' + response);
                                    deferred.resolve(response);
                                }).error(function (err) {
                                    logger.info('failure: ' + err);
                                    deferred.reject(err)
                                });

                            }
                            catch (Ex) {
                                logger.info('Exception: ' + Ex);
                            }
                        }
                        else if (AllSBU == false) {
                            logger.info('Get SBU Data');
                            try {
                                sequelize.query(queryAssignedToAllInMySBU,
                                {
                                    replacements: { UserId: userID.userID },
                                    type: sequelize.QueryTypes.SELECT
                                }).then(function (response) {
                                    logger.info('success');
                                    logger.info('response: ' + response);
                                    deferred.resolve(response);
                                }).error(function (err) {
                                    logger.info('failure: ' + err);
                                    deferred.reject(err)
                                });

                            }
                            catch (Ex) {
                                logger.info('Exception: ' + Ex);
                            }
                        }
                        else {
                            logger.info('Get all data');
                            query = 'SELECT OM.*,SM.SBU as SBU, CS.StatusName as CSCStatus FROM TBL_OPPORTUNITY_MASTER OM inner join TBL_SBU_MASTER SM on OM.SBUId=SM.id left join TBL_CSCStatus CS on isnull(OM.CSCStatusId,1) = CS.Id where OM.IsActive = \'true\'';
                            try {
                                sequelize.query(query,
                                {
                                    type: sequelize.QueryTypes.SELECT
                                }).then(function (response) {
                                    logger.info('success');
                                    logger.info('response: ' + response);
                                    deferred.resolve(response);
                                }).error(function (err) {
                                    logger.info('failure: ' + err);
                                    deferred.reject(err)
                                });


                            }
                            catch (Ex) {
                                logger.info('Exception: ' + Ex);
                            }
                        }
                    }
                    ).catch(function (err) { logger.info('Find User ' + err); });
            }).catch(function (err) { logger.info('Find SBU ' + err); });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetMyAssignedOpportunities: function (userId) {
        logger.info('Getting opportunities assigned to ' + userId);
        var deferred = q.defer();
        try {
            models.User.findOne({ where: { userId: userId } }).then(
                function (userData) {
                    logger.info('user found-------------');

                    var query = 'SELECT distinct(OM.id),SBUId,CountryId,AccountName,OpportunityName,ParentOppId,OppId,AccManagerName,ExpectedClosureDate,OM.CreatedOn as OppCreatedOn, OU.CreatedOn as OppAssignedOn FROM TBL_OPPORTUNITY_MASTER OM inner join TBL_OPPORTUNITYUSER OU on OM.id = OU.OpportunityID and OU.UserID = :UserId where OM.IsActive = \'true\'';
                    try {
                        logger.info('querying..');
                        sequelize.query(query,
                        {
                            replacements: { UserId: userId },
                            type: sequelize.QueryTypes.SELECT
                        }).then(function (response) {
                            logger.info('success');
                            logger.info('response: ' + response);
                            deferred.resolve(response);
                        }).error(function (err) {
                            logger.info('failure: ' + err);
                            deferred.reject(err)
                        });

                    }
                    catch (Ex) {
                        logger.info('Exception: ' + Ex);
                    }
                }).error(function (err) {
                    logger.info('cannot find user: ' + err);
                    deferred.reject(err)
                });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetUnassignedOpportunities: function () {
        logger.info('Getting un-assigned opportunities..');
        var deferred = q.defer();
        var query = 'SELECT id,SBUId,CountryId,AccountName,OpportunityName,ParentOppId,OppId,AccManagerName,ExpectedClosureDate,CreatedOn FROM TBL_OPPORTUNITY_MASTER where IsActive = \'true\' and id not in (select OpportunityID from TBL_OPPORTUNITYUSER)';
        try {
            logger.info('querying..');
            sequelize.query(query,
            {
                type: sequelize.QueryTypes.SELECT
            }).then(function (response) {
                logger.info('success');
                logger.info('response: ' + response);
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('failure: ' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetTypeID: function (userId) {
        logger.info('Getting type id for user ' + userId);
        var deferred = q.defer();
        var query = 'Select TypeId from TBL_USER_MASTER where Userid = :UserId';
        try {
            sequelize.query(query,
            {
                replacements: { UserId: userId },
                type: sequelize.QueryTypes.SELECT
            }).then(function (response) {
                logger.info('success');
                logger.info('response: ' + response);
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('failure: ' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    }

}
module.exports.OppModel = OppModel;