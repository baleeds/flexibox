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
            ['$scope', '$rootScope', '$log', namespaceCommon + '.homeFactory', namespaceCommon + '.utilityFactory', namespaceCommon + '.sessionFactory',
                function ($scope, $rootScope, $log, homeFactory, utilityFactory, sessionFactory) {

                    var logger = $log.getInstance(name);

                    $scope.editableProject = 0;
                    $scope.projects = {}; // Local instance of projects.  Only contains project name and project description.
                    $scope.formData = {};
                    $scope.potentialUsers = [];

                    sessionFactory.getCurrentUser()
                        .success(function (user) {
                            $scope.user = user;
                            $scope.userForm = {};
                            $scope.userForm.projects = $scope.user.projectsVisible;
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
                        .error(function (err) {
                            // Do nothing
                        });
                    // On controller load, populate project

                    var oldProject = {};

                    $scope.setEditable = function (projectId) {
                        $scope.editableProject = utilityFactory.findById($scope.projects, projectId);
                        oldProject.name = $scope.editableProject.name;
                        oldProject.description = $scope.editableProject.description;
                        $scope.newTags = $scope.editableProject.tags.slice(0);
                    };

                    $scope.confirmEdit = function () {
                        $scope.editableProject.tags = $scope.newTags;
                        homeFactory.updateProject($scope.editableProject._id, $scope.editableProject)
                            .success(function (set) {

                            }).error(function (err) {
                                //
                            });
                        oldProject = {};
                        $scope.newTags = [];
                    };

                    $scope.cancelEdit = function () {
                        $scope.newTags = [];
                        $scope.editableProject.name = oldProject.name;
                        $scope.editableProject.description = oldProject.description;
                        // tags are handled separately
                    };

                    homeFactory.getProjects()
                        .success(function (projectData) {
                            $scope.projects = projectData;
                            console.log($scope.projects);
                        })
                        .error(function (projectData) {
                            logger.error('homeController - Error getting projects: ' + projectData);
                        });

                    // Create a project based on form data.  Called by upload modal
                    $scope.createProject = function () {
                        $scope.formData.userID = $scope.user._id;
                        $scope.formData.tags = $scope.newTags;
                        console.log($scope.formData);
                        var fd = $scope.formData;


                        homeFactory.createProject(fd)
                            .success(function (projectData) {
                                $scope.formData = {};
                                $scope.newTags = [];
                                $scope.projects = projectData;
                            })
                            .error(function (projectData) {
                                logger.error('homeController - Error creating project: ' + projectData);
                            });

                    };

                    // Delete project based on id
                    $scope.deleteProject = function (id) {
                        homeFactory.deleteProject(id)
                            .success(function (projectData) {
                                $scope.projects = projectData;
                            })
                            .error(function (projectData) {
                                logger.error('homeController - Error deleting project: ' + projectData);
                            });
                        homeFactory.deleteUserProject(id)
                            .success(function (data) {

                            })
                            .error(function (projectData) {
                                logger.error('homeController - Error deleting project: ' + projectData);
                            });

                    };

                    $scope.newTag = "";
                    $scope.newTags = [];

                    $scope.addTag = function() {
                        var tagIndex = utilityFactory.findIndexBy("text", $scope.newTags, $scope.newTag);
                        if ($scope.newTag != '' && tagIndex === -1) {
                            $scope.newTag = $scope.newTag.toLowerCase();
                            $scope.newTag = $scope.newTag.replace(/[^a-zA-Z0-9\+\-\.#]/g, '');
                            $scope.newTags.push({'text': $scope.newTag});
                            $scope.newTag = '';
                        }
                    };

                    $scope.removeTag = function(index) {
                        $scope.newTags.splice(index, 1);
                    };

                    $scope.newSharedUser = "";
                    $scope.newSharedUsers = [];

                    $scope.addSharedUser = function(id) {
                        var newUserIndex = utilityFactory.findIndexBy("_id", $scope.newSharedUsers, $scope.newSharedUser);
                        if ($scope.newSharedUser != '' && newUserIndex === -1) {
                            $scope.newSharedUsers.push()
                        }
                    };

                }]);
    });