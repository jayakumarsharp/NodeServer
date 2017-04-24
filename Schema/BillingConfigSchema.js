"use strict";
//UserRoles
module.exports = function (sequelize, DataTypes) {
    var BillingConfig = sequelize.define('BillingConfig', {
        Id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id',
            autoIncrement: true
        },
        SBU: {
            type: DataTypes.INTEGER,
            field: 'SBU'
        },
        APR: {
            type: DataTypes.STRING,
            field: 'APR'
        }, 
        MAY: {
            type: DataTypes.STRING,
            field: 'MAY'
        }, 
        JUN: {
            type: DataTypes.STRING,
            field: 'JUN'
        }, 
        JUL: {
            type: DataTypes.STRING,
            field: 'JUL'
        }, 
        AUG: {
            type: DataTypes.STRING,
            field: 'AUG'
        }, 
        SEP: {
            type: DataTypes.STRING,
            field: 'SEP'
        }, 
        OCT: {
            type: DataTypes.STRING,
            field: 'OCT'
        }, 
        NOV: {
            type: DataTypes.STRING,
            field: 'NOV'
        }, 
        DEC: {
            type: DataTypes.STRING,
            field: 'DEC'
        }, 
        JAN: {
            type: DataTypes.STRING,
            field: 'JAN'
        }, 
        FEB: {
            type: DataTypes.STRING,
            field: 'FEB'
        }, 
        MAR: {
            type: DataTypes.STRING,
            field: 'MAR'
        },       
        Year: {
            type: DataTypes.INTEGER,
            field: 'Year'
        }
    }, {
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
        // don't delete database entries but set the newly added attribute deletedAt
        // to the current date (when deletion was done). paranoid will only work if
        // timestamps are enabled,
        paranoid: false,
        // don't use camelcase for automatically added attributes but underscore style
        // so updatedAt will be updated_at
        underscored: true,
        // disable the modification of tablenames; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,
        // define the table's name
        tableName: 'TBL_BILLCONFIG_MASTER',
        //classMethods: {
        //    associate: function (models) {
        //        CountryRegionMap.belongsTo(models.Country, { foreignKey: 'CountryId', targetKey: 'Id' });
                
        //    }
        //}
    });

    return BillingConfig;
};