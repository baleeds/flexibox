// ------------------------------------------------------------
//
//-------------------------------------------------------------
define([
        '../module',
        '../namespace'
    ],
    function (module, namespace) {
        'use strict';

        var name = namespace + ".flashFactory";
        module.factory(name, ['$rootScope', function ($rootScope) {

            var queue = [];
            var currentMessage = "";

            $rootScope.$on("$routeChangeSuccess", function() {
                currentMessage = queue.shift() || "";
            });

            return {
                setMessage: function(message) {
                    queue.push(message);
                },
                getMessage: function() {
                    return currentMessage;
                }
            };
        }]);
    });