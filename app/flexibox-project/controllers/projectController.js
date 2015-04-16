// ------------------------------------------------------------
// Controller used for the project details page.  Manipulates sets.
//-------------------------------------------------------------
define([
        '../module',
        '../namespace',
        '../../common/namespace'
    ],
    function (module, namespace, namespaceCommon) {
        'use strict';

        var SETS_PER_PAGE = 5;

        var name = namespace + ".projectController";
        module.controller(name,
            ['$scope', '$rootScope', '$log', namespaceCommon + '.projectFactory', '$routeParams', namespaceCommon + '.utilityFactory', namespaceCommon + '.setFactory',
                function ($scope, $rootScope, $log, projectFactory, $routeParams, utilityFactory, setFactory) {

                    var logger = $log.getInstance(name);      // logger
                    $scope.project = {};                      // Local instance of focused project.  Only contains project name, description, set.name, set.description
                    $scope.formData = {};                     // Data from the new set modal
                    $scope.editableSet = {};
                    var oldSet = {};
                    $scope.pages = [];
                    $scope.page = 1;
                    var maxPage = 1;
                    $scope.options = [
                        { label: 'Alphabetically by Set Name', value: 'name' },
                        { label: 'Reverse Alphabetically by Set Name', value: 'revName' },
                        { label: 'Set Last Edited', value: 'lastEdit' },
                        {label:  'Newest Set', value: 'newest'}
                        // {label: 'Number of Members', value:'numMembers'}
                    ];

                    // On controller load, populate local instance of focused project
                    projectFactory.getProject($routeParams.projectId)
                        .success(function (project) {
                            $scope.project = project;
                            console.log(project);
                            //sortAlphabetically($scope.project.sets);
                            calculatePages();
                        })
                        .error(function (project) {
                            $scope.error = 'projectController - Error getting project by id';
                            logger.error('projectController - Error getting project by id: ' + project);
                        });

                    $scope.setEditable = function (setId) {
                        $scope.editableSet = utilityFactory.findById($scope.project.sets, setId);
                        oldSet.name = $scope.editableSet.name;
                        oldSet.description = $scope.editableSet.description;
                        $scope.newTags = $scope.editableSet.tags.slice(0); // use slice to copy data as opposed to point to it.
                    };

                    $scope.confirmEdit = function () {
                        $scope.editableSet.tags = $scope.newTags;
                        setFactory.updateSet($scope.project._id, $scope.editableSet._id, $scope.editableSet)
                            .success(function (set) {
                                //
                            })
                            .error(function (err) {
                                //
                                $scope.error = "Error in Editing";
                            });
                        oldSet = {};
                        $scope.newTags = [];
                    };

                    $scope.cancelEdit = function () {
                        $scope.editableSet.name = oldSet.name;
                        $scope.editableSet.description = oldSet.description;
                        $scope.newTags = [];
                        $scope.newTag = "";
                    };

                    // Add a set to a project based on form data
                    $scope.addSet = function () {
                        $scope.formData.tags = $scope.newTags;
                        var fd = $scope.formData;
                        projectFactory.createSet($routeParams.projectId, fd)
                            .success(function (project) {
                                $scope.formData = {};
                                $scope.project = project;
                                calculatePages();
                            })
                            .error(function (project) {
                                $scope.error = 'projectController - Error adding set to project';
                                logger.error('projectController - Error adding set to project: ' + project);
                            });
                        $scope.newTags = [];
                    };

                    // Delete a set based on ID
                    $scope.deleteSet = function (id) {
                        projectFactory.deleteSet($routeParams.projectId, id)
                            .success(function (project) {
                                $scope.project = project;
                                calculatePages();
                            })
                            .error(function (project) {
                                $scope.error = 'projectController - Error deleting set from project';
                                logger.error('projectController - Error deleting set from project: ' + project);
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


                    $scope.visibleSets = [];
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
                        maxPage = Math.floor(($scope.project.sets.length - 1) / SETS_PER_PAGE) + 1;
                        console.log("calculated pages, maxPage: " + maxPage);
                        $scope.pages = new Array(maxPage);
                        $scope.visibleSets = $scope.project.sets.slice(SETS_PER_PAGE * ($scope.page - 1), SETS_PER_PAGE * $scope.page);
                        console.log("visible: ", $scope.visibleSets);
                    };

                    function sortByKey(array, key) {
                        return array.sort(function(a, b) {
                            var x = a[key].toLowerCase(); var y = b[key].toLowerCase();
                            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                        });
                    }

                    function sortAlphabetically(array, key) {
                        return array.sort(function(a, b) {
                            var x = a[key].toLowerCase(); var y = b[key].toLowerCase();
                            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                        });
                    }

                    $scope.filterSelected = function(){
                        var filter = $scope.filter.value;
                        if(filter =="name"){
                            sortAlphabetically($scope.project.sets, "name");
                        }else if(filter =="revName"){
                            console.log($scope.project.sets);
                            sortByKey($scope.project.sets, "name");
                            console.log($scope.project.sets);
                        }
                        else if(filter == "lastEdit" ){
                            sortByKey($scope.project.sets, "editedAt");
                        }
                        else if(filter == "newest"){
                            console.log($scope.project.sets);
                            sortByKey($scope.project.sets, "createdAt");
                        }
                        /*else if(filter == "numMembers"){
                         sortByNumberOfCommenters($scope.projects)
                         }*/
                        calculatePages();
                    };
                    
                }]);
    });