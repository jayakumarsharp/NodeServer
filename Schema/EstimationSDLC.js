'use strict';
//Menu
module.exports = function (sequelize, DataTypes) {
    var EstimationSDLCPercentage = sequelize.define('EstimationSDLCPercentage', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        ProductName: {
            type: DataTypes.STRING,
            field: 'ProductName'
        },
        SDLC_Type: {
            type: DataTypes.STRING,
            field: 'SDLC_Type'
        },
        DC_prod: {
            type: DataTypes.STRING,
            field: 'DC_prod'
        }
        , POP_prod: {
            type: DataTypes.STRING,
            field: 'POP_prod'
        }
        , AGT_prod: {
            type: DataTypes.STRING,
            field: 'AGT_prod'
        },
        DC_Upgrade: {
            type: DataTypes.STRING,
            field: 'DC_Upgrade'
        }
        , POP_Upgrade: {
            type: DataTypes.STRING,
            field: 'POP_Upgrade'
        }
        , AGT_Upgrade: {
            type: DataTypes.STRING,
            field: 'AGT_Upgrade'
        }
        , IsDCOppValue: {
            type: DataTypes.BOOLEAN,
            field: 'IsDCOppValue'
        }, IsAgentOppValue: {
            type: DataTypes.BOOLEAN,
            field: 'IsAgentOppValue'
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
            tableName: 'TBL_EstimationSDLCPercentage'
        });
    return EstimationSDLCPercentage;
};