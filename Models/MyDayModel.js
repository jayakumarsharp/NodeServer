var q = require('q');
var moment = require('moment');
var Sequelize = require('sequelize');
var models = require(__base + "Schema");
var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var User = require('./UserModel');
var _ = require('underscore')._;


var MyDayModel = {
    GetTaskTypes: function () {
        var deferred = q.defer();
        logger.info('Getting Task Types..');
        try {
            models.TaskType.findAll().then(function (types) {
                deferred.resolve(types);
            }).catch(function (err) { logger.info('Getting Task Types error: ' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetLockedDate: function () {
        var deferred = q.defer();
        logger.info('Getting Locked Date..');
        try {
            models.MyDayLock.findAll().then(function (date) {
                logger.info('Result: ' + JSON.stringify(date));
                deferred.resolve(date);
            }).catch(function (err) { logger.info('Getting locked date error: ' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    SetReleaseLock: function (lockdate) {
        var deferred = q.defer();
        logger.info('SetReleaseLock..');
        try {
            if (lockdate.LockDate != null || lockdate.LockDate != undefined) {
                logger.info('Input lockdate: ' + JSON.stringify(lockdate));
                logger.info('Setting lock..');

                var localTime = moment.utc(lockdate.LockDate).toDate();
                lockdate.LockDate = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

                models.MyDayLock.update({ LockDate: lockdate.LockDate }, { where: { Id: 1 } })
                    .then(function (set) {
                        deferred.resolve(set);
                    })
                    .catch(function (seterror) {
                        deferred.reject(seterror);
                    });
            }
            else {
                logger.info('Releasing lock..');
                models.MyDayLock.update({ LockDate: null }, { where: { Id: 1 } })
                    .then(function (release) {
                        deferred.resolve(release);
                    })
                    .catch(function (releaseerror) {
                        deferred.reject(releaseerror);
                    });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetMyDay: function (userid) {
        var deferred = q.defer();
        logger.info('Getting My Day info for user: ' + userid);
        try {
            models.MyDay.findAll({ where: { UpdatedBy: userid } }).then(function (myday) {
                deferred.resolve(myday);
            }).catch(function (err) { logger.info('Getting My Day info error: ' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetHRMISLeave: function (userid, month, year) {
        var deferred = q.defer();

        logger.info('Getting HRMIS info for user: ' + userid);
        try {
            models.HRMIS.findOne({ where: { UserId: userid, Month: month, Year: year } }).then(function (hrmis) {
                deferred.resolve(hrmis);
            }).catch(function (err) { logger.info('Error getting hrmis info: ' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    SetHRMISLeave: function (hrmis) {
        var deferred = q.defer();
        logger.info('Setting HRMIS Leave for user: ' + hrmis.UserId);
        try {
            var localTime = moment.utc(hrmis.LeaveDate).toDate();
            hrmis.LeaveDate = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
            hrmis.LeaveDate = moment(hrmis.LeaveDate).add(1, 'days').format('L LT');

            var year = new Date(hrmis.LeaveDate).getFullYear();
            var month = new Date(hrmis.LeaveDate).getMonth() + 1;

            logger.info('Inputs: ' +
                '\nUserId: ' + hrmis.UserId +
                '\nLeaveDate: ' + hrmis.LeaveDate +
                '\nLeaveCount: ' + hrmis.LeaveCount);

            models.HRMIS.destroy({ where: { UserId: hrmis.UserId, Month: month, Year: year } }).then(function () {
                models.HRMIS.create({
                    UserId: hrmis.UserId,
                    LeaveDate: hrmis.LeaveDate,
                    LeaveCount: hrmis.LeaveCount,
                    Month: month,
                    Year: year
                }).then(function (hrmis) {
                    deferred.resolve(hrmis);
                }).catch(function (err) { logger.info('Error creating hrmis: ' + err); deferred.reject(err); });
            }).catch(function (err) { logger.info('Error destroying hrmis: ' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    SaveWeekends: function (weekend) {
        logger.info('SaveWeekends..');
        var deferred = q.defer();
        logger.info('Bulk creating..');
        try {
            models.LocationWeekend.destroy({ where: { LocationId: weekend[0].LocationId } }).then(function () {
                models.LocationWeekend.bulkCreate(weekend, { omitNull: true }).then(function (data) {
                    logger.info('Added weekends successfully');
                    deferred.resolve(data);
                }).catch(function (err) {
                    logger.info('Error bulk creating location-weekend: ' + err);
                    deferred.reject(err);
                });
            }).catch(function (err) { logger.info('Error destroying location-weekend: ' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetWeekends: function (locationid) {
        var deferred = q.defer();
        logger.info('Getting Weekends info for location: ' + locationid);
        try {
            if (locationid != null && locationid != undefined && locationid != 'null' && locationid != 'undefined') {
                models.LocationWeekend.findAll({ where: { LocationId: locationid } }).then(function (myday) {
                    deferred.resolve(myday);
                }).catch(function (err) { logger.info('Getting Weekends info error: ' + err); deferred.reject(err); });
            }
            else {
                models.LocationWeekend.findAll().then(function (myday) {
                    deferred.resolve(myday);
                }).catch(function (err) { logger.info('Getting Weekends info error: ' + err); deferred.reject(err); });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetAllDays: function () {
        var deferred = q.defer();
        logger.info('Getting days in a week');
        try {
            models.Days.findAll().then(function (days) {
                deferred.resolve(days);
            }).catch(function (err) { logger.info('Getting Weekends info error: ' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetMyDayFromTaskId: function (taskid) {
        var deferred = q.defer();
        logger.info('Getting My Day info for task: ' + taskid);
        try {
            models.MyDay.findAll({ where: { TaskId: taskid } }).then(function (myday) {
                deferred.resolve(myday);
            }).catch(function (err) { logger.info('Getting My Day info error: ' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetNewOpps: function (UserId) {
        var deferred = q.defer();
        try {
            logger.info('GetNewOpps for user ' + UserId);
            sequelize.query('SELECT distinct(OpportunityName),OppId,SM.SBU from TBL_MYDAY MD inner join TBL_SBU_MASTER SM on MD.SBU = SM.id  WHERE OppId = \'NEW\' AND UpdatedBy = :userid',
                { replacements: { userid: UserId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                    deferred.resolve(response);
                }).error(function (err) {
                    console.log('Error occurred when getting new opps: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    UpdateNewOpp: function (opp) {
        var deferred = q.defer();
        logger.info('UpdateNewOpp..');
        try {
            logger.info('Data to update: ' + JSON.stringify(opp));
            models.MyDay.update({
                OppId: opp.OppId,
                OpportunityName: opp.OpportunityName,
                SBU: opp.SBU
            },
                {
                    where: {
                        OppId: 'NEW',
                        OpportunityName: opp.OldOppName
                    }
                })
                .then(function (set) {
                    logger.info('Successfully updated');
                    deferred.resolve(set);
                })
                .catch(function (seterror) {
                    logger.info('Error occurred when updating: ' + seterror);
                    deferred.reject(seterror);
                });

        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    SaveSubmitMyDay: function (myday) {
        logger.info('SaveSubmitMyDay..');
        var deferred = q.defer();
        logger.info('Saving for user ' + myday[0].UpdatedBy);
        try {
            logger.info(JSON.stringify(myday));

            models.User.findOne({ where: { userId: myday[0].UpdatedBy } }).then(function (user) {
                models.UserBillingSBU.findAll({ where: { UserID: myday[0].UpdatedBy } }).then(function (usersbu) {
                    var userSBU = '';
                    for (var cnt = 0; cnt < usersbu.length; cnt++) {
                        userSBU = userSBU + usersbu[cnt].SBUID;
                        if (cnt != usersbu.length - 1) {
                            userSBU = userSBU + ',';
                        }
                    }
                    logger.info('Billing SBU: ' + usersbu);
                    for (var i = 0; i < myday.length; i++) {
                        var localTime = moment.utc(myday[i].WorkDate).toDate();
                        myday[i].WorkDate = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

                        var curDate = new Date();
                        var currTime = moment.utc(curDate).toDate();
                        myday[i].EntryDate = moment(currTime).format('YYYY-MM-DD HH:mm:ss');

                        myday[i].RoleId = user.TypeId;
                        myday[i].BillingId = user.BillingId;
                        myday[i].BaseSkillId = user.BaseSkillId;
                        myday[i].LocationId = user.LocationId;
                        myday[i].BillingSBU = userSBU;
                        myday[i].TotalMinutes = (myday[i].hhDuration * 60) + myday[i].mmDuration;

                    }
                    models.MyDay.bulkCreate(myday, { omitNull: true }).then(function (data) {
                        logger.info('Added myday successfully');
                        deferred.resolve(data);
                    }).catch(function (err) {
                        logger.info('Error bulk creating myday: ' + err);
                        deferred.reject(err);
                    });
                }).catch(function (err) { logger.info('Getting My Day info error: ' + err); deferred.reject(err); });
            }).catch(function (err) { logger.info('Getting My Day info error: ' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetMyDayOppIDsForUsers: function (Users) {
        var deferred = q.defer();
        try {
            logger.info('GetMyDayOppIDsForUsers');
            logger.info(JSON.stringify(Users))
            var users = Users.Users.split(',');
            var userArray = '';
            for (var i = 0; i < users.length; i++) {
                userArray = userArray + '\'' + users[i] + '\'';
                if (i != users.length - 1) {
                    userArray = userArray + ',';
                }
            }
            var query = 'select distinct(OppId) from TBL_MYDAY where UpdatedBy in' + '(' + userArray + ')';
            logger.info(query);
            sequelize.query(query,
                { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                    deferred.resolve(response);
                }).error(function (err) {
                    console.log('Error occurred when getting new opps: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetMyDayOppNamesForUsers: function (Users) {
        var deferred = q.defer();
        try {
            logger.info('GetMyDayOppNamesForUsers');
            logger.info(JSON.stringify(Users))
            var users = Users.Users.split(',');
            var userArray = '';
            for (var i = 0; i < users.length; i++) {
                userArray = userArray + '\'' + users[i] + '\'';
                if (i != users.length - 1) {
                    userArray = userArray + ',';
                }
            }
            var query = 'select distinct(OpportunityName) from TBL_MYDAY where UpdatedBy in' + '(' + userArray + ')';
            logger.info(query);
            sequelize.query(query,
                { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                    deferred.resolve(response);
                }).error(function (err) {
                    console.log('Error occurred when getting new opps: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetTaskDetailsReport: function (taskdetails) {
        var deferred = q.defer();
        try {
            logger.info('GetTaskDetailsReport');
            var TaskDetails = taskdetails[0];
            logger.info('Task Details: ' + JSON.stringify(TaskDetails));
            // if (TaskDetails.OppId == undefined) {
            //     TaskDetails.OppId = null;
            // }
            // else if (TaskDetails.OppId.OppId != undefined) {
            //     TaskDetails.OppId = TaskDetails.OppId.OppId;
            // }
            //logger.info('TaskDetails.OppId: ' + TaskDetails.OppId);
            //TaskDetails.OppId = TaskDetails.OppId == undefined ? null : TaskDetails.OppId.OppId;
            TaskDetails.Resource = TaskDetails.Resource == undefined ? null : TaskDetails.Resource;
            //TaskDetails.OpportunityName = TaskDetails.OpportunityName == undefined ? null : TaskDetails.OpportunityName.OpportunityName;
            TaskDetails.SBUId = TaskDetails.SBUId == undefined ? null : TaskDetails.SBUId;
            TaskDetails.TypeId = TaskDetails.TypeId == undefined ? null : TaskDetails.TypeId;

            logger.info('Inputs..' +
                '\nResource: ' + TaskDetails.Resource +
                '\nSBU: ' + TaskDetails.SBUId +
                '\nType: ' + TaskDetails.TypeId +
                '\nFromDate: ' + TaskDetails.FromDate +
                '\nToDate: ' + TaskDetails.ToDate);

            var query = '';
            var reportees = [];
            if (TaskDetails.Resource == null) {

                User.UserModel.CallUserHierarchy(TaskDetails.MainUser)
                    .then(function (reps) {
                        reportees.push(TaskDetails.MainUser);
                        for (var i = 0; i < reps.length; i++) {
                            reportees.push(reps[i]);
                        }
                        logger.info('Reportees are: ' + JSON.stringify(reps));
                        var userArray = '';
                        for (var i = 0; i < reportees.length; i++) {
                            userArray = userArray + '\'' + reportees[i] + '\'';
                            if (i != reportees.length - 1) {
                                userArray = userArray + ',';
                            }
                        }

                        if (TaskDetails.OppIdArray.length > 0) {
                            var oppIdArray = '';
                            for (var i = 0; i < TaskDetails.OppIdArray.length; i++) {
                                oppIdArray = oppIdArray + '\'' + TaskDetails.OppIdArray[i].OppId + '\'';
                                if (i != TaskDetails.OppIdArray.length - 1) {
                                    oppIdArray = oppIdArray + ',';
                                }
                            }

                            query = 'SELECT WorkDate,OppId,TaskId,OpportunityName,SBU,TM.TaskName,hhDuration,mmDuration,Note, UpdatedBy FROM TBL_MYDAY MD inner join TBL_TASKTYPE_MASTER TM on MD.TaskTypeId = TM.TaskTypeId inner join TBL_USER_MASTER UM on MD.UpdatedBy = UM.Userid where OppId in (' + oppIdArray + ') AND UpdatedBy in (' + userArray + ') AND MD.SBU=(case when :sbuid is null then MD.SBU ELSE :sbuid END) AND UM.TypeId=(case when :typeid is null then UM.TypeId ELSE :typeid END) AND WorkDate between :fromDate and :toDate';
                        }
                        else {
                            query = 'SELECT WorkDate,OppId,TaskId,OpportunityName,SBU,TM.TaskName,hhDuration,mmDuration,Note, UpdatedBy FROM TBL_MYDAY MD inner join TBL_TASKTYPE_MASTER TM on MD.TaskTypeId = TM.TaskTypeId inner join TBL_USER_MASTER UM on MD.UpdatedBy = UM.Userid where UpdatedBy in (' + userArray + ') AND MD.SBU=(case when :sbuid is null then MD.SBU ELSE :sbuid END) AND UM.TypeId=(case when :typeid is null then UM.TypeId ELSE :typeid END) AND WorkDate between :fromDate and :toDate';
                        }
                        logger.info(query);
                        sequelize.query(query,
                            {
                                replacements: {
                                    //oppid: TaskDetails.OppId,
                                    //oppname: TaskDetails.OpportunityName,
                                    sbuid: TaskDetails.SBUId,
                                    typeid: TaskDetails.TypeId,
                                    fromDate: TaskDetails.FromDate,
                                    toDate: TaskDetails.ToDate
                                },
                                type: sequelize.QueryTypes.SELECT
                            }).then(function (response) {
                                logger.info('Data fetched successfully');
                                deferred.resolve(response);
                            }).error(function (err) {
                                logger.info('Error occurred when getting TaskDetailsReport: ' + err);
                                deferred.reject(err);
                            });
                    })
                    .catch(function (err) { logger.info('GetTaskDetailsReport error: ' + err); deferred.reject(err) });
            }
            else {

                if (TaskDetails.OppIdArray.length > 0) {
                    var oppIdArray = '';
                    for (var i = 0; i < TaskDetails.OppIdArray.length; i++) {
                        oppIdArray = oppIdArray + '\'' + TaskDetails.OppIdArray[i].OppId + '\'';
                        if (i != TaskDetails.OppIdArray.length - 1) {
                            oppIdArray = oppIdArray + ',';
                        }
                    }

                    query = 'SELECT WorkDate,OppId,TaskId,OpportunityName,SBU,TM.TaskName,hhDuration,mmDuration,Note, UpdatedBy FROM TBL_MYDAY MD inner join TBL_TASKTYPE_MASTER TM on MD.TaskTypeId = TM.TaskTypeId inner join TBL_USER_MASTER UM on MD.UpdatedBy = UM.Userid where OppId in (' + oppIdArray + ') AND UpdatedBy=(case when :updatedby is null then UpdatedBy ELSE :updatedby END) AND MD.SBU=(case when :sbuid is null then MD.SBU ELSE :sbuid END) AND UM.TypeId=(case when :typeid is null then UM.TypeId ELSE :typeid END) AND WorkDate between :fromDate and :toDate';
                }
                else {
                    query = 'SELECT WorkDate,OppId,TaskId,OpportunityName,SBU,TM.TaskName,hhDuration,mmDuration,Note, UpdatedBy FROM TBL_MYDAY MD inner join TBL_TASKTYPE_MASTER TM on MD.TaskTypeId = TM.TaskTypeId inner join TBL_USER_MASTER UM on MD.UpdatedBy = UM.Userid where UpdatedBy=(case when :updatedby is null then UpdatedBy ELSE :updatedby END) AND MD.SBU=(case when :sbuid is null then MD.SBU ELSE :sbuid END) AND UM.TypeId=(case when :typeid is null then UM.TypeId ELSE :typeid END) AND WorkDate between :fromDate and :toDate';
                }
                logger.info(query);
                sequelize.query(query,
                    {
                        replacements: {
                            oppid: TaskDetails.OppId,
                            updatedby: TaskDetails.Resource,
                            oppname: TaskDetails.OpportunityName,
                            sbuid: TaskDetails.SBUId,
                            typeid: TaskDetails.TypeId,
                            fromDate: TaskDetails.FromDate,
                            toDate: TaskDetails.ToDate
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (response) {
                        logger.info('Data fetched successfully');
                        deferred.resolve(response);
                    }).error(function (err) {
                        logger.info('Error occurred when getting TaskDetailsReport: ' + err);
                        deferred.reject(err);
                    });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetSCUtilizationReport: function (scUtilsInput) {
        var deferred = q.defer();
        try {
            logger.info('Inside GetSCUtilizationReport');
            logger.info('SC Utils Input: ' + JSON.stringify(scUtilsInput));

            scUtilsInput.FromDate = scUtilsInput.FromDate.split('T')[0];
            scUtilsInput.ToDate = scUtilsInput.ToDate.split('T')[0];

            var fmdate = new Date(scUtilsInput.FromDate), yf = fmdate.getFullYear(), mf = fmdate.getMonth();
            var todate = new Date(scUtilsInput.ToDate), yt = todate.getFullYear(), mt = todate.getMonth();
            var firstDay = new Date(yf, mf, 1);
            var lastDay = new Date(yt, mt + 1, 0);

            firstDay = moment(firstDay).format('L');
            lastDay = moment(lastDay).format('L');

            logger.info('Format with js: \n');
            logger.info('From: ' + firstDay);
            logger.info('To: ' + lastDay);

            scUtilsInput.FromDate = firstDay;
            scUtilsInput.ToDate = lastDay;

            var userinfo = [];
            var typearray = '';
            var userarray = '';

            for (var i = 0; i < scUtilsInput.TypeId.length; i++) {
                typearray = typearray + scUtilsInput.TypeId[i];
                if (i != scUtilsInput.TypeId.length - 1) {
                    typearray = typearray + ',';
                }
            }

            for (var i = 0; i < scUtilsInput.UserId.length; i++) {
                userarray = userarray + '\'' + scUtilsInput.UserId[i] + '\'';
                if (i != scUtilsInput.UserId.length - 1) {
                    userarray = userarray + ',';
                }
            }

            logger.info('Final Inputs..' + '\nUser Type: ' + typearray +
                '\nUser Name: ' + userarray +
                '\nFromDate: ' + scUtilsInput.FromDate +
                '\nToDate: ' + scUtilsInput.ToDate);

            var queryNonBULogged = 'Select COUNT(distinct(WorkDate)) as NonBULoggedDays, UpdatedBy from TBL_MYDAY M where OppId = \'NONE\' and TaskTypeId != 30 and TaskTypeId != 32 and WorkDate not in (Select DateValue from fnGetWeekends(LocationId, :fromDate, :toDate)) and WorkDate not in(select distinct(WorkDate) from TBL_MYDAY M2 where OppId != \'NONE\' and M2.UpdatedBy = M.UpdatedBy and WorkDate between :fromDate and :toDate) and WorkDate between :fromDate and :toDate group by UpdatedBy';

            logger.info(queryNonBULogged);
            sequelize.query(queryNonBULogged,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: {
                        fromDate: scUtilsInput.FromDate,
                        toDate: scUtilsInput.ToDate
                    },
                }).then(function (nonBuLogged) {
                    var queryMDLeaveDays = 'Select UpdatedBy, sum(case when hhDuration = 4 then 0.5 else case when hhDuration = 8 then 1 else 0 end end) as MyDayLeaveCount from TBL_MyDay where TaskTypeId = 30 and WorkDate between :fromDate and :toDate group by UpdatedBy';

                    logger.info(queryMDLeaveDays);
                    sequelize.query(queryMDLeaveDays,
                        {
                            type: sequelize.QueryTypes.SELECT,
                            replacements: {
                                fromDate: scUtilsInput.FromDate,
                                toDate: scUtilsInput.ToDate
                            },
                        }).then(function (mdLeaveDays) {

                            var loggedDaysquery = 'select Count(distinct(WorkDate)) as MDLoggedDays, UpdatedBy from TBL_MYDAY MD inner join (select DM.Day, LocationId from TBL_DAYS_MASTER DM inner join TBL_Location_Weekend LW on DM.Id = LW.DayId) D on MD.LocationId = D.LocationId where UpdatedBy in (' + userarray + ') and WorkDate between :fromDate and :toDate and UPPER(DATENAME(dw,WorkDate)) not in (select DM.Day from TBL_DAYS_MASTER DM inner join TBL_Location_Weekend LW on DM.Id = LW.DayId where LocationId = MD.LocationId) group by UpdatedBy';

                            logger.info('logged days query:\n' + loggedDaysquery);
                            sequelize.query(loggedDaysquery,
                                {
                                    replacements: {
                                        fromDate: scUtilsInput.FromDate,
                                        toDate: scUtilsInput.ToDate
                                    },
                                    type: sequelize.QueryTypes.SELECT
                                }).then(function (loggedDays) {
                                    logger.info('Result: ' + JSON.stringify(loggedDays));
                                    var queryHrmis = 'select UserId, sum(LeaveCount) as LeaveCount from TBL_HRMIS_LEAVES where LeaveDate between :fromDate and :toDate group by UserId';

                                    logger.info(queryHrmis);
                                    sequelize.query(queryHrmis,
                                        {
                                            replacements: {
                                                fromDate: scUtilsInput.FromDate,
                                                toDate: scUtilsInput.ToDate
                                            },
                                            type: sequelize.QueryTypes.SELECT
                                        }).then(function (leaveCount) {
                                            logger.info('HRMIS Query Result: ' + JSON.stringify(leaveCount));

                                            var query = 'Select UM.Userid, UM.UserName, convert(NUMERIC(18, 2), sum(case when (TaskTypeId != 30 and TaskTypeId != 32) then mmDuration ELSE 0 END) / 60 + (sum(case when (TaskTypeId != 30 and TaskTypeId != 32) then mmDuration ELSE 0 END) % 60) / 100.0) + sum(case when (TaskTypeId != 30 and TaskTypeId != 32) then hhDuration ELSE 0 END) as TotalHoursSpent, convert(NUMERIC(18, 2), sum(case when (OppId != \'NONE\' and TaskTypeId != 30 and TaskTypeId != 32) then mmDuration ELSE 0 END) / 60 + (sum(case when (OppId != \'NONE\' and TaskTypeId != 30 and TaskTypeId != 32) then mmDuration ELSE 0 END) % 60) / 100.0) + sum(case when (OppId != \'NONE\' and TaskTypeId != 30 and TaskTypeId != 32) then hhDuration ELSE 0 END) as BillableHoursSpent, count(distinct(MD.WorkDate))as MDLoggedDays from TBL_MYDAY MD inner join TBL_USER_MASTER UM on UM.Userid = MD.UpdatedBy where UM.TypeId in (' + typearray + ') and UpdatedBy in (' + userarray + ') and MD.WorkDate between :fromDate and :toDate group by UM.UserName, UM.Userid';

                                            logger.info(query);
                                            sequelize.query(query,
                                                {
                                                    replacements: {
                                                        userid: scUtilsInput.UserId,
                                                        typeid: scUtilsInput.TypeId,
                                                        fromDate: scUtilsInput.FromDate,
                                                        toDate: scUtilsInput.ToDate
                                                    },
                                                    type: sequelize.QueryTypes.SELECT
                                                }).then(function (response) {
                                                    logger.info('Result: ' + JSON.stringify(response));
                                                    for (var i = 0; i < response.length; i++) {
                                                        for (var j = 0; j < leaveCount.length; j++)
                                                            if (response[i].Userid == leaveCount[j].UserId) {
                                                                response[i].HRMISLeaveDays = leaveCount[j].LeaveCount;
                                                            }
                                                    }
                                                    for (var a = 0; a < response.length; a++) {
                                                        for (var b = 0; b < mdLeaveDays.length; b++)
                                                            if (response[a].Userid == mdLeaveDays[b].UpdatedBy) {
                                                                response[a].MDLeaveDays = mdLeaveDays[b].MyDayLeaveCount;
                                                            }
                                                    }
                                                    for (var a = 0; a < response.length; a++) {
                                                        for (var b = 0; b < loggedDays.length; b++)
                                                            if (response[a].Userid == loggedDays[b].UpdatedBy) {
                                                                response[a].MDLoggedDays = loggedDays[b].MDLoggedDays;
                                                            }
                                                    }
                                                    for (var a = 0; a < response.length; a++) {
                                                        var continueNonBULoop = true;
                                                        for (var b = 0; b < nonBuLogged.length; b++)
                                                            if (continueNonBULoop && response[a].Userid == nonBuLogged[b].UpdatedBy) {
                                                                response[a].NonBULoggedDays = nonBuLogged[b].NonBULoggedDays;
                                                                continueNonBULoop = false;
                                                            }
                                                        if (continueNonBULoop) {
                                                            response[a].NonBULoggedDays = 0;
                                                        }
                                                    }
                                                    deferred.resolve(response);
                                                }).error(function (err) {
                                                    logger.info('Error occurred when getting SCUtilizationReport: ' + err);
                                                    deferred.reject(err);
                                                });
                                        }).error(function (err) {
                                            logger.info('Error occurred when getting SCUtilizationReport: ' + err);
                                            deferred.reject(err);
                                        });
                                }).error(function (err) {
                                    logger.info('Error occurred when getting SCUtilizationReport: ' + err);
                                    deferred.reject(err);
                                });


                        }).error(function (err) {
                            logger.info('Error occurred when getting SCUtilizationReport: ' + err);
                            deferred.reject(err);
                        });
                });


        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetSCUtilizationWeeklyReport: function (scUtilsInput) {
        var deferred = q.defer();
        try {
            logger.info('GetSCUtilizationWeeklyReport');
            //logger.info('SC Utils Input: ' + JSON.stringify(scUtilsInput));

            scUtilsInput.FromDate = scUtilsInput.FromDate.split('T')[0];

            logger.info('Date before formatting: \n');
            logger.info('From: ' + scUtilsInput.FromDate);

            var localTime = moment.utc(scUtilsInput.FromDate).toDate();
            scUtilsInput.FromDate = moment(localTime).format('L');
            scUtilsInput.FromDate = moment(scUtilsInput.FromDate).subtract(2, 'days').format('L');
            scUtilsInput.ToDate = moment(scUtilsInput.FromDate).add(6, 'days').format('L');

            var typearray = '';
            var userarray = '';

            for (var i = 0; i < scUtilsInput.TypeId.length; i++) {
                typearray = typearray + scUtilsInput.TypeId[i];
                if (i != scUtilsInput.TypeId.length - 1) {
                    typearray = typearray + ',';
                }
            }

            for (var i = 0; i < scUtilsInput.UserId.length; i++) {
                userarray = userarray + '\'' + scUtilsInput.UserId[i].UserId + '\'';
                if (i != scUtilsInput.UserId.length - 1) {
                    userarray = userarray + ',';
                }
            }

            logger.info('Inputs..' + '\nUser Type: ' + typearray +
                '\nUser Name: ' + userarray +
                '\nFromDate: ' + scUtilsInput.FromDate +
                '\nToDate: ' + scUtilsInput.ToDate);

            var Efforts = [];
            var Holidays = [];
            var Weekends = [];
            var WeeklyReport = [];

            var queryEfforts = 'Select SUM(TotalMinutes)/ convert(DECIMAL(4,2), 60) as Efforts, WorkDate, UpdatedBy, LocationId, TaskTypeId from TBL_MYDAY where WorkDate between :fromDate and :toDate and UpdatedBy in (' + userarray + ') and RoleId in (' + typearray + ')  group by WorkDate, TaskTypeId, UpdatedBy, LocationId order by WorkDate asc';

            logger.info('Query efforts: ' + queryEfforts);
            sequelize.query(queryEfforts,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: {
                        fromDate: scUtilsInput.FromDate,
                        toDate: scUtilsInput.ToDate
                    }
                }).then(function (resEffort) {
                    Efforts = resEffort;
                    var queryHoliday = 'Select LocationID as LocationId, Date from TBL_HOLIDAY_CALENDAR where Date between :fromDate and :toDate';

                    logger.info('Query holiday: ' + queryHoliday);
                    sequelize.query(queryHoliday,
                        {
                            type: sequelize.QueryTypes.SELECT,
                            replacements: {
                                fromDate: scUtilsInput.FromDate,
                                toDate: scUtilsInput.ToDate
                            }
                        }).then(function (resHoliday) {
                            Holidays = resHoliday;

                            var queryWeekend = 'Select LocationId, Day from TBL_Location_Weekend lw inner join TBL_DAYS_MASTER dm on dm.Id = lw.DayId';

                            logger.info('Query weekend: ' + queryWeekend);
                            sequelize.query(queryWeekend,
                                {
                                    type: sequelize.QueryTypes.SELECT,
                                }).then(function (resWeekend) {
                                    Weekends = resWeekend;
                                    // TODO //
                                    var dates = [];
                                    var currentdate = scUtilsInput.FromDate;

                                    for (var iCnt = 0; iCnt <= 6; iCnt++) { // Hard-coded to 6 as it is a Weekly Report
                                        var dtCurr = new Date(currentdate);
                                        if (dtCurr <= new Date(scUtilsInput.ToDate)) {
                                            dates.push({ 'WorkDate': currentdate });
                                            currentdate = moment(currentdate).add(1, 'days').format('MM/DD/YYYY');
                                        }
                                    }
                                    logger.info('Dates list: ' + JSON.stringify(dates));
                                    var UserSums = [];
                                    for (var j = 0; j < scUtilsInput.UserId.length; j++) {
                                        var totEffort = 0;
                                        var totLeave = 0;
                                        var totHoliday = 0;
                                        for (var i = 0; i <= 6; i++) {
                                            var effortWeek = {};
                                            effortWeek[dates[i].WorkDate] = 0;
                                            var dtFound = false;
                                            var userFound = false;
                                            for (var effCnt = 0; effCnt < Efforts.length; effCnt++) {
                                                if (Efforts[effCnt].UpdatedBy == scUtilsInput.UserId[j].UserId) {
                                                    userFound = true;
                                                    var dt = moment.utc(Efforts[effCnt].WorkDate).toDate();
                                                    dt = moment(dt).format('MM/DD/YYYY');
                                                    effortWeek.UpdatedBy = Efforts[effCnt].UpdatedBy;
                                                    effortWeek.WorkDate = dates[i].WorkDate;
                                                    if (dt == dates[i].WorkDate) {
                                                        if (Efforts[effCnt].TaskTypeId == 30) {
                                                            effortWeek[dates[i].WorkDate] = 'Leave';
                                                            totLeave += 1;
                                                        }
                                                        else {
                                                            if (effortWeek[dates[i].WorkDate] != 'Leave')
                                                                effortWeek[dates[i].WorkDate] += Efforts[effCnt].Efforts;
                                                            totEffort += Efforts[effCnt].Efforts;
                                                            logger.info('Current Total Effort for user ' + effortWeek.UpdatedBy + ' is ' + totEffort);
                                                        }
                                                        dtFound = true;
                                                    }
                                                }
                                            }
                                            if (userFound && !dtFound) {
                                                var weekendz = MyDayModel.GetValuesByLocation(scUtilsInput.UserId[j].LocationId, Weekends);
                                                for (var w = 0; w < weekendz.length; w++) {
                                                    var day = moment(dates[i].WorkDate).format('dddd');
                                                    if (day == weekendz[w].Day) {
                                                        effortWeek[dates[i].WorkDate] = 'Weekend';
                                                        dtFound = true;
                                                    }
                                                }
                                                if (!dtFound) {
                                                    var holz = MyDayModel.GetValuesByLocation(scUtilsInput.UserId[j].LocationId, Holidays);
                                                    for (var w = 0; w < holz.length; w++) {
                                                        var dt = moment.utc(holz[w].Date).toDate();
                                                        dt = moment(dt).format('MM/DD/YYYY');
                                                        if (dates[i].WorkDate == dt) {
                                                            effortWeek[dates[i].WorkDate] = 'Holiday';
                                                            dtFound = true;
                                                            totHoliday += 1;
                                                        }
                                                    }
                                                    if (!dtFound)
                                                        effortWeek[dates[i].WorkDate] = '';
                                                }

                                            }
                                            if (userFound) {
                                                WeeklyReport.push(effortWeek);
                                            }
                                            else {
                                                effortWeek.UpdatedBy = scUtilsInput.UserId[j].UserId;
                                                effortWeek.WorkDate = dates[i].WorkDate;
                                                effortWeek[dates[i].WorkDate] = '';
                                                WeeklyReport.push(effortWeek);
                                            }
                                        }

                                        var sum = {}
                                        sum.UpdatedBy = scUtilsInput.UserId[j].UserId;
                                        sum.Total = totEffort.toFixed(2);
                                        sum.Leave = totLeave;
                                        sum.Holiday = totHoliday;
                                        sum.Days = 5 - totHoliday - totLeave;
                                        sum.Util = ((sum.Total / (sum.Days * 8)) * 100).toFixed(2) + '%';
                                        logger.info('pushing sum ' + JSON.stringify(sum));
                                        UserSums.push(sum);
                                    }
                                    //logger.info('Resolved object: ' + JSON.stringify(WeeklyReport));
                                    var FinalList = {};
                                    FinalList.Dates = dates;
                                    FinalList.WeeklyReport = WeeklyReport;
                                    FinalList.Counts = UserSums;
                                    deferred.resolve(FinalList);
                                }).error(function (err) {
                                    logger.info('Error occurred when getting weekend: ' + err);
                                    deferred.reject(err);
                                });
                        }).error(function (err) {
                            logger.info('Error occurred when getting holiday: ' + err);
                            deferred.reject(err);
                        });
                }).error(function (err) {
                    logger.info('Error occurred when getting efforts: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetValuesByLocation: function (locId, List) {
        return val = _.where(List, { LocationId: locId });
    },

    GetHolidaybetweendate: function (scUtilsInput) {
        var deferred = q.defer();
        try {
            logger.info('Inside GetHolidayBetween');
            logger.info('SC Utils Input: ' + JSON.stringify(scUtilsInput));

            scUtilsInput.FromDate = scUtilsInput.FromDate.split('T')[0];
            scUtilsInput.ToDate = scUtilsInput.ToDate.split('T')[0];

            var fmdate = new Date(scUtilsInput.FromDate), yf = fmdate.getFullYear(), mf = fmdate.getMonth();
            var todate = new Date(scUtilsInput.ToDate), yt = todate.getFullYear(), mt = todate.getMonth();
            var firstDay = new Date(yf, mf, 1);
            var lastDay = new Date(yt, mt + 1, 0);

            firstDay = moment(firstDay).format('L');
            lastDay = moment(lastDay).format('L');

            logger.info('Format with js: \n');
            logger.info('From: ' + firstDay);
            logger.info('To: ' + lastDay);

            scUtilsInput.FromDate = firstDay;
            scUtilsInput.ToDate = lastDay;


            scUtilsInput.TypeId = scUtilsInput.TypeId == undefined ? null : scUtilsInput.TypeId;
            scUtilsInput.UserId = scUtilsInput.UserId == undefined ? null : scUtilsInput.UserId;

            var userinfo = [];

            logger.info('Inputs..' + '\nUser Type: ' + scUtilsInput.TypeId +
                '\nUser Name: ' + scUtilsInput.UserId +
                '\nFromDate: ' + scUtilsInput.FromDate +
                '\nToDate: ' + scUtilsInput.ToDate);

            // var query = 'select count(H.LocationID) cnt,U.UserName,U.LocationId from TBL_USER_MASTER U left join TBL_HOLIDAY_CALENDAR H on U.LocationId = H.LocationID and H.Date not in (Select DateValue from fnGetWeekends(U.LocationId,:fromDate, :toDate)) and H.Date between :fromDate and :toDate group by H.LocationID,U.UserName,U.LocationId';

            var query = 'Select A.UserName, A.LocationId, count(H.LocationID) cnt from (select distinct(UserName), case when m.LocationId is null then u.LocationId else m.LocationId end as LocationId from TBL_USER_MASTER u right join TBL_MYDAY m on u.Userid = m.UpdatedBy where m.WorkDate between :fromDate and :toDate) A left join TBL_HOLIDAY_CALENDAR H on A.LocationId = H.LocationID and H.Date not in (Select DateValue from fnGetWeekends(A.LocationId,:fromDate, :toDate)) and H.Date between :fromDate and :toDate group by H.LocationID,A.UserName,A.LocationId order by A.UserName asc';

            logger.info(query);
            sequelize.query(query,
                {
                    replacements: {
                        fromDate: scUtilsInput.FromDate,
                        toDate: scUtilsInput.ToDate
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (response) {
                    logger.info('Result: ' + JSON.stringify(response));

                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('Error occurred when getting SCUtilizationReport: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetSCBillingNewReport: function (scBillingInput) {
        var deferred = q.defer();
        try {
            logger.info('Getting SC billing new way report');
            logger.info('SC Billing New Input: ' + JSON.stringify(scBillingInput));

            if (scBillingInput.Month != 'All') {
                if (scBillingInput.Month == '01' || scBillingInput.Month == '02' || scBillingInput.Month == '03') {
                    logger.info('Adding 1 to BillingYear');
                    from = new Date(scBillingInput.Month + '/01/' + scBillingInput.BillingPeriod);
                    from.setFullYear(from.getFullYear() + 1);
                }
                else
                    from = new Date(scBillingInput.Month + '/01/' + scBillingInput.BillingPeriod);

                var localTime = moment.utc(from).toDate();
                scBillingInput.FromDate = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

                var lastdta = moment(scBillingInput.FromDate).daysInMonth();
                scBillingInput.ToDate = moment(scBillingInput.FromDate).add((lastdta - 1), 'days').format('YYYY-MM-DD HH:mm:ss');
            }
            else {
                var from = new Date('04/01/' + scBillingInput.BillingPeriod);
                var localTime = moment.utc(from).toDate();
                scBillingInput.FromDate = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

                var nextYr = from.getFullYear() + 1;
                var to = new Date('03/01/' + nextYr);
                var localTime2 = moment.utc(to).toDate();
                scBillingInput.ToDate = moment(localTime2).format('YYYY-MM-DD HH:mm:ss');
            }

            var typearray = '';
            for (var i = 0; i < scBillingInput.TypeId.length; i++) {
                typearray = typearray + scBillingInput.TypeId[i];
                if (i != scBillingInput.TypeId.length - 1) {
                    typearray = typearray + ',';
                }
            }

            logger.info('Inputs..' +
                '\nTypeID: ' + typearray +
                '\nFromDate: ' + scBillingInput.FromDate +
                '\nToDate: ' + scBillingInput.ToDate);

            var billQuery = 'select SUM(TotalMinutes)/ convert(DECIMAL(4,2), 60) as Efforts,SBU, DATEPART(MM,WorkDate) as Month, UpdatedBy, BillingSBU,BillingId, RoleId from tbl_myday where TaskTypeId != 30 and TaskTypeId != 32 and WorkDate between :fromDate and :toDate and RoleId in (' + typearray + ') group by UpdatedBy,SBU,DATEPART(MM,WorkDate), BillingSBU,BillingId, RoleId order by DATEPART(MM,WorkDate) asc';

            logger.info('Query: ' + billQuery);
            sequelize.query(billQuery,
                {
                    replacements: {
                        fromDate: scBillingInput.FromDate,
                        toDate: scBillingInput.ToDate
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (sharedResponse) {
                    logger.info('Billing Result: ' + JSON.stringify(sharedResponse));
                    deferred.resolve(sharedResponse);
                }).error(function (err) {
                    logger.info('Error occurred when getting scBillingNewReport: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetSCBillingReport: function (scBillingInput) {
        var deferred = q.defer();
        try {
            logger.info('Getting SC billing leaves');
            logger.info('SC Billing Leaves Input: ' + JSON.stringify(scBillingInput));

            if (scBillingInput.Month != 'All') {
                if (scBillingInput.Month == '01' || scBillingInput.Month == '02' || scBillingInput.Month == '03') {
                    logger.info('Adding 1 to BillingYear');
                    from = new Date(scBillingInput.Month + '/01/' + scBillingInput.BillingPeriod);
                    from.setFullYear(from.getFullYear() + 1);
                }
                else
                    from = new Date(scBillingInput.Month + '/01/' + scBillingInput.BillingPeriod);

                var localTime = moment.utc(from).toDate();
                scBillingInput.FromDate = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

                var lastdta = moment(scBillingInput.FromDate).daysInMonth();
                scBillingInput.ToDate = moment(scBillingInput.FromDate).add((lastdta - 1), 'days').format('YYYY-MM-DD HH:mm:ss');
            }
            else {
                var from = new Date('04/01/' + scBillingInput.BillingPeriod);
                var localTime = moment.utc(from).toDate();
                scBillingInput.FromDate = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

                var nextYr = from.getFullYear() + 1;
                var to = new Date('03/01/' + nextYr);
                var localTime2 = moment.utc(to).toDate();
                scBillingInput.ToDate = moment(localTime2).format('YYYY-MM-DD HH:mm:ss');
            }

            var typearray = '';
            for (var i = 0; i < scBillingInput.TypeId.length; i++) {
                typearray = typearray + scBillingInput.TypeId[i];
                if (i != scBillingInput.TypeId.length - 1) {
                    typearray = typearray + ',';
                }
            }

            logger.info('Inputs..' +
                '\nTypeID: ' + typearray +
                '\nFromDate: ' + scBillingInput.FromDate +
                '\nToDate: ' + scBillingInput.ToDate);

            //var query = 'Select SBU, DATEPART(mm,WorkDate) as Month, convert(NUMERIC(18, 2), sum(case when TaskTypeId != 39 then mmDuration else 0 end) / 60 + (sum(case when TaskTypeId != 39 then mmDuration else 0 end) % 60) / 100.0) + sum(case when TaskTypeId != 39 then hhDuration else 0 end) as HoursSpentOnSBU from TBL_MYDAY where WorkDate between :fromDate and :toDate group by SBU,DATEPART(mm,WorkDate)';

            //var sharedHoursQuery = 'Select UpdatedBy,SBU,DATEPART(mm,WorkDate) as Month,convert(NUMERIC(18, 2), sum(case when BillingId = 1 then mmDuration else 0 end) / 60 + (sum(case when BillingId = 1 then mmDuration else 0 end) % 60) / 100.0) + sum(case when BillingId = 1 then hhDuration else 0 end) as SharedHours from TBL_MYDAY where WorkDate between :fromDate and :toDate group by UpdatedBy,sbu,DATEPART(mm,WorkDate) union Select UpdatedBy,SBU,DATEPART(mm,WorkDate) as Month, convert(NUMERIC(18, 2), sum(mmDuration) / 60 + (sum(mmDuration) % 60) / 100.0) + sum(hhDuration) as NonSharedHours from( select * from TBL_MYDAY where WorkDate between :fromDate and :toDate and BillingId = 2 and SBU not in (Select Value from fnSplitVariable(BillingSBU, \',\'))) A group by UpdatedBy,SBU,DATEPART(mm,WorkDate) ';

            var leavesQuery = 'Select DATEPART(mm,WorkDate) as Month, convert(NUMERIC(18,2), (SUM(TotalMinutes)))/60 as LeaveHours from TBL_MYDAY where BillingId=1 and (TaskTypeId=30 or TaskTypeId=32 ) and WorkDate between :fromDate and :toDate group by DATEPART(mm,WorkDate) order by DATEPART(mm,WorkDate) asc';

            logger.info('Leaves Query' + leavesQuery);
            sequelize.query(leavesQuery,
                {
                    replacements: {
                        fromDate: scBillingInput.FromDate,
                        toDate: scBillingInput.ToDate
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (sharedResponse) {
                    logger.info('Leaves Result: ' + JSON.stringify(sharedResponse));
                    deferred.resolve(sharedResponse);
                }).error(function (err) {
                    logger.info('Error occurred when getting scBillingReport: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetSCBillingTotal: function (scBillingInput) {
        var deferred = q.defer();
        try {
            logger.info('GetSCBillingTotal');
            logger.info('SC Billing Input: ' + JSON.stringify(scBillingInput));

            if (scBillingInput.Month != 'All') {
                if (scBillingInput.Month == '01' || scBillingInput.Month == '02' || scBillingInput.Month == '03') {
                    logger.info('Adding 1 to BillingYear');
                    from = new Date(scBillingInput.Month + '/01/' + scBillingInput.BillingPeriod);
                    from.setFullYear(from.getFullYear() + 1);
                }
                else
                    from = new Date(scBillingInput.Month + '/01/' + scBillingInput.BillingPeriod);

                var localTime = moment.utc(from).toDate();
                scBillingInput.FromDate = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

                var lastdta = moment(scBillingInput.FromDate).daysInMonth();
                scBillingInput.ToDate = moment(scBillingInput.FromDate).add((lastdta - 1), 'days').format('YYYY-MM-DD HH:mm:ss');
            }
            else {
                var from = new Date('04/01/' + scBillingInput.BillingPeriod);
                var localTime = moment.utc(from).toDate();
                scBillingInput.FromDate = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

                var nextYr = from.getFullYear() + 1;
                var to = new Date('03/01/' + nextYr);
                var localTime2 = moment.utc(to).toDate();
                scBillingInput.ToDate = moment(localTime2).format('YYYY-MM-DD HH:mm:ss');
            }

            logger.info('Inputs..' +
                '\nFromDate: ' + scBillingInput.FromDate +
                '\nToDate: ' + scBillingInput.ToDate);

            //var query = 'select convert(NUMERIC(18, 2), sum(mmDuration) / 60 + (sum(mmDuration) % 60) / 100.0) + sum(hhDuration) as HoursSpent ,DATEPART(mm,WorkDate) Month from TBL_MYDAY where WorkDate between :fromDate and :toDate group by DATEPART(mm,WorkDate)';
            // var query = 'Select DATEPART(mm,WorkDate) as Month, SBU,BillingId, convert(NUMERIC(18,2), (SUM(TotalMinutes)))/60 as HoursSpent from TBL_MYDAY where BillingId=1 and WorkDate between :fromDate and :toDate group by DATEPART(mm,WorkDate), BillingId,SBU union Select DATEPART(mm,WorkDate) as Month, SBU,BillingId, convert(NUMERIC(18,2), (SUM(TotalMinutes)))/60 as HoursSpent from( select * from TBL_MYDAY  where WorkDate between :fromDate and :toDate and BillingId = 2 and SBU!=6 and SBU !=0 and TaskTypeId != 30 and TaskTypeId != 32 and SBU not in (Select Value from fnSplitVariable(BillingSBU, \',\'))) A group by BillingId,SBU,DATEPART(mm,WorkDate) order by  DATEPART(mm,WorkDate) asc';

            var query = 'Select Month,SBU,sum(HoursSpent) HoursSpent from (Select DATEPART(mm,WorkDate) as Month, SBU,BillingId, convert(NUMERIC(18,2), (SUM(TotalMinutes)))/60 as HoursSpent from TBL_MYDAY where BillingId=1 and WorkDate between :fromDate and :toDate group by DATEPART(mm,WorkDate), BillingId,SBU union Select DATEPART(mm,WorkDate) as Month, SBU,BillingId, convert(NUMERIC(18,2), (SUM(TotalMinutes)))/60 as HoursSpent from( select * from TBL_MYDAY  where WorkDate between :fromDate and :toDate and BillingId = 2 and SBU!=6 and SBU !=0 and TaskTypeId != 30 and TaskTypeId != 32 and SBU not in (Select Value from fnSplitVariable(BillingSBU, \',\'))) A   group by BillingId,SBU,DATEPART(mm,WorkDate)) t group by Month,SBU order by Month asc';

            logger.info('Billing Hours Query: ' + query);
            sequelize.query(query,
                {
                    replacements: {
                        fromDate: scBillingInput.FromDate,
                        toDate: scBillingInput.ToDate
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (response) {
                    logger.info('Result: ' + JSON.stringify(response));
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('Error occurred when getting scBillingTotal: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetUsersBillingID: function (scBillingInput) {
        var deferred = q.defer();
        logger.info('Getting Billing IDs for My Day Users..');
        try {
            logger.info('SC Billing Input: ' + JSON.stringify(scBillingInput));
            var from = new Date();
            if (scBillingInput.Month != 'All') {
                if (scBillingInput.Month == '01' || scBillingInput.Month == '02' || scBillingInput.Month == '03') {
                    logger.info('Adding 1 to BillingYear');
                    from = new Date(scBillingInput.Month + '/01/' + scBillingInput.BillingPeriod);
                    from.setFullYear(from.getFullYear() + 1);
                }
                else
                    from = new Date(scBillingInput.Month + '/01/' + scBillingInput.BillingPeriod);

                var localTime = moment.utc(from).toDate();
                scBillingInput.FromDate = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

                var lastdta = moment(scBillingInput.FromDate).daysInMonth();
                scBillingInput.ToDate = moment(scBillingInput.FromDate).add((lastdta - 1), 'days').format('YYYY-MM-DD HH:mm:ss');
            }
            else {
                from = new Date('04/01/' + scBillingInput.BillingPeriod);
                var localTime = moment.utc(from).toDate();
                scBillingInput.FromDate = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

                var nextYr = from.getFullYear() + 1;
                var to = new Date('03/01/' + nextYr);
                var localTime2 = moment.utc(to).toDate();
                scBillingInput.ToDate = moment(localTime2).format('YYYY-MM-DD HH:mm:ss');
            }

            logger.info('Inputs..' +
                '\nFromDate: ' + scBillingInput.FromDate +
                '\nToDate: ' + scBillingInput.ToDate);

            var query = 'Select distinct(DATEPART(mm,WorkDate)) as Month, UpdatedBy, BillingId, BillingSBU from TBL_MYDAY where WorkDate between :fromDate and :toDate';
            logger.info(query);
            sequelize.query(query,
                {
                    replacements: {
                        fromDate: scBillingInput.FromDate,
                        toDate: scBillingInput.ToDate
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (response) {
                    logger.info('Result: ' + JSON.stringify(response));
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('Error occurred when getting Billing IDs for My Day users: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    formatDate: function (indate) {
        indateTime = indate.split('T');
        var date = new Date(indateTime[0]);
        var time = indateTime[1].substring(0, 8);
        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    },

    GetTaskummaryReportTotal: function (taskSummary) {
        var deferred = q.defer();
        try {
            logger.info('GetTaskSummaryReport');
            logger.info('Task Summary Inputs: ' + JSON.stringify(taskSummary));

            var localTime = moment.utc(taskSummary.FromDate).toDate();
            taskSummary.FromDate = moment(localTime).format('L');

            var localTime = moment.utc(taskSummary.ToDate).toDate();
            taskSummary.ToDate = moment(localTime).format('L');

            taskSummary.UserId = taskSummary.UserId == undefined ? [] : taskSummary.UserId;
            taskSummary.SBUId = taskSummary.SBUId == undefined ? [] : taskSummary.SBUId;
            taskSummary.TaskName = taskSummary.TaskName == undefined ? [] : taskSummary.TaskName;
            taskSummary.ReportType = taskSummary.ReportType == undefined ? [] : taskSummary.ReportType;

            logger.info('Inputs..' +
                '\nFromDate: ' + taskSummary.FromDate +
                '\nToDate: ' + taskSummary.ToDate +
                '\nUserId: ' + taskSummary.UserId.length +
                '\nSBUId: ' + taskSummary.SBUId.length +
                '\nTaskName: ' + taskSummary.TaskName.length +
                '\nReportType: ' + taskSummary.ReportType.length
            );

            var reportees = [];
            var userArray = '';
            var sbuArray = '';
            var taskArray = '';

            models.UserHierarchy.findAll({ where: { UserId: taskSummary.MainUser } })
                .then(function (reps) {

                    // --- Fix User Array For Search -- //

                    if (taskSummary.UserId.length == 0) {
                        reportees.push(taskSummary.MainUser);
                        for (var i = 0; i < reps.length; i++) {
                            reportees.push(reps[i].Reportee);
                        }
                        logger.info('Reportees are: ' + JSON.stringify(reps));
                        for (var i = 0; i < reportees.length; i++) {
                            userArray = userArray + '\'' + reportees[i] + '\'';
                            if (i != reportees.length - 1) {
                                userArray = userArray + ',';
                            }
                        }
                    }
                    else {
                        logger.info('Users selected are: ' + JSON.stringify(taskSummary.UserId));
                        for (var i = 0; i < taskSummary.UserId.length; i++) {
                            userArray = userArray + '\'' + taskSummary.UserId[i] + '\'';
                            if (i != taskSummary.UserId.length - 1) {
                                userArray = userArray + ',';
                            }
                        }
                    }

                    // --- Fix SBU Array For Search -- //

                    logger.info('SBU selected are: ' + JSON.stringify(taskSummary.SBUId));
                    for (var i = 0; i < taskSummary.SBUId.length; i++) {
                        sbuArray = sbuArray + taskSummary.SBUId[i];
                        if (i != taskSummary.SBUId.length - 1) {
                            sbuArray = sbuArray + ',';
                        }
                    }

                    // --- Fix Task Array For Search -- //

                    logger.info('Task selected are: ' + JSON.stringify(taskSummary.TaskName));
                    for (var i = 0; i < taskSummary.TaskName.length; i++) {
                        taskArray = taskArray + taskSummary.TaskName[i];
                        if (i != taskSummary.TaskName.length - 1) {
                            taskArray = taskArray + ',';
                        }
                    }

                    var selectedSBU = [];
                    var selectedTask = [];
                    if (taskSummary.TaskName.length > 0) {
                        for (var i = 0; i < taskSummary.AllTaskType.length; i++) {
                            for (var j = 0; j < taskSummary.TaskName.length; j++) {
                                if (taskSummary.AllTaskType[i].TaskTypeId == taskSummary.TaskName[j]) {
                                    selectedTask.push(taskSummary.AllTaskType[i]);
                                }
                            }
                        }
                    }
                    taskSummary.AllSBU.push({ id: 0, SBU: 'None' });
                    if (taskSummary.SBUId.length > 0) {
                        for (var i = 0; i < taskSummary.AllSBU.length; i++) {
                            for (var j = 0; j < taskSummary.SBUId.length; j++) {
                                if (taskSummary.AllSBU[i].id == taskSummary.SBUId[j]) {
                                    selectedSBU.push(taskSummary.AllSBU[i]);
                                }
                            }
                        }
                    }

                    var TaskSummaryResult = [];
                    // Query All Report Types irrespective of the selected ones
                    // 1. Task Type
                    var TaskSummaryquery = 'SELECT convert(NUMERIC(18, 2),SUM(TotalMinutes)/ convert(DECIMAL(4,2), 60)) as TotalEfforts from TBL_MYDAY md where UpdatedBy in (' + userArray + ') AND md.SBU in (' + sbuArray + ') AND md.TaskTypeId in (' + taskArray + ') AND WorkDate between :fromDate and :toDate';

                    logger.info('Task Query: ' + TaskSummaryquery);
                    sequelize.query(TaskSummaryquery,
                        {
                            replacements: {
                                fromDate: taskSummary.FromDate,
                                toDate: taskSummary.ToDate
                            },
                            type: sequelize.QueryTypes.SELECT
                        }).then(function (result) {
                            logger.info('RESULT: \n' + JSON.stringify(result));
                            deferred.resolve(result);
                        }).error(function (err) {
                            logger.info('Error occurred when getting Summary Total: ' + err);
                            deferred.reject(err);
                        });
                    // -- End -- //

                }).error(function (err) {
                    logger.info('Error occurred when getting GetTaskummaryReportTotal: ' + err);
                    deferred.reject(err);
                });

        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetTaskSummaryReport: function (taskSummary) {
        var deferred = q.defer();
        try {
            logger.info('GetTaskSummaryReport');
            logger.info('Task Summary Inputs: ' + JSON.stringify(taskSummary));

            var localTime = moment.utc(taskSummary.FromDate).toDate();
            taskSummary.FromDate = moment(localTime).format('L');

            var localTime = moment.utc(taskSummary.ToDate).toDate();
            taskSummary.ToDate = moment(localTime).format('L');

            taskSummary.UserId = taskSummary.UserId == undefined ? [] : taskSummary.UserId;
            taskSummary.SBUId = taskSummary.SBUId == undefined ? [] : taskSummary.SBUId;
            taskSummary.TaskName = taskSummary.TaskName == undefined ? [] : taskSummary.TaskName;
            taskSummary.ReportType = taskSummary.ReportType == undefined ? [] : taskSummary.ReportType;

            logger.info('Inputs..' +
                '\nFromDate: ' + taskSummary.FromDate +
                '\nToDate: ' + taskSummary.ToDate +
                '\nUserId: ' + taskSummary.UserId.length +
                '\nSBUId: ' + taskSummary.SBUId.length +
                '\nTaskName: ' + taskSummary.TaskName.length +
                '\nReportType: ' + taskSummary.ReportType.length
            );

            var reportees = [];
            var userArray = '';
            var sbuArray = '';
            var taskArray = '';

            models.UserHierarchy.findAll({ where: { UserId: taskSummary.MainUser } })
                .then(function (reps) {

                    // --- Fix User Array For Search -- //

                    if (taskSummary.UserId.length == 0) {
                        reportees.push(taskSummary.MainUser);
                        for (var i = 0; i < reps.length; i++) {
                            reportees.push(reps[i].Reportee);
                        }
                        logger.info('Reportees are: ' + JSON.stringify(reps));
                        for (var i = 0; i < reportees.length; i++) {
                            userArray = userArray + '\'' + reportees[i] + '\'';
                            if (i != reportees.length - 1) {
                                userArray = userArray + ',';
                            }
                        }
                    }
                    else {
                        logger.info('Users selected are: ' + JSON.stringify(taskSummary.UserId));
                        for (var i = 0; i < taskSummary.UserId.length; i++) {
                            userArray = userArray + '\'' + taskSummary.UserId[i] + '\'';
                            if (i != taskSummary.UserId.length - 1) {
                                userArray = userArray + ',';
                            }
                        }
                    }

                    // --- Fix SBU Array For Search -- //

                    logger.info('SBU selected are: ' + JSON.stringify(taskSummary.SBUId));
                    for (var i = 0; i < taskSummary.SBUId.length; i++) {
                        sbuArray = sbuArray + taskSummary.SBUId[i];
                        if (i != taskSummary.SBUId.length - 1) {
                            sbuArray = sbuArray + ',';
                        }
                    }

                    // --- Fix Task Array For Search -- //

                    logger.info('Task selected are: ' + JSON.stringify(taskSummary.TaskName));
                    for (var i = 0; i < taskSummary.TaskName.length; i++) {
                        taskArray = taskArray + taskSummary.TaskName[i];
                        if (i != taskSummary.TaskName.length - 1) {
                            taskArray = taskArray + ',';
                        }
                    }

                    var selectedSBU = [];
                    var selectedTask = [];
                    if (taskSummary.TaskName.length > 0) {
                        for (var i = 0; i < taskSummary.AllTaskType.length; i++) {
                            for (var j = 0; j < taskSummary.TaskName.length; j++) {
                                if (taskSummary.AllTaskType[i].TaskTypeId == taskSummary.TaskName[j]) {
                                    selectedTask.push(taskSummary.AllTaskType[i]);
                                }
                            }
                        }
                    }
                    taskSummary.AllSBU.push({ id: 0, SBU: 'None' });
                    if (taskSummary.SBUId.length > 0) {
                        for (var i = 0; i < taskSummary.AllSBU.length; i++) {
                            for (var j = 0; j < taskSummary.SBUId.length; j++) {
                                if (taskSummary.AllSBU[i].id == taskSummary.SBUId[j]) {
                                    selectedSBU.push(taskSummary.AllSBU[i]);
                                }
                            }
                        }
                    }

                    var TaskSummaryResult = [];
                    // Query All Report Types irrespective of the selected ones
                    // 1. Task Type
                    var TaskSummaryquery = 'SELECT sm.SBU,TM.TaskName, md.UpdatedBy,sum(md.hhDuration) as Hours,sum(md.mmDuration) as Minutes,md.WorkDate from TBL_MYDAY md left join TBL_SBU_MASTER sm on md.SBU=sm.id inner join TBL_TASKTYPE_MASTER TM on md.TaskTypeId = TM.TaskTypeId inner join TBL_USER_MASTER UM on md.UpdatedBy = UM.Userid where UpdatedBy in (' + userArray + ') AND md.SBU in (' + sbuArray + ') AND md.TaskTypeId in (' + taskArray + ') AND WorkDate between :fromDate and :toDate group by sm.SBU,TM.TaskName, md.UpdatedBy,md.WorkDate';

                    logger.info('Task Query: ' + TaskSummaryquery);
                    sequelize.query(TaskSummaryquery,
                        {
                            replacements: {
                                fromDate: taskSummary.FromDate,
                                toDate: taskSummary.ToDate
                            },
                            type: sequelize.QueryTypes.SELECT
                        }).then(function (result) {
                            logger.info('RESULT: \n' + JSON.stringify(result));
                            // Common code to all 3 report types //
                            var TaskSummArray = [];
                            TaskSummArray = result;
                            var dateArray = [];
                            var dataToPush = {};
                            var pushTotal = {};
                            var dates = []; //done
                            var diffInDays = moment(taskSummary.ToDate).diff(moment(taskSummary.FromDate), 'days');
                            logger.info('diffInDays' + diffInDays);
                            var currentdate = taskSummary.FromDate;

                            for (var iCnt = 0; iCnt <= diffInDays; iCnt++) {
                                var dtCurr = new Date(currentdate);
                                if (dtCurr <= new Date(taskSummary.ToDate)) {
                                    dates.push(currentdate);
                                    currentdate = moment(currentdate).add(1, 'days').format('L');
                                }
                            }
                            logger.info('Dates: \n' + JSON.stringify(dates));
                            // End of Common Code //
                            for (var count = 0; count < taskSummary.ReportType.length; count++) {

                                if (taskSummary.ReportType[count] == 'SBU') {
                                    logger.info('Formatting SBU result...')
                                    dateArray = [];
                                    var SBUList = taskSummary.SBUId.length == 0 ? taskSummary.AllSBU : selectedSBU;
                                    for (j = 0; j < dates.length; j++) {
                                        for (var k = 0; k < SBUList.length; k++) {
                                            var isSBUDataFound = false;
                                            var hh = 0;
                                            var mm = 0;
                                            var totalHH = 0;
                                            var totalMM = 0;
                                            for (i = 0; i < TaskSummArray.length; i++) {
                                                if (TaskSummArray[i].SBU == null)
                                                    TaskSummArray[i].SBU = 'None';
                                                var datee = moment.utc(TaskSummArray[i].WorkDate).toDate();
                                                TaskSummArray[i].WorkDate = moment(datee).format('MM/DD/YYYY');
                                                var currdate = moment.utc(dates[j]).toDate();
                                                dates[j] = moment(currdate).format('MM/DD/YYYY');
                                                if (TaskSummArray[i].WorkDate == dates[j] && TaskSummArray[i].SBU == SBUList[k].SBU) {
                                                    isSBUDataFound = true;
                                                    hh += TaskSummArray[i].Hours;
                                                    mm += TaskSummArray[i].Minutes;
                                                    if (mm > 59) {
                                                        hh++;
                                                        mm = mm - 60;
                                                    }
                                                    dataToPush = {
                                                        WorkDate: TaskSummArray[i].WorkDate, Hour: hh, Minutes: mm, SBU: TaskSummArray[i].SBU
                                                    }
                                                }
                                                if (TaskSummArray[i].WorkDate == dates[j]) {
                                                    totalHH += TaskSummArray[i].Hours;
                                                    totalMM += TaskSummArray[i].Minutes;
                                                    if (totalMM > 59) {
                                                        totalHH++;
                                                        totalMM = totalMM - 60;
                                                    }
                                                    pushTotal = {
                                                        WorkDate: TaskSummArray[i].WorkDate, Hour: totalHH, Minutes: totalMM, SBU: 'Total'
                                                    }
                                                }
                                            }
                                            if (isSBUDataFound) {
                                                dateArray.push(dataToPush);
                                                dataToPush = {};
                                            }
                                            else {
                                                dateArray.push({ WorkDate: dates[j], Hour: '0', Minutes: '0', SBU: SBUList[k].SBU, Total: '0' })
                                            }
                                        }
                                        if (pushTotal.WorkDate == undefined) {
                                            pushTotal = { WorkDate: dates[j], Hour: '0', Minutes: '0', SBU: 'Total' }
                                        }
                                        dateArray.push(pushTotal);
                                        pushTotal = {};
                                    }
                                    TaskSummaryResult.push({ 'SBUReport': dateArray });
                                    logger.info('SBU Report fetched');
                                }
                                else if (taskSummary.ReportType[count] == 'Task') {
                                    logger.info('Formatting Task result...')
                                    dateArray = [];
                                    var TaskList = taskSummary.TaskName.length == 0 ? taskSummary.AllTaskType : selectedTask;
                                    for (j = 0; j < dates.length; j++) {
                                        for (var k = 0; k < TaskList.length; k++) {
                                            var isTaskDataFound = false;
                                            var hh = 0;
                                            var mm = 0;
                                            var totalHH = 0;
                                            var totalMM = 0;
                                            for (i = 0; i < TaskSummArray.length; i++) {
                                                if (TaskSummArray[i].SBU == null)
                                                    TaskSummArray[i].SBU = 'None';
                                                var datee = moment.utc(TaskSummArray[i].WorkDate).toDate();
                                                TaskSummArray[i].WorkDate = moment(datee).format('MM/DD/YYYY');
                                                var currdate = moment.utc(dates[j]).toDate();
                                                dates[j] = moment(currdate).format('MM/DD/YYYY');
                                                if (TaskSummArray[i].WorkDate == dates[j] && TaskSummArray[i].TaskName == TaskList[k].TaskName) {
                                                    isTaskDataFound = true;
                                                    hh += TaskSummArray[i].Hours;
                                                    mm += TaskSummArray[i].Minutes;
                                                    if (mm > 59) {
                                                        hh++;
                                                        mm = mm - 60;
                                                    }
                                                    dataToPush = {
                                                        WorkDate: TaskSummArray[i].WorkDate, Hour: hh, Minutes: mm, TaskName: TaskSummArray[i].TaskName
                                                    }
                                                }
                                                if (TaskSummArray[i].WorkDate == dates[j]) {
                                                    totalHH += TaskSummArray[i].Hours;
                                                    totalMM += TaskSummArray[i].Minutes;
                                                    if (totalMM > 59) {
                                                        totalHH++;
                                                        totalMM = totalMM - 60;
                                                    }
                                                    pushTotal = {
                                                        WorkDate: TaskSummArray[i].WorkDate, Hour: totalHH, Minutes: totalMM, TaskName: 'Total'
                                                    }
                                                }
                                            }
                                            if (isTaskDataFound) {
                                                dateArray.push(dataToPush);
                                                dataToPush = {};
                                            }
                                            else {
                                                dateArray.push({ WorkDate: dates[j], Hour: '0', Minutes: '0', TaskName: TaskList[k].TaskName })
                                            }
                                        }
                                        if (pushTotal.WorkDate == undefined) {
                                            pushTotal = { WorkDate: dates[j], Hour: '0', Minutes: '0', TaskName: 'Total' }
                                        }
                                        dateArray.push(pushTotal);
                                        pushTotal = {};
                                    }
                                    TaskSummaryResult.push({ 'TaskReport': dateArray });
                                    logger.info('Task Report fetched');
                                }
                                else if (taskSummary.ReportType[count] == 'Resource') {
                                    logger.info('Formatting Resource result...')
                                    dateArray = [];
                                    var UserList = taskSummary.UserId.length == 0 ? reportees : taskSummary.UserId;
                                    for (j = 0; j < dates.length; j++) {
                                        for (var k = 0; k < UserList.length; k++) {
                                            var isTaskDataFound = false;
                                            var hh = 0;
                                            var mm = 0;
                                            var totalHH = 0;
                                            var totalMM = 0;
                                            for (i = 0; i < TaskSummArray.length; i++) {
                                                if (TaskSummArray[i].SBU == null)
                                                    TaskSummArray[i].SBU = 'None';
                                                var datee = moment.utc(TaskSummArray[i].WorkDate).toDate();
                                                TaskSummArray[i].WorkDate = moment(datee).format('MM/DD/YYYY');
                                                var currdate = moment.utc(dates[j]).toDate();
                                                dates[j] = moment(currdate).format('MM/DD/YYYY');
                                                if (TaskSummArray[i].WorkDate == dates[j] && TaskSummArray[i].UpdatedBy == UserList[k]) {
                                                    isTaskDataFound = true;
                                                    hh += TaskSummArray[i].Hours;
                                                    mm += TaskSummArray[i].Minutes;
                                                    if (mm > 59) {
                                                        hh++;
                                                        mm = mm - 60;
                                                    }
                                                    dataToPush = {
                                                        WorkDate: TaskSummArray[i].WorkDate, Hour: hh, Minutes: mm, Resource: TaskSummArray[i].UpdatedBy
                                                    }
                                                }
                                                if (TaskSummArray[i].WorkDate == dates[j]) {
                                                    totalHH += TaskSummArray[i].Hours;
                                                    totalMM += TaskSummArray[i].Minutes;
                                                    if (totalMM > 59) {
                                                        totalHH++;
                                                        totalMM = totalMM - 60;
                                                    }
                                                    pushTotal = {
                                                        WorkDate: TaskSummArray[i].WorkDate, Hour: totalHH, Minutes: totalMM, Resource: 'Total'
                                                    }
                                                }
                                            }
                                            if (isTaskDataFound) {
                                                dateArray.push(dataToPush);
                                                dataToPush = {};
                                            }
                                            else {
                                                dateArray.push({ WorkDate: dates[j], Hour: '0', Minutes: '0', Resource: UserList[k] })
                                            }
                                        }
                                        if (pushTotal.WorkDate == undefined) {
                                            pushTotal = { WorkDate: dates[j], Hour: '0', Minutes: '0', Resource: 'Total' }
                                        }
                                        dateArray.push(pushTotal);
                                        pushTotal = {};
                                    }

                                    TaskSummaryResult.push({ 'UserReport': dateArray });
                                    logger.info('User Report fetched');
                                }
                            }
                            //logger.info('Summary Report Result: \n' + JSON.stringify(TaskSummaryResult));
                            logger.info('Summary report retrieved successfully');
                            deferred.resolve(TaskSummaryResult);

                            //--------- Received Task type report -----------//

                        }).error(function (err) {
                            logger.info('Error occurred when getting Task Type Result: ' + err);
                            deferred.reject(err);
                        });
                    // -- End -- //

                }).error(function (err) {
                    logger.info('Error occurred when getting SCUtilizationReport: ' + err);
                    deferred.reject(err);
                });

        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    DeleteTask: function (taskId) {
        var deferred = q.defer();
        logger.info('Deleting task ' + taskId);
        try {
            models.MyDay.destroy({ where: { TaskId: taskId }, truncate: false })
                .then(function (user) {
                    deferred.resolve(user);
                })
                .catch(function (destroyError) {
                    logger.info('Error occurred: ' + destroyError)
                    deferred.reject(destroyError);
                })
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    EditTask: function (task) {
        var deferred = q.defer();
        logger.info('Editing task ' + task.TaskId);
        try {
            var localTime = moment.utc(task.WorkDate).toDate();
            task.WorkDate = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

            models.MyDay.update({
                WorkDate: task.WorkDate,
                SBU: task.SBUId,
                TaskTypeId: task.TaskTypeId,
                hhDuration: task.hhDuration,
                mmDuration: task.mmDuration,
                Note: task.Note,
                UpdatedBy: task.UpdatedBy
            },
                { where: { TaskId: task.TaskId } })
                .then(function (task) {
                    deferred.resolve(task);
                })
                .catch(function (editerror) {
                    logger.info('Error occurred: ' + editerror)
                    deferred.reject(editerror);
                })
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetYears: function () {
        var deferred = q.defer();
        try {
            logger.info('Getting Years...');
            sequelize.query('select distinct(Year) from TBL_HOLIDAY_CALENDAR',
                { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                    deferred.resolve(response);
                }).error(function (err) {
                    console.log('Error occurred when getting years: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetHolidays: function (locationid, year) {
        var deferred = q.defer();
        logger.info('Getting Holidays info for location: ' + locationid);
        try {
            models.Holiday.findAll({ where: { LocationId: locationid, Year: year } }).then(function (myday) {
                deferred.resolve(myday);
            }).catch(function (err) { logger.info('Getting Holidays info error: ' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    SaveHolidays: function (holiday) {
        logger.info('SaveHolidays..');
        var deferred = q.defer();

        logger.info('Bulk creating..');
        try {
            models.Holiday.destroy({ where: { LocationId: holiday[0].LocationId, Year: holiday[0].Year } }).then(function () {
                models.Holiday.bulkCreate(holiday, { omitNull: true }).then(function (data) {
                    logger.info('Added Holidays successfully');
                    deferred.resolve(data);
                }).catch(function (err) {
                    logger.info('Error bulk creating Holidays: ' + err);
                    deferred.reject(err);
                });
            }).catch(function (err) { logger.info('Error destroying Holidays: ' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

}

module.exports.MyDayModel = MyDayModel;

