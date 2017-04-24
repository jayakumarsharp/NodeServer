﻿'use strict';
module.exports = function (sequelize, DataTypes) {
    var PaymentMilestone = sequelize.define('PaymentMilestone', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        MilestoneDescription: {
            type: DataTypes.STRING,
            field: 'MilestoneDescription'
        },
        PaymentCode: {
            type: DataTypes.STRING,
            field: 'PaymentCode'
        },
        VendorBreakdown: {
            type: DataTypes.STRING,
            field: 'VendorBreakdown'
        },
        PercentageType: {
            type: DataTypes.STRING,
            field: 'PercentageType'
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
        tableName: 'TBL_PAYMENT_MILESTONE'
    });
    return PaymentMilestone;
};