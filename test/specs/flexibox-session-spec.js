/**
 * Created by dfperry on 1/21/2015.
 */
define(
    ["namespace", "flexibox-session/namespace", "flexibox-session/module.require"],
    function(namespace, ctrlNamespace){

        var name = ctrlNamespace + ".sessionController";

        describe(name, function() {

            var $controller;

            beforeEach(function () {
                module(namespace);

                inject(function (_$controller_) {
                    $controller = _$controller_;
                });
            });

            describe("login tests", function(){
                it("Valid Login name", function(){
                    var $scope = {};

                    $controller(name, {$scope : $scope});

                    $scope.fd.name = "Ben Leeds";
                    $scope.login();

                    expect($scope.username).toEqual("Ben Leeds");
                });
            });

            describe("logout tests", function(){

                it("logout without logging in", function(){
                    var $scope = {};

                    $controller(name, {$scope : $scope});

                    $scope.username = "Ben Leeds";

                    $scope.logout();

                    expect($scope.username).toEqual("");
                });
            });
        });

    });