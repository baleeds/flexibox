// ------------------------------------------------------------
// Controller used for the set details view.  Used to create new
// posts.
//-------------------------------------------------------------
define([
        '../module',
        '../namespace',
        '../../common/namespace'
    ],
    function (module, namespace, namespaceCommon) {
        'use strict';

        var POSTS_PER_PAGE = 10;

        var name = namespace + '.setController';
        module.controller(name,
            ['$scope', '$rootScope', '$log', namespaceCommon + '.setFactory', '$routeParams', namespaceCommon + '.utilityFactory', namespaceCommon + '.postFactory',
                function ($scope, $rootScope, $log, setFactory, $routeParams, utilityFactory, postFactory) {
                    var logger = $log.getInstance(name);

                    $scope.backURL = {};           // URL used to go back to the project
                    $scope.set = {};               // local instance of focused set
                    $scope.formData = {};          // data from form in upload modal
                    var newImageURL = "";          // stores URL of most recently uploaded image
                    $scope.imageUp = 0;            // determines whether an image was uploaded
                    $scope.imageButtonState = "";  // text to be displayed on image button (uploading..., delete)
                    var oldPost = {};				//
                    $scope.editablePost = {};
                    $scope.pagination = POSTS_PER_PAGE;
                    $scope.pageLength = POSTS_PER_PAGE;
                    $scope.options = [
                        { label: 'Alphabetically by Set Name', value: 'name' },
                        { label: 'Reverse Alphabetically by Set Name', value: 'revName' },
                        { label: 'Set Last Edited', value: 'lastEdit' },
                        {label:  'Newest Set', value: 'newest'}
                        // {label: 'Number of Members', value:'numMembers'}
                    ];

                    // On controller load, populate local instance of focused set
                    setFactory.getSet($routeParams.projectId, $routeParams.setId)
                        .success(function (set) {
                            $scope.backURL = $routeParams.projectId;
                            $scope.set = set;
                            console.log(set.posts);
                        })
                        .error(function (project) {
                            logger.error('setController - Error getting project by id: ' + project);
                        });

                    $scope.postEditable = function (postId) {
                        $scope.editablePost = utilityFactory.findById($scope.set.posts, postId);
                        oldPost.name = $scope.editablePost.name;
                        oldPost.description = $scope.editablePost.description;
                        $scope.newTags = $scope.editablePost.tags.slice(0); // use slice to copy data as opposed to point to it.
                    };

                    $scope.confirmEdit = function () {
                        $scope.editablePost.tags = $scope.newTags;
                        postFactory.updatePost($routeParams.projectId, $routeParams.setId, $scope.editablePost._id, $scope.editablePost)
                            .success(function (post) {
                                //
                            }).error(function (err) {
                                alert("error");
                            });
                        $scope.newTags = [];
                    };

                    $scope.cancelEdit = function () {
                        $scope.editablePost.name = oldPost.name;
                        $scope.editablePost.description = oldPost.description;
                        $scope.newTags = [];
                        $scope.newTag = "";
                    };

                    // Upload an image to filesystem and set newImageURL
                    $scope.uploadFile = function (files) {
                        if (files[0].type === "image/jpeg" || files[0].type === "image/png") {
                            $scope.imageButtonState = "Uploading...";
                            setFactory.uploadFile(files)

                                .success(function (data) {
                                    newImageURL = data.imageURL;
                                    $scope.imageButtonState = "Remove";
                                    $scope.imageUp = 1;
                                    var postName = files[0].name.split(".");
                                    $scope.formData.name = postName[0];
                                })
                                .error(function (imageURL) {
                                    logger.error('setController - Error uploading file: ' + imageURL);
                                });
                        } else {
                            alert("Error: Invalid File Type.  Please choose a PNG or JPEG image.");
                            $scope.dReset('imageForm');
                        }
                    };

                    // Add a post to the local project using form data and newImageUrl
                    $scope.addPost = function () {
                        var fd = $scope.formData;
                        fd.imageURL = newImageURL;
                        fd.tags = $scope.newTags;
                        setFactory.createPost($routeParams.projectId, $routeParams.setId, fd)
                            .success(function (set) {
                                newImageURL = {};
                                $scope.formData = {};
                                $scope.imageUp = 0;
                                $scope.imageButtonState = "";
                                $scope.set = set;
                            })
                            .error(function (project) {
                                logger.error('setController - Error creating post: ' + project);
                            });
                        $scope.newTags = [];
                    };

                    // Clear form
                    $scope.clearForm = function () {
                        $scope.formData = {};
                    };

                    // Reset the image upload.  Includes deleting the image.
                    $scope.resetImage = function () {
                        if ($scope.imageButtonState === "Remove" || $scope.imageButtonState === "Uploading...") {
                            setFactory.deleteUpload(newImageURL.replace("\\", "/"))
                                .success(function (data) {
                                    newImageURL = "";
                                    $scope.imageUp = 0;
                                    $scope.imageButtonState = "";
                                    $scope.formData.name = '';
                                })
                                .error(function (data) {
                                    $scope.imageButtonState = "";
                                    logger.error('setController - Error resetting image: ' + data);
                                });
                        }
                    };

                    // Delete post.  Includes deleting the image from filesystem.
                    $scope.deletePost = function (id) {
                        var deleteImg = utilityFactory.findById($scope.set.posts, id).imageURL;
                        setFactory.deleteUpload(deleteImg.replace("\\", "/"))
                            .success(function (data) {
                                //
                            })
                            .error(function (data) {
                                logger.error('setController - Error resetting image: ' + data);
                            });

                        setFactory.deletePost($routeParams.projectId, $routeParams.setId, id)
                            .success(function (set) {
                                $scope.set = set;
                            })
                            .error(function (data) {
                                logger.error('setController - Error deleting posts: ' + data);
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

                    $scope.pageLeft = function () {
                        if ($scope.paginationUpper > POSTS_PER_PAGE) {
                            $scope.paginationUpper -= POSTS_PER_PAGE;
                        }
                    };

                    $scope.pageRight = function () {
                        if ($scope.paginationUpper < $scope.set.posts.length) {
                            $scope.paginationUpper += POSTS_PER_PAGE;
                        }
                    };

                    $scope.endRight = function(){
                        $scope.pagination = Math.ceil($scope.set.posts.length / POSTS_PER_PAGE) * POSTS_PER_PAGE;
                    };

                    $scope.pageLeft = function(){
                        if($scope.paginationUpper > POSTS_PER_PAGE){
                            $scope.paginationUpper -= POSTS_PER_PAGE;
                            if($scope.pagination > $scope.set.posts.length){
                                $scope.pageLength = ($scope.set.posts.length % POSTS_PER_PAGE);
                            }
                        }
                    };

                    $scope.endLeft = function(){
                        $scope.pagination = POSTS_PER_PAGE;
                        if($scope.pagination > $scope.set.posts.length){
                            $scope.pageLength = ($scope.set.posts.length % POSTS_PER_PAGE);
                        }
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
                            sortAlphabetically($scope.set.posts, "name");
                        }else if(filter =="revName"){
                            sortByKey($scope.set.posts, "name");
                        }
                        else if(filter == "lastEdit" ){
                            sortByKey($scope.set.posts, "editedAt");
                        }
                        else if(filter == "newest"){
                            console.log($scope.project.sets);
                            sortByKey($scope.set.posts, "createdAt");
                        }
                        /*else if(filter == "numMembers"){
                         sortByNumberOfCommenters($scope.projects)
                         }*/
                    };

                }]);
    });