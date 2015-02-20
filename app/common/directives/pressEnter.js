// ------------------------------------------------------------
// A directive used to call a function when enter is pressed
//-------------------------------------------------------------
define([
        '../module'
    ],
    function (module) {
        'use strict';

        var name = "pressEnter";
        module.directive(name, function() {
            return function(scope, element, attrs) {
                element.bind("keydown keypress", function(event) {
                    if (event.which === 13 || event.which === 32) {
                        scope.$apply(function() {
                            scope.$eval(attrs.pressEnter);
                        });

                        event.preventDefault();
                    }
                });
            };
        });
    });