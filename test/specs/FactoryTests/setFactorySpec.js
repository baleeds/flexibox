/**
 * Created by Andie on 1/23/2015.
 */

define(
    ["namespace", "common/namespace", "common/module.require"],
    function(namespace, ctrlNamespace){

        //The name of the factory we are testing
        var name = ctrlNamespace + ".setFactory";

        describe(name, function() {

            //The variable to hold the setFactory
            var setFactory, $httpBackend;

            beforeEach(function () {
                //Mock the app module
                module(namespace);

                inject(function ($injector) {
                    //use $injector to pull get the setFactory!
                    setFactory = $injector.get(name);

                    //Start mocking the http requests.
                    $httpBackend = $injector.get('$httpBackend');
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe("getSet test", function () {

                it("testing getSet call", function () {
                    var time = Date.now();
                    var projectIdTarget = 6;
                    var setIdTarget = 9;

                    //Tell the HTTP Backend to expect a GET method at '/api/projects'
                    //(found in the setFactory file), and to respond with an HTTP
                    //Status of 200 with some JSON object we can use to test the data
                    //is being properly returned.
                    $httpBackend.expectGET('/api/projects/' + projectIdTarget + '/sets/'
                        + setIdTarget + '?includePosts=1').respond(200, {time : time});
                    setFactory.getSet(projectIdTarget, setIdTarget).success(
                        function(data){
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (get) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("updateSet tests", function() {

                it("testing updateSet call", function () {
                    var time = Date.now();
                    var projectIdTarget = 3;
                    var setIdTarget = 6;

                    $httpBackend.expectPUT('/api/projects/' + projectIdTarget + '/sets/'
                        + setIdTarget).respond(200, {time : time});
                    setFactory.updateSet(projectIdTarget, setIdTarget).success(
                        function(data){
                            expect(data.time).toEqual(time)
                        })
                        .error(function() {
                            fail("Error with the http (create) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("createPost test", function () {

                it("testing createPost call", function() {
                    var time = Date.now();
                    var projectIdTarget = 6;
                    var setIdTarget = 9;

                    $httpBackend.expectPOST('/api/projects/' + projectIdTarget + '/sets/'
                        + setIdTarget + '/posts').respond(200, {time : time});
                    setFactory.createPost(projectIdTarget, setIdTarget).success(
                        function(data) {
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (create post) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("deletePost test", function () {

                it("testing deletePost call", function () {
                    var time = Date.now();
                    var projectIdTarget = 3;
                    var setIdTarget = 6;
                    var deletePostTarget = 9;

                    //See expectGET above. This is pretty much the same.
                    $httpBackend.expectDELETE('/api/projects/' + projectIdTarget +
                        '/sets/' + setIdTarget + '/posts/' + deletePostTarget).respond(200, {time : time});
                    setFactory.deletePost(projectIdTarget, setIdTarget, deletePostTarget).success(
                        function(data){
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (delete) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("uploadFile test", function () {

                it("testing uploadFile call", function() {
                    var time = Date.now();
                    var data = [36, 25, 34];

                    $httpBackend.expectPOST('/api/upload').respond(200, {time : time});
                    setFactory.uploadFile(data).success(
                        function(data) {
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (uploadfile) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("deleteUpload test", function () {

                it("testing deleteUpload call", function() {
                    var time = Date.now();
                    var urlTarget = "upload/735a9f04d669502f505fc7604c8d0757.PNG";

                    $httpBackend.expectDELETE('/api/upload/' + urlTarget.substring(8)).respond(200, {time : time});
                    setFactory.deleteUpload(urlTarget).success(
                        function(data) {
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (delete upload) request");
                        });
                    $httpBackend.flush();
                });
            });

        });

    });