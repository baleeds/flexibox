var User = require('../../app/common/models/users');
var Utils = require('../utils.js');
module.exports = function(router, protect) {
// USER ROUTES
// =====================================================================================
    router.route('/users')  // accessed at POST //<server>:<port>/api/users
        .all(protect)
        .post(function (req, res) {
            var user = new User();

            user.name = req.body.name;
            user.displayName = req.body.name;


            user.save(function (err) {
                if (err)
                    res.send(err);

                res.json({message: 'User Created!'});
            });
        })

        .get(Utils.isAdmin, function (req, res) {
            User.find(function (err, users) {
                if (err)
                    res.send(err);

                res.json(users);
            });
        });

    router.route('/users/current')
        .all(protect)
        .get(function (req, res) {
            User.findById(req.user.id, function (err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            });
        })

        .put(function (req, res) {

            User.findById(req.params.user_id, function (err, user) {
                if (err)
                    res.send(err);

                // update fields here!
                user.name = req.body.name;
                user.displayName = req.body.displayName;
                user.imageURL = req.body.imageURL;
                user.emailSettings = req.body.emailSettings;
                user.projectsVisible = req.body.projectsVisible;

                // save the user
                user.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json({message: 'User Updated'});
                });
            });
        })

        .delete(function (req, res) {
            User.remove({
                _id: req.params.user_id
            }, function (err, bear) {
                if (err)
                    res.send(err);
                res.json({message: 'Successfully deleted'});
            });
        });
    /**
     * Potentially unnecessary route. Just written right now as a place holder, needs to be extended.
     * Just a user route that will (hopefully) be used to update user roles.
     */
    router.route('/users/updateRoles')
        .all(protect)
        .post(function (req, res) {
            for(var i = 0; i< req.body.length; i++){
                var query = {_id: req.body[i].id};
                var update = {$set: {role:req.body[i].role}};
                var options = {multi: true};
                User.update(query, update, options, function(err, numAffected){
                    if(err)
                        res.send(err);
                })
            }
            res.json({message: "Sucessfully updated"});
        });

    router.route('/users/projects/:project_id')
        .all(protect)
        .delete(function(req, res){
            User.findById(req.user._id, function(err, user) {
                if (err)
                    res.send(err)
                for (var i = 0; i < req.user.projectsVisible.length; i++) {
                    if (user.projectsVisible[i] == req.params.project_id) {
                        user.projectsVisible.splice(i, 1);
                    }
                }
                user.save(function (err) {
                    if (err)
                        res.send(err)
                    res.json({message: 'User Updated'});
                })
            })
        });
};