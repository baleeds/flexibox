define(
    ["namespace", "flexibox-set/namespace", "flexibox-set/module.require", "common/module.require"],
    function(namespace, ctrlNamespace) {

        var name = ctrlNamespace + ".setController";

        describe(name, function () {

            var $controller;
            var $httpBackend;

            var PID = "54d82057b46e200418000006";
            var SID = "54d82082b46e200418000007";

            var $scope = {};

            var $routeParams = {projectId : PID, setId : SID};
            var posts = [
                {_id : 0, name : "First", description : "First Description", imageURL : "uploads\\imageOne", tags : [{ _id : 01, text : "tag1"}]},
                {_id : 1, name : "Second", description : "Second Description", imageURL : "uploads\\imageTwo", tags : [{ _id : 02, text : "tag2"}]},
                {_id : 2, name : "Third", description : "Third Description", imageURL : "uploads\\imageThree", tags : [{ _id : 03, text : "tag3"}]},
                {_id : 3, name : "Fourth", description : "Fourth Description", imageURL : "uploads\\imageFour", tags : [{ _id : 04, text : "tag4"}]},
                {_id : 4, name : "Fifth", description : "Fifth Description", imageURL : "uploads\\imageFive", tags : [{ _id : 05, text : "tag5"}]},
                {_id : 5, name : "Sixth", description : "Sixth Description", imageURL : "uploads\\imageSix", tags : [{ _id : 06, text : "tag6"}]},
                {_id : 6, name : "Seventh", description : "Seventh Description", imageURL : "uploads\\imageSeven", tags : [{ _id : 07, text : "tag7"}]},
                {_id : 7, name : "Eighth", description : "Eighth Description", imageURL : "uploads\\imageEight", tags : [{ _id : 08, text : "tag8"}]},
                {_id : 8, name : "Ninth", description : "Ninth Description", imageURL : "uploads\\imageNine", tags : [{ _id : 09, text : "tag9"}]}
            ];

            beforeEach(function () {
                module(namespace);

                inject(function ($injector) {
                    $controller = $injector.get("$controller");
                    $httpBackend = $injector.get("$httpBackend");

                    $httpBackend.expectGET('/api/projects/' + PID + '/sets/' + SID + '?includePosts=1')
                        .respond(200, {posts : posts});

                    $scope = {};
                    $controller(name, {$scope: $scope, $routeParams: $routeParams});
                    $httpBackend.flush();
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe("postEditable", function () {
                it("Test making a post editable", function () {

                    $scope.postEditable(3);
                    expect($scope.editablePost._id).toBe(3);
                    expect($scope.editablePost.name).toBe(posts[3].name);
                    expect($scope.editablePost.description).toBe(posts[3].description);
                    expect($scope.editablePost.tags._id).toBe(posts[3].tags._id);

                });
            });

            describe("confirmEdit", function () {
                it("Should make a call to the correct route.", function () {

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

                    $scope.postEditable(3);
                    expect($scope.editablePost._id).toBe(posts[3]._id);
                    $scope.editablePost = posts[0];
                    expect($scope.editablePost._id).toBe(0);
                    $scope.cancelEdit();

                });
            });

            describe("clearForm", function () {
                it("Test clearing the form data", function () {

                    $scope.formData = "Hi there!";
                    $scope.clearForm();
                    expect($scope.formData).toEqual({});

                });
            });

            describe("uploadFile", function() {
                it("Uploading a proper image type", function() {

                    expect($scope.imageUp).toBe(0);

                    $httpBackend.expectPOST('/api/upload')
                        .respond(200, {imageURL : "uploads/54d82082b46e200418000008"});

                    $scope.uploadFile([{type : "image/jpeg"}]);
                    expect($scope.imageButtonState).toBe("Uploading...");
                    $httpBackend.flush();
                    expect($scope.imageButtonState).toBe("Remove");
                    expect($scope.imageUp).toBe(1);

                });

                //TODO Incorrect file type
            });

            describe("resetImage", function() {
                it("Testing a successful reset", function() {

                    $httpBackend.expectPOST('/api/upload')
                        .respond(200, {imageURL : "uploads/54d82082b46e200418000008"});
                    $scope.uploadFile([{type : "image/jpeg"}]);
                    $httpBackend.flush();

                    expect($scope.imageButtonState).toBe("Remove");
                    expect($scope.imageUp).toBe(1);

                    $httpBackend.expectDELETE('/api/upload/54d82082b46e200418000008')
                        .respond(200, {});
                    $scope.resetImage();
                    $httpBackend.flush();

                    expect($scope.imageButtonState).toBe("");
                    expect($scope.imageUp).toBe(0);

                });


            });

            describe("addPost", function() {
                it("Testing a successful addition", function() {

                    $httpBackend.expectPOST('/api/upload')
                        .respond(200, {imageURL : "uploads/imageTen"});
                    $scope.uploadFile([{type : "image/jpeg"}]);
                    $scope.newTags = [{_id : 01, text : "tag1"}];
                    $httpBackend.flush();

                    expect($scope.imageButtonState).toBe("Remove");
                    expect($scope.imageUp).toBe(1);

                    $httpBackend.expectPOST('/api/projects/' + PID + '/sets/' + SID + '/posts',
                        { imageURL : "uploads/imageTen", tags : [{_id : 01, text : "tag1"}] })// form data that would be passed in.
                        .respond(200, {posts : posts.concat({
                            _id : 9,
                            name : "Tenth",
                            description : "Tenth Description",
                            imageURL : "uploads\\imageTen",
                            tags : [{_id : 01, text : "tag1"}]
                        })});

                    $scope.addPost();

                    $httpBackend.flush();

                    expect($scope.imageButtonState).toBe("");
                    expect($scope.imageUp).toBe(0);
                    expect($scope.set.posts.length).toBe(posts.length + 1);

                });
            });

            describe("deletePost", function () {
                it("Test deleting a post", function () {

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

            describe("addTag", function () {
                it("Test adding a tag to the new tags array", function () {
                    expect($scope.newTags.length).toBe(0);
                    $scope.newTag = "New&*(*&*tag";
                    $scope.addTag();
                    expect($scope.newTags[0].text).toBe("newtag");
                });
            });

            describe("removeTag", function () {
                it("Test removing a tag from the new tags array", function () {
                    $scope.newTag = "newtag";
                    $scope.addTag();
                    expect($scope.newTags.length).toBe(1);
                    $scope.removeTag(0);
                    expect($scope.newTags.length).toBe(0);
                });
            });

            describe("addTagThatExists", function () {
                it("Test adding a tag that exists", function () {
                    expect($scope.newTags.length).toBe(0);
                    $scope.newTag = "New&*(*&*tag";
                    $scope.addTag();
                    expect($scope.newTags[0].text).toBe("newtag");
                    $scope.newTag = "newtag";
                    $scope.addTag();
                    expect($scope.newTags.length).toBe(1);
                });
            });
        })
    }
);
