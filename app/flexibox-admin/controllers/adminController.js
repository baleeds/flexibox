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
            $scope.userModels = [];
            $scope.options = [
                { label: 'Commenter', value: 'commenter' },
                { label: 'Project Owner', value: 'projOwner' },
                {label:  'System Admin', value: 'sysAdmin'}
            ];

            $scope.formDataArray = [];
            var formObj = {};

            adminFactory.getAllUsers()
                .success(function(users){
                    $scope.userList = users;
                })
                .error(function(err){
                    // do nothing
                });

            $scope.updateRoles = function(){
                for(var i = 0; i<$scope.userModels.length; i++){
                    if($scope.userModels[i] == null){
                        console.log(i);
                    }
                    else{
                        console.log("Hey");
                        formObj.id = $scope.userList[i]._id;
                        formObj.name = $scope.userList[i].name;
                        formObj.role = $scope.userModels[i];
                        $scope.formDataArray = $scope.formDataArray.concat(formObj);
                        formObj = {};
                    }
                }
                adminFactory.updateRoles($scope.formDataArray);
            };
        }]);
    }
);