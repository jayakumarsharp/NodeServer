module.exports = function (sequelize, DataTypes) {
    var GROSSMARGIN = sequelize.define('GROSSMARGIN', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        MAINTANACEvalue: {
            type: DataTypes.STRING,
            field: 'MAINTANACEvalue'
        },
        IPvalue: {
            type: DataTypes.STRING,
            field: 'IPvalue'
        },

        HOSTEDvalue: {
            type: DataTypes.STRING,
            field: 'HOSTEDvalue'
        },
        PSvalue: {
            type: DataTypes.STRING,
            field: 'PSvalue'
        },
        RESOURCINGvalue: {
            type: DataTypes.STRING,
            field: 'RESOURCINGvalue'
        },
        TRADINGvalue: {
            type: DataTypes.STRING,
            field: 'TRADINGvalue'
        },
        CONSULTINGvalue: {
            type: DataTypes.STRING,
            field: 'CONSULTINGvalue'
        },
        MAINTANACE: {
            type: DataTypes.STRING,
            field: 'MAINTANACE'
        },
        IP: {
            type: DataTypes.STRING,
            field: 'IP'
        },
        HOSTED: {
            type: DataTypes.STRING,
            field: 'HOSTED'
        },
        PS: {
            type: DataTypes.STRING,
            field: 'PS'
        },
        RESOURCING: {
            type: DataTypes.STRING,
            field: 'RESOURCING'
        },
        TRADING: {
            type: DataTypes.STRING,
            field: 'TRADING'
        },
        CONSULTING: {
            type: DataTypes.STRING,
            field: 'CONSULTING'
        },
        MarginGroupId: {
            type: DataTypes.INTEGER,
            field: 'MarginGroupId'
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
            tableName: 'TBL_GROSSMARGIN'
        });
    return GROSSMARGIN;
};;