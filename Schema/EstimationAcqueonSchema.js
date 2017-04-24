'use strict';
//Menu
module.exports = function (sequelize, DataTypes) {
    var EstimationAcqueon = sequelize.define('EstimationAcqueon', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        OppId: {
            type: DataTypes.STRING,
        },
        GroupType: {
            type: DataTypes.STRING,
            field: 'GroupType'
        },
        Name: {
            type: DataTypes.STRING(4000),
            field: 'Name'
        },
        col1: {
            type: DataTypes.STRING,
            field: 'col1'
        }
        , col2: {
            type: DataTypes.STRING,
            field: 'col2'
        }
        , col3: {
            type: DataTypes.STRING,
            field: 'col3'
        },
        Name1: {
            type: DataTypes.STRING(4000),
            field: 'Name1'
        }
        , Fcol1: {
            type: DataTypes.STRING(4000),
            field: 'Fcol1'
        }
        , Fcol2: {
            type: DataTypes.STRING(4000),
            field: 'Fcol2'
        }
        , Fcol3: {
            type: DataTypes.STRING(4000),
            field: 'Fcol3'
        }
        , Fcol4: {
            type: DataTypes.STRING(4000),
        }
        , Fcol5: {
            type: DataTypes.STRING(4000),
        }
        , Fcol6: {
            type: DataTypes.STRING(4000),
        }

        , RowId: {
            type: DataTypes.STRING,
            field: 'RowId'
        },
        A1col1: {
            type: DataTypes.STRING,
        }
        , A1col2: {
            type: DataTypes.STRING,
        }
        , A1col3: {
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
            tableName: 'TBL_EstimationAcqueon'
        });
    return EstimationAcqueon;
};