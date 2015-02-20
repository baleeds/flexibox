/**
 * Created by dfperry on 2/13/2015.
 */
var Project = require('../../app/common/models/projects');

module.exports = {
    getMyProjects: function(user, callback){
        if (user.role == 'System Admin'){
            Project
                .find()
                .select('name description setsURL entryURL tags members')
                .exec(function (err, projects) {
                    if (err) {
                        console.log(err);
                    } else {
                        callback(projects);
                    }
                });
        }else {
            Project
                .find({"_id": {$in: user.projectsVisible}})
                .select('name description setsURL entryURL tags members')
                .exec(function (err, projects) {
                    if (err) {
                      console.log(err);
                    } else {
                        callback(projects);
                    }
                });
        }
    }
};