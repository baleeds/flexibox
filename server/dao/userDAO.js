/**
 * Created by dfperry on 2/13/2015.
 */
var User = require('../../app/common/models/users');
module.exports= {

    updateProjects: function(user , projID, callback) {
        User.findById(user._id, function (err, user) {
            if (err)
                console.log(err);

            // upddate Project
            user.projectsVisible = user.projectsVisible.concat(projID);
            // save the user
            user.save(function (err) {
                if (err)
                    console.log(err);
                callback(user);
            });

        })
    }
};