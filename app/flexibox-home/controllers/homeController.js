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
        var PROJECTS_PER_PAGE = 5;

        var name = namespace + ".homeController";
        module.controller(name,
            ['$scope', '$rootScope', '$log', namespaceCommon + '.homeFactory', namespaceCommon + '.utilityFactory', namespaceCommon + '.sessionFactory',
                function ($scope, $rootScope, $log, homeFactory, utilityFactory, sessionFactory) {

                    var logger = $log.getInstance(name);

                    $scope.editableProject = 0;
                    $scope.projects = {}; // Local instance of projects.  Only contains project name and project description.
                    $scope.formData = {};
                    $scope.potentialUsers = [];
                    $scope.pages = [];
                    $scope.page = 1;
                    $scope.deletable = {};
                    var maxPage = 1;

                    $scope.options = [
                        { label: 'Alphabetically by Project Name', value: 'name' },
                        { label: 'Reverse Alphabetically by Project Name', value: 'revName' },
                        { label: 'Last Edited Project', value: 'lastEdit' },
                        {label:  'Newest', value: 'newest'},
                       // {label: 'Number of Members', value:'numMembers'}
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

                    homeFactory.getProjects()
                        .success(function (projectData) {
                            $scope.projects = projectData;
                            sortByKey($scope.projects, "editedAt");
                            console.log($scope.projects);
                            buildMembersList();
                            calculatePages();
                        })
                        .error(function (projectData) {
                            logger.error('homeController - Error getting projects: ' + projectData);
                            $scope.error = 'Error getting projects from bomeFactory';
                        });

                    var buildMembersList = function() {

                    };

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
                                calculatePages();
                            })
                            .error(function (projectData) {
                                logger.error('homeController - Error creating project: ' + projectData);
                                $scope.error = 'Error creating project';
                            });
                    };

                    $scope.setDeletable = function(project) {
                        $scope.deletable = project;
                    };

                    // Delete project based on id
                    $scope.deleteProject = function() {
                        console.log($scope.deletable);
                        var id = $scope.deletable._id;

                        homeFactory.deleteProject(id)
                            .success(function (projectData) {
                                $scope.projects = projectData;
                                calculatePages();
                            })
                            .error(function (projectData) {
                                logger.error('homeController - Error deleting project: ' + projectData);
                                $scope.error = 'Error Deleting Project';
                            });
                        homeFactory.deleteUserProject(id)
                            .success(function (data) {
                                calculatePages();
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


                    $scope.visibleProjects = [];
                    $scope.pageLeft = function(){
                        if ($scope.page > 1) {
                            $scope.page -= 1;
                        }
                        console.log("page left, new page: " + $scope.page);
                        calculatePages();
                    };

                    $scope.pageRight = function () {
                        if ($scope.page < maxPage) {
                            $scope.page += 1;
                        }
                        console.log("page right, new page: " + $scope.page);
                        calculatePages();
                    };

                    $scope.setPage = function(p) {
                        $scope.page = p;
                        console.log("page clicked, new page: " + $scope.page);
                        calculatePages();
                    };

                    var calculatePages = function() {
                        if ($scope.hasOwnProperty("projects")) {
                            maxPage = Math.floor($scope.projects.length / PROJECTS_PER_PAGE) + 1;
                            console.log("calculated pages, maxPage: " + maxPage);
                            $scope.pages = new Array(maxPage);
                            $scope.visibleProjects = $scope.projects.slice(PROJECTS_PER_PAGE * ($scope.page - 1), PROJECTS_PER_PAGE * $scope.page);
                            console.log($scope.visibleProjects);
                        }
                    };

                    function sortByKey(array, key) {
                        if(typeof array != "undefined") {
                            return array.sort(function (a, b) {
                                if(a.hasOwnProperty(key)){
                                    var x = a[key].toLowerCase();
                                    var y = b[key].toLowerCase();
                                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                                }
                                return 1;
                            });
                        }
                    }
                    function sortAlphabetically(array, key) {
                        if(typeof array != "undefined") {
                            return array.sort(function (a, b) {
                                var x = a[key].toLowerCase();
                                var y = b[key].toLowerCase();
                                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                            });
                        }
                    }

                    function sortByNumberOfCommenters(array){
                        return array.sort(function(a, b) {
                            var x = a["commenters"].length(); var y = b["commenters"].length();
                            return ((x >y) ? -1 : ((x < y) ? 1 : 0));
                        });
                    }
                    $scope.filterSelected = function(){
                        var filter = $scope.filter.value;
                        if(filter =="name"){
                           sortAlphabetically($scope.projects, "name");
                        }else if(filter =="revName"){
                            sortByKey($scope.projects, "name")
                        }
                        else if(filter == "lastEdit" ){
                            console.log($scope.projects);
                            sortByKey($scope.projects, "editedAt");
                            console.log($scope.projects);
                        }
                        else if(filter == "newest"){
                            console.log($scope.projects);
                            sortByKey($scope.projects, "createdAt");
                            console.log($scope.projects);
                        }
                        /*else if(filter == "numMembers"){
                            sortByNumberOfCommenters($scope.projects)
                        }*/
                        calculatePages();
                    }
                }]);
    });