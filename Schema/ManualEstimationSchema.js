module.exports = function (sequelize, DataTypes) {
    var ManualEstimation = sequelize.define('ManualEstimation', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        RowNo: {
            type: DataTypes.INTEGER,
        },
        OppId: {
            type: DataTypes.STRING,

        },
        Description: {
            type: DataTypes.STRING,
        },

        TypeId: {
            type: DataTypes.INTEGER,

        },
        REQ: {
            type: DataTypes.STRING,
        },

        Design: {
            type: DataTypes.STRING,
        },
        DevTest: {
            type: DataTypes.STRING,
        },
        SysTest: {
            type: DataTypes.STRING,
        },
        IMPL: {
            type: DataTypes.STRING,
        },
        UAT: {
            type: DataTypes.STRING,
        },
        PROD: {
            type: DataTypes.STRING,

        },
        TRAIN: {
            type: DataTypes.STRING,

        },
        MANUAL: {
            type: DataTypes.STRING,
        },
        OH: {
            type: DataTypes.STRING,

        },
        SQA: {
            type: DataTypes.STRING,
        },
        GroupId: {
            type: DataTypes.STRING,
            field: 'GroupId'
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
            tableName: 'TBL_ManualEstimation'
        });
    return ManualEstimation;
};;