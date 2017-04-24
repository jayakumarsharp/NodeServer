module.exports = function (sequelize, DataTypes) {
    var TandEPS = sequelize.define('TandEPS', {
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
        ManDays: {
            type: DataTypes.INTEGER,
        },
        ResourceCount: {
            type: DataTypes.INTEGER,
        },
        ChangeResourceCountTo: {
            type: DataTypes.INTEGER,
        },
        OnsitePercent: {
            type: DataTypes.INTEGER,
        },
        ChangeOnsitePercentTo: {
            type: DataTypes.INTEGER,
        },
        AvgTravel: {
            type: DataTypes.INTEGER,
        },             
        StaysOnsite: {
            type: DataTypes.STRING,
        },
        OnsiteBusinessDays: {
            type: DataTypes.INTEGER,
        },
        EffectiveBusinessDays: {
            type: DataTypes.INTEGER,
        },
        TravelManDays: {
            type: DataTypes.INTEGER,
        },       
        Visa: {
            type: DataTypes.INTEGER,
        },
        AirFare: {
            type: DataTypes.INTEGER,
        },
        Accomodation: {
            type: DataTypes.INTEGER,
        },
        PerDiem: {
            type: DataTypes.INTEGER,
        },        
        LocalConveyance: {
            type: DataTypes.INTEGER,
        },
        Misc: {
            type: DataTypes.INTEGER,
        },
        Total: {
            type: DataTypes.INTEGER,
        },
        GroupId: {
            type: DataTypes.INTEGER,
            field: 'GroupId'
        },
        EditDescription: {
            type: DataTypes.BOOLEAN,
            field: 'EditDescription'
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
            tableName: 'TBL_TandEPS'
        });
    return TandEPS;
};