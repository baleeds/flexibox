var ProjectDAO = require('../../../server/dao/projectDAO');
var TestUtils = require('../../testingUtils');

var async = require('async');

describe("ProjectDAO Tests", function () {

    beforeEach(function () {
        TestUtils.loadTestData();
    });

    describe("getMyProjects", function () {
        it("Getting All Projects as a System Admin", function () {
            var user = {role: "System Admin"};
            async.waterfall([
                function (callback) {
                    ProjectDAO.getMyProjects(user, callback);
                }
            ], function (err, projects) {
                if (err) {
                    expect("Fail:").toBe("true");
                } else {
                    expect(projects.length).toBe(2);
                    for (var i = 0; i < projects.length; i++) {
                        if (projects[i]._id == "54d82057b46e200418000006") {
                            expect(projects[i].name).toBe("A shared project");
                        } else if (projects[i]._id == "54d82057b46e200418000007") {
                            expect(projects[i].name).toBe("A hidden project");
                        } else {
                            expect(1).toBe(2);
                        }
                    }
                }
            });

        });

        it("Getting All My Owned Projects", function () {
            var user = {role: "Project Owner", projectsVisible : ["54d82057b46e200418000006", "54d82057b46e200418000007"]};
            async.waterfall([
                function (callback) {
                    ProjectDAO.getMyProjects(user, callback);
                }
            ], function (err, projects) {
                if (err) {
                    expect("Fail:").toBe("true");
                } else {
                    expect(projects.length).toBe(2);

                    for (var i = 0; i < projects.length; i++) {
                        if (projects[i]._id == "54d82057b46e200418000006") {
                            expect(projects[i].name).toBe("A shared project");
                        } else if (projects[i]._id == "54d82057b46e200418000007") {
                            expect(projects[i].name).toBe("A hidden project");
                        } else {
                            expect(2).toBe(1);
                        }
                    }
                }
            });
        });

        it("Getting All My Visible Projects", function () {
            var user = {role: "Commenter", projectsVisible : ["54d82057b46e200418000006"]};
            async.waterfall([
                function (callback) {
                    ProjectDAO.getMyProjects(user, callback);
                }], function (err, projects) {
                if (err) {
                    console.log("Error: " + err.stack);
                    expect("Fail:").toBe("true");
                } else {
                    expect(projects.length).toBe(1);
                    expect(projects[0].name).toBe("A shared project");
                }
            });

        });
    })
});