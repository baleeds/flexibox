var exec = require('child_process').exec;
var async = require('async');

//Startup the server for testing.
require('../server');

var config = require('../config');
var Users = require('../app/common/models/users');
var Projects = require('../app/common/models/projects');

var projectsData = require('./data/projects.json');
var userData = require('./data/users.json');

var dropCollections = function(callback){
    async.waterfall([
        function(callback){Projects.remove({}, callback)},
        function(err, callback){Users.remove({}, callback)}
    ], function(){callback(null)});
};

var addCollection = function( callback ){
    var json2Mongoose = function(obj){
        if(typeof obj === 'object' && obj.hasOwnProperty('$oid') ) {
            return obj['$oid'];
        }
        for(var e in obj){
            if(!obj.hasOwnProperty(e)){
                continue;
            }
            if(typeof obj[e] === 'object' ) {
                obj[e] = json2Mongoose(obj[e]);
            }
        }
        return obj;
    };
    async.waterfall([
        function(callback){
            async.map(projectsData, function(obj, callback){
                    obj = json2Mongoose(obj, 0);
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
            async.map(userData, function(obj, callback){
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
        callback(null);
    });
};

module.exports = {
    URL : "http://" + config.server.host + ":" + config.server.port + "/",
    dropCollections : dropCollections,
    addCollections : addCollection,
    loadTestData : function(callback){
        async.waterfall([
            dropCollections,
            addCollection
        ], function(){
            if(callback) {
                callback();
            }
        })
    }
};
