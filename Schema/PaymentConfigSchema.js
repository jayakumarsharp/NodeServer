module.exports = function (sequelize, DataTypes) {
    var PAYMENTCONFIG = sequelize.define('PAYMENTCONFIG', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        BU:{
            type: DataTypes.INTEGER,
            field: 'BU'
        },
        Region:{
            type: DataTypes.INTEGER,
            field: 'Region'
        },
        PaymentCode: {
            type: DataTypes.STRING,
            field: 'PaymentCode'
        },
        Iyear1: {
            type: DataTypes.INTEGER,
            field: 'Iyear1',
           // default: 0
        },
        Iyear2: {
            type: DataTypes.INTEGER,
            field: 'Iyear2',
           // default: 0
        },
        Iyear3: {
            type: DataTypes.INTEGER,
            field: 'Iyear3',
          //  default: 0
        },
        Iyear4: {
            type: DataTypes.INTEGER,
            field: 'Iyear4',
           // default: 0
        },
        Iyear5: {
            type: DataTypes.INTEGER,
            field: 'Iyear5',
            //default: 0
        },
        paymentTerms: {
            type: DataTypes.STRING,
            field: 'paymentTerms'
        },
        percentageTotal: {
            type: DataTypes.INTEGER,
            field: 'percentageTotal'
        },
        OEMHWandSW: {
            type: DataTypes.STRING,
            field: 'OEMHWandSW'
        },
        OEMServices: {
            type: DataTypes.STRING,
            field: 'OEMServices'
        },
        OEMPS: {
            type: DataTypes.STRING,
            field: 'OEMPS'
        },
        OEMOther: {
            type: DataTypes.STRING,
            field: 'OEMOther'
        },
        SERVSW: {
            type: DataTypes.STRING,
            field: 'SERVSW'
        },
        SERVServices: {
            type: DataTypes.STRING,
            field: 'SERVServices'
        },
        SERVPS: {
            type: DataTypes.STRING,
            field: 'SERVPS'
        },
        SERVConsulting: {
            type: DataTypes.STRING,
            field: 'SERVConsulting'
        },
        SERVCare: {
            type: DataTypes.STRING,
            field: 'SERVCare'
        },
        SERVOther: {
            type: DataTypes.STRING,
            field: 'SERVOther'
        },
        SERVResource: {
            type: DataTypes.STRING,
            field: 'SERVResource'
        },
         SERVTM: {
            type: DataTypes.STRING,
            field: 'SERVTM'
        },
        SERVHosted: {
            type: DataTypes.STRING,
            field: 'SERVHosted'
        }
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
          tableName: 'TBL_PAYMENT_DEFAULTCONFIG'
      });
    return PAYMENTCONFIG;
};;