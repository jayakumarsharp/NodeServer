var express = require('express');
var models = require(__base + "Schema");
var Sequelize = require('sequelize');
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var q = require('q');


var PageSectionModel = {
    GetPageList: function (Id) {
        var deferred = q.defer();
        try {
            sequelize.query('select * from tbl_EstimationPages', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                deferred.resolve(response);
            }).catch(function (err) {
                console.log('Error' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    AddPageSection: function (opp) {
        var deferred = q.defer();
        try {
            models.EstimationPageSection.create({
                PageID: opp.PageID,
                SectionName: opp.SectionName,
                DisplayName: opp.DisplayName,
                OrderSequence: opp.OrderSequence
            }).then(function (response) {
                console.log('Add Page section success');
                deferred.resolve(response);
            }).catch(function (err) {
                console.log('Add Page section ' + err);
                deferred.reject(err);
            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.resolve(Ex);
        }
        return deferred.promise;
    },

    UpdatePageSection: function (opp) {
        var deferred = q.defer();
        try {
            models.EstimationPageSection.update({
                DisplayName: opp.DisplayName,
                OrderSequence: opp.OrderSequence
            }, { where: { Id: opp.Id } })
                .then(function (oppDetailsuccess) {
                    deferred.resolve(oppDetailsuccess);
                }).catch(function (err) { logger.info('SaveOpportunityDetail ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetAllPageSections: function () {
        var deferred = q.defer();
        try {
            sequelize.query('select a.Id,a.PageID,b.PageName,a.SectionName,a.DisplayName,a.OrderSequence from tbl_EstimationPageSection a JOIN tbl_EstimationPages b on a.PageID=b.Id', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },


}
module.exports.PageSectionModel = PageSectionModel;
