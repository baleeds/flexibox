/**
 * Created by dfperry on 2/6/2015.
 */

define([
        '../module',
        '../namespace'
    ],
    function (module, namespace) {
        'use strict';
        var adminFactory = {};
        var name = namespace + ".adminFactory";
        module.factory(name, ['$http', function ($http) {

            adminFactory.getAllUsers = function() {
                return $http.get('/api/users');
            };

            adminFactory.updateRoles = function(fd){
                return $http.post('/api/users/updateRoles', fd);
            };

            return adminFactory;
        }]);
    });