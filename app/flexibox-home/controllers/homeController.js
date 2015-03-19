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
        var PROJECTS_PER_PAGE = 9;

        var name = namespace + ".homeController";
        module.controller(name,
            ['$scope', '$rootScope', '$log', namespaceCommon + '.homeFactory', namespaceCommon + '.utilityFactory', namespaceCommon + '.sessionFactory',
                function ($scope, $rootScope, $log, homeFactory, utilityFactory, sessionFactory) {

                    var logger = $log.getInstance(name);

                    $scope.editableProject = 0;
                    $scope.projects = {}; // Local instance of projects.  Only contains project name and project description.
                    $scope.formData = {};
                    $scope.potentialUsers = [];
                    $scope.pagination = PROJECTS_PER_PAGE;
                    $scope.pageLength = PROJECTS_PER_PAGE;

                    $scope.options = [
                        { label: 'Project Name', value: 'name' },
                        { label: 'Project Last Edited', value: 'lastEdit' },
                        {label:  'Newest', value: 'newest'},
                        {label: 'Number of Members', value:'numMembers'}
                    ];
                    $scope.filter = "";

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
                            $scope.error = "Session Factory Error getting user";
                            // Do nothing
                        });
                    // On controller load, populate project

                    var oldProject = {};

                    $scope.setEditable = function (projectId) {
                        $scope.editableProject = utilityFactory.findById($scope.projects, projectId);
                        oldProject.name = $scope.editableProject.name;
                        oldProject.description = $scope.editableProject.description;
                        $scope.newTags = $scope.editableProject.tags.slice(0); // use slice to copy data as opposed to point to it.
                        $scope.newSharedUsers = $scope.editableProject.commenters.slice(0); // same
                    };

                    $scope.confirmEdit = function () {
                        $scope.editableProject.tags = $scope.newTags;
                        $scope.editableProject.commenters = $scope.newSharedUsers;
                        $scope.editableProject.editedAt = new Date().toISOString();
                        homeFactory.updateProject($scope.editableProject._id, $scope.editableProject)
                            .success(function (set) {

                            }).error(function (err) {

                                $scope.error = "Error confirming confirming Edit";
                            });
                        oldProject = {};
                        $scope.newTags = [];
                        $scope.newSharedUsers = [];
                    };

                    $scope.cancelEdit = function () {
                        $scope.newTags = [];
                        $scope.newSharedUsers = [];
                        $scope.editableProject.name = oldProject.name;
                        $scope.editableProject.description = oldProject.description;
                        // tags are handled separately
                    };

                    homeFactory.getProjects()
                        .success(function (projectData) {
                            $scope.projects = projectData;
                            sortByKey($scope.projects, "name");
                            console.log($scope.projects);
                        })
                        .error(function (projectData) {
                            logger.error('homeController - Error getting projects: ' + projectData);
                            $scope.error = 'Error getting projects from bomeFactory';
                        });

                    // Create a project based on form data.  Called by upload modal
                    $scope.createProject = function () {
                        $scope.formData.userID = $scope.user._id;
                        $scope.formData.tags = $scope.newTags;
                        $scope.formData.commenters = $scope.newSharedUsers;
                        console.log($scope.formData);
                        var fd = $scope.formData;


                        homeFactory.createProject(fd)
                            .success(function (projectData) {
                                $scope.formData = {};
                                $scope.newTags = [];
                                $scope.newSharedUsers = [];
                                $scope.projects = projectData;
                            })
                            .error(function (projectData) {
                                logger.error('homeController - Error creating project: ' + projectData);
                                $scope.error = 'Error creating project';
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
                                $scope.error = 'Error Deleting Project';
                            });
                        homeFactory.deleteUserProject(id)
                            .success(function (data) {

                            })
                            .error(function (projectData) {
                                logger.error('homeController - Error deleting project: ' + projectData);
                                $scope.error = 'Error in homeFactory deleting project';
                            });

                    };

                    $scope.newTag = "";
                    $scope.newTags = [];

                    $scope.addTag = function () {
                        var tagIndex = utilityFactory.findIndexBy("text", $scope.newTags, $scope.newTag);
                        if ($scope.newTag != '' && tagIndex === -1) {
                            $scope.newTag = $scope.newTag.toLowerCase();
                            $scope.newTag = $scope.newTag.replace(/[^a-zA-Z0-9\+\-\.#]/g, '');
                            $scope.newTags.push({'text': $scope.newTag});
                            $scope.newTag = '';
                        }
                    };

                    $scope.removeTag = function (index) {
                        $scope.newTags.splice(index, 1);
                    };

                    $scope.newSharedUser = "";
                    $scope.newSharedUsers = [];

                    $scope.filterPotentialUsers = function () {
                        if ($scope.newSharedUser === "") {
                            $scope.potentialUsers = [];
                        } else {
                            sessionFactory.filterPotentialUsers($scope.newSharedUser)
                                .success(function (potentialUsers) {

                                    $scope.potentialUsers = potentialUsers;
                                })
                                .error(function (err) {
                                    console.log(err);
                                    $scope.error = "Error filtering potential users";
                                });
                        }
                    };

                    $scope.addSharedUser = function (user) {
                        var newUserIndex = utilityFactory.findIndexBy("_id", $scope.newSharedUsers, user._id);
                        if ($scope.newSharedUser != '' && newUserIndex === -1) {
                            $scope.newSharedUsers.push(user);
                            $scope.newSharedUser = "";
                            $scope.potentialUsers = [];

                        }
                    };

                    $scope.removeNewSharedUser = function (userId) {
                        var newUserIndex = utilityFactory.findIndexBy("_id", $scope.newSharedUsers, userId);
                        $scope.newSharedUsers.splice(newUserIndex, 1);
                    };

                    $scope.pageLeft = function(){
                        if($scope.pagination > PROJECTS_PER_PAGE){
                            $scope.pagination -= PROJECTS_PER_PAGE;
                            $scope.pageLength = PROJECTS_PER_PAGE;
                        }
                    };

                    $scope.endLeft = function(){
                        $scope.pagination = PROJECTS_PER_PAGE;
                        $scope.pageLength = PROJECTS_PER_PAGE;
                    };

                    $scope.pageRight = function () {
                        if ($scope.pagination < $scope.projects.length) {
                            $scope.pagination += PROJECTS_PER_PAGE;
                            if($scope.pagination > $scope.projects.length){
                                $scope.pageLength = ($scope.projects.length % PROJECTS_PER_PAGE);
                            }
                        }
                    };

                    $scope.endRight = function(){
                        $scope.pagination = Math.ceil($scope.projects.length / PROJECTS_PER_PAGE) * PROJECTS_PER_PAGE;
                        if($scope.pagination > $scope.projects.length){
                            $scope.pageLength = ($scope.projects.length % PROJECTS_PER_PAGE);
                        }
                    };

                    function sortByKey(array, key) {
                        return array.sort(function(a, b) {
                            var x = a[key]; var y = b[key];
                            debugger;
                            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                        });
                    }

                    $scope.filterSelected = function(){
                        var filter = $scope.filter.value;
                        if(filter == "lastEdit" ){
                            console.log($scope.projects);
                            sortByKey($scope.projects, "editedAt");
                            console.log($scope.projects);
                        }
                        if(filter == "newest"){
                            console.log($scope.projects);
                            sortByKey($scope.projects, "createdAt");
                            console.log($scope.projects);
                        }
                    }

                }]);
    });