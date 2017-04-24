
module.exports = function (sequelize, DataTypes) {
    var DaysheetResourceDistribution = sequelize.define('DaysheetResourceDistribution', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        SDLCStage: {
            type: DataTypes.STRING,
        },
        BUOnsiteL1: {
            type: DataTypes.STRING,
        }, BUOnsiteL2: {
            type: DataTypes.STRING,
        }, BURemoteL1: {
            type: DataTypes.STRING,
        }, BURemoteL2: {
            type: DataTypes.STRING,
        }, CDOOnsiteL1: {
            type: DataTypes.STRING,
        }, CDOOnsiteL2: {
            type: DataTypes.STRING,
        },
        CDORemoteL1: {
            type: DataTypes.STRING,
        }, CDORemoteL2: {
            type: DataTypes.STRING,
        }, Total: {
            type: DataTypes.STRING,
        },
        DaySheetGroupId: {
            type: DataTypes.STRING,
        },

    },
        {
            // don't add the timestamp attributes (updatedAt, createdAt)
            timestamps: false,
            // don't delete database entries but set the newly added attribute deletedAt
            // to the current date (when deletion was done). paranoid will only work if
            // timestamps are enabled
            paranoid: true,
            // don't use camelcase for automatically added attributes but underscore style
            // so updatedAt will be updated_at
            underscored: true,
            // disable the modification of tablenames; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: true,
            // define the table's name
            tableName: 'TBL_DaysheetResourceDistribution'
        });
    return DaysheetResourceDistribution;
};;