var exec = require('child_process').exec;
var async = require('async');
var mongoose = require('mongoose');

var config = require('../config');
var Users = require('../app/common/models/users');
var Projects = require('../app/common/models/projects');

var projectsData = require('./data/projects.json');
var userData = require('./data/users.json');

mongoose.connect('mongodb://' + config.server.host + '/flexibox');

var exports = {
    dropCollections : function(callback){
        async.waterfall([
            function(callback){console.log("removing projects");Projects.remove({}, callback)},
            function(err, callback){console.log("removing users"); Users.remove({}, callback)}
        ], callback);
    },
    addCollections : function( callback ){
        var json2Mongoose = function(obj){
            if(typeof obj === 'object' && obj.hasOwnProperty("_id") ) {
                obj._id = mongoose.Types.ObjectId(obj['$oid']);
                obj = json2Mongoose(obj);
            }
            for(var e in obj){
                if(typeof obj[e] === 'object' && obj[e].hasOwnProperty("_id") ) {
                    obj[e]._id = mongoose.Types.ObjectId(obj[e]['$oid']);
                    obj[e] = json2Mongoose(obj[e]);
                }
            }
            return obj;
        };
        async.waterfall([
            function(callback){
                async.map(userData, function(obj, callback){
                        obj = json2Mongoose(obj);
                        var proj = new Projects(obj);
                        proj.save(function(err){
                            if(err){
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    },
                    function(err){
                        if(err){
                            throw new Error(err);
                        } else {
                            callback(null);
                        }
                    })
            },
            function(callback){
                async.map(projectsData, function(obj, callback){
                        obj = json2Mongoose(obj);
                        var user = new Users(obj);
                        user.save(function(err){
                            if(err){
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    },
                    function(err){
                        if(err){
                            throw new Error(err);
                        } else {
                            callback(null);
                        }
                    })
            }
        ], function(err){
            if(err){
                throw new Error("Error loading data!!!");
            }
            callback();
        })
    },
    URL : "http://" + config.server.host + ":" + config.server.port + "/"

};

console.log(userData);

exports.addCollections(function(err){
    console.log('dropped collections');
    mongoose.disconnect();
    mongoose.connection.close();
});
//exports.addCollections();
