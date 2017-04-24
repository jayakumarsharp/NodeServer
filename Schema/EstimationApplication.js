'use strict';
//Menu
module.exports = function (sequelize, DataTypes) {
    var EstimationApplication = sequelize.define('EstimationApplication', {
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
        },
        Name: {
            type: DataTypes.STRING(4000),
        },
        col1: {
            type: DataTypes.STRING,
        }
        , col2: {
            type: DataTypes.STRING,
        }
        , Fcol3: {
            type: DataTypes.STRING(4000),
        },
        A1col1: {
            type: DataTypes.STRING,
        }
        , A1col2: {
            type: DataTypes.STRING,
        }
        , A1Fcol3: {
            type: DataTypes.STRING,
        },
        A2col1: {
            type: DataTypes.STRING,
        }
        , A2col2: {
            type: DataTypes.STRING,
        }
        , A2Fcol3: {
            type: DataTypes.STRING,
        },
        A3col1: {
            type: DataTypes.STRING,
        }
        , A3col2: {
            type: DataTypes.STRING,
        },
        A3Fcol3: {
            type: DataTypes.STRING,
        },
        A4col1: {
            type: DataTypes.STRING,
        },
        A4col2: {
            type: DataTypes.STRING,
        },
        A4Fcol3: {
            type: DataTypes.STRING,
        },
        A5col1: {
            type: DataTypes.STRING,
        },
        A5col2: {
            type: DataTypes.STRING,
        },
        A5Fcol3: {
            type: DataTypes.STRING,
        },
        A6col1: {
            type: DataTypes.STRING,
            field: 'A6col1'
        }
        , A6col2: {
            type: DataTypes.STRING,
            field: 'A6col2'
        }
        , A6Fcol3: {
            type: DataTypes.STRING,
            field: 'A6Fcol3'
        },
        A7col1: {
            type: DataTypes.STRING,
            field: 'A7col1'
        }
        , A7col2: {
            type: DataTypes.STRING,
            field: 'A7col2'
        }
        , A7Fcol3: {
            type: DataTypes.STRING,
            field: 'A7Fcol3'
        },
        A8col1: {
            type: DataTypes.STRING,
        },
        A8col2: {
            type: DataTypes.STRING,
        },
        A8Fcol3: {
            type: DataTypes.STRING,
        }
        ,
        A9col1: {
            type: DataTypes.STRING,
        },
        A9col2: {
            type: DataTypes.STRING,
        },
        A9Fcol3: {
            type: DataTypes.STRING,
        }
        ,
        A10col1: {
            type: DataTypes.STRING,
        },
        A10col2: {
            type: DataTypes.STRING,
        },
        A10Fcol3: {
            type: DataTypes.STRING,
        }

        , RowId: {
            type: DataTypes.STRING,
            field: 'RowId'
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
            tableName: 'TBL_EstimationApplication'
        });
    return EstimationApplication;
};