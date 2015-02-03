/**
 * Created by Andie on 1/23/2015.
 */

define(
    ["namespace", "common/namespace", "common/module.require"],
    function(namespace, ctrlNamespace){

        //The name of the factory we are testing
        var name = ctrlNamespace + ".postFactory";

        describe(name, function() {

            //The variable to hold the postFactory
            var postFactory, $httpBackend;

            beforeEach(function () {
                //Mock the app module
                module(namespace);
                inject(function ($injector) {
                    //use $injector to pull get the postFactory!
                    postFactory = $injector.get(name);

                    //Start mocking the http requests.
                    $httpBackend = $injector.get('$httpBackend');
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe("getPost test", function () {

                it("testing getPost call", function () {
                    var time = Date.now();
                    var projectIdTarget = 3;
                    var setIdTarget = 6;
                    var postIdTarget = 9;

                    //Tell the HTTP Backend to expect a GET method at '/api/projects'
                    //(found in the postFactory file), and to respond with an HTTP
                    //Status of 200 with some JSON object we can use to test the data
                    //is being properly returned.
                    $httpBackend.expectGET('/api/projects/' + projectIdTarget + '/sets/'
                        + setIdTarget + '/posts/' + postIdTarget + '?includeComments=1').respond(200, {time : time});
                    postFactory.getPost(projectIdTarget, setIdTarget, postIdTarget).success(
                        function(data){
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (getPost) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("updatePost tests", function() {

                it("testing updatePost call", function () {
                    var time = Date.now();
                    var projectIdTarget = 3;
                    var setIdTarget = 6;
                    var postIdTarget = 9;

                    $httpBackend.expectPUT('/api/projects/' + projectIdTarget + '/sets/'
                        + setIdTarget + '/posts/' + postIdTarget).respond(200, {time : time});
                    postFactory.updatePost(projectIdTarget, setIdTarget, postIdTarget).success(
                        function(data){
                            expect(data.time).toEqual(time)
                        })
                        .error(function() {
                            fail("Error with the http (create) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("addComment test", function () {

                it("testing addComment call", function() {
                    var time = Date.now();
                    var projectIdTarget = 6;
                    var setIdTarget = 9;
                    var postIdTarget = 3;

                    $httpBackend.expectPOST('/api/projects/' + projectIdTarget + '/sets/'
                        + setIdTarget + '/posts/' + postIdTarget + '/comments').respond(200, {time : time});
                    postFactory.addComment(projectIdTarget, setIdTarget, postIdTarget).success(
                        function(data) {
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (create post) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("addReply test", function () {

                it("testing addReply call", function() {
                    var time = Date.now();
                    var projectIdTarget = "54cd03edf35c8f0c1d000004";
                    var setIdTarget = "54cd03f6f35c8f0c1d000005";
                    var postIdTarget = "54cd4bc97a3e43e41d000005";
                    var commentTarget = "54cd4bd87a3e43e41d000006";

                    $httpBackend.expectPOST('/api/projects/' + projectIdTarget + '/sets/'
                        + setIdTarget + '/posts/' + postIdTarget + '/comments/' + commentTarget).respond(200, {time : time});
                    postFactory.addReply(projectIdTarget, setIdTarget, postIdTarget, commentTarget).success(
                        function(data) {
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (create post) request");
                        });
                    $httpBackend.flush();
                });
            });

        });

    });