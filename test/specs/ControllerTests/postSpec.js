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

                it("Test mDown with new Div as 2", function(){
                    var $scope = {};
                    var testLoc = {"pageX": 100 , "pageY": 150};

                    $controller(name, {$scope : $scope});

                    $scope.newDiv = document.createElement('div');

                    var $element = document.createElement('div');
                    $element.id = 'imageDiv';
                    document.body.appendChild($element);

                    $element.appendChild($scope.newDiv);

                    var $testDiv = $scope.newDiv;

                    $scope.mDown(testLoc);

                    expect($testDiv.parentNode).toBe(null);

                    document.body.removeChild($element);
                });

                it("Test mDown With newDiv as 0", function(){
                    var $scope = {};
                    var testLoc = {"pageX": 100 , "pageY": 150};
                    $scope.newDiv = 0;

                    $controller(name, {$scope : $scope});

                    var $element = document.createElement('div');
                    $element.id = 'imageDiv';
                    document.body.appendChild($element);

                    $scope.mDown(testLoc);

                    document.body.removeChild($element);
                    expect($scope.isDown).toBe(true);
                });

                it("Tests eager mMove", function(){
                    var testLoc = {"pageX": 100 , "pageY": 150};
                    var $scope = {};

                    $controller(name, {$scope : $scope});

                    expect($scope.isDown).toBe(false);

                    try {
                        $scope.mMove(testLoc);
                    } catch ( err ){
                        fail();
                    }

                    expect($scope.isDown).toBe(false);
                });

                it("Test mMove", function(){
                    var testLoc = {"pageX": 100 , "pageY": 150};
                    var testLoc2 = {"pageX": 150 , "pageY": 275};
                    var $scope = {};

                    $controller(name, {$scope : $scope});

                    var $element = document.createElement('div');
                    $element.id = 'imageDiv';
                    document.body.appendChild($element);

                    $scope.mDown(testLoc);

                    expect($scope.isDown).toBe(true);

                    $scope.mMove(testLoc2);

                    expect($scope.newDiv.style.width).toBe((testLoc2.pageX - testLoc.pageX) + "px");
                    expect($scope.newDiv.style.height).toBe((testLoc2.pageY - testLoc.pageY) + "px");

                    expect($scope.newDiv.style.left).toBe((testLoc.pageX - $scope.container.scrollLeft) + "px");
                    expect($scope.newDiv.style.top).toBe((testLoc.pageY - $scope.container.offsetTop - $scope.container.scrollTop) + "px");

                    document.body.removeChild($element);

                });

                it("Test mUp", function(){
                    var $scope = {};

                    $controller(name, {$scope : $scope});
                    var testLoc = {"offsetX": 100 , "offsetY": 150};

                    var $element = document.createElement('div');
                    $element.id = 'imageDiv';
                    document.body.appendChild($element);

                    $scope.mDown(testLoc);

                    expect($scope.isDown).toBe(true);

                    document.body.removeChild($element);

                    $scope.mUp();

                    expect($scope.isDown).toBe(false);
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