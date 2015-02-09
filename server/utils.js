var User = require('../app/common/models/users');
module.exports = {
    getUserName : function(req){
        if(req.hasOwnProperty("user")) {
            return req.user.name;
        }
        return null;
    },
    isAdmin: function(req, res, next){
        User.findById(req.user.id, function (err, user) {
            if (err)
                res.send(err);
            console.log(user.role);
            if(user.role == "System Admin"){
                return next();
            }
            else{
                res.status("402").end();
            }
        });


    }
};