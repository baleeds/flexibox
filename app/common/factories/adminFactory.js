/**
 * Created by dfperry on 2/6/2015.
 */

define([
        '../module',
        '../namespace'
    ],
    function (module, namespace) {
        'use strict';

        var name = namespace + ".adminFactory";
        module.factory(name, ['$http', function ($http) {

            sessionFactory.getAllUsers = function() {
                return $http.get('/api/users');
            };
        }]);
    });