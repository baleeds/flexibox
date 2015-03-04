var UserDAO = require('../../../server/dao/userDAO');
var TestUtils = require('../../testingUtils');

var async = require('async');

describe("UserDAO Tests", function () {

    beforeEach(function () {
        TestUtils.loadTestData();
    });

    describe("deleteProjects", function () {
        it("Deleting a shared project", function () {
            async.waterfall([
                function (callback) {
                    UserDAO.deleteProjects("54d82057b46e200418000006", callback);
                },
                function (callback) {
                    UserDAO.userSearch('owner', function (user) {
                        callback(null, user);
                    })
                },
                function (user, callback) {
                    expect(user.name).toBe('owner');
                    expect(user[0].projectsVisible.length).toBe(1);
                    callback(null);
                },
                function (callback) {
                    UserDAO.userSearch('commenter', callback)
                }

            ], function (err, user) {
                if (err) {
                    expect(2).toBe(1);
                } else {
                    expect(user.name).toBe('commenter');
                    expect(user[0].projectsVisible.length).toBe(0);
                }
            });

        });
    });
});