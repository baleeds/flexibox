// ------------------------------------------------------------
// Controller that is loaded on the home view (index).  Has the ability
// to add and remove projects.
//-------------------------------------------------------------
define([
        '../module',
        '../namespace',
        '../../common/namespace'
    ],
    function (module, namespace, namespaceCommon) {
        'use strict';

        var name = namespace + ".signupController";
        module.controller(name,
            ['$scope','$rootScope', '$log', namespaceCommon + '.sessionFactory', '$location',
                function ($scope, $rootScope, $log, sessionFactory, $location) {

                    $scope.signupData = {};
                    $scope.error = "";


                    $scope.signup = function() {
                        if (!$scope.signupData.password) {
                            $scope.error = "password";
                        } else if (!$scope.signupData.email) {
                            $scope.error = "email";
                        } else if (!$scope.signupData.name) {
                            $scope.error = "name";
                        } else {
                            sessionFactory.signup($scope.signupData)
                                .success(function (err) {
                                    sessionFactory.getCurrentUser()
                                        .success(function(user) {
                                            $rootScope.$broadcast('userChanged', user);
                                        })
                                        .error(function (err) {
                                            $log.error('Login error: ' + err);
                                        });
                                    $location.path('/projects');
                                })
                                .error(function (err) {
                                    $log.error('Signup error: ' + err);
                                    $scope.error = "unknown";
                                });
                        }
                    }
                }]);
    });
