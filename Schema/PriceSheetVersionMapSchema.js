'use strict';
//Menu

module.exports = function (sequelize, DataTypes) {
    var PriceVersionMap = sequelize.define('PriceVersionMap', {
        OppId: {
            type: DataTypes.STRING,
            field: 'OppId'
        },
        PriceSheetId: {
            type: DataTypes.INTEGER,
            field: 'PriceSheetId',
        },
        Version: {
            type: DataTypes.STRING,
            field: 'Version'
        },
        IsEditable: {
            type: DataTypes.BOOLEAN,
            field: 'IsEditable'
        },

        IsLocked: {
            type: DataTypes.BOOLEAN,
            field: 'IsLocked'
        },
        IsPriceSheetUpdated: {
            type: DataTypes.BOOLEAN,
            field: 'IsPriceSheetUpdated'
        },
        LockedIn: {
            type: DataTypes.STRING,
            field: 'LockedIn'
        },
        PSUpdatedBy: {
            type: DataTypes.STRING,
            field: 'PSUpdatedBy'
        },
        PYUpdatedBy: {
            type: DataTypes.STRING,
            field: 'PYUpdatedBy'
        },
        GMUpdatedBy: {
            type: DataTypes.STRING,
            field: 'GMUpdatedBy'
        },
        DaySheetVersionJSON:
        {
            type: DataTypes.STRING(2000),
        },
        LockedUser: {
            type: DataTypes.STRING,
            field: 'LockedUser'
        },
        LockStartTime: {
            type: DataTypes.DATE,
            field: 'LockStartTime'
        },
        Comment: {
            type: DataTypes.STRING,
            field: 'Comment'
        },
        ColStatus: {
            type: DataTypes.STRING,
            field: 'ColStatus'
        },
        CreatedBy: {
            type: DataTypes.STRING,
            field: 'CreatedBy'
        },
        CreatedOn: {
            type: DataTypes.DATE,
            field: 'CreatedOn',
            defaultValue: sequelize.NOW
        }
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
            tableName: 'TBL_PRICESHEETVERSIONMAP'
        });
    return PriceVersionMap;
};