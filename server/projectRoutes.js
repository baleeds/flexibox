var Project = require('../app/common/models/projects');

module.exports = function(router, protect){

    // PROJECT ROUTES
    // ==========================================================================
    router.route('/projects')  // accessed at //<server>:<port>/api/projects
        .all(protect)
        // add a project
        .post(function(req, res) {
            console.log(req.body);
            var project = new Project();

            project.name = req.body.name;
            project.description = req.body.description;
            project.entryURL = '/api/projects/' + project._id;
            project.setsURL = project.entryURL + '/sets';

            project.save(function(err) {
                if (err)
                    res.send(err);

                Project.find(function(err, projects) {
                    if (err) res.send(err);
                    res.json(projects);
                });
            });
        })

        // get all projects
        .get(function(req, res) {
            Project
                .find()
                .select('name description setsURL entryURL')
                .exec(function(err, projects) {
                    if (err)
                        res.send(err);

                    res.json(projects);
                });
        });

    router.route('/projects/:project_id') // accessed at //<server>:<port>/api/projects/id
        .all(protect)
        // get a project
        .get(function(req, res) {
            if (req.query.includeSets) {
                Project
                    .findById(req.params.project_id)
                    .select('name description setsURL entryURL sets._id sets.name sets.description')
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

                // save the project
                project.save(function(err) {
                    if (err)
                        res.send(err);
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

                Project.find(function(err, projects) {
                    if (err) res.send(err);
                    res.json(projects);
                });
            });
        });

};
