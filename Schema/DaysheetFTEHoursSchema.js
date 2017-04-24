module.exports = function (sequelize, DataTypes) {
    var DaysheetFTEHours = sequelize.define('DaysheetFTEHours', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        SDLCStage: {
            type: DataTypes.STRING,
        }, Tool: { type: DataTypes.STRING, },
        Manual: { type: DataTypes.STRING, },
        Extend: { type: DataTypes.STRING, },
        CalculatedEfforts: { type: DataTypes.STRING, },
        Total: {
            type: DataTypes.STRING,
        }, Change: {
            type: DataTypes.STRING,
        }, EffortAuthourize: {
            type: DataTypes.STRING,
        }, FTEHours: {
            type: DataTypes.STRING,
        }, Resources: {
            type: DataTypes.STRING,
        }, Days: {
            type: DataTypes.STRING,
        }, Daychange: {
            type: DataTypes.STRING,
        }, DaysAuthourize: {
            type: DataTypes.STRING,
        }, BusinessDays: {
            type: DataTypes.STRING,
        }, OnsitePercentage: {
            type: DataTypes.STRING,
        }, PrevvalueFTE: {
            type: DataTypes.STRING,
        }, PrevvalueBD: {
            type: DataTypes.STRING,
        }, FTEChangeStatus: {
            type: DataTypes.STRING,
        }, BDChangeStatus: {
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
            tableName: 'TBL_DaysheetFTEHours'
        });
    return DaysheetFTEHours;
};;