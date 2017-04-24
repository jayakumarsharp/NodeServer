'use strict';

module.exports = function (sequelize,DataTypes) {
    var Role = sequelize.define('Role', {
        //RoleID: {
        //    type: DataTypes.INTEGER,
        //    autoIncrement: true,
        //    field: 'RoleID'
        //},
        RoleName: {
            type: DataTypes.STRING,
            field: 'RoleName'
        },
        CreatedDate: {
            type: DataTypes.DATE,
            field: 'CreatedDate'
        },
        CreatedBy: {
            type: DataTypes.STRING,
            field: 'CreatedBy'
        },
        ModifiedDate: {
            type: DataTypes.DATE,
            field: 'ModifiedDate'
        },
        ModifiedBy: {
            type: DataTypes.STRING,
            field: 'ModifiedBy'
        }
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
        tableName: 'TBL_ROLE_MASTER'
    });
    return Role;
};