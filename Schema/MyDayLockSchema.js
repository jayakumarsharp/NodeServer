"use strict";
//UserRoles
module.exports = function (sequelize, DataTypes) {
    var MyDayLock = sequelize.define('MyDayLock', {
        Id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id',
            autoIncrement: true
        },
        LockDate: {
            type: DataTypes.DATE,
            field: 'LockDate'
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
        tableName: 'TBL_MyDayLock',
        //classMethods: {
        //    associate: function (models) {
        //        CountryRegionMap.belongsTo(models.Country, { foreignKey: 'CountryId', targetKey: 'Id' });
                
        //    }
        //}
    });

    return MyDayLock;
};