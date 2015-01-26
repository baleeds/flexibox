/**
 * Created by Andie on 1/23/2015.
 */

define(
    ["../../../app/namespace", "common/namespace", "common/module.require"],
    function(namespace, ctrlNamespace){

        //The name of the factory we are testing
        var name = ctrlNamespace + ".projectFactory";

        describe(name, function() {

            //The variable to hold the projectFactory
            var projectFactory, $httpBackend;

            beforeEach(function () {
                //Mock the app module
                module(namespace);

                inject(function ($injector) {
                    //use $injector to pull get the projectFactory!
                    projectFactory = $injector.get(name);

                    //Start mocking the http requests.
                    $httpBackend = $injector.get('$httpBackend');
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe("getProject tests", function () {

                it("testing getProject call", function () {
                    var time = Date.now();
                    var projectIdTarget = 23;

                    //Tell the HTTP Backend to expect a GET method at '/api/projects'
                    //(found in the projectFactory file), and to respond with an HTTP
                    //Status of 200 with some JSON object we can use to test the data
                    //is being properly returned.
                    $httpBackend.expectGET('/api/projects/' + projectIdTarget + '?includeSets=1').respond(200, {time : time});
                    projectFactory.getProject(projectIdTarget).success(
                        function(data){
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (get) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("createSet tests", function() {

                it("testing createSet call", function () {
                    var time = Date.now();
                    var projectIdTarget = 3;

                    $httpBackend.expectPOST('/api/projects/' + projectIdTarget + '/sets').respond(200, {time : time});
                    projectFactory.createSet(projectIdTarget).success(
                        function(data){
                            expect(data.time).toEqual(time)
                        })
                        .error(function() {
                            fail("Error with the http (create) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("deleteSet tests", function () {

                it("testing deleteSet call", function () {
                    var time = Date.now();
                    var projectIdTarget = 15;
                    var deleteSetTarget = 12;

                    //See expectGET above. This is pretty much the same.
                    $httpBackend.expectDELETE('/api/projects/' + projectIdTarget +
                        '/sets/'+ deleteSetTarget).respond(200, {time : time});
                    projectFactory.deleteSet(projectIdTarget, deleteSetTarget).success(
                        function(data){
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (delete) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("updateSet tests", function () {

                it("testing updateSet call", function () {
                    var time = Date.now();
                    var projectIdTarget = 13;
                    var updateSetTarget = 18;

                    $httpBackend.expectPUT('/api/projects/' + projectIdTarget
                        + '/sets/' + updateSetTarget).respond(200, {time : time});
                    projectFactory.updateSet(projectIdTarget, updateSetTarget).success(
                        function(data) {
                            expect(data.time).toEqual(time);
                        })
                        .error(function() {
                            fail("Error with the http (update) request");
                        });
                    $httpBackend.flush();
                });
            });
        });

    });