var userDAO = require('../../../server/dao/userDAO');
var TestUtils = require('../../testingUtils');

describe("userDAO Tests", function() {

    beforeEach(function () {
        TestUtils.loadTestData();
    });

    describe("updateProjects", function(){
        it("Updates the projects visible for a particular user", function(){
            var user ={_id: "54d81fffb46e200418000005"};
            var projID = "54d82057b46e200418000007";
            var callBack = function(user){
                expect(user.projectsVisible.length).toBe(1);
                expect(user.projectsVisible[0]).toBe(projID);
            };
            userDAO.updateProjects(user, projID, callBack);
        });
    });

    describe("deleteProjects", function(){
        it("Delete the project from all users that have it", function(){
            var user ={_id: "54d81fffb46e200418000005"};
            var projID = "54d82057b46e200418000006";

            var searchCallback = function(users){
                if(users[0].name == 'owner') {
                    expect(users[0].projectsVisible.length).toBe(1);
                    //expect(users[0].projectsVisible[0]._id).toBe("54d82057b46e200418000007");
                }
                else if(users[0].name == 'commenter'){
                        expect(users[0].projectsVisible.length).toBe(0);

                }
            };
            var callBack = function(){
                var now = Date.now();
                while(Date.now() - now < 5000){
                    //Wait for 5 seconds so that child processes can finish.
                }
                userDAO.userSearch("owner", searchCallback);
                userDAO.userSearch("commenter", searchCallback);
            };
            var firstCallback = function(users){
                userDAO.deleteProjects(users[0].projectsVisible[0]._id, callBack);
            };
            userDAO.userSearch("owner", firstCallback);

        });

    describe("userSearch", function(){
        it("Search for a user starting with the letter 'o'", function(){
            var searchCallback = function(users){
                expect(users[0].name).toBe('owner');
                expect(users[0].projectsVisible.length).toBe(2);
            };
            userDAO.userSearch('o',searchCallback);
        })
    })

    })
});