/**
 * Created by dfperry on 2/6/2015.
 */

define([
        '../module',
        '../namespace',
        '../../common/namespace'
    ],
    function (module, namespace, namespaceCommon) {
        'use strict';

        var name = namespace + ".adminController";
        module.controller(name, ['$scope','$rootScope', namespaceCommon + '.adminFactory', '$location', function ($scope,
                                                                                                                    $rootScope, adminFactory, $location) {
            $scope.userList = {};
            adminFactory.getAllUsers()
                .success(function(users){
                    $scope.userList = users;
                })
                .error(function(err){
                    // do nothing
                });
        }]);
    }
);