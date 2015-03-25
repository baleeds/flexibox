var Project = require('../../app/common/models/projects');
var Utils = require('../utils');
var ProjectDAO = require('../dao/projectDAO');

module.exports = function(router, protect) {
    // COMMENT ROUTES
    // ==========================================================================
    router.route('/projects/:project_id/sets/:set_id/posts/:post_id/comments') // accessed at //<server>:<port>/api/projects/<project_id>/sets/<set_id>/posts/<post_id>/comments
        .all(protect)
        .get(function (req, res) {
            Project
                .findById(req.params.project_id)
                .select('sets._id sets.posts._id sets.posts.comments.posterName sets.posts.comments.txt sets.posts.comments')
                .exec(function (err, project) {
                    if (err)
                        res.send(err);
                    res.json(project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments);
                });
        })

        // create a comment
        .post(function (req, res) {
            Project.findById(req.params.project_id, function (err, project) {
                if (err)
                    res.send(err);

                var newComment = {};
                newComment.posterName = req.body.posterName;
                newComment.txt = req.body.txt;
                newComment.smallest = req.body.smallest;
                newComment.width = req.body.width;
                newComment.height = req.body.height;
                newComment.color = req.body.color;
                newComment.number = req.body.number;


                project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments.push(newComment);
                project.sets.id(req.params.set_id).posts.id(req.params.post_id).editedAt = new Date().toISOString();

                project.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json(project.sets.id(req.params.set_id).posts.id(req.params.post_id));
                });
                ProjectDAO.updateEditedAt(req.params.project_id);
                ProjectDAO.updatedSetEditedAt(req.params.project_id, req.params.set_id);

            });
        });

    router.route('/projects/:project_id/sets/:set_id/posts/:post_id/comments/:comment_id') // accessed at //<server>:<port>/api/projects/<project_id>/sets/<set_id>/posts/<post_id>/comments/<comment_id>
        .all(protect)
        .get(function (req, res) {
            Project
                .findById(req.params.project_id)
                .exec(function (err, project) {
                    if (err)
                        res.send(err);
                    res.json(project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments.id(req.params.comment_id));
                });
        })

        .post(function(req, res){
            Project
                .findById(req.params.project_id)
                .exec(function(err, project) {
                    if(err)
                        res.send(err);
                    var reply = {};
                    reply.posterName = Utils.getUserName(req);
                    reply.txt = req.body.txt;

                    project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments.id(req.params.comment_id).replies.push(reply);
                    project.save(function(err){
                        if(err)
                            res.send(err);
                        res.json(project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments.id(req.params.comment_id));
                    });
                    ProjectDAO.updateEditedAt(req.params.project_id);
                    ProjectDAO.updatedSetEditedAt(req.params.project_id, req.params.set_id);
                    ProjectDAO.updatePostEditedAt(req.params.project_id, req.params.set_id, req.params.post_id);
                });
        })

        .put(function (req, res) {
            Project
                .findById(req.params.project_id)
                .exec(function (err, project) {
                    if (err)
                        res.send(err);
                    project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments.id(req.params.comment_id).posterName = req.body.posterName;
                    project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments.id(req.params.comment_id).txt = req.body.txt;

                    project.save(function (err) {
                        if (err)
                            res.send(err);
                        res.json(project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments.id(req.params.comment_id));
                    });
                    ProjectDAO.updateEditedAt(req.params.project_id);
                    ProjectDAO.updatedSetEditedAt(req.params.project_id, req.params.set_id);
                    ProjectDAO.updatePostEditedAt(req.params.project_id, req.params.set_id, req.params.post_id);
                });
        })

        // delete a comment
        .delete(function (req, res) {
            Project.findById(req.params.project_id, function (err, project) {
                if (err)
                    res.send(err);
                project.sets.id(req.params.set_id).posts.id(req.params.post_id).comments.id(req.params.comment_id).remove();
                project.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json(project.sets.id(req.params.set_id));
                });
                ProjectDAO.updateEditedAt(req.params.project_id);
                ProjectDAO.updatedSetEditedAt(req.params.project_id, req.params.set_id);
                ProjectDAO.updatePostEditedAt(req.params.project_id, req.params.set_id, req.params.post_id);
            });
        });
};