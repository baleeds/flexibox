/**
 * Created by dfperry on 2/13/2015.
 */
var async = require('async');

var User = require('../../app/common/models/users');
module.exports = {

    updateProjects: function (user, projID, callback) {
        User.findById(user._id, function (err, user) {
            if (err) {
                callback(err);
            } else {
                // upddate Project
                user.projectsVisible = user.projectsVisible.concat(projID);
                // save the user
                user.save(function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, user);
                    }
                });
            }

        })
    },
    deleteProjects: function (projID, callback) {
        User.find({projectsVisible: projID}, function (err, users) {
            var vals = [];
            for (var i = 0; i < users.length; i++) {
                vals.push(i);
            }
            async.map(vals, function (i) {
                var idx = users[i].projectsVisible.indexOf(projID);
                users[i].projectsVisible.splice(idx, 1);
                users[i].save(function (err) {
                    if (err)
                        callback(err);
                })
            }, callback);
        });

    },
    userSearch: function (str, callback) {
        console.log("String: " + (!str));
        if (!str) {
            callback(null, []);
        } else {
            User.find({$or: [{"name": {$regex: "^" + str}}, {"local.email": {$regex: "^" + str}}]}, function (err, users) {
                if (err) {
                    callback(err);
                }
                callback(null, users);
            })
        }
    }
};