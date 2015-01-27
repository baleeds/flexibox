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

                        if (!$scope.signupData.password && $scope.signupData.password != 0) {
                            $('#signupFailDiv').html("<strong> There was an error in signing up</strong> <br/> This was most likely caused by a blank password field");
                            $('#signupFailDiv').show();
                        } else if (!$scope.signupData.email && $scope.signupData.email != 0) {
                            $('#signupFailDiv').html("<strong> There was an error in signing up</strong> <br/> This was most likely caused by a blank email field");
                            $('#signupFailDiv').show();
                        } else {
                            signupFactory.signup($scope.signupData)
                                .success(function (err) {
                                    alert("successful registration");
                                    $location.path('/projects');
                                })
                                .error(function (err) {
                                    $log.error('Signup error: ' + err);
                                    $('#signupFailDiv').html("<strong> There was an error in signing up</strong> <br/>" + err);
                                    $('#signupFailDiv').show();


                                });
                        }
                    }
                }]);
    });
