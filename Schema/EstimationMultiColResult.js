'use strict';
//Menu
module.exports = function (sequelize, DataTypes) {
    var EstimationMultiColResult = sequelize.define('EstimationMultiColResult', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        OppId: {
            type: DataTypes.STRING,
        },
        ProductName: {
            type: DataTypes.STRING,
        },
        Section: {
            type: DataTypes.STRING,
        },
        A1Fcol1: {
            type: DataTypes.STRING,
        }
        , A1Fcol2: {
            type: DataTypes.STRING,
        }
        , A1Fcol3: {
            type: DataTypes.STRING,
        },
        A1Fcol4: {
            type: DataTypes.STRING,
        }
        , A1Fcol5: {
            type: DataTypes.STRING,
        }
        , A1Fcol6: {
            type: DataTypes.STRING,
        },

        GroupId: {
            type: DataTypes.STRING,
            field: 'GroupId'
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
            tableName: 'TBL_EstimationMultiColResult'
        });
    return EstimationMultiColResult;
};