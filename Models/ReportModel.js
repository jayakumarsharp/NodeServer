var q = require('q');
var path = require('path');
var Sequelize = require('sequelize');
var moment = require('moment');
var models = require(__base + "Schema");
var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var MSdbconfig = require(__base + "Config/MSSQLConfig")
var sql = require('mssql');

var ReportModel = {

    //Get PricesheetbyOppId
    GetOpportunityReport: function (Reportdata) {
        var deferred = q.defer();
        try {

            logger.info(Reportdata);
            var sbus = '';
            var sales = '';
            var presales = '';

            for (var i = 0; i < Reportdata.SBUId.length; i++) {
                sbus = sbus + Reportdata.SBUId[i];
                if (i != Reportdata.SBUId.length - 1) {
                    sbus = sbus + ',';
                }
            }

            for (var i = 0; i < Reportdata.SalesStatusId.length; i++) {
                sales = sales + Reportdata.SalesStatusId[i];
                if (i != Reportdata.SalesStatusId.length - 1) {
                    sales = sales + ',';
                }
            }

            for (var i = 0; i < Reportdata.PreSalesStatusId.length; i++) {
                presales = presales + Reportdata.PreSalesStatusId[i];
                if (i != Reportdata.PreSalesStatusId.length - 1) {
                    presales = presales + ',';
                }
            }

            var connection = new sql.Connection(MSdbconfig);
            connection.connect(function (err) {
                if (err) {
                    logger.info('Error in sql connection');
                    logger.info('ex' + err);
                    deferred.reject(err)
                }
                var request = new sql.Request(connection);

                request.input('BU', sql.VarChar(100), sbus);
                request.input('SalesStatus', sql.VarChar(100), sales);
                request.input('PreSalesStatus', sql.VarChar(100), presales);
                request.input('VAD1From', sql.VarChar(100), Reportdata.TCV1From);
                request.input('VAD1To', sql.VarChar(100), Reportdata.TCV1To);
                request.input('VADFrom', sql.VarChar(100), Reportdata.TCVFrom);
                request.input('VADTo', sql.VarChar(100), Reportdata.TCVTo);
                request.input('StartDate', sql.VarChar(100), Reportdata.fromDate);
                request.input('Enddate', sql.VarChar(100), Reportdata.toDate);

                // request.output('o_errorcode', sql.Int);
                // request.output('o_errordesc', sql.VarChar(100));
                request.execute('OpportunityReport', function (err, recordsets, returnValue) {
                    if (err) {
                        logger.info('SP Execution Error on OpportunityReport');
                        closeConnection(connection, 'OpportunityReport');
                        logger.info('ex' + err);
                        deferred.reject(err)
                    }
                    closeConnection(connection, 'OpportunityReport');
                    deferred.resolve(recordsets);
                });
            });
            connection.on('error', function (err) {
                if (err) {
                    logger.info('Error Event received in sql connection');
                    logger.info('ex' + err);
                    deferred.reject(err)
                }
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    UpdateAction: function (Reportdata) {
        var deferred = q.defer();
        try {
            sequelize.query('update TBL_OPPORTUNITY_MASTER set Action=:action where OppId = :id ', { replacements: { action: Reportdata.Action, id: Reportdata.OppId }, type: sequelize.QueryTypes.SELECT })
                .then(function () {
                    deferred.resolve("Record updated");
                }).catch(function (err) {
                    logger.info('fail' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },


}

module.exports.ReportModel = ReportModel;




function closeConnection(connection, reqName) {

    try {
        if (connection.connected) {
            connection.close();
            logger.debug('Connection Closed : ' + reqName);
        }

    } catch (cerror) {
        logger.error('Close Connection Error : ' + reqName, { error: cerror });
    }
}