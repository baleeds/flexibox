define(
    ["namespace", "flexibox-some/namespace", "flexibox-some/module.require", "common/module.require"],
    function(namespace, ctrlNamespace) {

        //Recreate the controllers namespace.
        var name = ctrlNamespace + ".someController";

        //Create an initial test suite.
        describe(name, function () {

            //variables to be used for testing
            var $controller;
            var $httpBackend;
            var $scope = {};

            //Before each, construct the objects we use for testing.
            beforeEach(function () {
                module(namespace);

                inject(function ($injector) {
                    $controller = $injector.get("$controller");
                    $httpBackend = $injector.get("$httpBackend");

                    //$httpBackend.expect calls needed for controller construction,
                    //and provide data for the controller.

                    $scope = {};
                    $controller(name, {$scope: $scope});
                    $httpBackend.flush();
                });
            });

            //Make sure all requests are made.
            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            //Test an individual function
            describe("someFunction", function(){

                //Test case for a specific use case of the function
                it("some scenario", function() {
                    //assertions or expect(...).toBe(...)
                });
            });

        })
    }
);
