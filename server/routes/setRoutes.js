var Project = require('../../app/common/models/projects');

module.exports = function(router, protect) {

    // SET ROUTES
    // ==========================================================================
    router.route('/projects/:project_id/sets') // accessed at //<server>:<port>/api/projects/<project_id>/sets
        .all(protect)
        .get(function (req, res) {
            Project
                .findById(req.params.project_id)
                .select('sets._id sets.name sets.description sets.entryURL sets.postsURL sets.tags')
                .exec(function (err, project) {
                    if (err)
                        res.send(err);
                    res.json(project.sets);
                });
        })

        // create a set
        .post(function (req, res) {
            Project
                .findById(req.params.project_id)
                .select('name description sets._id sets.name sets.description sets.entryURL sets.postsURL sets.tags')
                .exec(function (err, project) {
                    if (err)
                        res.send(err);
                    var newSet = {};
                    newSet.name = req.body.name;
                    newSet.description = req.body.description;
                    newSet.entryURL = '/api/projects' + req.params.project_id + '/sets/' + newSet._id;
                    newSet.postsURL = '/api/projects' + req.params.project_id + '/sets/' + newSet._id + '/posts';
                    newSet.tags = req.body.tags;

                    project.sets.push(newSet);

                    project.save(function (err) {
                        if (err)
                            res.send(err);
                        res.json(project);
                    });
                });
        });

    router.route('/projects/:project_id/sets/:set_id') // accessed at //<server>:<port>/api/projects/<project_id>/sets/<set_id>
        .all(protect)
        // get a set
        .get(function (req, res) {
            if (req.query.includePosts) {
                Project
                    .find({'sets._id': req.params.set_id}, {sets: 1})
                    .select({sets: {$elemMatch: {_id: req.params.set_id}}, 'sets.posts.comments': 0})
                    .exec(function (err, project) {
                        if (err)
                            res.send(err);
                        res.json(project[0].sets[0]);
                    });
            } else {
                Project
                    .find({'sets._id': req.params.set_id}, {sets: 1})
                    .select({sets: {$elemMatch: {_id: req.params.set_id}}, 'sets.posts': 0})
                    .exec(function (err, project) {
                        if (err)
                            res.send(err);
                        res.json(project[0].sets[0]);
                    });
            }
        })

        // update a set
        .put(function (req, res) {
            Project.findById(req.params.project_id, function (err, project) {
                if (err)
                    res.send(err);

                var thisSet = project.sets.id(req.params.set_id);
                thisSet.name = req.body.name;
                thisSet.description = req.body.description;
                thisSet.tags = req.body.tags;
                /*
                project.sets.id(req.params.set_id).name = req.body.name;
                project.sets.id(req.params.set_id).description = req.body.description;
                project.sets.id(req.params.set_id)
                */

                project.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json({
                        "name": thisSet.name,
                        "description": thisSet.description,
                        "tags": thisSet.tags
                    });
                });
            });
        })

        // delete a set
        .delete(function (req, res) {
            Project
                .findById(req.params.project_id)
                .select('name description sets._id sets.name sets.description sets.tags')
                .exec(function (err, project) {
                    if (err)
                        res.send(err);
                    project.sets.id(req.params.set_id).remove();
                    project.save(function (err) {
                        if (err)
                            res.send(err);
                        res.json(project);
                    });
                });
        });
};