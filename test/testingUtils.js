var exec = require('child_process').exec;
var config = require('../config');


module.exports = {
    loadTestData : function(){
        exec("mongoimport -d flexibox -c users test/data/users.json --drop");
        exec("mongoimport -d flexibox -c projects test/data/projects.json --drop");
        var now = Date.now();
        while(Date.now() - now < 5000){
            //Wait for 5 seconds so that child processes can finish.
        }
    },
    URL : "http://" + config.server.host + ":" + config.server.port + "/"

};
