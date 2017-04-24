"use strict";
//UserRoles
module.exports = function (sequelize, DataTypes) {
    var MyDay = sequelize.define('MyDay', {
        TaskId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'TaskId',
            autoIncrement: true
        },
        EntryDate: {
            type: DataTypes.DATE,
            field: 'EntryDate',
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        WorkDate: {
            type: DataTypes.DATE,
            field: 'WorkDate'
        },
        OppId: {
            type: DataTypes.STRING,
            field: 'OppId'
        },
        OpportunityName: {
            type: DataTypes.STRING,
            field: 'OpportunityName'
        },
        SBU: {
            type: DataTypes.INTEGER,
            field: 'SBU'
        },
        TaskTypeId: {
            type: DataTypes.INTEGER,
            field: 'TaskTypeId'
        },
        hhDuration: {
            type: DataTypes.INTEGER,
            field: 'hhDuration'
        },
        mmDuration: {
            type: DataTypes.INTEGER,
            field: 'mmDuration'
        },
        Note: {
            type: DataTypes.STRING,
            field: 'Note'
        },
        UpdatedBy: {
            type: DataTypes.STRING,
            field: 'UpdatedBy'
        },
        RoleId: {
            type: DataTypes.INTEGER,
            field: 'RoleId'
        },  
        BillingId: {
            type: DataTypes.INTEGER,
            field: 'BillingId'
        },
        BaseSkillId: {
            type: DataTypes.INTEGER,
            field: 'BaseSkillId'
        },
        LocationId: {
            type: DataTypes.INTEGER,
            field: 'LocationId'
        },
        BillingSBU: {
            type: DataTypes.STRING,
            field: 'BillingSBU'
        },
        TotalMinutes: {
            type: DataTypes.INTEGER,
            field: 'TotalMinutes'
        }
    }, {
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
        // don't delete database entries but set the newly added attribute deletedAt
        // to the current date (when deletion was done). paranoid will only work if
        // timestamps are enabled,
        paranoid: false,
        // don't use camelcase for automatically added attributes but underscore style
        // so updatedAt will be updated_at
        underscored: true,
        // disable the modification of tablenames; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,
        // define the table's name
        tableName: 'TBL_MYDAY',
        //classMethods: {
        //    associate: function (models) {
        //        CountryRegionMap.belongsTo(models.Country, { foreignKey: 'CountryId', targetKey: 'Id' });
                
        //    }
        //}
    });

    return MyDay;
};