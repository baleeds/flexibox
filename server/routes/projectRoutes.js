var Project = require('../../app/common/models/projects');
var projectDAO = require('../dao/projectDAO');
var userDAO = require('../dao/userDAO');

module.exports = function(router, protect){

    // PROJECT ROUTES
    // ==========================================================================
    router.route('/projects')  // accessed at //<server>:<port>/api/projects
        .all(protect)
    /**
     * POST /api/projects
     * Creates a new project.
     * @param req.body.name {String} The name of the new project.
     * @param req.body.description {String} The description of the new project.
     * @param req.body.userID {ObjectID} The mongo object ID of the project owner
     *                                   (from users collection)
     * @return The JSON data containing all the users projects.
     *
     * TODO : Ensure that the user is an owner or admin. (Add a commenter test)
     */
        .post(function(req, res) {
            var project = new Project();

            project.name = req.body.name;
            project.description = req.body.description;
            project.entryURL = '/api/projects/' + project._id;
            project.setsURL = project.entryURL + '/sets';
            project.owners = req.body.userID;
            project.tags = req.body.tags;
            project.commenters = req.body.commenters;
            project.save(function(err) {
                if (err)
                    res.send(err);
                var callback = function(projects) {
                    if (projects == null) {
                        res.status(404).end();
                    }
                    res.json(projects);
                };
                var userCallback = function(user){
                    projectDAO.getMyProjects(user, callback);
                };
                userDAO.updateProjects(req.user, project._id, userCallback );

                for(var i=0; i<project.commenters.length; i++){
                    var user = project.commenters[i];
                    userDAO.updateProjects(user, project._id, function(){});
                }
            });
        })

    /**
     * GET /api/projects
     * This simply returns a JSON Array containing all the projects
     * that are visible to the logged in user.
     * @return The JSON data array for the user's projects.
     */
        .get(function(req, res) {
            var callback = function(projects) {
                if (projects == null) {
                    res.status(404).end();
                }
                res.json(projects);
            };
            projectDAO.getMyProjects(req.user, callback);
        });

    router.route('/projects/:project_id') // accessed at //<server>:<port>/api/projects/id
        .all(protect)
        // get a project
        .get(function(req, res){
            if (req.query.includeSets) {
                Project
                    .findById(req.params.project_id)
                    .select('name description setsURL entryURL sets._id sets.name sets.description commenters')
                    .exec(function(err, project) {
                        if (err)
                            res.send(err);
                        res.json(project);
                    });
            } else {
                Project
                    .findById(req.params.project_id)
                    .select('name description setsURL entryURL')
                    .exec(function(err, project) {
                        if (err)
                            res.send(err);
                        res.json(project);
                    });
            }

        })

        // update a project
        .put(function(req, res) {

            Project.findById(req.params.project_id, function(err, project) {
                if (err)
                    res.send(err);

                project.name = req.body.name;
                project.description = req.body.description;
                project.tags = req.body.tags;
                project.commenters = req.body.commenters;

                // save the project
                project.save(function(err) {
                    if (err)
                        res.send(err);
                    for(var i=0; i<project.commenters.length; i++){
                        var user = project.commenters[i];
                        userDAO.updateProjects(user, project._id, function(){});
                    }
                    res.json(project);
                });
            });
        })

        // delete a project
        .delete(function(req, res) {
            Project.remove({
                _id: req.params.project_id
            }, function(err, bear) {
                if (err)
                    res.send(err);
                var callback = function(projects) {
                    if (projects == null) {
                        res.status(404).end();
                    }
                    res.json(projects);
                };
                var userCallback = function(){
                    projectDAO.getMyProjects(req.user, callback);
                };
                userDAO.deleteProjects(req.params.project_id, userCallback);
            });
        });
    router.route('/projects/userProjects') // accessed at //<server>:<port>/api/projects/id
        .all(protect)
        // get a project
        .get(function(req, res) {
                console.log(req.body);
        });

};
