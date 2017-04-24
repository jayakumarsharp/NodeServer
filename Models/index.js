"use strict";
var fs = require("fs");
var path = require('path')
var dbModel = {};

fs.readdirSync(__dirname).filter(function (file) {
    return (file.indexOf(".") !== 0) && (file != "index.js");
}).forEach(function (file) {
    console.log("Loading File " + file);
    var model = (path.join(__dirname, file));
    console.log("Model Name " + path.parse(file).name + ' Model ' + model);
    dbModel[path.parse(file).name] = model;
});
module.exports = dbModel