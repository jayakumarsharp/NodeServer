'use strict';
//Menu
module.exports = function (sequelize, DataTypes) {
    var OppopotunityMerged = sequelize.define('OppopotunityMerged', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'id'
        },
        ManualOppID: {
            type: DataTypes.INTEGER,
            field: 'ManualOppID'
        },
        CMSOppID: {
            type: DataTypes.INTEGER,
            field: 'CMSOppID'
        },
        MergedDateTime: {
            type: DataTypes.DATE,
            field: 'MergedDateTime',
            defaultValue: sequelize.NOW
        },
        MergedBy: {
            type: DataTypes.STRING,
            field: 'MergedBy'
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
        tableName: 'TBL_Oppopotunity_Merged'
    });
    return OppopotunityMerged;
};