define([
        '../module'
    ],
    function (module) {
        'use strict';

        var name = "closable";
        module.directive(name, function() {
            return {
                restrict: 'A',
                link: function($scope) {

                    $scope.dCloseDiv = function() {
                        $parent.newDiv = 0;
                    };

                }
            };
        });
    });