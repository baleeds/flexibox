/**
 * Created by Andie on 1/22/2015.
 */

define(
    ["namespace", "common/namespace", "common/module.require"],
    function(namespace, ctrlNamespace){

        describe(ctrlNamespace, function() {

            var $controller;

            var name = ctrlNamespace + ".utilityFactory";

            beforeEach(function () {
                module(namespace);

                inject(function (_$controller_) {
                    $controller = _$controller_;
                });
            });

            describe(name, function(){
                it("$scope.login", function(){
                    var $scope = {};

                    $controller(name, {$scope : $scope});

                    debugger;

                });

            })
        });

    });