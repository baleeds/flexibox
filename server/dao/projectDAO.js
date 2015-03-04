/**
 * Created by dfperry on 2/13/2015.
 */
var Project = require('../../app/common/models/projects');

module.exports = {
    getMyProjects: function (user, callback) {
        if (user.role == 'System Admin') {
            Project
                .find()
                .select('name description setsURL entryURL tags commenters')
                .exec(function (err, projects) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, projects);
                    }
                });
        } else {
            Project
                .find({"_id": {$in: user.projectsVisible}})
                .select('name description setsURL entryURL tags commenters')
                .exec(function (err, projects) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, projects);
                    }
                });
        }
    }
};