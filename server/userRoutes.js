var User = require('../app/common/models/users');

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

        .get(function (req, res) {
            User.find(function (err, users) {
                if (err)
                    res.send(err);

                res.json(users);
            });
        });

    router.route('/users/current')
        .all(protect)
        .get(function (req, res) {
            console.log(req.user);
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
};