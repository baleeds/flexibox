/**
 * Created by dfperry on 2/6/2015.
 */
define(
    ["namespace", "common/namespace", "common/module.require"],
    function(namespace, ctrlNamespace){

        //The name of the factory we are testing
        var name = ctrlNamespace + ".adminFactory";

        describe(name, function() {

            //The variable to hold the sessionFactory
            var adminFactory, $httpBackend;

            beforeEach(function () {
                //Mock the app module
                module(namespace);

                inject(function ($injector) {
                    //use $injector to pull get the sessionFactory!
                    adminFactory = $injector.get(name);

                    //Start mocking the http requests.
                    $httpBackend = $injector.get('$httpBackend');
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

        describe("admin tests", function () {
            it("testing getAll Userscall", function () {
               var time = Date.now();

                    //Tell the HTTP Backend to expect a GET method at '/api/projects'
                    //(found in the sessionFactory file), and to respond with an HTTP
                    //Status of 200 with some JSON object we can use to test the data
                    //is being properly returned.
                    $httpBackend.expectGET('/api/users').respond(200, {time : time});
                    adminFactory.getAllUsers()
                        .success(
                        function(data){
                            expect(data.time).toEqual(time);
                        })
                        .error(function(){
                            fail("Error with the http (getAllUsers) request");
                        });
                    $httpBackend.flush();
                });
            });
        });

    });