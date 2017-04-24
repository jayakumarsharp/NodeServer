module.exports = function (sequelize, DataTypes) {
    var DAYSHEET = sequelize.define('DAYSHEET', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        Description: { type: DataTypes.STRING, },
        REQ: { type: DataTypes.STRING, },
        Design: { type: DataTypes.STRING, },
        DevTest: { type: DataTypes.STRING, },
        SysTest: { type: DataTypes.STRING, },
        IMPL: { type: DataTypes.STRING, },
        UAT: { type: DataTypes.STRING, },
        PROD: { type: DataTypes.STRING, },
        TRAIN: { type: DataTypes.STRING, },
        MANUAL: { type: DataTypes.STRING, },
        OH: { type: DataTypes.STRING, },
        SQA: { type: DataTypes.STRING, },
        PM: { type: DataTypes.STRING, },
        Product: {
            type: DataTypes.STRING,
        },
        Total: { type: DataTypes.STRING, },
        GridName: {
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
            tableName: 'TBL_DAYSHEET'
        });
    return DAYSHEET;
};;