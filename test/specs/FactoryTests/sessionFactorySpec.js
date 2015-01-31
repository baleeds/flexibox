/**
 * Created by Andie on 1/30/2015.
 */

define(
    ["namespace", "common/namespace", "common/module.require"],
    function(namespace, ctrlNamespace){

        //The name of the factory we are testing
        var name = ctrlNamespace + ".sessionFactory";

        describe(name, function() {

            //The variable to hold the sessionFactory
            var sessionFactory, $httpBackend;

            beforeEach(function () {
                //Mock the app module
                module(namespace);

                inject(function ($injector) {
                    //use $injector to pull get the sessionFactory!
                    sessionFactory = $injector.get(name);

                    //Start mocking the http requests.
                    $httpBackend = $injector.get('$httpBackend');
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe("logout tests", function () {

                it("testing logout call", function () {
                    var time = Date.now();

                    //Tell the HTTP Backend to expect a GET method at '/api/projects'
                    //(found in the sessionFactory file), and to respond with an HTTP
                    //Status of 200 with some JSON object we can use to test the data
                    //is being properly returned.
                    $httpBackend.expectGET('/api/logout/').respond(200, {time : time});
                    sessionFactory.logout().success(
                        function(data){
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (logout) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("login tests", function() {

                it("testing login call", function () {
                    var time = Date.now();

                    $httpBackend.expectPOST('/api/login').respond(200, {time : time});
                    sessionFactory.login().success(
                        function(data){
                            expect(data.time).toEqual(time)
                        })
                        .error(function() {
                            fail("Error with the http (login) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("get current user tests", function () {

                it("testing getCurrentUser call", function () {
                    var time = Date.now();

                    //See expectGET above. This is pretty much the same.
                    $httpBackend.expectGET('/api/users/current').respond(200, {time : time});
                    sessionFactory.getCurrentUser().success(
                        function(data){
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (get current user) request");
                        });
                    $httpBackend.flush();
                });
            });

            describe("signup tests", function () {

                it("testing signup call", function () {
                    var time = Date.now();

                    $httpBackend.expectPOST('/api/signup').respond(200, {time : time});
                    sessionFactory.signup().success(
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