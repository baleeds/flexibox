/**
 * Created by dfperry on 2/13/2015.
 */
var Project = require('../../app/common/models/projects');

module.exports = {
    getMyProjects: function (user, callback) {
        if (user.role == 'System Admin') {
            Project
                .find()
                .select('name description createdAt editedAt setsURL entryURL tags commenters')
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
                .select('name description createdAt editedAt setsURL entryURL tags commenters')
                .exec(function (err, projects) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, projects);
                    }
                });
        }
    },
    updateEditedAt: function(project_id){
      Project
          .findById(project_id, function(err, project){
              if (err)
                res.send(err);
              else{
                  project.editedAt = new Date().toISOString();
                  project.save(function(err){
                    if(err)
                        console.log(err)
                  });
              }

          }
          );
    },
    updatedSetEditedAt: function(project_id, set_id){
        Project.findById(project_id, function (err, project) {
            if (err)
                res.send(err);
            else {
                project.sets.id(set_id).editedAt = new Date().toISOString();
                project.save(function(err){
                    if (err){
                        console.log(err);
                    }
                });
            }
        });
    },
    updatePostEditedAt: function (project_id, set_id, post_id){
        Project.findById(project_id, function (err, project) {
            if (err)
                res.send(err);
            else {
                project.sets.id(set_id).posts.id(post_id).editedAt = new Date().toISOString();
                project.save(function(err){
                    if (err){
                        console.log(err);
                    }
                });
            }
        });
    }
};