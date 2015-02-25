define(
    ["namespace", "flexibox-home/namespace", "flexibox-home/module.require", "common/module.require"],
    function(namespace, ctrlNamespace) {

        var name = ctrlNamespace + ".homeController";

        describe(name, function () {

            var $controller;
            var $httpBackend;

            var UID = "54de173badad5ff417000006";
            var PID = "54d82057b46e200418000006";
            var SID = "54d82082b46e200418000007";

            var $scope = {};

            var projects = [
                {_id : 0, name : "First", description : "First Description",tags : [{ _id : 1, text : "tag1"}], commenters : [{name : "commenter", email : "commenter@test.com", _id : "54d81fffb46e200418000005"}]},
                {_id : 1, name : "Second", description : "Second Description", tags : [{ _id : 2, text : "tag2"}], commenters : []},
                {_id : 2, name : "Third", description : "Third Description", tags : [{ _id : 3, text : "tag3"}], commenters : [{name : "commenter", email : "commenter@test.com", _id : "54d81fffb46e200418000005"}]},
                {_id : 3, name : "Fourth", description : "Fourth Description", tags : [{ _id : 4, text : "tag4"}], commenters : []},
                {_id : 4, name : "Fifth", description : "Fifth Description", tags : [{ _id : 5, text : "tag5"}], commenters : [{name : "commenter", email : "commenter@test.com", _id : "54d81fffb46e200418000005"}]},
                {_id : 5, name : "Sixth", description : "Sixth Description", tags : [{ _id : 6, text : "tag6"}], commenters : []},
                {_id : 6, name : "Seventh", description : "Seventh Description", tags : [{ _id : 7, text : "tag7"}], commenters : []},
                {_id : 7, name : "Eighth", description : "Eighth Description", tags : [{ _id : 8, text : "tag8"}], commenters : []},
                {_id : 8, name : "Ninth", description : "Ninth Description", tags : [{ _id : 9, text : "tag9"}], commenters : [{name : "commenter", email : "commenter@test.com", _id : "54d81fffb46e200418000005"}]}
            ];

            beforeEach(function () {
                module(namespace);

                inject(function ($injector) {
                    $controller = $injector.get("$controller");
                    $httpBackend = $injector.get("$httpBackend");

                    $httpBackend.expectGET('/api/users/current')
                        .respond(200, {
                            _id : UID,
                            projectsVisible : PID
                        });
                    $httpBackend.expectGET('/api/projects')
                        .respond(200, projects);

                    $scope = {};
                    $controller(name, {$scope: $scope});
                    $httpBackend.flush();
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe("setEditable", function(){
                it("Setting a correct project as editable", function() {
                    $scope.setEditable(2);
                    expect($scope.editableProject._id).toBe(projects[2]._id);
                    expect($scope.newTags[0].text).toBe(projects[2].tags[0].text);

                });
            });

            describe("confirmEdit", function(){
                it("Should set the tags and commenters of the editable project", function() {
                    $scope.setEditable(2);
                    $scope.newTags = "newTags";
                    $scope.newSharedUsers = "commenters";
                    $httpBackend.expectPUT('/api/projects/' + projects[2]._id)
                        .respond(200, {});

                    $scope.confirmEdit();

                    $httpBackend.flush();

                    expect($scope.editableProject.tags).toEqual("newTags");
                    expect($scope.editableProject.commenters).toEqual("commenters");
                });
            });
        })
    }
);
