/**
 * Created by baleeds on 1/31/2015.
 */
define(
    ["namespace", "flexibox-signup/namespace", "flexibox-signup/module.require", "common/module.require"],
    function(namespace, ctrlNamespace){

        var name = ctrlNamespace + ".signupController";

        describe(name, function() {

            var $controller;

            beforeEach(function () {
                module(namespace);

                inject(function (_$controller_) {
                    $controller = _$controller_;
                });
            });


            describe("signup function tests", function(){

                it("signup with no email", function(){
                    var $scope = {};

                    $controller(name, {$scope : $scope});

                    $scope.signupData.password = "pass";
                    $scope.signupData.name = "Ben";
                    $scope.signupData.email = "";


                    $scope.signup();

                    expect($scope.error).toEqual("email");
                });

                it("signup with no name", function(){
                    var $scope = {};

                    $controller(name, {$scope : $scope});

                    $scope.signupData.password = "pass";
                    $scope.signupData.name = "";
                    $scope.signupData.email = "Ben";


                    $scope.signup();

                    expect($scope.error).toEqual("name");
                });

                it("signup with no password", function(){
                    var $scope = {};

                    $controller(name, {$scope : $scope});

                    $scope.signupData.password = "";
                    $scope.signupData.name = "awdawd";
                    $scope.signupData.email = "Ben";


                    $scope.signup();

                    expect($scope.error).toEqual("password");
                });

                it("signup correctly", function(){
                    var $scope = {};

                    $controller(name, {$scope : $scope});

                    $scope.signupData.password = "111";
                    $scope.signupData.name = "awdawd";
                    $scope.signupData.email = "new";


                    $scope.signup();

                    expect($scope.error).toEqual("");
                });
            });
        });

    });