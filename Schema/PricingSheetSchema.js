"use strict";
//Opportunities
module.exports = function (sequelize, DataTypes) {
    var PRICESHEET = sequelize.define('PRICESHEET', {
        Id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'Id'
        },
        RowId: {
            type: DataTypes.INTEGER,
            field: 'RowId'
        },
        OppId: {
            type: DataTypes.STRING,
            field: 'OppId'
        },
        OemId: {
            type: DataTypes.INTEGER,
            field: 'OemId'
        },
        Component: {
            type: DataTypes.STRING,
            field: 'Component'
        },
        ComponenttypeId: {
            type: DataTypes.INTEGER,
            field: 'ComponenttypeId'
        },
        PricetypeId: {
            type: DataTypes.INTEGER,
            field: 'PricetypeId'
        },
        LegalEntityId: {
            type: DataTypes.INTEGER,
            field: 'LegalEntityId'
        },
        CurrencyId: {
            type: DataTypes.INTEGER,
            field: 'CurrencyId'
        },
        ProductId: {
            type: DataTypes.INTEGER,
            field: 'ProductId'
        },
        Cyear1: {
            type: DataTypes.STRING,
            field: 'Cyear1'
        },
        Cyear2: {
            type: DataTypes.STRING,
            field: 'Cyear2'
        },
        Cyear3: {
            type: DataTypes.STRING,
            field: 'Cyear3'
        },
        Cyear4: {
            type: DataTypes.STRING,
            field: 'Cyear4'
        },
        Cyear5: {
            type: DataTypes.STRING,
            field: 'Cyear5'
        },
        Vyear1: {
            type: DataTypes.STRING,
            field: 'Vyear1'
        },
        Vyear2: {
            type: DataTypes.STRING,
            field: 'Vyear2'
        },
        Vyear3: {
            type: DataTypes.STRING,
            field: 'Vyear3'
        },
        Vyear4: {
            type: DataTypes.STRING,
            field: 'Vyear4'
        },
        Vyear5: {
            type: DataTypes.STRING,
            field: 'Vyear5'
        },
        Lyear1: {
            type: DataTypes.STRING,
            field: 'Lyear1'
        },
        Lyear2: {
            type: DataTypes.STRING,
            field: 'Lyear2'
        },
        Lyear3: {
            type: DataTypes.STRING,
            field: 'Lyear3'
        },
        Lyear4: {
            type: DataTypes.STRING,
            field: 'Lyear4'
        },
        Lyear5: {
            type: DataTypes.STRING,
            field: 'Lyear5'
        },

        Oyear1: {
            type: DataTypes.STRING,
            field: 'Oyear1'
        },
        Oyear2: {
            type: DataTypes.STRING,
            field: 'Oyear2'
        },
        Oyear3: {
            type: DataTypes.STRING,
            field: 'Oyear3'
        },
        Oyear4: {
            type: DataTypes.STRING,
            field: 'Oyear4'
        },
        Oyear5: {
            type: DataTypes.STRING,
            field: 'Oyear5'
        },

        Syear1: {
            type: DataTypes.STRING,
            field: 'Syear1'
        },
        Syear2: {
            type: DataTypes.STRING,
            field: 'Syear2'
        },
        Syear3: {
            type: DataTypes.STRING,
            field: 'Syear3'
        },
        Syear4: {
            type: DataTypes.STRING,
            field: 'Syear4'
        },
        Syear5: {
            type: DataTypes.STRING,
            field: 'Syear5'
        },
        STotal: {
            type: DataTypes.STRING,
            field: 'STotal'
        },
        VTotal: {
            type: DataTypes.STRING,
            field: 'VTotal'
        },
        OTotal: {
            type: DataTypes.STRING,
            field: 'OTotal'
        },
        CTotal: {
            type: DataTypes.STRING,
            field: 'CTotal'
        },
        LTotal: {
            type: DataTypes.STRING,
            field: 'LTotal'
        },
        forvendordiscount: {
            type: DataTypes.STRING,
            field: 'forvendordiscount'
        },
        distmarginpercent: {
            type: DataTypes.STRING,
            field: 'distmarginpercent'
        },
        distdiscount: {
            type: DataTypes.STRING,
            field: 'distdiscount'
        },
        marginpercent: {
            type: DataTypes.STRING,
            field: 'marginpercent'
        },
        customerdiscount: {
            type: DataTypes.STRING,
            field: 'customerdiscount'
        },
        lob: {
            type: DataTypes.INTEGER,
            field: 'lob'
        },
        Dutytax1: {
            type: DataTypes.STRING,
            field: 'Dutytax1'
        },
        Dutytax2: {
            type: DataTypes.STRING,
            field: 'Dutytax2'
        },
        Dutytax3: {
            type: DataTypes.STRING,
            field: 'Dutytax3'
        },

        DTyear1: {
            type: DataTypes.STRING,
            field: 'DTyear1'
        },
        DTyear2: {
            type: DataTypes.STRING,
            field: 'DTyear2'
        },
        DTyear3: {
            type: DataTypes.STRING,
            field: 'DTyear3'
        },
        DTyear4: {
            type: DataTypes.STRING,
            field: 'DTyear4'
        },
        DTyear5: {
            type: DataTypes.STRING,
            field: 'DTyear5'
        },
        DTTotal: {
            type: DataTypes.STRING,
            field: 'DTTotal'
        },
        FCUyear1: {
            type: DataTypes.STRING,
            field: 'FCUyear1'
        },
        FCUyear2: {
            type: DataTypes.STRING,
            field: 'FCUyear2'
        },
        FCUyear3: {
            type: DataTypes.STRING,
            field: 'FCUyear3'
        },
        FCUyear4: {
            type: DataTypes.STRING,
            field: 'FCUyear4'
        },
        FCUyear5: {
            type: DataTypes.STRING,
            field: 'FCUyear5'
        },
        FCUTotal: {
            type: DataTypes.STRING,
            field: 'FCUTotal'
        },

        ConversionRate: {
            type: DataTypes.STRING,
            field: 'ConversionRate'
        },
        FCLyear1: {
            type: DataTypes.STRING,
            field: 'FCLyear1'
        },
        FCLyear2: {
            type: DataTypes.STRING,
            field: 'FCLyear2'
        },
        FCLyear3: {
            type: DataTypes.STRING,
            field: 'FCLyear3'
        },
        FCLyear4: {
            type: DataTypes.STRING,
            field: 'FCLyear4'
        },
        FCLyear5: {
            type: DataTypes.STRING,
            field: 'FCLyear5'
        },
        FCLTotal: {
            type: DataTypes.STRING,
            field: 'FCLTotal'
        },

        FDLyear1: {
            type: DataTypes.STRING,
            field: 'FDLyear1'
        },
        FDLyear2: {
            type: DataTypes.STRING,
            field: 'FDLyear2'
        },
        FDLyear3: {
            type: DataTypes.STRING,
            field: 'FDLyear3'
        },
        FDLyear4: {
            type: DataTypes.STRING,
            field: 'FDLyear4'
        },
        FDLyear5: {
            type: DataTypes.STRING,
            field: 'FDLyear5'
        },
        FDLTotal: {
            type: DataTypes.STRING,
            field: 'FDLTotal'
        },

        FWDLyear1: {
            type: DataTypes.STRING,
            field: 'FWDLyear1'
        },
        FWDLyear2: {
            type: DataTypes.STRING,
            field: 'FWDLyear2'
        },
        FWDLyear3: {
            type: DataTypes.STRING,
            field: 'FWDLyear3'
        },
        FWDLyear4: {
            type: DataTypes.STRING,
            field: 'FWDLyear4'
        },
        FWDLyear5: {
            type: DataTypes.STRING,
            field: 'FWDLyear5'
        },
        FWDLTotal: {
            type: DataTypes.STRING,
            field: 'FWDLTotal'
        },

        FSLyear1: {
            type: DataTypes.STRING,
            field: 'FSLyear1'
        },
        FSLyear2: {
            type: DataTypes.STRING,
            field: 'FSLyear2'
        },
        FSLyear3: {
            type: DataTypes.STRING,
            field: 'FSLyear3'
        },
        FSLyear4: {
            type: DataTypes.STRING,
            field: 'FSLyear4'
        },
        FSLyear5: {
            type: DataTypes.STRING,
            field: 'FSLyear5'
        },
        FSLTotal: {
            type: DataTypes.STRING,
            field: 'FSLTotal'
        },

        FVLyear1: {
            type: DataTypes.STRING,
            field: 'FVLyear1'
        },
        FVLyear2: {
            type: DataTypes.STRING,
            field: 'FVLyear2'
        },
        FVLyear3: {
            type: DataTypes.STRING,
            field: 'FVLyear3'
        },
        FVLyear4: {
            type: DataTypes.STRING,
            field: 'FVLyear4'
        },
        FVLyear5: {
            type: DataTypes.STRING,
            field: 'FVLyear5'
        },
        FVLTotal: {
            type: DataTypes.STRING,
            field: 'FVLTotal'
        },
        PriceSheetGroupId: {
            type: DataTypes.INTEGER,
            field: 'PriceSheetGroupId'
        },
        CreatedOn: {
            type: DataTypes.DATE,
            field: 'CreatedOn'

        },
        IsManual: {
            type: DataTypes.STRING,
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
                tableName: 'TBL_PRICESHEET'
            });
    return PRICESHEET;
};