/*
var userDAO = require('../../../server/dao/userDAO');
var TestUtils = require('../../testingUtils');
var ObjId = require('mongoose').Types.ObjectId;
describe("userDAO Tests", function() {

    beforeEach(function () {
        TestUtils.loadTestData();
    });

    describe("updateProjects", function(){
        it("Updates the projects visible for a particular user", function(){
            var user ={_id: "54d81fffb46e200418000005"};
            var projID = "54d82057b46e200418000007";
            var callBack = function(user){
                expect(user.projectsVisible.length).toBe(2);
                expect(user.projectsVisible[1]).toBe(projID);
            };
            userDAO.updateProjects(user, projID._id, callBack);
        });
    });
});
    */