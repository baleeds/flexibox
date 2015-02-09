/**
 * Created by dfperry on 1/21/2015.
 */
define(
    ["namespace", "flexibox-post/namespace", "flexibox-post/module.require", "common/module.require"],
        function(namespace, ctrlNamespace){

        var name = ctrlNamespace + ".postController";

        describe(name, function() {

            var $controller;
            var $httpBackend;

            beforeEach(function () {
                module(namespace);

                inject(function ($injector) {
                    $controller = $injector.get("$controller");
                    $httpBackend = $injector.get("$httpBackend");
                });


            });

            describe("Post Comment Tests", function(){
/*
                it("Test GetPost", function(){
                    var $scope = {};
                    var $routeParams = {"projectId" : 5, "scopeID": 5, "postId": 3};
                    $controller(name, {$scope : $scope, $routeParams: $routeParams});

                    $scope.getPost();
                    expect($scope.post.id).toEqual($routeParams.postId);
 });
*/
                it("Test mDown with new Div as 2", function(){
                    var $scope = {};
                    var testLoc = {"offsetX": 100 , "offsetY": 150};
                    $scope.newDiv = 2;

                    $controller(name, {$scope : $scope});

                    var $element = document.createElement('div');
                    $element.id = 'imageDiv';
                    document.body.appendChild($element);

                    $scope.mDown(testLoc);

                    document.body.removeChild($element);
                    expect($scope.newDiv).toEqual(0);
                });

                it("Test mDown With newDiv as 0", function(){
                    var $scope = {};
                    var testLoc = {"offsetX": 100 , "offsetY": 150};
                    $scope.newDiv = 0;

                    $controller(name, {$scope : $scope});

                    var $element = document.createElement('div');
                    $element.id = 'imageDiv';
                    document.body.appendChild($element);

                    $scope.mDown(testLoc);
                    document.body.removeChild($element);
                    expect($scope.newDiv).toEqual(0);
                });

/**

 */
                it("Test mUp", function(){
                    var $scope = {};

                    $controller(name, {$scope : $scope});
                    var testLoc = {"offsetX": 100 , "offsetY": 150};
                    var testLoc2 = {"offsetX": 150 , "offsetY": 275};

                    var $element = document.createElement('div');
                    $element.id = 'imageDiv';
                    document.body.appendChild($element);

                    $scope.mDown(testLoc);
                    $scope.mUp(testLoc2);

                    document.body.removeChild($element);

                    expect($scope.newDiv.style.width).toEqual('50px');
                    expect($scope.newDiv.style.height).toEqual('125px');
                });

                it("Test addComment", function(){
                    var $scope = {};

                    var $routeParams = {"projectId" : 5, "setId": 5, "postId": 3};
                    $controller(name, {$scope : $scope, $routeParams: $routeParams});

                    $httpBackend.expectGET('/api/projects/' + $routeParams.projectId + '/sets/'
                    + $routeParams.setId + '/posts/' + $routeParams.postId + '?includeComments=1').respond(200, {});



                    $scope.newComment.cText = "Hello World";
                    $scope.$parent = {
                                        "user": {"name": "Dylan"}
                                    };
                    $scope.post = {"comments": []};
                    var testLoc = {"offsetX": 100 , "offsetY": 150};
                    var testLoc2 = {"offsetX": 150 , "offsetY": 275};

                    var $element = document.createElement('div');
                    $element.id = 'imageDiv';
                    document.body.appendChild($element);

                    $scope.mDown(testLoc);
                    $scope.mUp(testLoc2);


                    $httpBackend.expectPOST('/api/projects/' + $routeParams.projectId + '/sets/'
                    + $routeParams.setId + '/posts/' + $routeParams.postId + "/comments").respond(200, {txt : "Hello World"})

                    $scope.addComment();
                    $httpBackend.flush();
                    document.body.removeChild($element);
                    expect($scope.post.txt).toEqual("Hello World");

                });
                it("Test addComment fail", function(){
                    var $scope = {};

                    var $routeParams = {"projectId" : 5, "setId": 5, "postId": 3};
                    $controller(name, {$scope : $scope, $routeParams: $routeParams});

                    $httpBackend.expectGET('/api/projects/' + $routeParams.projectId + '/sets/'
                    + $routeParams.setId + '/posts/' + $routeParams.postId + '?includeComments=1').respond(200, {});



                    $scope.newComment.cText = "Hello World";
                    $scope.$parent = {
                        "user": {"name": "Dylan"}
                    };
                    $scope.post = {"comments": []};
                    var testLoc = {"offsetX": 100 , "offsetY": 150};
                    var testLoc2 = {"offsetX": 150 , "offsetY": 275};
                    var $element = document.createElement('div');
                    $element.id = 'imageDiv';
                    document.body.appendChild($element);

                    $scope.mDown(testLoc);
                    $scope.mUp(testLoc2);
                    $scope.newDiv = 5;


                    $httpBackend.expectPOST('/api/projects/' + $routeParams.projectId + '/sets/'
                    + $routeParams.setId + '/posts/' + $routeParams.postId + "/comments").respond(404, {txt : "Hello World"})

                    $scope.addComment();
                    $httpBackend.flush();
                    document.body.removeChild($element);
                    expect($scope.newDiv).toEqual(5);

                });
                it("Test addReply", function(){
                    var $scope = {};
                    var $commentId = 5;
                    var $txt = "This is a reply";


                    var $routeParams = {"projectId" : 5, "setId": 5, "postId": 3};
                    $controller(name, {$scope : $scope, $routeParams: $routeParams});

                   // $scope.post = {};
                    $scope.replyIndex = 0;
                    $httpBackend.expectGET('/api/projects/' + $routeParams.projectId + '/sets/'
                    + $routeParams.setId + '/posts/' + $routeParams.postId + '?includeComments=1').respond(200, {"comments": ["Test Comment"]});

                    $httpBackend.expectPOST('/api/projects/' + $routeParams.projectId + '/sets/'
                    + $routeParams.setId + '/posts/' + $routeParams.postId + '/comments/' + $commentId).respond(200, {txt : "Hello World"});


                    $scope.addReply($commentId, $txt);
                    $httpBackend.flush();
                    expect($scope.post.comments[$scope.replyIndex].txt).toEqual("Hello World")


                });
                it("Test addReply Failure", function(){
                    var $scope = {};
                    var $commentId = 5;
                    var $txt = "This is a reply";


                    var $routeParams = {"projectId" : 5, "setId": 5, "postId": 3};
                    $controller(name, {$scope : $scope, $routeParams: $routeParams});

                    // $scope.post = {};
                    $scope.replyIndex = 0;
                    $httpBackend.expectGET('/api/projects/' + $routeParams.projectId + '/sets/'
                    + $routeParams.setId + '/posts/' + $routeParams.postId + '?includeComments=1').respond(200, {"comments": ["Test Comment"]});

                    $httpBackend.expectPOST('/api/projects/' + $routeParams.projectId + '/sets/'
                    + $routeParams.setId + '/posts/' + $routeParams.postId + '/comments/' + $commentId).respond(404, {txt : "Hello World"});


                    $scope.addReply($commentId, $txt);
                    $httpBackend.flush();
                    expect($scope.post.comments[$scope.replyIndex]).toEqual("Test Comment");
                });
                it("Test showReply", function(){
                    var $scope = {};
                    var $commentId = 5;
                    $controller(name, {$scope : $scope});
                    $scope.showReply($commentId);

                    expect($scope.replyIndex).toEqual($commentId)
                });

            });
        });
    });