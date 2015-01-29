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
          // $scope.signupData = {};

           $scope.login = function() {
               if(!$scope.loginData.password && $scope.loginData.password != 0){
                   $("#loginFailDiv").show();
               }else if( !$scope.loginData.email && $scope.loginData.email != 0){
                   $("#loginFailDiv").show();
               } else {
                   loginFactory.login($scope.loginData)
                       .success(function (err, user, flash) {
                           $scope.$parent.username = user;  // need to change;
                           $location.path('/projects');
                       })
                       .error(function (err) {
                           $log.error('Login error: ' + err);
                           //$location.path('/');
                           $("#loginFailDiv").show();
                       });
               }
           };
        }]);
    });