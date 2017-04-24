"use strict";
//Opportunities
module.exports = function (sequelize,DataTypes) {
    var Opp = sequelize.define('Opp', {
        OppId: {
            primaryKey:true,
            type: DataTypes.STRING,
            field: 'OppId'            
        },
        Analysis: {
            type: DataTypes.STRING,
            field: 'Analysis'
        },
        OppInfo:{
          type:DataTypes.STRING,
          field:'OppInfo'  
        },
        Pricing: {
            type: DataTypes.STRING,
            field: 'Pricing'
        },
        Estimation: {
            type: DataTypes.STRING,
            field: 'Estimation'
        },
        ServCare: {
            type: DataTypes.STRING,
            field: 'ServCare'
        },
        Resourcing: {
            type: DataTypes.STRING,
            field: 'Resourcing'
        },
        ServionIP: {
            type: DataTypes.STRING,
            field: 'ServionIP'
        },
        SBU: {
            type: DataTypes.STRING,
            field: 'SBU'
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
        tableName: 'TBL_OPP_MASTER'
    });
    return Opp;
};