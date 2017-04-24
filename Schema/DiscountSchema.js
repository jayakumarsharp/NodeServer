'use strict';
module.exports = function (sequelize, DataTypes) {
    var Discount = sequelize.define('Discount', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        BU: {
            type: DataTypes.STRING,
            field: 'BU'
        },
        Region: {
            type: DataTypes.STRING,
            field: 'Region'
        },
        Vendor: {
            type: DataTypes.STRING,
            field: 'Vendor'
        },
        ComponentType: {
            type: DataTypes.STRING,
            field: 'ComponentType'
        },
        DefaultVal: {
            type: DataTypes.INTEGER,
            field: 'DefaultVal'
        },
        Level1: {
            type: DataTypes.INTEGER,
            field: 'Level1'
        },
        Level2: {
            type: DataTypes.INTEGER,
            field: 'Level2'
        },
        Level3: {
            type: DataTypes.INTEGER,
            field: 'Level3'
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
        tableName: 'TBL_DISCOUNT_MASTER'
    });
    return Discount;
};