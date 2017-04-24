'use strict';
//Menu
module.exports = function (sequelize, DataTypes) {
    var OppEstimationSDLCPercentage = sequelize.define('OppEstimationSDLCPercentage', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        OppID: {
            type: DataTypes.INTEGER,
            field: 'OppID'
        },
        ProductName: {
            type: DataTypes.STRING,
            field: 'ProductName'
        },
        SDLC_Type: {
            type: DataTypes.STRING,
            field: 'SDLC_Type'
        },
        prod_percentage: {
            type: DataTypes.STRING,
            field: 'prod_percentage'
        }
        , uat_percentage: {
            type: DataTypes.STRING,
            field: 'uat_percentage'
        }
        ,
               DCCount: {
            type: DataTypes.INTEGER,
            field: 'DCCount'
        }
        , AgentCount: {
            type: DataTypes.INTEGER,
            field: 'AgentCount'
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
            tableName: 'TBL_OppEstimationSDLCPercentage'
        });
    return OppEstimationSDLCPercentage;
};