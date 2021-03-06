// ------------------------------------------------------------
// Controller for the post details view.  Allows the addition of
// comments.
//-------------------------------------------------------------
define([
        '../module',
        '../namespace',
        '../../common/namespace'
    ],
    function (module, namespace, namespaceCommon) {
        'use strict';

        var name = namespace + ".postController";
        module.controller(name, ['$scope', '$rootScope', namespaceCommon + '.postFactory', namespaceCommon + '.utilityFactory', '$routeParams',
            function ($scope, $rootScope, postFactory, utilityFactory, $routeParams) {

                $scope.post = {};                                                          // local instance of focused post
                $scope.newComment = {};                                                    // data from form in upload modal
                $scope.backURL = $routeParams.projectId + '/' + $routeParams.setId;        // url to the previous page.  Used to feed routeParams to the front end.
                $scope.currentComment = 0;
                $scope.container = null;
                $scope.isDown = false;
                $scope.currentView = 'full';
                $scope.locationComments = 1;

                $scope.$sidebar = $(".sidebar");

                var a = {};
                var b = {};
                var smallest = {};
                var biggest = {};
                $scope.newDiv = 0;

                // On controller load, populate local instance of focused post
                postFactory.getPost($routeParams.projectId, $routeParams.setId, $routeParams.postId)
                    .success(function (post) {
                        $scope.post = post;
                    })
                    .error(function (post) {
                        console.error('postController - Error getting project by id: ' + post);
                    });


                // Update posts name and decription
                $scope.updatePost = function (project) {
                    //
                };

                // Add comment using comment input and username
                $scope.addComment = function () {
                    var fd = {};
                    fd.txt = $scope.newComment.cText;
                    fd.posterName = $scope.$parent.user.name;
                    fd.smallest = smallest;
                    fd.width = biggest.x - smallest.x;
                    fd.height = biggest.y - smallest.y;
                    fd.number = $scope.post.comments.length + 1;
                    fd.color = utilityFactory.randomColor(4);

                    console.log(fd);

                    postFactory.addComment($routeParams.projectId, $routeParams.setId, $routeParams.postId, fd)
                        .success(function (post) {
                            $scope.post = post;
                            $scope.newComment = {};
                            if ($scope.newDiv != 0) {
                                document.getElementById('imageDiv').removeChild($scope.newDiv);
                                $scope.newDiv = 0;
                                smallest = {};
                            }
                        })
                        .error(function (post) {
                            console.error('postController - Error adding comment: ' + post);
                        });
                };

                // Add comment using comment input and username
                $scope.addReply = function (commentId, text) {
                    var fd = {};
                    fd.txt = text;

                    postFactory.addReply($routeParams.projectId, $routeParams.setId, $routeParams.postId, commentId, fd)
                        .success(function (post) {
                            $scope.post.comments[$scope.replyIndex] = post;
                        })
                        .error(function (post) {
                            console.error('postController - Error adding comment: ' + post);
                        });
                };

                $scope.showReply = function (index) {
                    $scope.replyIndex = index;
                };

                /**
                 * mDown is the mouseDown call back. This is called when a user is depresses the mouse button.
                 * When this is called, we obtain the mouse down location, and store it.
                 * @param e {MouseEvent} The event object created by the mouse down event.
                 */
                $scope.mDown = function (e) {
                    if ($scope.currentView == 'full') {
                        if ($scope.container == null) {
                            $scope.container = document.getElementById('imageDiv')
                        }
                        if ($scope.newDiv !== 0) {
                            $scope.container.removeChild($scope.newDiv);
                            $scope.newDiv = 0;
                        }
                        $scope.isDown = true;
                        a.x = e.pageX + $scope.container.scrollLeft;
                        a.y = e.pageY - $scope.container.offsetTop + $scope.container.scrollTop;

                        $scope.newDiv = document.createElement("div");

                        $scope.newDiv.className = 'flexiBox maybe';
                        $scope.newDiv.innerHTML = '<div class="flexiNumber">New</div><div class="flexiClose" ng-click="newDiv = 0;">x</div>';

                        $scope.newDiv.style.top = a.y + 'px';
                        $scope.newDiv.style.left = a.x + 'px';

                        $scope.newDiv.onmousemove = function (e) {
                            $scope.mMove(e);
                        };
                        $scope.newDiv.onmouseup = function (e) {
                            $scope.mUp(e);
                        };

                        document.getElementById('imageDiv').appendChild($scope.newDiv);
                    }
                };

                /**
                 * mUp is the mouseUp call back. This is called when a user is releases the mouse button.
                 * When this is called, we obtain the mouse up location, and calculate the rectangle that
                 * was formed by the user clicks. Once we have calculated this, we then create a new div
                 * based on those values.
                 * @param e {MouseEvent} The event object created by the mouse up event.
                 */
                $scope.mUp = function (e) {
                    $scope.isDown = false;
                    $($scope.newDiv).resizable({
                        handles: "n, s, e, w, nw, se, sw",
                        containment: "#draggable-container",
                        stop: function (e, ui) {
                            smallest = {x: ui.position.left, y: ui.position.top};
                            biggest = {x: ui.position.left + ui.size.width, y: ui.position.top + ui.size.height};
                        }
                    }).draggable({
                        containment: "#draggable-container",
                        stop: function (e, ui) {
                            biggest = {
                                x: biggest.x + (ui.position.left - smallest.x),
                                y: biggest.y + (ui.position.top - smallest.y)
                            };
                            smallest = {x: ui.position.left, y: ui.position.top};
                        }
                    });

                    $("#comment-box").focus();
                };

                $scope.mMove = function (e) {
                    if ($scope.isDown) {
                        b.x = e.pageX + $scope.container.scrollLeft;
                        b.y = e.pageY - $scope.container.offsetTop + $scope.container.scrollTop;

                        smallest.x = ((a.x < b.x) ? a.x : b.x);
                        smallest.y = ((a.y < b.y) ? a.y : b.y);

                        biggest.x = ((a.x > b.x) ? a.x : b.x);
                        biggest.y = ((a.y > b.y) ? a.y : b.y);

                        $scope.newDiv.style.width = (biggest.x - smallest.x) + 'px';
                        $scope.newDiv.style.height = (biggest.y - smallest.y) + 'px';
                        $scope.newDiv.style.top = smallest.y + 'px';
                        $scope.newDiv.style.left = smallest.x + 'px';
                    }

                };


                $scope.setCurrentComment = function (id) {
                    $scope.currentComment = id;
                };

                $scope.scrollView = function () {
                    var comment = utilityFactory.findById($scope.post.comments, $scope.currentComment);
                    if (comment.hasOwnProperty("smallest")) {
                        $(".workspace").stop().animate({
                            scrollTop: comment.smallest.y - ( (window.innerHeight - comment.height) / 2),
                            scrollLeft: comment.smallest.x - ( ( (window.innerWidth * .75) - comment.width) / 2)}, 500);
                    }
                };

                $scope.scrollSideBar = function () {
                    var comment = utilityFactory.findById($scope.post.comments, $scope.currentComment);
                    var p = $("#commentSide" + comment.number).position();
                    $(".sidebar").stop().animate({scrollTop: p.top}, 500);
                };


                $scope.toggleLocationComments = function () {
                    if ($scope.locationComments == 1) {
                        $scope.locationComments = 0;
                    } else {
                        $scope.locationComments = 1;
                    }
                };

                $scope.toggleView = function () {
                    var image = document.getElementById('draggable-container');
                    $scope.imageWidth = image.width;
                    $scope.imageHeight = image.height;

                    if ($scope.currentView == 'full') {
                        $scope.currentView = 'scaled';
                        if ($scope.container == null) {
                            $scope.container = document.getElementById('imageDiv');
                        }
                        if ($scope.newDiv != 0) {
                            $scope.container.removeChild($scope.newDiv);
                            $scope.newDiv = 0;
                            smallest = {};
                        }

                        var imageWidth = $scope.imageWidth;
                        var imageHeight = $scope.imageHeight;
                        var imageRatio = imageWidth / imageHeight;

                        var sceneWidth = $scope.container.getClientRects()[0].width - (2 * 50);
                        var sceneHeight = $scope.$sidebar[0].getClientRects()[0].height - (2 * 50);

                        if (imageWidth > sceneWidth && imageHeight > sceneHeight) {
                            if (imageWidth > imageHeight) {
                                $("#draggable-container").css({
                                    width: sceneWidth + "px",
                                    height: Math.floor(sceneWidth / imageRatio) + "px"
                                });
                            } else {
                                $("#draggable-container").css({
                                    width: Math.ceil(sceneHeight * imageRatio) + "px",
                                    height: sceneHeight + "px"
                                });
                            }
                        } else if (imageWidth > sceneWidth) {
                            $("#draggable-container").css({
                                width: sceneWidth + "px",
                                height: Math.ceil(sceneWidth / imageRatio) + "px"
                            });
                            $scope.post.comments.forEach(function (comment, idx) {

                            });
                        } else if (imageHeight > sceneHeight) {
                            $("#draggable-container").css({
                                width: Math.ceil(sceneHeight * imageRatio) + "px",
                                height: sceneHeight + "px"
                            });
                        }

                    } else {
                        $scope.currentView = 'full';

                        $("#draggable-container")[0].removeAttribute("style");
                    }
                };

                $scope.getStyle = function(index){
                    var comment = $scope.post.comments[index];

                    var top = 0;
                    var left = 0;

                    if($scope.currentView == 'full'){
                        return {
                            "top" : comment.hasOwnProperty('smallest') ? comment.smallest.y + "px" : top,
                            "left" : comment.hasOwnProperty('smallest') ? comment.smallest.x + "px": left,
                            "width" : comment.width + "px",
                            "height" : comment.height + "px",
                            "border": "4px solid " + comment.color
                        };
                    } else {

                        var imageWidth = $scope.imageWidth;
                        var imageHeight = $scope.imageHeight;
                        var imageRatio = imageWidth / imageHeight;

                        var sceneWidth = $scope.container.getClientRects()[0].width - (2 * 50);
                        var sceneHeight = $scope.$sidebar[0].getClientRects()[0].height - (2 * 50);

                        var commentHeightRatio;
                        var commentWidthRatio;

                        if (imageWidth > sceneWidth && imageHeight > sceneHeight) {
                            if (imageWidth > imageHeight) {
                                if (comment.hasOwnProperty("smallest")) {
                                    commentHeightRatio = comment.smallest.y / imageHeight;
                                    commentWidthRatio = comment.smallest.x / imageWidth;
                                    left = (Math.ceil(sceneWidth * commentWidthRatio) + 50) + "px";
                                    top = (Math.floor(sceneWidth * commentHeightRatio / imageRatio) + 50) + "px";
                                }
                            } else {
                                if (comment.hasOwnProperty("smallest")) {
                                    commentHeightRatio = comment.smallest.y / imageHeight;
                                    commentWidthRatio = comment.smallest.x / imageWidth;
                                    left = (Math.ceil(sceneHeight * imageRatio * commentWidthRatio) + 50) + "px";
                                    top = (Math.floor(sceneHeight * commentHeightRatio) + 50) + "px";
                                }
                            }
                        } else if (imageWidth > sceneWidth) {
                            if (comment.hasOwnProperty("smallest")) {
                                commentHeightRatio = comment.smallest.y / imageHeight;
                                commentWidthRatio = comment.smallest.x / imageWidth;
                                left = (Math.ceil(sceneWidth * commentWidthRatio) + 50) + "px";
                                top = (Math.floor(sceneWidth * commentHeightRatio / imageRatio) + 50) + "px";
                            }
                        } else if (imageHeight > sceneHeight) {
                            if (comment.hasOwnProperty("smallest")) {
                                commentHeightRatio = comment.smallest.y / imageHeight;
                                commentWidthRatio = comment.smallest.x / imageWidth;
                                left = (Math.ceil(sceneHeight * imageRatio * commentWidthRatio) + 50) + "px";
                                top = (Math.floor(sceneHeight * commentHeightRatio) + 50) + "px";
                            }
                        } else {
                            if (comment.hasOwnProperty("smallest")) {
                                left = (comment.smallest.x + 50) + "px";
                                top = (comment.smallest.y + 50) + "px";
                            }
                        }

                        return {
                            "top" : top,
                            "left" : left,
                            "width" : 0,
                            "height": 0
                        };
                    }
                }
            }])
    });