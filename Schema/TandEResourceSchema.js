module.exports = function (sequelize, DataTypes) {
    var TandEResource = sequelize.define('TandEResource', {
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
        ResourceCount1: {
            type: DataTypes.INTEGER,
        },
        ResourceCount2: {
            type: DataTypes.INTEGER,
        },
        ResourceCount3: {
            type: DataTypes.INTEGER,
        },
        ResourceCount4: {
            type: DataTypes.INTEGER,
        },
        ResourceCount5: {
            type: DataTypes.INTEGER,
        },
        ChangeResourceCountTo1: {
            type: DataTypes.INTEGER,
        },
        ChangeResourceCountTo2: {
            type: DataTypes.INTEGER,
        },
        ChangeResourceCountTo3: {
            type: DataTypes.INTEGER,
        },
        ChangeResourceCountTo4: {
            type: DataTypes.INTEGER,
        },
        ChangeResourceCountTo5: {
            type: DataTypes.INTEGER,
        },
        OnsitePercent1: {
            type: DataTypes.INTEGER,
        },
        OnsitePercent2: {
            type: DataTypes.INTEGER,
        },
        OnsitePercent3: {
            type: DataTypes.INTEGER,
        },
        OnsitePercent4: {
            type: DataTypes.INTEGER,
        },
        OnsitePercent5: {
            type: DataTypes.INTEGER,
        },
        AvgTravel1: {
            type: DataTypes.INTEGER,
        },
        AvgTravel2: {
            type: DataTypes.INTEGER,
        },
        AvgTravel3: {
            type: DataTypes.INTEGER,
        },
        AvgTravel4: {
            type: DataTypes.INTEGER,
        },
        AvgTravel5: {
            type: DataTypes.INTEGER,
        },
        OnsiteBusinessDays1: {
            type: DataTypes.INTEGER,
        },
        OnsiteBusinessDays2: {
            type: DataTypes.INTEGER,
        },
        OnsiteBusinessDays3: {
            type: DataTypes.INTEGER,
        },
        OnsiteBusinessDays4: {
            type: DataTypes.INTEGER,
        },
        OnsiteBusinessDays5: {
            type: DataTypes.INTEGER,
        },
        EffectiveBusinessDays1: {
            type: DataTypes.INTEGER,
        },
        EffectiveBusinessDays2: {
            type: DataTypes.INTEGER,
        },
        EffectiveBusinessDays3: {
            type: DataTypes.INTEGER,
        },
        EffectiveBusinessDays4: {
            type: DataTypes.INTEGER,
        },
        EffectiveBusinessDays5: {
            type: DataTypes.INTEGER,
        },
        TravelManDays1: {
            type: DataTypes.INTEGER,
        },
        TravelManDays2: {
            type: DataTypes.INTEGER,
        },
        TravelManDays3: {
            type: DataTypes.INTEGER,
        },
        TravelManDays4: {
            type: DataTypes.INTEGER,
        },
        TravelManDays5: {
            type: DataTypes.INTEGER,
        },
        Visa1: {
            type: DataTypes.INTEGER,
        },
        Visa2: {
            type: DataTypes.INTEGER,
        },
        Visa3: {
            type: DataTypes.INTEGER,
        },
        Visa4: {
            type: DataTypes.INTEGER,
        },
        Visa5: {
            type: DataTypes.INTEGER,
        },
        AirFare1: {
            type: DataTypes.INTEGER,
        },
        AirFare2: {
            type: DataTypes.INTEGER,
        },
        AirFare3: {
            type: DataTypes.INTEGER,
        },
        AirFare4: {
            type: DataTypes.INTEGER,
        },
        AirFare5: {
            type: DataTypes.INTEGER,
        },
        Accomodation1: {
            type: DataTypes.INTEGER,
        },
        Accomodation2: {
            type: DataTypes.INTEGER,
        },
        Accomodation3: {
            type: DataTypes.INTEGER,
        },
        Accomodation4: {
            type: DataTypes.INTEGER,
        },
        Accomodation5: {
            type: DataTypes.INTEGER,
        },
        PerDiem1: {
            type: DataTypes.INTEGER,
        },
        PerDiem2: {
            type: DataTypes.INTEGER,
        },
        PerDiem3: {
            type: DataTypes.INTEGER,
        },
        PerDiem4: {
            type: DataTypes.INTEGER,
        },
        PerDiem5: {
            type: DataTypes.INTEGER,
        },
        LocalConveyance1: {
            type: DataTypes.INTEGER,
        },
        LocalConveyance2: {
            type: DataTypes.INTEGER,
        },
        LocalConveyance3: {
            type: DataTypes.INTEGER,
        },
        LocalConveyance4: {
            type: DataTypes.INTEGER,
        },
        LocalConveyance5: {
            type: DataTypes.INTEGER,
        },
        Misc1: {
            type: DataTypes.INTEGER,
        },
        Misc2: {
            type: DataTypes.INTEGER,
        },
        Misc3: {
            type: DataTypes.INTEGER,
        },
        Misc4: {
            type: DataTypes.INTEGER,
        },
        Misc5: {
            type: DataTypes.INTEGER,
        },
        Total1: {
            type: DataTypes.INTEGER,
        },
        Total2: {
            type: DataTypes.INTEGER,
        },
        Total3: {
            type: DataTypes.INTEGER,
        },
        Total4: {
            type: DataTypes.INTEGER,
        },
        Total5: {
            type: DataTypes.INTEGER,
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
            tableName: 'TBL_TandEResource'
        });
    return TandEResource;
};