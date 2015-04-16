
define(
    ["namespace", "flexibox-home/namespace", "flexibox-home/module.require", "common/module.require"],
    function(namespace, ctrlNamespace) {

        var name = ctrlNamespace + ".homeController";

        describe(name, function () {

            var $controller;
            var $httpBackend;
            var $scope;
            var PROJECTS_PER_PAGE = 9;

            beforeEach(function () {
                module(namespace);

                inject(function ($injector) {
                    $controller = $injector.get("$controller");
                    $httpBackend = $injector.get("$httpBackend");

                    $httpBackend.expectGET('/api/users/current').respond(200,  {_id: '555', name: 'Admin', role:'System Admin'});
                    $httpBackend.expectGET('/api/projects').respond(200, [ {_id: '222', name: 'Test Project',description:'Test Description', tags:[],
                        commenters:[], sets:[{_id: '1', name:"Test Set", description:"Test Description", tags:[]}]}]);

                    $scope = {};

                    $controller(name, {$scope: $scope});
                    $httpBackend.flush();
                });
            });
            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe("Home Controller Test", function () {
                it("setEditable Test", function(){
                    expect($scope.user.name).toBe('Admin');
                    expect($scope.projects.length).toBe(1);
                    $scope.setEditable('222');
                    expect($scope.editableProject.name).toBe('Test Project');
                    expect($scope.editableProject.description).toBe('Test Description');
                });

                it("confirmEdit Test", function(){
                    $scope.setEditable('222');
                    $scope.newTags = 'newTags';
                    $scope.newSharedUsers = [{_id:'234', role:'commenter', name:'Commenter'},{_id:'123', role:'commenter', name:'Commenter2'}];
                    $httpBackend.whenPUT('/api/projects/222', function(postData){
                        postData = JSON.parse(postData);
                        expect(postData.tags).toBe('newTags');
                        expect(postData.commenters.length).toBe(2);
                        expect(postData.commenters[0].name).toBe('Commenter');
                        expect(postData.commenters[1].name).toBe('Commenter2');
                        return true;
                    }).respond(200, true);
                    $scope.confirmEdit();
                    $httpBackend.flush();

                });

                it("confirmEdit Failure Test", function(){
                    $scope.setEditable('222');
                    $scope.newTags = 'newTags';
                    $scope.newSharedUsers = [{_id:'234', role:'commenter', name:'Commenter'},{_id:'123', role:'commenter', name:'Commenter2'}];
                    $httpBackend.whenPUT('/api/projects/222', function(postData){
                        postData = JSON.parse(postData);
                        expect(postData.tags).toBe('newTags');
                        expect(postData.commenters.length).toBe(2);
                        expect(postData.commenters[0].name).toBe('Commenter');
                        expect(postData.commenters[1].name).toBe('Commenter2');
                        return true;
                    }).respond(400, false);
                    $scope.confirmEdit();

                    $httpBackend.flush();
                    expect($scope.error).toBe("Error confirming confirming Edit");

                });



                it("cancelEdit Test", function(){
                    $scope.setEditable('222');
                    $scope.newTags = 'newTag';
                    $scope.newSharedUsers = 'newUser';
                    $scope.editableProject.name = 'Editable Project';
                    $scope.editableProject.description= 'Edited Description'
                    expect($scope.editableProject.name).toBe('Editable Project');
                    expect($scope.editableProject.description).toBe('Edited Description');

                    $scope.cancelEdit();
                    expect($scope.editableProject.name).toBe('Test Project');
                    expect($scope.editableProject.description).toBe('Test Description');

                });


                it("createProject Test", function(){
                    $scope.newTags = [{text:"testTag"}];
                    $scope.newSharedUsers = [{_id:'234', name:'Commenter', email:'Commenter@email.com'}];
                    var returnProjects = $scope.projects.concat({_id: '223', name: 'Test Project2',description:'Test Description2', tags:[$scope.newTags[0]],
                        commenters:[$scope.newSharedUsers[0]], sets:[{_id: '1', name:"Test Set", description:"Test Description", tags:[]}]});
                    $httpBackend.whenPOST('/api/projects', function(postData){
                        postData = JSON.parse(postData);
                        expect(postData.userID).toBe('555');
                        expect(postData.tags[0].text).toBe('testTag');
                        expect(postData.commenters[0].name).toBe('Commenter');
                        return true;
                    }).respond(returnProjects);

                    $scope.createProject();
                    $httpBackend.flush();
                    expect($scope.projects.length).toBe(2);

                });
                it("createProject Failure Test", function(){
                    $scope.newTags = [{text:"testTag"}];
                    $scope.newSharedUsers = [{_id:'234', name:'Commenter', email:'Commenter@email.com'}];
                    $httpBackend.whenPOST('/api/projects', function(postData){
                        postData = JSON.parse(postData);
                        expect(postData.userID).toBe('555');
                        expect(postData.tags[0].text).toBe('testTag');
                        expect(postData.commenters[0].name).toBe('Commenter');
                        return true;
                    }).respond(400);

                    $scope.createProject();
                    $httpBackend.flush();

                    expect($scope.error).toBe('Error creating project');
                });

                it("deleteProject Test", function(){
                    expect($scope.projects.length).toBe(1);
                    $httpBackend.expectDELETE('/api/projects/222').respond(200, []);
                    $httpBackend.expectDELETE('/api/users/projects/222').respond(200, []);
                    $scope.deleteProject('222');
                    $httpBackend.flush();
                    expect($scope.projects.length).toBe(0);
                });

                it("deleteProject failure Test", function(){
                    expect($scope.projects.length).toBe(1);
                    $httpBackend.expectDELETE('/api/projects/222').respond(400);
                    $httpBackend.expectDELETE('/api/users/projects/222').respond(200, []);
                    $scope.deleteProject('222');
                    $httpBackend.flush();
                    expect($scope.error).toBe('Error Deleting Project');
                });

                it("deleteProject Factory failure Test", function(){
                    expect($scope.projects.length).toBe(1);
                    $httpBackend.expectDELETE('/api/projects/222').respond(200,[]);
                    $httpBackend.expectDELETE('/api/users/projects/222').respond(400);
                    $scope.deleteProject('222');
                    $httpBackend.flush();
                    expect($scope.error).toBe('Error in homeFactory deleting project');
                });

                it("addTag Test", function(){
                   expect($scope.newTags.length).toBe(0);
                    $scope.newTag = 'New Tag For Testing';
                    $scope.addTag();
                    expect($scope.newTags.length).toBe(1);
                    expect($scope.newTags[0].text).toBe('newtagfortesting');
                });

                it("addTag Bad Test", function(){
                   expect($scope.newTags.length).toBe(0);
                    $scope.addTag();
                    expect($scope.newTags.length).toBe(0);
                });

                it("removeTag Test", function(){
                    expect($scope.newTags.length).toBe(0);
                    $scope.newTag = 'New Tag For Testing';
                    $scope.addTag();
                    expect($scope.newTags.length).toBe(1);
                    expect($scope.newTags[0].text).toBe('newtagfortesting');
                    $scope.newTag = 'Second Tag For Testing';
                    $scope.addTag();
                    expect($scope.newTags.length).toBe(2);
                    expect($scope.newTags[1].text).toBe('secondtagfortesting');

                    $scope.removeTag(0);
                    expect($scope.newTags.length).toBe(1);
                    expect($scope.newTags[0].text).toBe('secondtagfortesting');
                });

                it('filterPotentialUsers Test', function(){
                    $scope.newSharedUser = "o";
                    $httpBackend.expectGET('/api/users/search/o').respond(['owner','otherUser']);
                    $scope.filterPotentialUsers();
                    $httpBackend.flush();
                    expect($scope.potentialUsers.length).toBe(2);
                    expect($scope.potentialUsers[0]).toBe('owner');
                    expect($scope.potentialUsers[1]).toBe('otherUser');
                });

                it('Empty filterPotentialUsers Test', function(){
                    $scope.newSharedUser = "";
                    $scope.filterPotentialUsers();
                    expect($scope.potentialUsers.length).toBe(0);

                });

                it('filterPotentialUsers Failure Test', function(){
                    $scope.newSharedUser = "o";
                    $httpBackend.expectGET('/api/users/search/o').respond(400);
                    $scope.filterPotentialUsers();
                    $httpBackend.flush();
                    expect($scope.error).toBe("Error filtering potential users");
                });

                it("addSharedUser Test", function(){
                    var user = {_id:'234', name:'Commenter', email:'Commenter@email.com'};
                    $scope.newSharedUser = 'Commenter';
                    $scope.addSharedUser(user);
                    expect($scope.newSharedUsers.length).toBe(1);
                    expect($scope.newSharedUsers[0].name).toBe('Commenter');
                    expect($scope.newSharedUsers[0]._id).toBe('234');
                    expect($scope.newSharedUsers[0].email).toBe('Commenter@email.com');
                });

                it("addSharedUser bad Test", function(){
                    var user = {_id:'234', name:'Commenter', email:'Commenter@email.com'};
                    $scope.addSharedUser(user);
                    expect($scope.newSharedUsers.length).toBe(0);
                });

                it("removeSharedUser Test", function(){
                    var user = {_id:'234', name:'Commenter', email:'Commenter@email.com'};
                    $scope.newSharedUser = 'Commenter';
                    $scope.addSharedUser(user);
                    expect($scope.newSharedUsers.length).toBe(1);

                    var user2 = {_id:'235', name:'Owner', email:'Owner@email.com'};
                    $scope.newSharedUser = 'Owner';
                    $scope.addSharedUser(user2);
                    expect($scope.newSharedUsers.length).toBe(2);

                    $scope.removeNewSharedUser(user._id);

                    expect($scope.newSharedUsers.length).toBe(1);
                    expect($scope.newSharedUsers[0].name).toBe('Owner');
                    expect($scope.newSharedUsers[0]._id).toBe('235');
                    expect($scope.newSharedUsers[0].email).toBe('Owner@email.com');
                });

                it("Constructor Test: Session Factory Failure", function(){
                    $httpBackend.expectGET('/api/users/current').respond(400);
                    $httpBackend.expectGET('/api/projects').respond(200, [ {_id: '222', name: 'Test Project',description:'Test Description', tags:[],
                        commenters:[], sets:[{_id: '1', name:"Test Set", description:"Test Description", tags:[]}]}]);

                    $scope = {};

                    $controller(name, {$scope: $scope});
                    $httpBackend.flush();
                    expect($scope.error).toBe('Session Factory Error getting user');
                });

                it("Constructor Test: Home Factory Failure", function(){
                    $httpBackend.expectGET('/api/users/current').respond(200,  {_id: '555', name: 'Admin', role:'System Admin'});
                    $httpBackend.expectGET('/api/projects').respond(400);

                    $scope = {};

                    $controller(name, {$scope: $scope});
                    $httpBackend.flush();
                    expect($scope.error).toBe('Error getting projects from bomeFactory');
                })

            });
        });
    });

