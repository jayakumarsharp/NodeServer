'use strict';
module.exports = function (sequelize, DataTypes) {
    var CurrencyConversion = sequelize.define('CurrencyConversion', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        SBUId: {
            type: DataTypes.INTEGER,
            field: 'SBUId'
        },
        RegionId: {
            type: DataTypes.INTEGER,
            field: 'RegionId'
        },
        CurrencyId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'CurrencyId'
        },
        ServionLegalEntityId: {
            type: DataTypes.INTEGER,
            field: 'ServionLegalEntityId'
        },
        ConversionRate: {
            type: DataTypes.STRING,
            field: 'ConversionRate'
        },
        UpdatedBy: {
            type: DataTypes.STRING,
            field: 'UpdatedBy'
        },
        UpdatedOn: {
            type: DataTypes.DATE,
            field: 'UpdatedOn',
            defaultValue: DataTypes.NOW
        },
    }, {
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
        tableName: 'TBL_CURRENCY_CONVERSION_MASTER'
    });
    return CurrencyConversion;
};