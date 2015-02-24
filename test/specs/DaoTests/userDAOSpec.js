var UserDAO = require('../../../server/dao/userDAO');
var TestUtils = require('../../testingUtils');
var async = require('async');

describe("userDAO Tests", function() {

    beforeEach(function () {
        TestUtils.loadTestData();
    });

    describe("deleteProjects", function() {
        it("Deleting a shared project", function() {
            var searchCallback = function(user, callback) {
                if(user[0].name == 'owner') {
                    expect(user[0].projectsVisible.length).toBe(1);
                } else if (user[0].name == 'commenter') {
                    expect(user[0].projectsVisible.length).toBe(0);
                }
                callback(null);
            };

            async.waterfall([
                function(callback) {
                    UserDAO.deleteProjects("54d82057b46e200418000006", function(){
                        callback(null);
                    });
                },
                function(callback){
                    UserDAO.userSearch('owner', function(user){
                        callback(null, user);
                    })
                },
                searchCallback,
                function(callback){
                    UserDAO.userSearch('commenter', function(user){
                        callback(null, user);
                    })
                },
                searchCallback
            ]);

        });
    });
});