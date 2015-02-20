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

            sessionFactory.user = null;

            sessionFactory.logout = function() {
                return $http.get('/api/logout/');
            };

            sessionFactory.login = function(fd) {
                return $http.post('/api/login', fd);
            };

            sessionFactory.getCurrentUser = function() {
                return $http.get('/api/users/current');
            };

            sessionFactory.filterPotentialUsers = function(filterText) {
                return $http.get('/api/users/search/' + filterText);
            }

            sessionFactory.signup = function(fd) {
                return $http.post('/api/signup', fd);
            };

            return sessionFactory;
        }]);
    });