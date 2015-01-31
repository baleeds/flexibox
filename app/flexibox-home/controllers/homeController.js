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
              ['$scope','$rootScope', '$log', namespaceCommon + '.homeFactory', namespaceCommon + '.utilityFactory',
               function ($scope, $rootScope, $log, homeFactory, utilityFactory) {

            var logger = $log.getInstance(name);

            $scope.projects = {}; // Local instance of projects.  Only contains project name and project description.

            // On controller load, populate projects
            homeFactory.getProjects()
                .success(function(projectData) {
                    $scope.projects = projectData;
                })
                .error(function(projectData) {
                    logger.error('homeController - Error getting projects: ' + projectData);
                });

            // Create a project based on form data.  Called by upload modal
            $scope.createProject = function() {
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
            };
                   
            $(document).foundation(); // Load foundation when view loads

        }]);
    });