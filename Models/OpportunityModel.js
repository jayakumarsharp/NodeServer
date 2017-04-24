var q = require('q');
var moment = require('moment');
var models = require(__base + "Schema");

var OpportunityModel = {
    GetOpportunity: function (oppId) {
        console.log('Start Fetching the Opportunity');
        var deferred = q.defer();
        try {
            if (oppId != null && oppId != undefined) {
                console.log('Inside get opportunity ' + oppId);
                models.Opportunity.findOne({ where: { id: oppId } })
                .then(function (opp) { deferred.resolve(opp); })
                .catch(function (err) { console.log('GetOpportunity ' + err); deferred.reject(err) });
            }
            else {
                console.log('Inside get all new opportunities');
                models.Opportunity.findAll().then(function (opps) {
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
    GetOpportunityBySBU: function (SBUName) {
        console.log('Start Fetching the GetOpportunityBySBU***');
        var deferred = q.defer();
        try {
            console.log('Inside get GetOpportunityBySBU ' + SBUName);
            models.Opportunity.findAll({ where: { SBU: SBUName } })
            .then(function (opp) { deferred.resolve(opp); })
            .catch(function (err) { console.log('GetOpportunityBySBU errorrrrrrrr' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetOpportunitySBUCount: function () {
        console.log('Start Fetching the GetOpportunitySBUCount');
        var deferred = q.defer();
        try {
            var SBUCountData = [];

            models.Opportunity.findAll({ where: { 'SBU': 'INDIA' } }).then(function (result) {
                SBUCountData.push({ 'SBU': 'INDIA', 'COUNT': result.length });
            }).catch(function (err) { console.log(err); }).then(
            models.Opportunity.findAll({ where: { 'SBU': 'NA' } }).then(function (result) {
                SBUCountData.push({ 'SBU': 'NA', 'COUNT': result.length });
            })).then(
            models.Opportunity.findAll({ where: { 'SBU': 'US' } }).then(function (result) {
                SBUCountData.push({ 'SBU': 'US', 'COUNT': result.length });
            })).then(
            models.Opportunity.findAll({ where: { 'SBU': 'ME' } }).then(function (result) {
                SBUCountData.push({ "SBU": "ME", "COUNT": result.length });
                deferred.resolve(SBUCountData);
            }));
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    }
}
module.exports.OpportunityModel = OpportunityModel;