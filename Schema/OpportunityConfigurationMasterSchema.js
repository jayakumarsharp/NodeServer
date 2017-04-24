'use strict';
//Menu
module.exports = function (sequelize, DataTypes) {
    var OppConfigurationMaster = sequelize.define('OppConfigurationMaster', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'id'
        },
        SBU: {
            type: DataTypes.STRING,
            field: 'SBU'
        },
        Region: {
            type: DataTypes.STRING,
            field: 'Region'
        },
        Visa: {
            type: DataTypes.INTEGER,
            field: 'Visa'
        },
        AirFare: {
            type: DataTypes.INTEGER,
            field: 'AirFare'
        },
        Accommodation: {
            type: DataTypes.INTEGER,
            field: 'Accommodation'
        },
        PerDiemLaundry: {
            type: DataTypes.INTEGER,
            field: 'PerDiemLaundry'
        },
        LocalConveyance: {
            type: DataTypes.INTEGER,
            field: 'LocalConveyance'
        },
        Miscellaneous: {
            type: DataTypes.INTEGER,
            field: 'Miscellaneous'
        },
        SalaryHike: {
            type: DataTypes.INTEGER,
            field: 'SalaryHike'
        },
        SalarySpike: {
            type: DataTypes.INTEGER,
            field: 'SalarySpike'
        },
        Margin: {
            type: DataTypes.INTEGER,
            field: 'Margin'
        },
        Penalty: {
            type: DataTypes.INTEGER,
            field: 'Penalty'
        },
        WorkingHoursperDay: {
            type: DataTypes.INTEGER,
            field: 'WorkingHoursperDay'
        },
        BUOnsiteManDaysRate: {
            type: DataTypes.INTEGER,
            field: 'BUOnsiteManDaysRate'
        },
        BURemoteManDaysRate: {
            type: DataTypes.INTEGER,
            field: 'BURemoteManDaysRate'
        },
        CDOOnsiteManDaysRate: {
            type: DataTypes.INTEGER,
            field: 'CDOOnsiteManDaysRate'
        },
        CDORemoteManDaysRate: {
            type: DataTypes.INTEGER,
            field: 'CDORemoteManDaysRate'
        },
        CDOOffsiteManDaysRate: {
            type: DataTypes.INTEGER,
            field: 'CDOOffsiteManDaysRate'
        },
        ProjectManagement: {
            type: DataTypes.INTEGER,
            field: 'ProjectManagement'
        },
        BUPMManDaysRate: {
            type: DataTypes.INTEGER,
            field: 'BUPMManDaysRate'
        },
        CDOPMManDaysRate: {
            type: DataTypes.INTEGER,
            field: 'CDOPMManDaysRate'
        },
        ServCareMAC50Rate: {
            type: DataTypes.INTEGER,
            field: 'ServCareMAC50Rate'
        },
        ServCareCM50hrsRate: {
            type: DataTypes.INTEGER,
            field: 'ServCareCM50hrsRate'
        },
        ServCareGreen50hrsRate: {
            type: DataTypes.INTEGER,
            field: 'ServCareGreen50hrsRate'
        },
        ServCareLocalResourceIML2: {
            type: DataTypes.INTEGER,
            field: 'ServCareLocalResourceIML2'
        },
        ServCareOnsiteResourcePML2: {
            type: DataTypes.INTEGER,
            field: 'ServCareOnsiteResourcePML2'
        },
        ServCareSalaryHike: {
            type: DataTypes.INTEGER,
            field: 'ServCareSalaryHike'
        }
    }
    , {
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
        // don't delete database entries but set the newly added attribute deletedAt
        // to the current date (when deletion was done). paranoid will only work if
        // timestamps are enabled,
        paranoid: true,
        // don't use camelcase for automatically added attributes but underscore style
        // so updatedAt will be updated_at
        underscored: true,
        // disable the modification of tablenames; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,
        // define the table's name
        tableName: 'TBL_OPPORTUNITYCONFIGURATION_MASTER'
    });
    return OppConfigurationMaster;
};