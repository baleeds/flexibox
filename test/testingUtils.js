var exec = require('child_process').exec;


module.exports = {
    loadTestData : function(){
        exec("mongoimport -db flexibox -c users test/data/users.json --drop");
        exec("mongoimport -d flexibox -c projects test/data/projects.json --drop");
    }
};
