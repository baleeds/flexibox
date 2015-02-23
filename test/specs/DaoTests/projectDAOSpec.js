var ProjectDAO = require('../../../server/dao/projectDAO');
var TestUtils = require('../../testingUtils');

describe("ProjectDAO Tests", function(){

    beforeEach(function(){
        TestUtils.loadTestData();
    });

    describe("getMyProjects", function(){
        it("Getting All Projects as a System Admin", function(){
            var user = {role : "System Admin"};
            var testCallback = function(projects){
                expect(projects.length).toBe(2);
                for(var i = 0; i < projects.length; i++){
                    if(projects[i]._id == "54d82057b46e200418000006"){
                        expect(projects[i].name).toBe("A shared project");
                    } else if(projects[i]._id == "54d82057b46e200418000007"){
                        expect(projects[i].name).toBe("A hidden project");
                    } else {
                        expect("fail").toBe("yes");
                    }
                }
            };

            ProjectDAO.getMyProjects(user, testCallback);
        });

        it("Getting All My Owned Projects", function(){
            var user = {role : "Owner"};
            var testCallback = function(projects){
                expect(projects.length).toBe(2);
                for(var i = 0; i < projects.length; i++){
                    if(projects[i]._id == "54d82057b46e200418000006"){
                        expect(projects[i].name).toBe("A shared project");
                    } else if(projects[i]._id == "54d82057b46e200418000007"){
                        expect(projects[i].name).toBe("A hidden project");
                    } else {
                        expect("fail").toBe("yes");
                    }
                }
            };

            ProjectDAO.getMyProjects(user, testCallback);
        });

        it("Getting All My Visible Projects", function(){
            var user = {role : "Commenter"};
            var testCallback = function(projects){
                expect(projects.length).toBe(1);
                expect(projects[i].name).toBe("A shared project");
            };

            ProjectDAO.getMyProjects(user, testCallback);
        });
    })
});