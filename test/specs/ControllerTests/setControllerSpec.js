define(
    ["namespace", "flexibox-set/namespace", "flexibox-set/module.require", "common/module.require"],
    function(namespace, ctrlNamespace) {

        var name = ctrlNamespace + ".setController";

        describe(name, function () {

            var $controller;
            var $httpBackend;

            var PID = "54d82057b46e200418000006";
            var SID = "54d82082b46e200418000007";

            var $routeParams = {projectId : PID, setId : SID};
            var posts = [
                {_id : 0, name : "First", description : "First Description", imageURL : "uploads\\imageOne"},
                {_id : 1, name : "Second", description : "Second Description", imageURL : "uploads\\imageTwo"},
                {_id : 2, name : "Third", description : "Third Description", imageURL : "uploads\\imageThree"},
                {_id : 3, name : "Fourth", description : "Fourth Description", imageURL : "uploads\\imageFour"},
                {_id : 4, name : "Fifth", description : "Fifth Description", imageURL : "uploads\\imageFive"},
                {_id : 5, name : "Sixth", description : "Sixth Description", imageURL : "uploads\\imageSix"},
                {_id : 6, name : "Seventh", description : "Seventh Description", imageURL : "uploads\\imageSeven"},
                {_id : 7, name : "Eighth", description : "Eighth Description", imageURL : "uploads\\imageEight"},
                {_id : 8, name : "Ninth", description : "Ninth Description", imageURL : "uploads\\imageNine"}
            ];

            beforeEach(function () {
                module(namespace);

                inject(function ($injector) {
                    $controller = $injector.get("$controller");
                    $httpBackend = $injector.get("$httpBackend");
                    $httpBackend.expectGET('/api/projects/' + PID + '/sets/' + SID + '?includePosts=1')
                        .respond(200, {posts : posts})
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe("postEditable", function () {
                it("Test making a post editable", function () {
                    var $scope = {};
                    $controller(name, {$scope : $scope, $routeParams : $routeParams});
                    $httpBackend.flush();

                    $scope.postEditable(3);
                    expect($scope.editablePost._id).toBe(3);
                    expect($scope.editablePost.name).toBe(posts[3].name);
                    expect($scope.editablePost.description).toBe(posts[3].description);
                });
            });

            describe("confirmEdit", function () {
                it("Should make a call to the correct route.", function () {
                    var $scope = {};
                    $controller(name, {$scope : $scope, $routeParams : $routeParams});
                    $httpBackend.flush();

                    $scope.postEditable(3);
                    expect($scope.editablePost._id).toBe(3);
                    $httpBackend.expectPUT('/api/projects/' + PID + '/sets/' + SID + '/posts/' + $scope.editablePost._id,
                        posts[3])
                        .respond(200, {});

                    $scope.confirmEdit();
                    $httpBackend.flush();
                });
            });

            describe("cancelEditable", function () {
                it("Test cancelling editing", function () {
                    var $scope = {};
                    $controller(name, {$scope : $scope, $routeParams : $routeParams});
                    $httpBackend.flush();

                    $scope.postEditable(3);
                    expect($scope.editablePost._id).toBe(posts[3]._id);
                    $scope.editablePost = posts[0];
                    expect($scope.editablePost._id).toBe(0);
                    $scope.cancelEdit();
                });
            });

            describe("clearForm", function () {
                it("Test clearing the form data", function () {
                    var $scope = {};
                    $controller(name, {$scope : $scope, $routeParams : $routeParams});
                    $httpBackend.flush();

                    $scope.formData = "Hi there!";
                    $scope.clearForm();
                    expect($scope.formData).toEqual({});
                });
            });

            describe("deletePost", function () {
                it("Test deleting a post", function () {
                    var $scope = {};
                    $controller(name, {$scope : $scope, $routeParams : $routeParams});
                    $httpBackend.flush();

                    expect($scope.set.posts.length).toBe(posts.length);

                    $httpBackend.expectDELETE('/api/upload/imageOne')
                        .respond(200, {});

                    $httpBackend.expectDELETE('/api/projects/' + PID + '/sets/' + SID + '/posts/' + 0)
                        .respond(200, {posts : [
                            {_id : 1, name : "Second", description : "Second Description", imageURL : "uploads\\imageTwo"},
                            {_id : 2, name : "Third", description : "Third Description", imageURL : "uploads\\imageThree"},
                            {_id : 3, name : "Fourth", description : "Fourth Description", imageURL : "uploads\\imageFour"},
                            {_id : 4, name : "Fifth", description : "Fifth Description", imageURL : "uploads\\imageFive"},
                            {_id : 5, name : "Sixth", description : "Sixth Description", imageURL : "uploads\\imageSix"},
                            {_id : 6, name : "Seventh", description : "Seventh Description", imageURL : "uploads\\imageSeven"},
                            {_id : 7, name : "Eighth", description : "Eighth Description", imageURL : "uploads\\imageEight"},
                            {_id : 8, name : "Ninth", description : "Ninth Description", imageURL : "uploads\\imageNine"}
                        ]});

                    $scope.deletePost(0);

                    $httpBackend.flush();
                    expect($scope.set.posts.length).toBe(posts.length - 1);
                });
            });
        })
    }
);
