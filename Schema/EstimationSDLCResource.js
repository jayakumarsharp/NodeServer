'use strict';
//Menu
module.exports = function (sequelize, DataTypes) {
    var EstimationSDLCResource = sequelize.define('EstimationSDLCResource', {
        SBU: {
            type: DataTypes.INTEGER,
            field: 'SBU'
        },
        Region: {
            type: DataTypes.INTEGER,
            field: 'Region'
        },
        OEM: {
            type: DataTypes.INTEGER,
            field: 'OEM'
        }
        , Infra: {
            type: DataTypes.STRING,
            field: 'Infra'
        }
        , Apps: {
            type: DataTypes.STRING,
            field: 'Apps'
        },
        Upgrade: {
            type: DataTypes.STRING,
            field: 'Upgrade'
        }
        , Complexity: {
            type: DataTypes.STRING,
            field: 'Complexity'
        }
        , REQ: {
            type: DataTypes.STRING,
            field: 'REQ'
        }
        , Design: {
            type: DataTypes.STRING,
            field: 'Design'
        }, DevTest: {
            type: DataTypes.STRING,
            field: 'DevTest'
        }        , SysTest: {
            type: DataTypes.STRING,
            field: 'SysTest'
        }        , IMPL: {
            type: DataTypes.STRING,
            field: 'IMPL'
        }        , UAT: {
            type: DataTypes.STRING,
            field: 'UAT'
        }        , PROD: {
            type: DataTypes.STRING,
            field: 'PROD'
        }        , Train: {
            type: DataTypes.STRING,
            field: 'Train'
        }        , Manual: {
            type: DataTypes.STRING,
            field: 'Manual'
        }        , OH: {
            type: DataTypes.STRING,
            field: 'OH'
        }        , SQA: {
            type: DataTypes.STRING,
            field: 'SQA'
        }        , PM: {
            type: DataTypes.STRING,
            field: 'PM'
        }        , CE: {
            type: DataTypes.STRING,
            field: 'CE'
        }        , description: {
            type: DataTypes.STRING,
            field: 'description'
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
            tableName: 'TBL_SDLCResourceDistribution'
        });
    return EstimationSDLCResource;
};