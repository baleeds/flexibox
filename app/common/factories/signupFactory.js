/**
 * Created by dfperry on 1/25/2015.
 */
// ------------------------------------------------------------
//
//-------------------------------------------------------------
define([
        '../module',
        '../namespace'
    ],
    function (module, namespace) {
        'use strict';

        var name = namespace + ".signupFactory";
        module.factory(name, ['$http', function ($http) {

            var signupFactory = {};

            // Get all projects
            signupFactory.signup = function(fd) {
                return $http.post('/api/signup', fd);
            };

            return signupFactory;
        }]);
    });