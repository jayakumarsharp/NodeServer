module.exports = function (sequelize, DataTypes) {
    var Resource = sequelize.define('Resource', {
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
        LOB: {
            type: DataTypes.INTEGER,
        },
        SBU: {
            type: DataTypes.INTEGER,
        },
        Region: {
            type: DataTypes.INTEGER,
        },
        ResourceType: {
            type: DataTypes.STRING,
        },
        Experience: {
            type: DataTypes.INTEGER,
        },
        Unit: {
            type: DataTypes.STRING,
        },
        UnitRate: {
            type: DataTypes.INTEGER,
        },        
        UnitCount1: {
            type: DataTypes.INTEGER,
        },
        UnitCount2: {
            type: DataTypes.INTEGER,
        },
        UnitCount3: {
            type: DataTypes.INTEGER,
        },
        UnitCount4: {
            type: DataTypes.INTEGER,
        },
        UnitCount5: {
            type: DataTypes.INTEGER,
        },
        HeadCount1: {
            type: DataTypes.INTEGER,
        },
        HeadCount2: {
            type: DataTypes.INTEGER,
        },
        HeadCount3: {
            type: DataTypes.INTEGER,
        },
        HeadCount4: {
            type: DataTypes.INTEGER,
        },
        HeadCount5: {
            type: DataTypes.INTEGER,
        },
        TotalYearCost: {
            type: DataTypes.STRING,
        },
        Year1: {
            type: DataTypes.STRING,
        },
        Year2: {
            type: DataTypes.STRING,
        },
        Year3: {
            type: DataTypes.STRING,
        },
        Year4: {
            type: DataTypes.STRING,
        },
        Year5: {
            type: DataTypes.STRING,
        },
        Penalty:  {
            type: DataTypes.STRING,
        },
        TotalPenalty: {
            type: DataTypes.STRING,
        },
        PenaltyYear1: {
            type: DataTypes.STRING,
        },
        PenaltyYear2: {
            type: DataTypes.STRING,
        },
        PenaltyYear3: {
            type: DataTypes.STRING,
        },
        PenaltyYear4: {
            type: DataTypes.STRING,
        },
        PenaltyYear5: {
            type: DataTypes.STRING,
        },
        Overhead:  {
            type: DataTypes.STRING,
        },
        TotalOverhead: {
            type: DataTypes.STRING,
        },
        OverheadYear1: {
            type: DataTypes.STRING,
        },
        OverheadYear2: {
            type: DataTypes.STRING,
        },
        OverheadYear3: {
            type: DataTypes.STRING,
        },
        OverheadYear4: {
            type: DataTypes.STRING,
        },
        OverheadYear5: {
            type: DataTypes.STRING,
        },
        Margin:  {
            type: DataTypes.STRING,
        },
        TotalMargin: {
            type: DataTypes.STRING,
        },
        MarginYear1: {
            type: DataTypes.STRING,
        },
        MarginYear2: {
            type: DataTypes.STRING,
        },
        MarginYear3: {
            type: DataTypes.STRING,
        },
        MarginYear4: {
            type: DataTypes.STRING,
        },
        MarginYear5: {
            type: DataTypes.STRING,
        },
        GroupId: {
            type: DataTypes.INTEGER,
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
            tableName: 'TBL_Resource'
        });
    return Resource;
};