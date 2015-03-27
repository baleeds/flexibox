var Project = require('../../app/common/models/projects');
var ProjectDAO = require('../dao/projectDAO');
module.exports = function(router, protect) {

    // POST ROUTES
    // ==========================================================================
    router.route('/projects/:project_id/sets/:set_id/posts') // accessed at //<server>:<port>/api/projects/<project_id>/sets/<set_id>/posts
        .all(protect)
        .get(function (req, res) {
            if (req.query.includeComments) {
                Project
                    .findById(req.params.project_id)
                    .select('sets.posts.name sets.posts.description sets.posts.comments sets.posts._id')
                    .exec(function (err, project) {
                        if (err)
                            res.send(err);
                        res.json(project.sets[0].posts);
                    });
            } else {
                Project
                    .findById(req.params.project_id)
                    .select('sets.posts.name sets.posts.description sets.posts._id')
                    .exec(function (err, project) {
                        if (err)
                            res.send(err);
                        res.json(project.sets[0].posts);
                    });
            }
        })

        // create a post
        .post(function (req, res) {
            Project
                .findById(req.params.project_id)
                .select('name description sets._id sets.name sets.description sets.posts')
                .exec(function (err, project) {
                    if (err)
                        res.send(err);
                    var newPost = {};
                    newPost.name = req.body.name;
                    newPost.description = req.body.description;
                    newPost.imageURL = req.body.imageURL;
                    newPost.tags = req.body.tags;

                    project.sets.id(req.params.set_id).posts.push(newPost);

                    project.save(function (err) {
                        if (err)
                            res.send(err);
                        res.json(project.sets.id(req.params.set_id));
                    });
                    ProjectDAO.updateEditedAt(req.params.project_id);
                    ProjectDAO.updatedSetEditedAt(req.params.project_id, req.params.set_id);
                });
        });


    router.route('/projects/:project_id/sets/:set_id/posts/:post_id') // accessed at //<server>:<port>/api/projects/<project_id>/sets/<set_id>/posts/<post_id>
        .all(protect)
        // get a post
        .get(function (req, res) {
            if (req.query.includeComments) {
                Project
                    .find({_id: req.params.project_id}, {
                        sets: {$elemMatch: {_id: req.params.set_id}},
                        'sets.description': 0
                    })
                    .select({posts: {$elemMatch: {_id: req.params.post_id}}})
                    .exec(function (err, project) {
                        if (err)
                            res.send(err);
                        res.json(project[0].sets[0].posts.id(req.params.post_id));
                    });
            } else {
                Project
                    .find({_id: req.params.project_id}, {
                        sets: {$elemMatch: {_id: req.params.set_id}},
                        'sets.description': 0,
                        'sets.posts.comments': 0
                    })
                    .select({posts: {$elemMatch: {_id: req.params.post_id}}})
                    .exec(function (err, project) {
                        if (err)
                            res.send(err);
                        res.json(project[0].sets[0].posts.id(req.params.post_id));
                    });
            }
        })

        // update a post
        .put(function (req, res) {
            Project.findById(req.params.project_id, function (err, project) {
                if (err)
                    res.send(err);

                var thisPost = project.sets.id(req.params.set_id).posts.id(req.params.post_id);
                thisPost.name = req.body.name;
                thisPost.description = req.body.description;
                thisPost.tags = req.body.tags;
                thisPost.editedAt = new Date().toISOString();


                project.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json(thisPost);
                });

                ProjectDAO.updateEditedAt(req.params.project_id);
                ProjectDAO.updatedSetEditedAt(req.params.project_id, req.params.set_id);

            });
        })

        // delete a post
        .delete(function (req, res) {
            Project.findById(req.params.project_id, function (err, project) {
                if (err)
                    res.send(err);
                project.sets.id(req.params.set_id).posts.id(req.params.post_id).remove();
                project.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json(project.sets.id(req.params.set_id));
                });
                ProjectDAO.updateEditedAt(req.params.project_id);
                ProjectDAO.updatedSetEditedAt(req.params.project_id, req.params.set_id);

            });
        });
};