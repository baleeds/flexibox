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
            /**
             * Makes sure the "getAll" function is calling the correct route, and recieving
             * the response from that route appropiately.
             */
            describe("admin tests", function () {
                it("testing getAll function", function () {
                    var time = Date.now();
                    $httpBackend.expectGET('/api/users').respond(200, {time: time});
                    adminFactory.getAllUsers()
                        .success(
                        function (data) {
                            expect(data.time).toEqual(time);
                        })
                        .error(function () {
                            fail("Error with the http (getAllUsers) request");
                        });
                    $httpBackend.flush();
                });
                /**
                 * Test that the updateRoles function is properly passing on data to the
                 * API route call, and that the data is the data we expect it to be.
                 */
                it("testing updateRoles function", function () {
                    var time = Date.now();
                    var fd = [{"id": "5", "name": "Dylan", "role": "Commenter"}];
                    $httpBackend.whenPOST('/api/users/updateRoles',
                        function (postData) {
                            expect(postData.id).toEqual(fd.id);
                            expect(postData.name).toEqual(fd.name);
                            expect(postData.role).toEqual(fd.role);
                            return true;
                        }).respond(200, true);

                    adminFactory.updateRoles(fd)
                        .success(
                        function (data) {
                            expect(data).toEqual(true);
                        })
                        .error(function () {
                            fail("Error with the http (getAllUsers) request");
                        });
                    $httpBackend.flush();
                });
                /**
                 * Test that the function is recieving the response from the correct place.
                 */
                it("testing updateRole response", function () {
                    var time = Date.now();

                    $httpBackend.expectPOST('/api/users/updateRoles').respond(200, {time: time});
                    var fd = [{"id": "5", "name": "Dylan", "role": "Commenter"}];
                    adminFactory.updateRoles(fd)
                        .success(
                        function (data) {
                            expect(data.time).toEqual(time);
                        })
                        .error(function () {
                            fail("Error with the http (getAllUsers) request");
                        });
                    $httpBackend.flush();
                });
            });
        });
    });