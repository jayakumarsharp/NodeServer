"use strict";
var fs = require("fs");
var path = require('path')
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || "development";
var lodash = require('lodash');
var config = require(__dirname + "/../config/config.json")[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};

fs.readdirSync(__dirname).filter(function (file) {
    return (file.indexOf(".") !== 0) && (file != "index.js");
}).forEach(function (file) {
    console.log("Loading File " + file);
    var model = sequelize["import"](path.join(__dirname, file));
    console.log("Model Name " + model.name + ' Model ' + model);
    db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});
module.exports =  lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);