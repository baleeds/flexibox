/**
 * Created by dfperry on 2/13/2015.
 */
var User = require('../../app/common/models/users');
module.exports= {

    updateProjects: function(user , projID, callback) {
        User.findById(user._id, function (err, user) {
            if (err)
                console.log(err);

            // upddate Project
            user.projectsVisible = user.projectsVisible.concat(projID);
            // save the user
            user.save(function (err) {
                if (err)
                    console.log(err);

                callback(user);
            });

        })
    },
    deleteProjects: function(projID, callback){
        User.find({projectsVisible:projID}, function(err, users){
            var idx;
            for(var i=0; i<users.length;i++){
                idx = users[i].projectsVisible.indexOf(projID);
                users[i].projectsVisible.splice(idx, 1);
                users[i].save(function(err){
                    if(err)
                        console.log(err);
                })
            }
        });
        callback();
    },
    userSearch: function(str, callback){
        User.find({$or : [{"name":{$regex:"^" + str}}, {"local.email":{$regex: "^" + str}}]}, function(err, users){
            if(err){
                callback(null);
            }
            callback(users);
        })
    }
};