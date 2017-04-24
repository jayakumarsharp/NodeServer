"use strict";
//Opportunities
module.exports = function (sequelize, DataTypes) {
    var OPPORTUNITYHistory = sequelize.define('OPPORTUNITYHistory', {
        OpportunityMasterId: {
            type: DataTypes.INTEGER,
            field: 'OpportunityMasterId'
        },
        SBUId: {
            type: DataTypes.INTEGER,
            field: 'SBUId'
        },
        CountryId: {
            type: DataTypes.INTEGER,
            field: 'CountryId'
        },
        AccountName: {
            type: DataTypes.STRING,
            field: 'AccountName'
        },
        OpportunityName: {
            type: DataTypes.STRING,
            field: 'OpportunityName'
        },
        OppId: {
            type: DataTypes.STRING,
            field: 'OppId'
        },
        ParentOppId: {
            type: DataTypes.STRING,
            field: 'ParentOppId'
        },
        AccManagerName: {
            type: DataTypes.STRING,
            field: 'AccManagerName'
        },
        OppStatus: {
            type: DataTypes.STRING,
            field: 'OppStatus'
        },
        OppCategoryId: {
            type: DataTypes.INTEGER,
            field: 'OppCategoryId'
        },
        PartnerName: {
            type: DataTypes.STRING,
            field: 'PartnerName'
        },
        UseManDayshours: {
            type: DataTypes.STRING,
            field: 'UseManDayshours'
        },
        UseOEMPricingStrategy: {
            type: DataTypes.INTEGER,
            field: 'UseOEMPricingStrategy'
        },
        NoOfDataCenterLocs: {
            type: DataTypes.INTEGER,
            field: 'NoOfDataCenterLocs'
        },
        NoOfAgentCenterLocs: {
            type: DataTypes.INTEGER,
            field: 'NoOfAgentCenterLocs'
        },
        IsDataCenterandAgentsColocated: {
            type: DataTypes.INTEGER,
            field: 'IsDataCenterandAgentsColocated'
        },
        RSCId: {
            type: DataTypes.INTEGER,
            field: 'RSCId'
        },
        CSCId: {
            type: DataTypes.INTEGER,
            field: 'RSCId'
        },
        CSCStatusId: {
            type: DataTypes.INTEGER,
            field: 'CSCStatusId'
        },
        SalesStatusId: {
            type: DataTypes.INTEGER,
            field: 'SalesStatusId'
        },
        OpportunityTypeId: {
            type: DataTypes.INTEGER,
            field: 'OpportunityTypeId'
        },
        ExpectedClosureDate: {
            type: DataTypes.DATE,
            field: 'ExpectedClosureDate'
        },
        SLAClosureDate: {
            type: DataTypes.DATE,
            field: 'SLAClosureDate'
        },
        Comment: {
            type: DataTypes.STRING,
            field: 'Comment'
        },
        CSCOwner_Users: {
            type: DataTypes.STRING,
            field: 'CSCOwner_Users'
        },
        CSCTeamMember_Users: {
            type: DataTypes.STRING,
            field: 'CSCTeamMember_Users'
        },
        RSC_users: {
            type: DataTypes.STRING,
            field: 'RSC_users'
        },
        Other_users: {
            type: DataTypes.STRING,
            field: 'Other_users'
        },
        IsUpdated: {
            type: DataTypes.STRING,
            field: 'IsUpdated'
        },
        CreatedOn: {
            type: DataTypes.DATE,
            field: 'CreatedOn',
            defaultValue: sequelize.NOW
        },
        OpenDate: {
            type: DataTypes.DATE,
            field: 'OpenDate',
            defaultValue: sequelize.NOW
        },
        ActualCloseDate: {
            type: DataTypes.DATE,
            field: 'ActualCloseDate',
            defaultValue: sequelize.NOW
        },
        OpenUser: {
            type: DataTypes.STRING,
            field: 'OpenUser'
        },
        CloseUser: {
            type: DataTypes.STRING,
            field: 'CloseUser'
        },
        AccountSalesManager: {
            type: DataTypes.STRING,
            field: 'AccountSalesManager'
        },
        ServionLegalEntity: {
            type: DataTypes.INTEGER,
            field: 'ServionLegalEntity'
        },
        Vertical: {
            type: DataTypes.STRING,
            field: 'Vertical'
        },
        Source: {
            type: DataTypes.STRING,
            field: 'Source'
        },
        CustomerType: {
            type: DataTypes.INTEGER,
            field: 'CustomerType'
        },
        Cycle: {
            type: DataTypes.INTEGER,
            field: 'Cycle'
        },
        IsManual: {
            type: DataTypes.BOOLEAN,
            field: 'IsManual'
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            field: 'IsManual'
        }
    },
            {
                // don't add the timestamp attributes (updatedAt, createdAt)
                timestamps: false,
                // don't delete database entries but set the newly added attribute deletedAt
                // to the current date (when deletion was done). paranoid will only work if
                // timestamps are enabled
                paranoid: true,
                // don't use camelcase for automatically added attributes but underscore style
                // so updatedAt will be updated_at
                underscored: true,
                // disable the modification of tablenames; By default, sequelize will automatically
                // transform all passed model names (first parameter of define) into plural.
                // if you don't want that, set the following
                freezeTableName: true,
                // define the table's name
                tableName: 'TBL_OPPORTUNITY_History'
            });
    return OPPORTUNITYHistory;
};;