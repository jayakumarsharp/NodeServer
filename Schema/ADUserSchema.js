"use strict";
//Users
module.exports = function (sequelize,DataTypes) {
    var ADUser = sequelize.define('ADUser', {
        userId: {
            primaryKey:true,
            type: DataTypes.STRING,
            field: 'Userid'            
        },
        UserName: {
            type: DataTypes.STRING,
            field: 'UserName'
        },       
        EmailId: {
            type: DataTypes.STRING,
            field: 'EmailId'
        },
        Street: {
            type: DataTypes.STRING,
            field: 'st'
        },
        PostalCode: {
            type: DataTypes.STRING,
            field: 'postalCode'
        },
        DeliveryOffice: {
            type: DataTypes.STRING,
            field: 'physicalDeliveryOfficeName'
        },
        TelephoneNumber: {
            type: DataTypes.STRING,
            field: 'telephoneNumber'
        },
        Department: {
            type: DataTypes.STRING,
            field: 'department'
        },
        StreetAddress: {
            type: DataTypes.STRING,
            field: 'streetAddress'
        },
        MobileNumber: {
            type: DataTypes.STRING,
            field: 'MobileNumber'
        },
        Manager: {
            type: DataTypes.STRING,
            field: 'manager'
        },
        HomeNumber: {
            type: DataTypes.STRING,
            field: 'homePhone'
        },
        EmployeeID: {
            type: DataTypes.STRING,
            field: 'description'
        },
    },{
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
        tableName: 'TBL_ADUSER_MASTER'
    });
    return ADUser;
};