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
              ['$scope','$rootScope', '$log', namespaceCommon + '.sessionFactory', '$location',
               function ($scope, $rootScope, $log, sessionFactory, $location) {

           $scope.loginData = {};
           $scope.isLoggedIn = false;
           $scope.username = "";
           $scope.loginFail = false;


           if (sessionFactory.user != null) {
               console.log("Yes");
               $scope.isLoggedIn = true;
               $scope.username = sessionFactory.user.name;
           }

          // $scope.signupData = {};

           $scope.login = function() {
               if(!$scope.loginData.password && $scope.loginData.password != 0){
                   $scope.loginFail = true;
               }else if( !$scope.loginData.email && $scope.loginData.email != 0){
                   $scope.loginFail = true;
               } else {
                   sessionFactory.login($scope.loginData)
                       .success(function (err, user, flash) {
                           sessionFactory.getCurrentUser()
                               .success(function(user) {
                                   $rootScope.$broadcast('userChanged', user);
                                   sessionFactory.user = user;
                               })
                               .error(function (err) {
                                   $log.error('Login error: ' + err);
                               });
                           $location.path('/projects');
                       })
                       .error(function (err) {
                           $log.error('Login error: ' + err);
                           //$location.path('/');
                           $scope.loginFail = true;
                       });
               }
           };
        }]);
    });