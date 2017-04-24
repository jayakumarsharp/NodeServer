var q = require('q');
var Sequelize = require('sequelize');
var models = require(__base + "Schema");
var logger = require(__base + 'Models/logger');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var moment = require('moment');

var CountryModel = {
    ModifyOpportunity: function (Opp) {
        var deferred = q.defer();
        try {
            models.sequelize.transaction().then(function (t) {
                if (t != null && t != undefined) {
                    models.Opportunity.update({
                        CountryId: Opp.CountryId, //OppCategoryId: Opp.selectedType.OppCategoryId,
                        PartnerName: Opp.PartnerName, UseManDayshours: Opp.UseManDayshours, NoOfDataCenterLocs: Opp.NoOfDataCenterLocs, NoOfAgentCenterLocs: Opp.NoOfAgentCenterLocs,
                        SLAClosureDate: Opp.SLAClosureDate, Comment: Opp.Comment
                    }, { where: { id: Opp.id } }, { transaction: t }).then(function (user) {
                        t.commit(); deferred.resolve(user);
                    }).catch(function (updateUserError) {
                        logger.info(updateUserError);
                        t.rollback();
                        deferred.reject(updateUserError);
                    });
                }
            })
                .catch(function (err) { logger.info('FetchUser' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    UpdateOpportunityConfiguration: function (Opp) {
        var deferred = q.defer();
        try {
            models.sequelize.transaction().then(function (t) {
                if (t != null && t != undefined) {
                    models.Opportunity.update({
                        Visa: Opp.Visa, AirFare: Opp.AirFare, Accommodation: Opp.Accommodation, PerDiemLaundry: Opp.PerDiemLaundry, LocalConveyance: Opp.LocalConveyance, Miscellaneous: Opp.Miscellaneous,
                        SalaryHike: Opp.SalaryHike, SalarySpike: Opp.SalarySpike, Margin: Opp.Margin, Penalty: Opp.Penalty, WorkingHoursperDay: Opp.WorkingHoursperDay, BUOnsiteManDaysRate: Opp.BUOnsiteManDaysRate, BURemoteManDaysRate: Opp.BURemoteManDaysRate, CDOOnsiteManDaysRate: Opp.CDOOnsiteManDaysRate, CDORemoteManDaysRate: Opp.CDORemoteManDaysRate, CDOOffsiteManDaysRate: Opp.CDOOffsiteManDaysRate, ProjectManagement: Opp.ProjectManagement,
                        BUPMManDaysRate: Opp.BUPMManDaysRate, CDOPMManDaysRate: Opp.CDOPMManDaysRate, ServCareMAC50Rate: Opp.ServCareMAC50Rate, ServCareCM50hrsRate: Opp.ServCareCM50hrsRate, ServCareGreen50hrsRate: Opp.ServCareGreen50hrsRate,
                        ServCareLocalResourceIML2: Opp.ServCareLocalResourceIML2, ServCareOnsiteResourcePML2: Opp.ServCareOnsiteResourcePML2
                        , ServCareSalaryHike: Opp.ServCareSalaryHike

                    }, { where: { OppId: Opp.OppId } }, { transaction: t }).then(function (user) {
                        t.commit(); deferred.resolve(user);
                    }).catch(function (updateUserError) {
                        logger.info(updateUserError);
                        t.rollback(); deferred.reject(updateUserError);
                    });
                }
            })
                .catch(function (err) { logger.info('FetchUser' + err); deferred.reject(err); });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    GetOppConfiguration: function (oppId) {
        logger.info('Start Fetching SP');
        var deferred = q.defer();
        models.OppConfiguration.findAll({ where: { OppId: oppId } })
            .then(function (opp) { deferred.resolve(opp); })
            .catch(function (err) { logger.info('GetOppConfig ' + err); deferred.reject(err) });

        return deferred.promise;
    },

    GetOpportunityByID: function (oppId) {

        logger.info('Start Fetching SP GetOpportunityByID');
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            sequelize.query('SELECT OM.[id],OM.[SBUId],SM.SBU,OM.[CountryId],Cm.Currency,[AccountName],[OpportunityName],[ParentOppId],[OppId],[AccManagerName],OppCategoryId,[PartnerName],[UseManDayshours],[UseOEMPricingStrategy],OE.OEMName,[NoOfDataCenterLocs],[NoOfAgentCenterLocs],[IsDataCenterandAgentsColocated],[RSCId],[CSCStatusId],[SalesStatusId],[OpportunityTypeId],[ExpectedClosureDate],[SLAClosureDate],[Comment],[OppStatus],[ActualCloseDate],[OpenDate],[CloseUser],[OpenUser],[AccountSalesManager],[ServionLegalEntity],[Vertical],[Source],[CustomerType],[Cycle],[IsManual],[IsActive] FROM [TBL_OPPORTUNITY_MASTER] OM join TBL_SBU_MASTER SM on OM.SBUId=SM.id  left join TBL_OEMList OE on OM.UseOEMPricingStrategy =OE.Id  left join TBL_CountryCurrencyMapping CCM on OM.CountryId =CCM.CountryID left join TBL_CURRENCY_MASTER Cm on CCM.CurrencyID =Cm.Id where OM.Id=:id ', { replacements: { id: oppId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    GetOpportunityConfigurationByID: function (oppId) {
        logger.info('Start Fetching SP GetOpportunityConfigurationByID');
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            sequelize.query('SELECT [Visa],[AirFare],[Accommodation],[PerDiemLaundry],[LocalConveyance],[Miscellaneous],[SalaryHike],[SalarySpike],[Margin],[Penalty],[WorkingHoursperDay],[BUOnsiteManDaysRate],[BURemoteManDaysRate],[CDOOnsiteManDaysRate],[CDORemoteManDaysRate],[CDOOffsiteManDaysRate],[ProjectManagement],[BUPMManDaysRate],[CDOPMManDaysRate],[ServCareMAC50Rate],[ServCareCM50hrsRate],[ServCareGreen50hrsRate],[ServCareLocalResourceIML2],[ServCareOnsiteResourcePML2],[ServCareSalaryHike],[OppId]  FROM [dbo].[TBL_OPPORTUNITYCONFIGURATION_MAPPING]  where OppId=:OppId', { replacements: { OppId: oppId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });

        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    getOpportunityServionLegalEntity: function (oppId) {
        logger.info('Start Fetching SP getOpportunityServionLegalEntity');
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {

            sequelize.query('SELECT [OppID],[ServionLegalEntityID] FROM [dbo].[TBL_OPPORTUNITY_ServionLegalEntity]  where OppId=:OppId', { replacements: { OppId: oppId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });

        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex)
        }
        return deferred.promise;
    },

    GetAllCSCPersons: function () {
        logger.info('Start Fetching SP');
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            sequelize.query('USP_GetAllCSCPersons', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
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

    GetAllRSCPersons: function () {
        logger.info('Start Fetching SP');
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            sequelize.query('USP_GetAllRSCPersons', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });

        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetOtherUsers: function (SbuId) {
        logger.info('Start Fetching SP');
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {

            models.sequelize.query('select distinct(UM.Userid),UserName from TBL_USER_MASTER UM join TBL_USER_TYPES UT on Ut.id=UM.TypeId join TBL_USERSBU_MAPPING USM on UM.Userid = USM.UserID where (ut.TypeName not like \'RSC%\') and ut.TypeName not in (\'CSC User\', \'CSC Lead\', \'CSC Major User\') and UM.Status = \'Active\' union select distinct(UM.Userid),UserName from TBL_USER_MASTER UM join TBL_USER_TYPES UT on Ut.id=UM.TypeId join TBL_USERSBU_MAPPING USM on UM.Userid = USM.UserID where ut.TypeName like \'RSC%\' and USM.SBUID != :sbuid and UM.Status = \'Active\'',
                { replacements: { sbuid: SbuId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                    logger.info('success');
                    deferred.resolve(response);
                }).error(function (err) {
                    logger.info('fail' + err);
                    deferred.reject(err)
                });

            // models.sequelize.query('USP_GetOtherUsers', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
            //     logger.info('success');
            //     deferred.resolve(response);
            // }).error(function (err) {
            //     logger.info('fail' + err);
            //     deferred.reject(err)
            // });

        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetOppCategory: function () {
        var deferred = q.defer();
        try {

            logger.info('Inside get all GetOppCategory');
            models.OpportunityCategory.findAll().then(function (opps) {
                deferred.resolve(opps);
            }).catch(function (err) { deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;

    },

    GetOpportunityDataCenterLocated: function () {
        var deferred = q.defer();
        try {
            logger.info('Start Fetching the OpportunityDataCenterColocated');

            logger.info('Inside get all OpportunityDataCenterColocated');
            models.OpportunityDataCenterColocated.findAll().then(function (opps) {
                deferred.resolve(opps);
            }).catch(function (err) { deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetCSCOpptype: function () {
        var deferred = q.defer();
        try {

            logger.info('Inside get all CSCOppType');
            models.CSCOppType.findAll().then(function (opps) {
                //logger.info(opps);
                deferred.resolve(opps);
            }).catch(function (err) { deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetConfigurationDetails: function () {
        var deferred = q.defer();
        try {

            logger.info('Inside get all ConfigurationDetails');
            models.Configuration.findAll().then(function (opps) {
                deferred.resolve(opps);
            }).catch(function (err) { deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetOppConfigurationDetails: function () {
        var deferred = q.defer();
        try {

            logger.info('Inside get all ConfigurationDetails');
            models.Configuration.findAll().then(function (opps) {
                //logger.info(opps);
                deferred.resolve(opps);
            }).catch(function (err) { deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetCSCStatus: function () {
        var deferred = q.defer();
        try {

            logger.info('Inside get all CscStatus');
            models.CSCStatus.findAll().then(function (opps) {
                //logger.info(opps);
                deferred.resolve(opps);
            }).catch(function (err) { deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    getAllSalestatus: function () {

        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            models.sequelize.query('select * from [TBL_SalesStatus] ', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);

            deferred.reject(Ex);

        }
        return deferred.promise;
    },



    getAllPreSalestatus: function () {

        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            models.sequelize.query('select [Id],[StatusName] FROM [dbo].[TBL_CSCStatus] ', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);

            deferred.reject(Ex);

        }
        return deferred.promise;
    },
    GetOpportunityType: function () {
        var deferred = q.defer();
        try {

            models.OpportunityType.findAll().then(function (opps) {
                //logger.info(opps);
                deferred.resolve(opps);
            }).catch(function (err) { deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetCountry: function (countryId) {
        var deferred = q.defer();
        try {
            if (countryId != null && countryId != undefined) {
                logger.info('Inside get country ' + countryId);
                models.Country.findOne({ where: { Id: countryId } })
                    .then(function (opp) { deferred.resolve(opp); })
                    .catch(function (err) { logger.info('GetCountry ' + err); deferred.reject(err) });
            }
            else {
                logger.info('Inside get all country');
                models.Country.findAll().then(function (opps) {
                    //logger.info(opps);
                    deferred.resolve(opps);
                }).catch(function (err) { deferred.reject(err) });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetCountryBySBU: function (SBUName) {
        logger.info('Start Fetching the GetCountryBySBU***');
        var deferred = q.defer();
        try {
            logger.info('Inside get GetOpportunityBySBU ' + SBUName);
            models.Country.findAll({ where: { SBUId: SBUName } })
                .then(function (opp) { deferred.resolve(opp); })
                .catch(function (err) { logger.info('GetCountryBySBU errorrrrrrrr' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    Getsp: function () {
        logger.info('Start Fetching SP');
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            var num = 3;
            models.sequelize.query('SELECT * FROM TBL_OPPORTUNITY_MASTER WHERE id= :id ', { replacements: { id: num }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });

        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetOpportunityConfigBySBU: function (SBUID, CountryId) {
        var deferred = q.defer();
        try {
            logger.info('GetOpportunityConfigBySBU for CountryId: ' + CountryId);
            models.sequelize.query('select Currency from TBL_CURRENCY_MASTER C inner join TBL_CountryCurrencyMapping CCM on CCM.CurrencyID =C.Id where CCM.CountryID = :id ', { replacements: { id: CountryId }, type: sequelize.QueryTypes.SELECT })
                .then(function (responseCurrency) {
                    var CURID = responseCurrency[0].Currency;
                    logger.info('responseCurrency for CountryId: ' + CURID);

                    models.sequelize.query('SELECT ' +
                        ' cast(MAX(CASE WHEN mode_type = \'Visa\' THEN ' + CURID + ' ELSE NULL END) as integer) as Visa, ' +
                        ' cast(MAX(CASE WHEN mode_type = \'Air Fare\' THEN ' + CURID + ' ELSE NULL END)  as integer) AirFare,	' +
                        ' cast(MAX(CASE WHEN mode_type = \'Accommodation\' THEN ' + CURID + ' ELSE NULL END) as integer)  Accommodation, ' +
                        ' cast(MAX(CASE WHEN mode_type =  \'Per-Diem & Laundry\' THEN ' + CURID + ' ELSE NULL END) as integer)  PerDiemLaundry,	' +
                        ' cast(MAX(CASE WHEN mode_type = \'Local Conveyance\' THEN ' + CURID + ' ELSE NULL END) as integer)  LocalConveyance,	' +
                        ' cast(MAX(CASE WHEN mode_type = \'Miscellaneous\' THEN ' + CURID + ' ELSE NULL END) as integer)  Miscellaneous,	' +
                        ' cast(MAX(CASE WHEN mode_type = \'Penalty %\' THEN ' + CURID + ' ELSE NULL END) as integer)  Penalty, ' +
                        ' cast(MAX(CASE WHEN mode_type = \'Margin%\' THEN ' + CURID + ' ELSE NULL END) as integer)  Margin,	' +
                        ' cast(MAX(CASE WHEN mode_type = \'Salary Spike %\' THEN ' + CURID + ' ELSE NULL END) as integer)  SalarySpike, ' +
                        ' cast(MAX(CASE WHEN mode_type = \'Salary Hike %\' THEN ' + CURID + ' ELSE NULL END) as integer)  SalaryHike,	' +
                        ' cast(MAX(CASE WHEN mode_type = \'BU Onsite - FTE Hours Rate\' THEN ' + CURID + ' ELSE NULL END) as integer)  BUOnsiteManDaysRate, ' +
                        ' cast(MAX(CASE WHEN mode_type = \'BU Remote - FTE Hours Rate\' THEN ' + CURID + ' ELSE NULL END) as integer)  BURemoteManDaysRate,	' +
                        ' cast(MAX(CASE WHEN mode_type = \'CDO Onsite - FTE Hours Rate\' THEN ' + CURID + ' ELSE NULL END) as integer)  CDOOnsiteManDaysRate, ' +
                        ' cast(MAX(CASE WHEN mode_type = \'CDO Remote - FTE Hours Rate\' THEN   ' + CURID + ' ELSE NULL END) as integer)  CDORemoteManDaysRate,' +
                        ' cast(MAX(CASE WHEN mode_type =  \'CDO Offsite - FTE Hours Rate\' THEN ' + CURID + ' ELSE NULL END) as integer)  CDOOffsiteManDaysRate, ' +
                        ' cast(MAX(CASE WHEN mode_type = \'BU PM - FTE Hours Rate\' THEN ' + CURID + ' ELSE NULL END) as integer)  BUPMManDaysRate, ' +
                        ' cast(MAX(CASE WHEN mode_type = \'CDO PM - FTE Hours Rate\'  THEN ' + CURID + ' ELSE NULL END) as integer)   CDOPMManDaysRate,	' +
                        ' cast(MAX(CASE WHEN mode_type = \'Project Management %\' THEN ' + CURID + ' ELSE NULL END) as integer)  ProjectManagement, ' +
                        ' cast(MAX(CASE WHEN mode_type = \'ServCare MAC-50 Rate\' THEN ' + CURID + ' ELSE NULL END) as integer)  ServCareMAC50Rate, ' +
                        ' cast(MAX(CASE WHEN mode_type =  \'ServCare Green-50 hrs Rate\' THEN ' + CURID + ' ELSE NULL END) as integer) ServCareGreen50hrsRate, ' +
                        ' cast(MAX(CASE WHEN mode_type = \'ServCare CM-50 hrs Rate\' THEN ' + CURID + ' ELSE NULL END) as integer)  ServCareCM50hrsRate, ' +
                        ' cast(MAX(CASE WHEN mode_type = \'ServCare Local Resource (IM-L2)\' THEN  ' + CURID + ' ELSE NULL END) as integer)  ServCareLocalResourceIML2,	' +
                        ' cast(MAX(CASE WHEN mode_type = \'ServCare Onsite Resource (PM-L2)\' THEN ' + CURID + ' ELSE NULL END) as integer)  ServCareOnsiteResourcePML2, ' +
                        ' cast(MAX(CASE WHEN mode_type = \'ServCare Salary Hike %\' THEN ' + CURID + ' ELSE NULL END) as integer)  ServCareSalaryHike,		8 as WorkingHoursperDay	FROM TBL_OPPORTUNITY_RATE ',
                        { replacements: { Curr: SBUID, CountryId: CountryId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                            logger.info('success');
                            deferred.resolve(response);
                        }).error(function (err) {
                            logger.info('fail' + err);
                            deferred.reject(err)
                        });
                }).error(function (err) {
                    logger.info('fail' + err);
                    deferred.reject(err)
                });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetOpportunityConfigBySBU1: function (SBUID, CountryId) {
        var deferred = q.defer();
        try {
            models.sequelize.query('SELECT * FROM TBL_OPPORTUNITYCONFIGURATION_MASTER WHERE SBU= :id AND Region= :CountryId ', { replacements: { id: SBUID, CountryId: CountryId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    AddOppConfigMaster: function (config) {
        logger.info('Adding opportunity configuration.. ');
        var deferred = q.defer();
        try {
            if (config != null && config != undefined) {
                delete config[0]['id'];
                models.OppConfigurationMaster.findAndCountAll({ where: { SBU: config[0].SBU, Region: config[0].Region } })
                    .then(function (oppconfig) {
                        logger.info(JSON.stringify(oppconfig));
                        logger.info('Oppconfig length: ' + oppconfig.count);
                        if (oppconfig.count > 0) {
                            models.OppConfigurationMaster.destroy({ where: { SBU: config[0].SBU, Region: config[0].Region } }).then(function () {
                                logger.info('Removed existing entry successfully');
                                models.OppConfigurationMaster.bulkCreate(config, { omitNull: true }).then(function (conf) {
                                    logger.info('Added configuration successfully');
                                    deferred.resolve(conf);
                                }).catch(function (err) {
                                    logger.info('Error bulk creating configuration: ' + err);
                                    deferred.reject(err);
                                });
                            }).catch(function (err) { logger.info('OppConfig remove: ' + err); deferred.reject(err) });
                        }
                        else {
                            models.OppConfigurationMaster.bulkCreate(config, { omitNull: true }).then(function (conf) {
                                logger.info('Added configuration successfully');
                                deferred.resolve(conf);
                            }).catch(function (err) {
                                logger.info('Error bulk creating configuration: ' + err);
                                deferred.reject(err);
                            });
                        }
                    })
                    .catch(function (err) { logger.info('AddOppConfigMaster ' + err); deferred.reject(err) });
            }
            else {
                deferred.reject({ 'Error': 'Configuration is null or invalid' });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetOpportunityUser: function (oppID) {
        logger.info('Start Fetching SP');
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            models.sequelize.query('SELECT distinct OpportunityID,UserID,OpportunityTypeId FROM TBL_OPPORTUNITYUSER WHERE OpportunityID= :id ', { replacements: { id: oppID }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetParentOpportunityID: function (SBUID) {
        logger.info('GetParentOpportunityID *************************************************************');
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            models.sequelize.query('SELECT distinct(OppId) FROM TBL_OPPORTUNITY_MASTER WHERE SBUId= :id and IsManual = 0', { replacements: { id: SBUID }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });

        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetChildOpportunityID: function (oppID) {
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            models.sequelize.query('select OppId from [TBL_OPPORTUNITY_MASTER] where ParentOppId = (select OppId from [TBL_OPPORTUNITY_MASTER] where id=:id)  ', { replacements: { id: oppID }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetOpportunityHistory: function (oppID) {
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            models.sequelize.query('SELECT H.*,S.StatusName FROM TBL_OPPORTUNITY_History H left join [TBL_CSCStatus] S on H.CSCStatusId=S.Id  WHERE H.opportunitymasterid= :id order by id desc', { replacements: { id: oppID }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    SaveOpportunityDetail: function (oppDetail) {
        var oppInfo = oppDetail.OpportunityInfo;
        var oppConfig = oppDetail.OpportunityConfig;
        var userList = oppDetail.userList;

        var expDate = new Date(oppInfo.ExpectedClosureDate);
        var cloDate = new Date(oppInfo.SLAClosureDate);
        logger.info('Start saving SaveOpportunityDetail');
        logger.info('ExpectedClosureDate: ' + moment(expDate).format('L'));
        logger.info('SLAClosureDate: ' + moment(cloDate).format('L'));
        logger.info('Control to save :' + oppDetail.CtrlToSave);
        var deferred = q.defer();
        try {
            models.sequelize.transaction().then(function (t) {
                if (t != null && t != undefined) {
                    models.OppEstimationSDLCPercentage.destroy({ where: { OppID: oppInfo.id } }, { transaction: t })
                        .then(function () {
                            logger.info('Saving Opportunity Estimation SDLC Percentage');
                            var sdlcQuery = 'insert into [TBL_OppEstimationSDLCPercentage] ([OppID] ,[ProductName] ,[SDLC_Type] ,[prod_percentage] ,[uat_percentage],dccount,agentcount) select :id as oppid,ProductName,SDLC_Type, (convert(decimal,DC_prod) * convert(decimal,(select  case  when (NoOfDataCenterLocs is null or isdcoppvalue=0) then 1 when NoOfDataCenterLocs > 1 then NoOfDataCenterLocs -1 else NoOfDataCenterLocs end   from TBL_OPPORTUNITY_MASTER where id=:id))) + case when isAgentoppvalue = 1  then (convert(decimal,(select isnull(NoOfAgentCenterLocs,1) from TBL_OPPORTUNITY_MASTER where id=:id)) * convert(decimal,AGT_prod)) else 0 end  as prodPercentage, (convert(decimal,DC_Upgrade) * convert(decimal,(select  case  when (NoOfDataCenterLocs is null or isdcoppvalue=0)  then 1 when NoOfDataCenterLocs > 1 then NoOfDataCenterLocs -1 else NoOfDataCenterLocs end   from TBL_OPPORTUNITY_MASTER where id=:id))) + case when isAgentoppvalue = 1  then (convert(decimal,(select isnull(NoOfAgentCenterLocs,1) from TBL_OPPORTUNITY_MASTER where id=:id)) * convert(decimal,AGT_Upgrade)) else 0 end  as upgradePercentage,case when isDCoppvalue = 1  then (select case when isnull(NoOfDataCenterLocs,1) >1 then NoOfDataCenterLocs -1 else NoOfDataCenterLocs end  from TBL_OPPORTUNITY_MASTER where id=:id) else 0 end as dcCount, case when isAgentoppvalue = 1  then (select isnull(NoOfAgentCenterLocs,1) from TBL_OPPORTUNITY_MASTER where id=:id) else 0 end as agentCount from [TBL_EstimationSDLCPercentage]';

                            var OldQuery = 'insert into [TBL_OppEstimationSDLCPercentage] ' +
                                ' ([OppID] ,[ProductName] ,[SDLC_Type] ,[prod_percentage] ,[uat_percentage]) ' +
                                'select :id as oppid,ProductName,SDLC_Type, ' +
                                '(convert(decimal(5,2),  convert(decimal,DC_prod)/100) * convert(decimal,(select  case  when NoOfDataCenterLocs is null then 0 when NoOfDataCenterLocs > 2 then NoOfDataCenterLocs -1 else NoOfDataCenterLocs end   from TBL_OPPORTUNITY_MASTER where id=:id)))  ' +
                                ' + case when Agent_Req = 1  then  (convert(decimal,(select isnull(NoOfAgentCenterLocs,1) from TBL_OPPORTUNITY_MASTER where id=52)) * convert(decimal(5,2),convert(decimal,AGT_prod)/100)) else 0 end  as prodPercentage, ' +
                                '(convert(decimal(5,2),  convert(decimal,DC_Upgrade)/100) * convert(decimal,(select  case  when NoOfDataCenterLocs is null then 0 when NoOfDataCenterLocs > 2 then NoOfDataCenterLocs -1 else NoOfDataCenterLocs end   from TBL_OPPORTUNITY_MASTER where id=:id))) ' +
                                ' +  case when Agent_Req = 1  then  (convert(decimal,(select isnull(NoOfAgentCenterLocs,1) from TBL_OPPORTUNITY_MASTER where id=52)) * convert(decimal(5,2),convert(decimal,AGT_Upgrade)/100)) else 0 end   as upgradePercentage ' +
                                'from [TBL_EstimationSDLCPercentage] ';

                            models.sequelize.query(sdlcQuery, { replacements: { id: oppInfo.id }, type: sequelize.QueryTypes.SELECT })
                                .then(function (response) {
                                    models.OPPORTUNITY.update({
                                        SBUId: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.SBUId : oppDetail.OrginalOpp.SBUId,
                                        CountryId: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.CountryId : oppDetail.OrginalOpp.CountryId,
                                        AccountName: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.AccountName : oppDetail.OrginalOpp.AccountName,
                                        OpportunityName: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.OpportunityName : oppDetail.OrginalOpp.OpportunityName,
                                        ParentOppId: oppInfo.ParentOppId, //Removed
                                        OppId: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.OppId : oppDetail.OrginalOpp.OppId,
                                        AccManagerName: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.AccManagerName : oppDetail.OrginalOpp.AccManagerName,
                                        OppStatus: oppInfo.OppStatus, //Removed
                                        OppCategoryId: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.OppCategoryId : oppDetail.OrginalOpp.OppCategoryId,
                                        PartnerName: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.PartnerName : oppDetail.OrginalOpp.PartnerName,
                                        UseManDayshours: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.UseManDayshours : oppDetail.OrginalOpp.UseManDayshours,
                                        UseOEMPricingStrategy: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.UseOEMPricingStrategy : oppDetail.OrginalOpp.UseOEMPricingStrategy,
                                        NoOfDataCenterLocs: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.NoOfDataCenterLocs : oppDetail.OrginalOpp.NoOfDataCenterLocs,
                                        NoOfAgentCenterLocs: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.NoOfAgentCenterLocs : oppDetail.OrginalOpp.NoOfAgentCenterLocs,
                                        IsDataCenterandAgentsColocated: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.IsDataCenterandAgentsColocated : oppDetail.OrginalOpp.IsDataCenterandAgentsColocated,
                                        RSCId: oppInfo.RSCId,
                                        CSCId: oppInfo.CSCId,
                                        CSCStatusId: oppDetail.CtrlToSave == 'CSC' ? oppInfo.CSCStatusId : oppDetail.OrginalOpp.CSCStatusId,
                                        SalesStatusId: oppDetail.CtrlToSave == 'CSC' ? oppInfo.SalesStatusId : oppDetail.OrginalOpp.SalesStatusId,
                                        OpportunityTypeId: oppDetail.CtrlToSave == 'CSC' ? oppInfo.OpportunityTypeId : oppDetail.OrginalOpp.OpportunityTypeId,
                                        ExpectedClosureDate: oppDetail.CtrlToSave == 'CSC' ? moment(expDate).add(1, 'days').format('L') : moment(oppDetail.OrginalOpp.ExpectedClosureDate).format('L'),
                                        SLAClosureDate: oppDetail.CtrlToSave == 'CSC' ? moment(oppInfo.cloDate).add(1, 'days').format('L') : moment(oppDetail.OrginalOpp.SLAClosureDate).format('L'),
                                        Comment: oppDetail.CtrlToSave == 'CSC' ? oppInfo.Comment : oppDetail.OrginalOpp.Comment,
                                        OpenDate: oppDetail.CtrlToSave == 'CSC' ? oppInfo.OpenDate : oppDetail.OrginalOpp.OpenDate,
                                        ActualCloseDate: oppDetail.CtrlToSave == 'CSC' ? oppInfo.ActualCloseDate : oppDetail.OrginalOpp.ActualCloseDate,
                                        OpenUser: oppDetail.CtrlToSave == 'CSC' ? oppInfo.OpenUser : oppDetail.OrginalOpp.OpenUser,
                                        CloseUser: oppDetail.CtrlToSave == 'CSC' ? oppInfo.CloseUser : oppDetail.OrginalOpp.CloseUser,
                                        AccountSalesManager: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.AccountSalesManager : oppDetail.OrginalOpp.AccountSalesManager,
                                        ServionLegalEntity: oppInfo.ServionLegalEntity,// Changed to multi select. So not required to update here
                                        Vertical: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.Vertical : oppDetail.OrginalOpp.Vertical,
                                        Source: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.Source : oppDetail.OrginalOpp.Source,
                                        CustomerType: oppDetail.CtrlToSave == 'Configuration' ? oppInfo.CustomerType : oppDetail.OrginalOpp.CustomerType,
                                        Cycle: oppDetail.CtrlToSave == 'CSC' ? oppInfo.Cycle : oppDetail.OrginalOpp.Cycle,
                                        IsManual: oppInfo.IsManual
                                    }, { where: { id: oppInfo.id } }, { transaction: t })
                                        .then(function (oppValue) {

                                            models.OppConfiguration.update({
                                                Visa: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.Visa : oppDetail.OrginalOpp.Visa,
                                                AirFare: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.AirFare : oppDetail.OrginalOpp.AirFare,
                                                Accommodation: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.Accommodation : oppDetail.OrginalOpp.Accommodation,
                                                PerDiemLaundry: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.PerDiemLaundry : oppDetail.OrginalOpp.PerDiemLaundry,
                                                LocalConveyance: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.LocalConveyance : oppDetail.OrginalOpp.LocalConveyance,
                                                Miscellaneous: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.Miscellaneous : oppDetail.OrginalOpp.Miscellaneous,
                                                SalaryHike: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.SalaryHike : oppDetail.OrginalOpp.SalaryHike,
                                                SalarySpike: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.SalarySpike : oppDetail.OrginalOpp.SalarySpike,
                                                Margin: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.Margin : oppDetail.OrginalOpp.Margin,
                                                Penalty: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.Penalty : oppDetail.OrginalOpp.Penalty,
                                                WorkingHoursperDay: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.WorkingHoursperDay : oppDetail.OrginalOpp.WorkingHoursperDay,
                                                BUOnsiteManDaysRate: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.BUOnsiteManDaysRate : oppDetail.OrginalOpp.BUOnsiteManDaysRate,
                                                BURemoteManDaysRate: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.BURemoteManDaysRate : oppDetail.OrginalOpp.BURemoteManDaysRate,
                                                CDOOnsiteManDaysRate: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.CDOOnsiteManDaysRate : oppDetail.OrginalOpp.CDOOnsiteManDaysRate,
                                                CDORemoteManDaysRate: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.CDORemoteManDaysRate : oppDetail.OrginalOpp.CDORemoteManDaysRate,
                                                CDOOffsiteManDaysRate: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.CDOOffsiteManDaysRate : oppDetail.OrginalOpp.CDOOffsiteManDaysRate,
                                                ProjectManagement: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.ProjectManagement : oppDetail.OrginalOpp.ProjectManagement,
                                                BUPMManDaysRate: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.BUPMManDaysRate : oppDetail.OrginalOpp.BUPMManDaysRate,
                                                CDOPMManDaysRate: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.CDOPMManDaysRate : oppDetail.OrginalOpp.CDOPMManDaysRate,
                                                ServCareMAC50Rate: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.ServCareMAC50Rate : oppDetail.OrginalOpp.ServCareMAC50Rate,
                                                ServCareCM50hrsRate: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.ServCareCM50hrsRate : oppDetail.OrginalOpp.ServCareCM50hrsRate,
                                                ServCareGreen50hrsRate: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.ServCareGreen50hrsRate : oppDetail.OrginalOpp.ServCareGreen50hrsRate,
                                                ServCareLocalResourceIML2: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.ServCareLocalResourceIML2 : oppDetail.OrginalOpp.ServCareLocalResourceIML2,
                                                ServCareOnsiteResourcePML2: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.ServCareOnsiteResourcePML2 : oppDetail.OrginalOpp.ServCareOnsiteResourcePML2,
                                                ServCareSalaryHike: oppDetail.CtrlToSave == 'Configuration' ? oppConfig.ServCareSalaryHike : oppDetail.OrginalOpp.ServCareSalaryHike
                                            },
                                                { where: { OppId: oppInfo.id } }, { transaction: t })

                                                .then(function (oppInfoID) {
                                                    if (oppDetail.CtrlToSave == 'Configuration') {
                                                        models.SERVIONLEGALENTITY.destroy({ where: { OppID: oppInfo.id } }, { transaction: t })
                                                            .then(function (user) {
                                                                logger.info('Saving to Servion Legal Entity');
                                                                var tempArr = [];
                                                                for (var i = 0; i < oppInfo.OpportunityServionLegalEntity.length; i++) {
                                                                    tempArr.push({ 'OppID': oppInfo.id, 'ServionLegalEntityID': oppInfo.OpportunityServionLegalEntity[i] });
                                                                }
                                                                models.SERVIONLEGALENTITY.bulkCreate(tempArr, { omitNull: true }, { transaction: t }).then(function (sle) {
                                                                    logger.info('Added servionlegalentity');
                                                                    t.commit();
                                                                    deferred.resolve(sle);
                                                                }).catch(function (err) {
                                                                    logger.info('Error bulk creating servionlegalentity: ' + err);
                                                                    t.rollback();
                                                                    deferred.reject(err);
                                                                });
                                                            }).catch(function (err) { logger.info('Legal entity destroy: ' + err); t.rollback(); deferred.reject(err) });
                                                    }
                                                    else {
                                                        var oppType = {};
                                                        if (oppDetail.CtrlToSave == 'CSC') {
                                                            oppType = { OpportunityID: oppInfo.id, OpportunityType: ['CSC_TM', 'CSC_Owner'] };

                                                        }
                                                        else if (oppDetail.CtrlToSave == 'Access') {
                                                            oppType = { OpportunityID: oppInfo.id, OpportunityType: ['RSC', 'CSC_Others'] };
                                                        }
                                                        models.OPPORTUNITYUSER.destroy({ where: oppType }, { transaction: t })
                                                            .then(function (user) {
                                                                logger.info('Opp ID ----------------------------- ' + oppInfo.id);
                                                                logger.info('Original Opp ID ----------------------------- ' + oppDetail.OrginalOpp.id);
                                                                var tempArr2 = [];
                                                                logger.info('Users List: ' + JSON.stringify(userList));
                                                                for (var i = 0; i < userList.length; i++) {
                                                                    logger.info('User ID: ' + userList[i].Userid);
                                                                    if (userList[i].Userid != '' && userList[i].Userid != null && userList[i].Userid != undefined && oppDetail.CtrlToSave == 'CSC' && (userList[i].userType == 'CSC_TM' || userList[i].userType == 'CSC_Owner'))
                                                                        tempArr2.push({ 'OpportunityID': oppInfo.id, 'UserID': userList[i].Userid, 'OpportunityType': userList[i].userType });
                                                                    else if (userList[i].Userid != '' && userList[i].Userid != null && userList[i].Userid != undefined && oppDetail.CtrlToSave == 'Access' && (userList[i].userType == 'RSC' || userList[i].userType == 'CSC_Others'))
                                                                        tempArr2.push({ 'OpportunityID': oppInfo.id, 'UserID': userList[i].Userid, 'OpportunityType': userList[i].userType });
                                                                }
                                                                logger.info('Array to bulkreate: ' + JSON.stringify(tempArr2));
                                                                models.OPPORTUNITYUSER.bulkCreate(tempArr2, { omitNull: true }, { transaction: t }).then(function (opuser) {
                                                                    logger.info('Opportunity-User bulk created successfully');
                                                                    if (oppDetail.CtrlToSave == 'CSC' && oppInfo.HistorySaveRequired) {
                                                                        logger.info('Creating to Opportunity History..');
                                                                        logger.info(JSON.stringify(oppDetail.OrginalOpp));
                                                                        models.OPPORTUNITYHistory.create({
                                                                            OpportunityMasterId: oppInfo.id,
                                                                            SBUId: oppDetail.OrginalOpp.SBUId,
                                                                            CountryId: oppDetail.OrginalOpp.CountryId,
                                                                            AccountName: oppDetail.OrginalOpp.AccountName,
                                                                            OpportunityName: oppDetail.OrginalOpp.OpportunityName,
                                                                            ParentOppId: oppInfo.ParentOppId,
                                                                            OppId: oppDetail.OrginalOpp.OppId,
                                                                            AccManagerName: oppDetail.OrginalOpp.AccManagerName,
                                                                            OppStatus: oppInfo.OppStatus,
                                                                            OppCategoryId: oppDetail.OrginalOpp.OppCategoryId,
                                                                            PartnerName: oppDetail.OrginalOpp.PartnerName,
                                                                            UseManDayshours: oppDetail.OrginalOpp.UseManDayshours,
                                                                            UseOEMPricingStrategy: oppDetail.OrginalOpp.UseOEMPricingStrategy,
                                                                            NoOfDataCenterLocs: oppDetail.OrginalOpp.NoOfDataCenterLocs,
                                                                            NoOfAgentCenterLocs: oppDetail.OrginalOpp.NoOfAgentCenterLocs,
                                                                            IsDataCenterandAgentsColocated: oppDetail.OrginalOpp.IsDataCenterandAgentsColocated,
                                                                            RSCId: oppInfo.RSCId,
                                                                            CSCId: oppInfo.CSCId,

                                                                            CSCStatusId: oppInfo.CSCStatusId,
                                                                            SalesStatusId: oppInfo.SalesStatusId,
                                                                            OpportunityTypeId: oppInfo.OpportunityTypeId,
                                                                            ExpectedClosureDate: moment(expDate).add(1, 'days').format('L'),
                                                                            SLAClosureDate: moment(cloDate).add(1, 'days').format('L'),
                                                                            Comment: oppInfo.Comment,
                                                                            CSCOwner_Users: oppInfo.CSCOwnerUsers,
                                                                            CSCTeamMember_Users: oppInfo.TMUsers,
                                                                            RSC_users: oppInfo.RSCUsers,
                                                                            Other_users: oppInfo.OthersUsers,
                                                                            OpenDate: oppInfo.OpenDate,
                                                                            ActualCloseDate: oppInfo.ActualCloseDate,
                                                                            OpenUser: oppInfo.OpenUser,
                                                                            CloseUser: oppInfo.CloseUser,

                                                                            IsUpdated: oppInfo.IsUpdated,
                                                                            AccountSalesManager: oppDetail.OrginalOpp.AccountSalesManager,
                                                                            ServionLegalEntity: oppInfo.ServionLegalEntity,
                                                                            Vertical: oppDetail.OrginalOpp.Vertical,
                                                                            Source: oppDetail.OrginalOpp.Source,
                                                                            CustomerType: oppDetail.OrginalOpp.CustomerType,
                                                                            Cycle: oppInfo.Cycle,
                                                                            IsManual: oppInfo.IsManual
                                                                        }, { transaction: t }).then(function (data) {
                                                                            logger.info('Successfully created to Opportunity History');

                                                                            //new control in csc page
                                                                            if (oppDetail.CtrlToSave == 'CSC') {
                                                                                models.EstimationProduct.destroy({ where: { OppID: oppInfo.id } }, { transaction: t })
                                                                                    .then(function (user) {
                                                                                        logger.info('Saving to Estimation Product');
                                                                                        var tempArr = [];
                                                                                        for (var i = 0; i < oppInfo.OpportunityEstimationProduct.length; i++) {
                                                                                            tempArr.push({ 'OppID': oppInfo.id, 'ProductName': oppInfo.OpportunityEstimationProduct[i].ProductName });
                                                                                        }
                                                                                        models.EstimationProduct.bulkCreate(tempArr, { omitNull: true }, { transaction: t }).then(function (sle) {
                                                                                            logger.info('Added EstimationProduct');
                                                                                            t.commit();
                                                                                            deferred.resolve(sle);
                                                                                        }).catch(function (err) {
                                                                                            logger.info('Error bulk creating EstimationProduct: ' + err);
                                                                                            t.rollback();
                                                                                            deferred.reject(err);
                                                                                        });
                                                                                    }).catch(function (err) { logger.info('Estimation Product destroy: ' + err); t.rollback(); deferred.reject(err) });
                                                                            }
                                                                            else {
                                                                                t.commit();
                                                                                deferred.resolve(data);
                                                                            }
                                                                        }).catch(function (error) {
                                                                            logger.info('Error creating Opportunity History: ' + error);
                                                                            t.rollback(); deferred.reject(err);
                                                                        });
                                                                    }
                                                                    else {
                                                                        logger.info('Opportunity control saved!');
                                                                        if (oppDetail.CtrlToSave == 'CSC') {
                                                                            models.EstimationProduct.destroy({ where: { OppID: oppInfo.id } }, { transaction: t })
                                                                                .then(function (user) {
                                                                                    logger.info('Saving to Estimation Product');
                                                                                    var tempArr = [];
                                                                                    for (var i = 0; i < oppInfo.OpportunityEstimationProduct.length; i++) {
                                                                                        tempArr.push({ 'OppID': oppInfo.id, 'ProductName': oppInfo.OpportunityEstimationProduct[i].ProductName });
                                                                                    }
                                                                                    models.EstimationProduct.bulkCreate(tempArr, { omitNull: true }, { transaction: t }).then(function (sle) {
                                                                                        logger.info('Added EstimationProduct');
                                                                                        t.commit();
                                                                                        deferred.resolve(sle);
                                                                                    }).catch(function (err) {
                                                                                        logger.info('Error bulk creating EstimationProduct: ' + err);
                                                                                        t.rollback();
                                                                                        deferred.reject(err);
                                                                                    });
                                                                                }).catch(function (err) { logger.info('Estimation Product destroy: ' + err); t.rollback(); deferred.reject(err) });
                                                                        }
                                                                        else {

                                                                            t.commit();
                                                                            deferred.resolve(opuser);
                                                                        }
                                                                    }
                                                                })
                                                                    .catch(function (err) { logger.info('Opp user bulk create: ' + err); t.rollback(); deferred.reject(err) });
                                                            })
                                                            .catch(function (err) { logger.info('Opp user destroy ' + err); t.rollback(); deferred.reject(err) });
                                                    }
                                                })
                                                .catch(function (err) { logger.info('Opp Config update ' + err); t.rollback(); deferred.reject(err) });
                                        }).catch(function (err) { logger.info('Opp update: ' + err); t.rollback(); deferred.reject(err) });
                                }).catch(function (err) {
                                    logger.info('Error saving Estimation SDLC Percentage: ' + err);
                                    t.rollback();
                                    deferred.reject(err);
                                });
                        }).catch(function (err) { logger.info('Legal entity destroy: ' + err); t.rollback(); deferred.reject(err) });
                }
            });
        }
        catch (Ex) {
            logger.info('ex: ' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    MergeManualOpportunity: function (oppDetail) {
        logger.info('Start saving SaveOpportunityDetail');
        logger.info(JSON.stringify(oppDetail));
        var deferred = q.defer();
        try {
            models.OPPORTUNITY.update({
                IsActive: 0
            }, { where: { id: oppDetail.ManualoppID } })
                .then(function (oppDetailsuccess) {

                    models.OppopotunityMerged.create({
                        ManualOppID: oppDetail.ManualoppID,
                        CMSOppID: oppDetail.ActualOppID,
                        MergedBy: oppDetail.MergedBy
                    });
                    deferred.resolve(oppDetail);
                }).catch(function (err) { logger.info('SaveOpportunityDetail ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    SaveOpportunityConfigurationDetail: function (oppInfo) {
        logger.info('Start saving SaveOpportunityConfigurationDetail');
        var deferred = q.defer();
        try {
            models.OppConfiguration.update({
                Visa: oppInfo.Visa,
                AirFare: oppInfo.AirFare,
                Accommodation: oppInfo.Accommodation,
                PerDiemLaundry: oppInfo.PerDiemLaundry,
                LocalConveyance: oppInfo.LocalConveyance,
                Miscellaneous: oppInfo.Miscellaneous,
                SalaryHike: oppInfo.SalaryHike,
                SalarySpike: oppInfo.SalarySpike,
                Margin: oppInfo.Margin,
                Penalty: oppInfo.Penalty,
                WorkingHoursperDay: oppInfo.WorkingHoursperDay,
                BUOnsiteManDaysRate: oppInfo.BUOnsiteManDaysRate,
                BURemoteManDaysRate: oppInfo.BURemoteManDaysRate,
                CDOOnsiteManDaysRate: oppInfo.CDOOnsiteManDaysRate,
                CDORemoteManDaysRate: oppInfo.CDORemoteManDaysRate,
                CDOOffsiteManDaysRate: oppInfo.CDOOffsiteManDaysRate,
                ProjectManagement: oppInfo.ProjectManagement,
                BUPMManDaysRate: oppInfo.BUPMManDaysRate,
                CDOPMManDaysRate: oppInfo.CDOPMManDaysRate,
                ServCareMAC50Rate: oppInfo.ServCareMAC50Rate,
                ServCareCM50hrsRate: oppInfo.ServCareCM50hrsRate,
                ServCareGreen50hrsRate: oppInfo.ServCareGreen50hrsRate,
                ServCareLocalResourceIML2: oppInfo.ServCareLocalResourceIML2,
                ServCareOnsiteResourcePML2: oppInfo.ServCareOnsiteResourcePML2,
                ServCareSalaryHike: oppInfo.ServCareSalaryHike
            }, { where: { OppId: oppInfo.OppId } })
                .then(function (oppInfo) {
                    deferred.resolve(oppInfo);
                }).catch(function (err) { logger.info('SaveOpportunityDetail ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetOpportunityCustomerType: function () {
        logger.info('GetOpportunityCustomerType *************************************************************');
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            models.sequelize.query('SELECT [CustomerTypeID],[CustomerType] FROM [dbo].[tbl_Opportunity_CustomerType]', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });

        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetServionLegalEntity: function () {
        logger.info('GetOpportunityServionLegalEntity *************************************************************');
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            models.sequelize.query('SELECT * FROM [TBL_ServionLegalEntity]', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });

        }
        catch (Ex) {
            logger.info('ex' + Ex);

            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    
    GetAllEstimationProduct: function () {
        logger.info('GetAllEstimationProduct *************************************************************');
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            models.sequelize.query(' SELECT distinct(productname) as productname FROM TBL_EstimationSDLCPercentage', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });

        }
        catch (Ex) {
            logger.info('ex' + Ex);

            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    GetOpportunityServionLegalEntity: function (oppID) {
        logger.info('GetOpportunityServionLegalEntity *************************************************************');
        var deferred = q.defer();
        logger.info('Inside get all sp');
        try {
            models.sequelize.query('SELECT ServionLegalEntityID FROM [TBL_OPPORTUNITY_ServionLegalEntity] WHERE oppID= :id ', { replacements: { id: oppID }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    getOpportunityEstimationProduct: function (oppID) {
        logger.info('getOpportunityEstimationProduct *************************************************************' + oppID);
        var deferred = q.defer();
        logger.info('Inside get all sp getOpportunityEstimationProduct');
        try {
            models.sequelize.query('select ProductName from TBL_OPPORTUNITY_EstimationProduct WHERE oppID= :id ', { replacements: { id: oppID }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success getOpportunityEstimationProduct');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail getOpportunityEstimationProduct' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    CreateManualOpportunity: function () {
        logger.info('CreateManualOpportunity *************************************************************');
        var deferred = q.defer();
        var q1 = 'CALL USP_CREATE_OPPERTUNITY(\'INDIA\',\'ParentOppId\',\'AccountName\',\'OpportunityName\',\'AccManagerName\',\'Vertical\',\'Servion_Legal_Entity\',\'Source\',\'Customer_Type\',\'Account_Sales_Manager\');';
        //var q1 = 'select * from TBL_OPPORTUNITY_MASTER';
        logger.info('CreateManualOpportunitywww *************************************************************');
        logger.info(q1);
        logger.info('Inside get all sp');
        try {
            //sequelize.query('CALL USP_CREATE_OPPERTUNITY(:SBUNAME,:ParentOppId,:AccountName,:OpportunityName,:AccManagerName,:Vertical,:Servion_Legal_Entity,:Source,:Customer_Type,:Account_Sales_Manager);', { replacements: { SBUNAME:'EUROPE',ParentOppId:'00122',AccountName:'HDFC Bank',OpportunityName:'XXXX',AccManagerName:'sssss',Vertical:'INDIA',Servion_Legal_Entity:'Serv',Source:'News',Customer_Type:'Direct',Account_Sales_Manager:'Goyal' }, type: sequelize.QueryTypes.INSERT }).then(function (response) {
            models.sequelize.query(q1, { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    CreateOpportunityMaster: function (oppDetail) {
        logger.info('CreateOpportunityMaster');
        var deferred = q.defer();
        try {
            models.OPPORTUNITY.create({
                SBUId: oppDetail.SBUID,
                CountryId: oppDetail.CountryId,
                AccountName: oppDetail.AccountName,
                OpportunityName: oppDetail.OpportunityName,
                ParentOppId: oppDetail.ParentOppID,
                OppId: oppDetail.OppId,
                AccManagerName: oppDetail.AccManagerName,
                AccountSalesManager: oppDetail.AccountSalesManager,
                Vertical: oppDetail.Vertical,
                Source: oppDetail.Source,
                CustomerType: oppDetail.CustomerType,
                IsManual: 1
            }).then(function (response) {
                logger.info('Added to Opp Master');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('failed to add to opp master: ' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    SaveManualOpportunityDetail: function (oppDetail) {
        logger.info('Start saving SaveManualOpportunityDetail');
        logger.info(JSON.stringify(oppDetail));
        var deferred = q.defer();
        try {
            models.sequelize.query('SELECT max(id) as id FROM [TBL_OPPORTUNITY_MASTER] ', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('Saving to Servion Legal Entity for Opp ID: ' + response[0].id);
                var tempArr = [];
                for (var i = 0; i < oppDetail.ServionLegalEntity.length; i++) {
                    tempArr.push({ 'OppID': response[0].id, 'ServionLegalEntityID': oppDetail.ServionLegalEntity[i] });
                }
                models.SERVIONLEGALENTITY.bulkCreate(tempArr, { omitNull: true }).then(function (sle) {
                    logger.info('Added servionlegalentity');
                    deferred.resolve(sle);
                }).catch(function (err) {
                    logger.info('Error bulk creating servionlegalentity: ' + err);
                    deferred.reject(err);
                });
            }).then(function (response) {
                deferred.resolve(response);
            }).catch(function (err) {
                logger.info('Error: ' + err); deferred.reject(err);
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;;
    },
    UpdateManualOpportunityConfiguration: function () {
        logger.info('Start Fetching SP');
        var deferred = q.defer();
        logger.info('Inside UpdateManualOpportunityConfiguration sp');
        try {
            models.sequelize.query('USP_CREATE_Manual_OPPERTUNITY', { type: sequelize.QueryTypes.SELECT }).then(function (response) {
                logger.info('success');
                deferred.resolve(response);
            }).error(function (err) {
                logger.info('fail' + err);
                deferred.reject(err)
            });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },

    GetExtendedEfforts: function () {
        var deferred = q.defer();
        try {
            models.ExtendedEffortsSDLC.findAll()
                .then(function (opp) {
                    deferred.resolve(opp);
                })
                .catch(function (err) { logger.info('GetExtendedEfforts ' + err); deferred.reject(err) });
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },
    AddExtendedEfforts: function (config) {
        logger.info('Adding opportunity configuration.. ');
        var deferred = q.defer();
        try {
            if (config != null && config != undefined) {

                models.ExtendedEffortsSDLC.destroy({ truncate: true }).then(function () {
                    models.ExtendedEffortsSDLC.create({
                        REQ: config.REQ
                        , Design: config.Design
                        , DevTest: config.DevTest
                        , ST: config.ST
                        , IMPL: config.IMPL
                        , UAT: config.UAT
                        , PROD: config.PROD
                        , Train: config.Train
                        , Manual: config.Manual
                        , OH: config.OH
                        , SQA: config.SQA
                        , PM: config.PM
                    }).then(function () {
                        deferred.resolve();
                    }).catch(function (err) {
                        console.log('ExtendedEffortsSDLC' + err);
                        deferred.reject(err);
                    });

                }).catch(function (Error) {
                    console.log("Error occured when deleting the ExtendedEffortsSDLC");
                    deferred.reject(Error);
                });
            }
            else {
                deferred.reject({ 'Error': 'Configuration is null or invalid' });
            }
        }
        catch (Ex) {
            logger.info('ex' + Ex);
            deferred.reject(Ex);
        }
        return deferred.promise;
    },


}

module.exports.CountryModel = CountryModel;