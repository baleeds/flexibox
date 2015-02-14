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

        var name = namespace + ".homeController";
        module.controller(name,
              ['$scope','$rootScope', '$log', namespaceCommon + '.homeFactory', namespaceCommon + '.utilityFactory',namespaceCommon +'.sessionFactory',
               function ($scope, $rootScope, $log, homeFactory, utilityFactory, sessionFactory) {

            var logger = $log.getInstance(name);

            $scope.projects = {}; // Local instance of projects.  Only contains project name and project description.
            sessionFactory.getCurrentUser()
                 .success(function(user) {
                    $scope.user = user;
                    $scope.userForm ={};
                    $scope.userForm.projects =$scope.user.projectsVisible;
                    /**
                    homeFactory.getUserProjects($scope.userForm)
                        .success(function(projectData){
                            $scope.projects = projectData;
                        })
                        .error(function(projectData) {
                            logger.error('homeController - Error getting projects: ' + projectData);
                        });
                     */
                   })
                .error(function(err) {
                               // Do nothing
                   });
            // On controller load, populate project


            homeFactory.getProjects()
                .success(function(projectData) {
                    $scope.projects = projectData;
                })
                .error(function(projectData) {
                    logger.error('homeController - Error getting projects: ' + projectData);
                });

            // Create a project based on form data.  Called by upload modal
            $scope.createProject = function() {
                $scope.formData.userID = $scope.user._id;
                var fd = $scope.formData;


                homeFactory.createProject(fd)
                    .success(function(projectData) {
                        $scope.formData = {};
                        $scope.projects = projectData;
                    })
                    .error(function(projectData) {
                        logger.error('homeController - Error creating project: ' + projectData);
                    });
            };

            // Update a project's persistence based on local project data
            $scope.updateProject = function(project) {
                //update project
            };

            // Delete project based on id
            $scope.deleteProject = function(id) {
                homeFactory.deleteProject(id)
                    .success(function(projectData) {
                        $scope.projects = projectData;
                    })
                    .error(function(projectData) {
                        logger.error('homeController - Error deleting project: ' + projectData);
                    });
                homeFactory.deleteUserProject(id)
                    .success(function(data){

                    })
                    .error(function(projectData) {
                        logger.error('homeController - Error deleting project: ' + projectData);
                    });

            };

        }]);
    });