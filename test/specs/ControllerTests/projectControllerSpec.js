/**
 * Created by dfperry on 2/23/2015.
 */
define(
    ["namespace", "flexibox-project/namespace", "flexibox-project/module.require", "common/module.require"],
    function(namespace, ctrlNamespace){
        var name = ctrlNamespace + ".projectController";

        describe(name, function() {

            var $controller;
            var $httpBackend;
            var $scope;
            var SETS_PER_PAGE = 10;

            beforeEach(function () {
                module(namespace);

                inject(function ($injector) {
                    $controller = $injector.get("$controller");
                    $httpBackend = $injector.get("$httpBackend");

                    $httpBackend.expectGET('/api/projects/555?includeSets=1').respond(200,  {
                        _id: '555', name: 'Test Project', sets:[
                            {_id: '1', name:"Test Set", description:"Test Description", tags:[]}]
                    });
                    $scope = {};

                    $controller(name, {$scope: $scope, $routeParams:{projectId: "555"}});

                    $httpBackend.flush();
                });
            });
            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe("Project Controller test", function() {
                it("Test Broken Project Id", function(){
                    inject(function ($injector) {
                        $controller = $injector.get("$controller");
                        $httpBackend = $injector.get("$httpBackend");

                        $httpBackend.expectGET('/api/projects/555?includeSets=1').respond(400);
                        $scope = {};

                        $controller(name, {$scope: $scope, $routeParams: {projectId: "555"}});

                        $httpBackend.flush();
                        expect($scope.error).toBe('projectController - Error getting project by id');
                    });
                });

                it("Set Editable Set", function () {
                    $scope.setEditable("1");
                    expect($scope.editableSet.name).toBe("Test Set");
                    expect($scope.editableSet._id).toBe('1');
                });

                it("Confirm Edit", function(){
                    $scope.editableSet = {_id: '1', name:"Edited Set", description:"Edited Description"};
                    $httpBackend.whenPUT('/api/projects/555/sets/1',
                        function (postData) {
                            postData = JSON.parse(postData);
                            expect(postData.name).toBe("Edited Set");
                            expect(postData.description).toBe("Edited Description");
                            return true;
                        }).respond(200, true);

                    $scope.confirmEdit();
                    $httpBackend.flush();

                });

                it("Confirm Edit Failure", function(){
                    $scope.editableSet = {_id: '1', name:"Edited Set", description:"Edited Description"};

                    $httpBackend.whenPUT('/api/projects/555/sets/1',
                        function (postData) {
                            postData = JSON.parse(postData);
                            expect(postData.name).toBe("Edited Set");
                            expect(postData.description).toBe("Edited Description");
                            return true;
                        }).respond(400);

                    $scope.confirmEdit();
                    $httpBackend.flush();
                    expect($scope.error).toBe("Error in Editing");

                });

                it("Cancel Edit",function(){
                    $scope.setEditable("1");
                    expect($scope.editableSet.name).toBe("Test Set");
                    expect($scope.editableSet._id).toBe('1');
                    expect($scope.editableSet.description).toBe("Test Description");

                    $scope.editableSet.name = "Edited Set";
                    $scope.editableSet.description = 'Edited Description';
                    expect($scope.editableSet.name).toBe("Edited Set");
                    expect($scope.editableSet.description).toBe("Edited Description");

                    $scope.cancelEdit();

                    expect($scope.editableSet.name).toBe("Test Set");
                    expect($scope.editableSet.description).toBe("Test Description");

                });

                it("Add Set", function(){

                    $scope.formData.name = "New Set";
                    $scope.formData.description = "New Description";

                    $httpBackend.whenPOST('/api/projects/555/sets',
                        function (postData) {
                            postData = JSON.parse(postData);
                            expect(postData.name).toBe("New Set");
                            expect(postData.description).toBe("New Description");
                            return true;
                        }).respond(200, true);

                    $scope.addSet();
                    $httpBackend.flush();
                });

                it(" Successful Delete Set", function(){
                    $scope.deletable = {'_id':'1'};
                    $httpBackend.expectDELETE('/api/projects/555/sets/1').respond({_id: "222", name:"Deleted Set Project"});
                    expect($scope.project.name).toBe("Test Project");
                    expect($scope.project._id).toBe("555");
                    $scope.deleteSet();
                    $httpBackend.flush();
                    expect($scope.project.name).toBe("Deleted Set Project");
                    expect($scope.project._id).toBe("222");
                });

                it("Failed Delete Set", function(){
                    $scope.deletable = {'_id':'1'};
                    $httpBackend.expectDELETE('/api/projects/555/sets/1').respond(400);
                    expect($scope.project.name).toBe("Test Project");
                    expect($scope.project._id).toBe("555");
                    $scope.deleteSet();
                    $httpBackend.flush();
                    expect($scope.project.name).toBe("Test Project");
                    expect($scope.project._id).toBe("555");
                    expect($scope.error).toBe('projectController - Error deleting set from project');
                });

                it("Add Tag", function(){
                    $scope.newTag="Test Tag";
                    $scope.addTag();
                    expect($scope.newTags.length).toBe(1);
                    expect($scope.newTags[0].text).toBe("testtag");
                    expect($scope.newTag).toBe("");

                });

                it("Remove Tag", function(){
                    $scope.newTag="Test Tag";
                    $scope.addTag();
                    $scope.newTag="Test Two Tag";
                    $scope.addTag();
                    $scope.newTag="Test Three Tag";
                    $scope.addTag();
                    expect($scope.newTags.length).toBe(3);
                    expect($scope.newTags[0].text).toBe("testtag");
                    expect($scope.newTags[1].text).toBe("testtwotag");
                    expect($scope.newTags[2].text).toBe("testthreetag");

                    $scope.removeTag(1);

                    expect($scope.newTags.length).toBe(2);
                    expect($scope.newTags[0].text).toBe("testtag");
                    expect($scope.newTags[1].text).toBe("testthreetag");
                });
            });
        });
    });