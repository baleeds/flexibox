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

        var name = namespace + ".loginController";
        module.controller(name,
              ['$scope','$rootScope', '$log', namespaceCommon + '.loginFactory', '$location',
               function ($scope, $rootScope, $log, loginFactory, $location) {

           $scope.loginData = {};
           $scope.signupData = {};

           $scope.login = function() {
               loginFactory.login($scope.loginData)
                   .success(function(err) {
                       alert("successful login");
                        $location.path('/projects');
                   })
                   .error(function(err) {
                       logger.error('Login error: ' + err);
                   });
           };

           $scope.signup = function() {
               loginFactory.signup($scope.signupData)
                   .success(function(err) {
                       alert("successful registration");
                       $location.path('/projects');
                   })
                   .error(function(err) {
                       logger.error('Signup error: ' + err);
                   });
           };

        }]);
    });