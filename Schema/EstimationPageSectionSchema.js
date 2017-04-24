'use strict';
//Menu
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('EstimationPageSection', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        PageID: {
            type: DataTypes.INTEGER,
            field: 'PageID'
        },
        SectionName: {
            type: DataTypes.STRING,
            field: 'SectionName'
        },
        DisplayName: {
            type: DataTypes.STRING,
        },
        OrderSequence: {
            type: DataTypes.INTEGER,
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
            tableName: 'TBL_EstimationPageSection'
        });

};