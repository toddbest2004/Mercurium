'use strict';

var fs        = require('fs');
var path      = require('path');
var mongoose  = require('mongoose');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
// var config    = require(__dirname + '/../config/config.json')[env];

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/mercurium')
var db = mongoose.connection


db.on('error', function(error){console.log(error)})
db.once('open', function(){
	console.log('open')	
})

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    var model = require(path.join(__dirname, file));
    db[model.modelName] = model;
  });

module.exports = db;
