"use strict";
//Users
module.exports = function (sequelize,DataTypes) {
    var User = sequelize.define('User', {
        userId: {
            primaryKey:true,
            type: DataTypes.STRING,
            field: 'Userid'            
        },
        UserName: {
            type: DataTypes.STRING,
            field: 'UserName'
        },
        TypeId: {
            type: DataTypes.STRING,
            field: 'TypeId'
        },
        RoleId: {
            type: DataTypes.STRING,
            field: 'RoleId'
        },
        UserImage:{
          type:DataTypes.BLOB,
          field:'UserImage'  
        },
        Password: {
            type: DataTypes.STRING,
            field: 'Password'
        },
        EmailId: {
            type: DataTypes.STRING,
            field: 'EmailId'
        },
        MobileNumber: {
            type: DataTypes.STRING,
            field: 'MobileNumber'
        },
        CustomData: {
            type: DataTypes.STRING,
            field: 'CustomData'
        },
        Status: {
            type: DataTypes.STRING,
            field: 'Status'
        },
        UserExpiryDate: {
            type: DataTypes.DATE,
            field: 'UserExpiryDate'
        },
        PasswordExpiryDate: {
            type: DataTypes.DATE,
            field: 'PasswordExpiryDate'
        },
        UserBlockDate: {
            type: DataTypes.DATE,
            field: 'UserBlockDate'
        },
        AttemptedTries: {
            type: DataTypes.INTEGER,
            field: 'AttemptTries'
        },        
        LastAuthenticatedDate: {
            type: DataTypes.DATE,
            field: 'LastAuthenticatedDate'
        },
        LastUsedDate: {
            type: DataTypes.DATE,
            field: 'LastUsedDate'
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
        },
        ApprovedDate: {
            type: DataTypes.DATE,
            field: 'ApprovedDate'
        },
        Approvedby : {
            type: DataTypes.STRING,
            field: 'Approvedby'
        },
        MakerComment: {
            type: DataTypes.STRING,
            field: 'MakerComment'
        },
        CheckerComment: {
            type: DataTypes.STRING,
            field: 'CheckerComment'
        },       
        IsADUser: {
            type: DataTypes.STRING,
            field: 'IsADUser'
        },
        BillingId: {
            type: DataTypes.INTEGER,
            field: 'BillingId'
        },   
        BaseSkillId: {
            type: DataTypes.INTEGER,
            field: 'BaseSkillId'
        }, 
        FirstWorkingDate: {
            type: DataTypes.DATE,
            field: 'FirstWorkingDate'
        },
        LastWorkingDate: {
            type: DataTypes.DATE,
            field: 'LastWorkingDate'
        }, 
        LocationId: {
            type: DataTypes.INTEGER,
            field: 'LocationId'
        }  
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
        tableName: 'TBL_USER_MASTER'
    });
    return User;
};