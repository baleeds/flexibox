var UserDAO = require('../../../server/dao/userDAO');
var TestUtils = require('../../testingUtils');

var async = require('async');

describe("UserDAO Tests", function () {

    beforeEach(function (done) {
        TestUtils.loadTestData(done);
    });

    describe("deleteProjects", function () {
        it("Deleting a shared project", function (done) {
            async.waterfall([
                function (callback) {
                    UserDAO.deleteProjects("54d82057b46e200418000006", callback);
                },
                function (callback) {
                    UserDAO.userSearch('owner', function (err, user) {
                        callback(null, user);
                    })
                },
                function (user, callback) {
                    expect(user[0].name).toBe('owner');
                    expect(user[0].projectsVisible.length).toBe(1);
                    callback(null);
                },
                function (callback) {
                    UserDAO.userSearch('commenter', callback)
                }

            ], function (err, user) {
                if (err) {
                    throw new Error(err);
                } else {
                    expect(user[0].name).toBe('commenter');
                    expect(user[0].projectsVisible.length).toBe(0);
                }
                done();
            });

        });
    });

    describe("userSearch", function(){
        it("searching for a valid user", function(done){
            async.waterfall([
                function(callback){
                    UserDAO.userSearch("com", callback);
                }
            ], function(err, users){
                if(err){
                    throw new Error(err);
                } else {
                    expect(users.length).toBe(1);
                    expect(users[0].name).toBe("commenter");
                }
                done();

            });
        });
        it("searching for an empty string", function(done){
            async.waterfall([
                function(callback){
                    UserDAO.userSearch("", callback);
                }
            ], function(err, users){
                if(err){
                    throw new Error(err);
                } else {
                    expect(users.length).toBe(0);
                }
                done();
            });
        });
    })
});