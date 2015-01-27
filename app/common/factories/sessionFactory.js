// ------------------------------------------------------------
//
//-------------------------------------------------------------
define([
        '../module',
        '../namespace'
    ],
    function (module, namespace) {
        'use strict';

        var name = namespace + ".sessionFactory";
        module.factory(name, ['$http', function ($http) {

            var sessionFactory = {};

            sessionFactory.logout = function() {
                return $http.get('/api/logout/');
            };

            return sessionFactory;
        }]);
    });