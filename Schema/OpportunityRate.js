'use strict';
//Menu
module.exports = function (sequelize, DataTypes) {
    var OPPORTUNITY_RATE = sequelize.define('OPPORTUNITY_RATE', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        Rate_Type: {
            type: DataTypes.STRING,
            field: 'Rate_Type'
        },
        mode_type: {
            type: DataTypes.STRING,
            field: 'mode_type'
        },
        misc: {
            type: DataTypes.STRING,
            field: 'misc'
        },
        USD: {
            type: DataTypes.STRING,
            field: 'USD'
        },
        CAD: {
            type: DataTypes.STRING,
            field: 'CAD'
        },
        SGD: {
            type: DataTypes.STRING,
            field: 'SGD'
        },
        THB: {
            type: DataTypes.STRING,
            field: 'THB'
        },
        MYR: {
            type: DataTypes.STRING,
            field: 'MYR'
        },
        IDR: {
            type: DataTypes.STRING,
            field: 'IDR'
        },
        AUD: {
            type: DataTypes.STRING,
            field: 'AUD'
        },    
         SAR: {
            type: DataTypes.STRING,
            field: 'SAR'
        },
        AED: {
            type: DataTypes.STRING,
            field: 'AED'
        },
        QAR: {
            type: DataTypes.STRING,
            field: 'QAR'
        },
        OMR: {
            type: DataTypes.STRING,
            field: 'OMR'
        },
        KES: {
            type: DataTypes.STRING,
            field: 'KES'
        },
        UGX: {
            type: DataTypes.STRING,
            field: 'UGX'
        },
        GBP: {
            type: DataTypes.STRING,
            field: 'GBP'
        },
        EUR: {
            type: DataTypes.STRING,
            field: 'EUR'
        },
        INR: {
            type: DataTypes.STRING,
            field: 'INR'
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
        tableName: 'TBL_OPPORTUNITY_RATE'
    });
    return OPPORTUNITY_RATE;
};