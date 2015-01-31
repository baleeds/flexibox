module.exports = {
    getUserName : function(req){
        if(req.hasOwnProperty("user")) {
            return req.user.name;
        }
        return null;
    }
};