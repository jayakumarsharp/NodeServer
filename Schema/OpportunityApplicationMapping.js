'use strict';
//Menu

module.exports = function (sequelize, DataTypes) {
    var OppApplicationMap = sequelize.define('OppApplicationMap', {
        SheetName: {
            type: DataTypes.STRING,
        },
        OppId: {
            type: DataTypes.STRING,
        },
        ApplicationId: {
            type: DataTypes.INTEGER,
        },
        Version: {
            type: DataTypes.STRING,
        },
        IsEditable: {
            type: DataTypes.BOOLEAN,
        },
        IsLocked: {
            type: DataTypes.BOOLEAN,
        },
        LockedIn: {
            type: DataTypes.STRING,
        },
        LockedUser: {
            type: DataTypes.STRING,
        },
        NumberOfApplication: {
            type: DataTypes.STRING,
        },
        Comment: {
            type: DataTypes.STRING,
        },
        IsFeed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        IsInitial: {
            type: DataTypes.BOOLEAN,
        },
        LockStartTime: {
            type: DataTypes.DATE,

        },
        CreatedBy: {
            type: DataTypes.STRING,
        },
        CreatedOn: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        Content: {
            type: DataTypes.STRING(4000),
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
            tableName: 'TBL_EstimationOppMapping'
        });
    return OppApplicationMap;
};