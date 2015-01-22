/**
 * Created by dfperry on 1/21/2015.
 */
define(
    ["namespace", "flexibox-session/namespace", "flexibox-session/module.require"],
    function(namespace, ctrlNamespace){

        describe(ctrlNamespace, function() {

            var $controller;

            var name = ctrlNamespace + ".sessionController";

            beforeEach(function () {
                module(namespace);

                inject(function (_$controller_) {
                    $controller = _$controller_;
                });
            });

            describe(name, function(){
                it("login", function(){
                    var $scope = {};

                    $controller(name, {$scope : $scope});

                    $scope.fd.name = "Ben Leeds";
                    $scope.login();

                    expect($scope.username).toEqual("Ben Leeds");
                });

                it("logout", function(){
                    var $scope = {};

                    $controller(name, {$scope : $scope});

                    $scope.username = "Ben Leeds";

                    $scope.logout();

                    expect($scope.username).toEqual("");
                });
            })
        });

    });