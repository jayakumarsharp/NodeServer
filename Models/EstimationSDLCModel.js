var q = require('q');
var Sequelize = require('sequelize');
var moment = require('moment');
var models = require(__base + "Schema");


var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var EstimationSDLCPercentageModel = {

    GetAllEstimationSDLCPercentage: function () {

        var deferred = q.defer();
        try {
            models.EstimationSDLCPercentage.findAll()
                .then(function (opp) { deferred.resolve(opp); })
                .catch(function (err) { logger.info('GetEstimationSDLCPercentage ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetAllEstimationSDLCPercentageBytype: function (type) {

        var deferred = q.defer();
        try {
            models.EstimationSDLCPercentage.findAll({ where: { ProductName: type } })
                .then(function (opp) { deferred.resolve(opp); })
                .catch(function (err) { logger.info('GetEstimationSDLCPercentage ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },



    AddEstimationSDLCPercentage: function (disc) {
        logger.info('Adding Discount');
        var deferred = q.defer();
        try {
            models.EstimationSDLCPercentage.destroy({ truncate: true }).then(function () {
                models.EstimationSDLCPercentage.bulkCreate(disc).then(function () {
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

    GetAllOpportunityEstimationSDLCPercentage1: function (oppID) {
        var FinalList = [];
        var deferred = q.defer();
        try {
            sequelize.query('SELECT isnull([NoOfDataCenterLocs],1) as NoOfDataCenterLocs,isnull([NoOfAgentCenterLocs],1) as NoOfAgentCenterLocs FROM [TBL_OPPORTUNITY_MASTER] where id= :OppID',
                { replacements: { OppID: oppID }, type: sequelize.QueryTypes.SELECT }).then(
                function (CountResponse) {
                    sequelize.query('select distinct(ProductName) as ProductName from TBL_OPPORTUNITY_EstimationProduct where OppID= :OppID',
                        { replacements: { OppID: oppID }, type: sequelize.QueryTypes.SELECT }).then(
                        function (response) {
                            var productList = [];
                            for (var i = 0; i < response.length; i++) {
                                productList.push(response[i].ProductName);
                            }
                            models.OppEstimationSDLCPercentage.findAll({ where: { OppID: oppID, ProductName: productList } })
                                .then(function (opp) {
                                    for (var i = 0; i < opp.length; i++) {
                                        FinalList.push(
                                        {'NoOfAgentCenterLocs':CountResponse[0].NoOfAgentCenterLocs,
                                        'NoOfDataCenterLocs':CountResponse[0].NoOfDataCenterLocs,
                                        'Id':opp[i].Id,
                                        'ProductName':opp[i].ProductName,
                                        'SDLC_Type':opp[i].SDLC_Type,
                                        'prod_percentage':opp[i].prod_percentage,
                                        'uat_percentage':opp[i].uat_percentage})
                                    }
                                    logger.info('^^^^^^^^^^^^^^^^^'+JSON.stringify(FinalList));
                                    deferred.resolve(FinalList);
                                })
                                .catch(function (err) {
                                    logger.info('GetAllOpportunityEstimationSDLCPercentage ' + err);
                                    logger.info('GetAllOpportunityEstimationSDLCPercentage input is ' + oppID);
                                    deferred.reject(err)
                                });
                        }).error(function (err) {
                            console.log('Error occurred when getting GetOpportunitySBUProduct: ' + err);
                            deferred.reject(err);
                        })
                }).error(function (err) {
                    console.log('Error occurred when getting user and Location count: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            console.log('ex asdasd' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetAllOpportunityEstimationSDLCPercentage: function (oppID) {
        var deferred = q.defer();
        try {
            logger.info('begin GetAllOpportunityEstimationSDLCPercentage oppID: ' + oppID);
            sequelize.query(' SELECT OP.OppID ,OP.[ProductName],OP.[SDLC_Type],[prod_percentage],[uat_percentage],EP.DC_prod,EP.AGT_prod,EP.DC_Upgrade,EP.AGT_Upgrade,EP.IsDCOppValue,EP.IsAgentOppValue, ' +
            ' agentcount as NoOfAgentCenterLocs ,DCcount NoOfDataCenterLocs FROM ' +
            ' [TBL_OppEstimationSDLCPercentage]  OP inner join [TBL_OPPORTUNITY_MASTER] OM on  OP.OppID =OM.id  inner join ' +
            ' [TBL_EstimationSDLCPercentage] EP on EP.ProductName=OP.ProductName and EP.SDLC_Type=OP.SDLC_Type  ' +
            ' inner join TBL_OPPORTUNITY_EstimationProduct OE on OE.ProductName= OP.ProductName and OE.OppID=OM.id where OM.id= :OppID',
                { replacements: { OppID: oppID }, type: sequelize.QueryTypes.SELECT }).then(
                function (response) {
                    logger.info('*************');
                    //logger.info(JSON.stringify(response));
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('error occurred when getting user and Location count: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            logger.info('error in GetAllOpportunityEstimationSDLCPercentage ' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetOpportunitySBUProduct: function (OppID) {
        var deferred = q.defer();
        try {
            logger.info('GetOpportunitySBUProduct for user ' + OppID);
            sequelize.query('select distinct(ProductName) as ProductName from TBL_OppEstimationSDLCPercentage where OppID= :OppID',
                 { replacements: { useOppIDrid: OppID }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                    deferred.resolve(response);
                }).error(function (err) {
                    console.log('Error occurred when getting GetOpportunitySBUProduct: ' + err);
                    deferred.reject(err);
                });
        }
        catch (Ex) {
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },



    AddOppEstimationSDLCPercentage: function (disc) {
        logger.info('Adding OppEstimationSDLCPercentage for oppid:'+disc[0].OppID);
        var deferred = q.defer();
        try {
            models.sequelize.transaction().then(function (t) {
                logger.info('step 1 Adding OppEstimationSDLCPercentage for oppid:' + JSON.stringify(disc));
                models.OppEstimationSDLCPercentage.destroy({ where: { OppID: disc[0].OppID }, truncate: false }, { transaction: t }, { omitNull: true }).then(function () {
                    logger.info('step 2 Adding'); 
                    models.OppEstimationSDLCPercentage.bulkCreate(disc, { transaction: t }, { omitNull: true }).then(function () {
                        logger.info('step 3 Adding');
                        t.commit();
                        deferred.resolve('Success');
                    }).catch(function (err) {
                        logger.error('Error occurred when adding OppEstimationSDLCPercentage' + err);
                        t.rollback();
                        deferred.reject(err);
                    });

                }).catch(function (err) {
                    logger.error('Error occurred when adding OppEstimationSDLCPercentage' + err);
                    t.rollback();
                    deferred.reject(err);
                });
            });
        }
        catch (Ex) {
            t.rollback();
            console.log('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    }


}

module.exports.EstimationSDLCPercentageModel = EstimationSDLCPercentageModel;