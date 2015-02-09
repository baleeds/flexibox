var exec = require('child_process').exec;
var MongoClient = require('mongodb').MongoClient;


module.exports = {
    loadTestData : function(){
        MongoClient.connect('mongodb://127.0.0.1:27017/flexibox', function(err, db) {
            if (err) throw err;
            db.dropDatabase();
        });
        exec("mongoimport -db flexibox -c users test/data/users.json");
        exec("mongoimport -d flexibox -c projects test/data/projects.json");
    }
};
