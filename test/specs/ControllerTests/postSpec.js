define(
    ["namespace", "flexibox-post/namespace", "flexibox-post/module.require", "common/module.require"],
        function(namespace, ctrlNamespace){

        var name = ctrlNamespace + ".postController";

        describe(name, function() {

            var PID = "54d82057b46e200418000006";
            var SID = "54d82082b46e200418000007";
            var OID = "54d8209cb46e200418000008";

            var $controller;
            var $httpBackend;

            var $scope;
            var $routeParams = {"projectId" : PID, "setId": SID, "postId": OID};

            var postsComments = [{
                smallest : {
                    x : 34,
                    y : 50
                },
                width : 100,
                height: 101
            }];

            beforeEach(function () {
                module(namespace);

                inject(function ($injector) {
                    $controller = $injector.get("$controller");
                    $httpBackend = $injector.get("$httpBackend");

                    $scope = {};
                    $httpBackend.expectGET('/api/projects/' + PID + '/sets/' + SID + '/posts/' + OID + '?includeComments=1')
                        .respond(200, {
                                comments: postsComments
                            });

                    $controller(name, {$scope : $scope, $routeParams: $routeParams});

                    $httpBackend.flush();
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            //describe("Test Update Post", function() {
            //
            //    it("Test update post with project", function() {
            //
            //    });
            //});

            describe("Post Comment Tests", function(){

                it("Test mDown with new Div as 2", function(){
                    var testLoc = {"pageX": 100 , "pageY": 150};

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
                    var testLoc = {"pageX": 100 , "pageY": 150};
                    $scope.newDiv = 0;

                    var $element = document.createElement('div');
                    $element.id = 'imageDiv';
                    document.body.appendChild($element);

                    $scope.mDown(testLoc);

                    document.body.removeChild($element);
                    expect($scope.isDown).toBe(true);
                });

                it("Tests eager mMove", function(){
                    var testLoc = {"pageX": 100 , "pageY": 150};

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

                it("Test mMove with reversed points", function(){
                    var testLoc2 = {"pageX": 100 , "pageY": 150};
                    var testLoc = {"pageX": 150 , "pageY": 275};

                    var $element = document.createElement('div');
                    $element.id = 'imageDiv';
                    document.body.appendChild($element);

                    $scope.mDown(testLoc);

                    expect($scope.isDown).toBe(true);

                    $scope.mMove(testLoc2);

                    expect($scope.newDiv.style.width).toBe((testLoc.pageX - testLoc2.pageX) + "px");
                    expect($scope.newDiv.style.height).toBe((testLoc.pageY - testLoc2.pageY) + "px");

                    expect($scope.newDiv.style.left).toBe((testLoc2.pageX - $scope.container.scrollLeft) + "px");
                    expect($scope.newDiv.style.top).toBe((testLoc2.pageY - $scope.container.offsetTop - $scope.container.scrollTop) + "px");

                    document.body.removeChild($element);

                });

                it("Test mUp", function(){
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
                    var $commentId = 5;
                    var $txt = "This is a reply";

                   // $scope.post = {};
                    $scope.replyIndex = 0;
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
                    var $commentId = 5;
                    $scope.showReply($commentId);

                    expect($scope.replyIndex).toEqual($commentId)
                });
                it("Test setCurrentComment", function() {
                    $scope.setCurrentComment("Secret");
                    expect($scope.currentComment).toBe("Secret");
                });
            });

            describe("Test toggleLocationComments", function(){
                it("should set the location to 0", function(){
                    expect($scope.locationComments).toBe(1);
                    $scope.toggleLocationComments();
                    expect($scope.locationComments).toBe(0);
                    $scope.toggleLocationComments();
                    expect($scope.locationComments).toBe(1);
                });
            });

            describe("Test getStyle", function(){
                it("should set full, and return original styles", function(){
                    var comment = {
                        smallest : {
                            x : 34,
                            y : 50
                        },
                        width : 100,
                        height: 101
                    };
                    $scope.post.comments[0] = comment;
                    expect($scope.currentView).toBe("full");

                    var style = $scope.getStyle(0);
                    expect(style.top).toBe(comment.smallest.y + "px");
                    expect(style.left).toBe(comment.smallest.x + "px");
                    expect(style.width).toBe(comment.width + "px");
                    expect(style.height).toBe(comment.height + "px");
                });
            });
        });
    });