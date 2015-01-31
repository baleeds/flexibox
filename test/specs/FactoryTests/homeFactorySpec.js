define(
    ["namespace", "common/namespace", "common/module.require"],
    function(namespace, ctrlNamespace){

        //The name of the factory we are testing
        var name = ctrlNamespace + ".homeFactory";

        describe(name, function() {

            //The variable to hold the homeFactory
            var homeFactory, $httpBackend;

            beforeEach(function () {
                //Mock the app module
                module(namespace);

                inject(function ($injector) {
                    //use $injector to pull get the homeFactory!
                    homeFactory = $injector.get(name);

                    //Start mocking the http requests.
                    $httpBackend = $injector.get('$httpBackend');
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe("getProjects tests", function () {

                it("testing getProjects call", function () {
                    var time = Date.now();

                    //Tell the HTTP Backend to expect a GET method at '/api/projects'
                    //(found in the homeFactory file), and to respond with an HTTP
                    //Status of 200 with some JSON object we can use to test the data
                    //is being properly returned.
                    $httpBackend.expectGET('/api/projects').respond(200, {time : time});
                    homeFactory.getProjects().success(
                        function(data){
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (get) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("createProjects tests", function() {

                it("testing createProjects call", function () {
                   var time = Date.now();

                    $httpBackend.expectPOST('/api/projects').respond(200, {time : time});
                    homeFactory.createProject().success(
                        function(data){
                            expect(data.time).toEqual(time)
                        })
                        .error(function() {
                            fail("Error with the http (create) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("deleteProject tests", function () {

                it("testing deleteProject call", function () {
                    var time = Date.now();
                    var deleteTarget = 12;

                    //See expectGET above. This is pretty much the same.
                    $httpBackend.expectDELETE('/api/projects/' + deleteTarget).respond(200, {time : time});
                    homeFactory.deleteProject(deleteTarget).success(
                        function(data){
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (delete) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("updateProjects tests", function () {

                it("testing updateProjects call", function () {
                    var time = Date.now();
                    var updateTarget = 18;

                    $httpBackend.expectPUT('/api/projects/' + updateTarget).respond(200, {time : time});
                    homeFactory.updateProject(updateTarget).success(
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