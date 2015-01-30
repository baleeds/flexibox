// ------------------------------------------------------------
//
//-------------------------------------------------------------
define([
        '../module',
        '../namespace'
    ],
    function (module, namespace) {
        'use strict';

        var name = namespace + ".loginFactory";
        module.factory(name, ['$http', function ($http) {

            var loginFactory = {};

            // Get all projects
            loginFactory.login = function(fd) {
                return $http.post('/api/login', fd);

            };

            loginFactory.getCurrentUser = function() {
                return $http.get('/api/users/current');
            };
            return loginFactory;
        }]);
    });