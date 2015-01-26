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
            ['$scope','$rootScope', '$log', namespaceCommon + '.signupFactory', '$location',
                function ($scope, $rootScope, $log, signupFactory, $location) {

                    $scope.signupData = {};

                    $scope.signup = function() {
                        signupFactory.signup($scope.signupData)
                            .success(function(err) {
                                alert("successful registration");
                                $location.path('/projects');
                            })
                            .error(function(err) {
                                $log.error('Signup error: ' + err);
                            });
                    };

                }]);
    });
