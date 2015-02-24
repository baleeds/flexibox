/**
 * Created by baleeds on 1/31/2015.
 */
define(
    ["namespace", "flexibox-login/namespace", "common/namespace", "flexibox-login/module.require", "common/module.require"],
    function(namespace, ctrlNamespace, cmmnNamespace){

        var name = ctrlNamespace + ".loginController";

        describe(name, function() {

            var $controller;
            var $scope;
            var $routeParams;
            var $httpBackend;
            var $sessionFactory;

            beforeEach(function () {
                module(namespace);

                inject(function ($injector) {
                    $controller = $injector.get("$controller");
                    $httpBackend = $injector.get("$httpBackend");

                    $scope = {};
                    $routeParams = {};
                    $controller(name, {$scope: $scope, $routeParams: $routeParams});
                    $sessionFactory = $injector.get(cmmnNamespace + ".sessionFactory");
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe("login", function() {
                it("login with correct info", function() {
                    $httpBackend.expectPOST('/api/login').respond(200, true);
                    $httpBackend.expectGET('/api/users/current').respond(200, {_id : 1, name : "benjamin"});
                    $scope.loginData.email = "ben";
                    $scope.loginData.password = "password";

                    $scope.login();
                    $httpBackend.flush();
                    expect($sessionFactory.user.name).toBe("benjamin");

                });
            });

        });
    });

