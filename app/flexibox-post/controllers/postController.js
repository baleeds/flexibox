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
	module.controller(name, ['$scope','$rootScope', namespaceCommon + '.postFactory', namespaceCommon + '.utilityFactory', '$routeParams',
		function ($scope, $rootScope, postFactory, utilityFactory, $routeParams) {

	$scope.post = {};                                                          // local instance of focused post
	$scope.newComment = {};                                                    // data from form in upload modal
	$scope.backURL = $routeParams.projectId + '/' + $routeParams.setId;        // url to the previous page.  Used to feed routeParams to the front end.
	$scope.currentComment = 0;
    $scope.container = null;
    $scope.isDown = false;

	var firstClick = 1;
	var a = {};
	var b = {};
	var smallest = {};
	var biggest = {};
	$scope.newDiv = 0;

	// On controller load, populate local instance of focused post
	postFactory.getPost($routeParams.projectId, $routeParams.setId, $routeParams.postId)
		.success(function(post) {
			$scope.post = post;
		})
		.error(function(post) {
			console.error('postController - Error getting project by id: ' + post);
		});


	// Update posts name and decription
	$scope.updatePost = function(project) {
		//
	};

	// Add comment using comment input and username
	$scope.addComment = function() {
		var fd = {};
		fd.txt = $scope.newComment.cText;
		fd.posterName = $scope.$parent.user.name;
		fd.smallest   = smallest;
		fd.width      = biggest.x - smallest.x;
		fd.height     = biggest.y - smallest.y;
		fd.number     = $scope.post.comments.length + 1;
		fd.color      = utilityFactory.randomColor(4);

		console.log(fd);

		postFactory.addComment($routeParams.projectId, $routeParams.setId, $routeParams.postId, fd)
			.success(function(post) {
				$scope.post = post;
				$scope.newComment = {};
				if ($scope.newDiv !== 0) {
					document.getElementById('imageDiv').removeChild($scope.newDiv);
					$scope.newDiv = 0;
				}
			})
			.error(function(post) {
				console.error('postController - Error adding comment: ' + post);
			});
	};

	// Add comment using comment input and username
	$scope.addReply = function(commentId, text) {
		var fd = {};
		fd.txt = text;

		postFactory.addReply($routeParams.projectId, $routeParams.setId, $routeParams.postId, commentId, fd)
			.success(function(post) {
				$scope.post.comments[$scope.replyIndex] = post;
			})
			.error(function(post) {
				console.error('postController - Error adding comment: ' + post);
			});
	};

    $scope.showReply = function(index){
        $scope.replyIndex = index;
    };

    /**
     * mDown is the mouseDown call back. This is called when a user is depresses the mouse button.
     * When this is called, we obtain the mouse down location, and store it.
     * @param e {MouseEvent} The event object created by the mouse down event.
     */
	$scope.mDown = function(e) {
        if($scope.container == null){
            $scope.container = document.getElementById('imageDiv')
        }
		if ($scope.newDiv !== 0) {
            $scope.container.removeChild($scope.newDiv);
			$scope.newDiv = 0;
		}
        $scope.isDown = true;
		a.x = e.pageX + $scope.container.scrollLeft;
		a.y = e.pageY - $scope.container.offsetTop - $scope.container.scrollTop;

        $scope.newDiv = document.createElement("div");

        $scope.newDiv.className = 'flexiBox maybe';
        $scope.newDiv.innerHTML = '<div class="flexiNumber">New</div><div class="flexiClose" ng-click="newDiv = 0;">x</div>';

        $scope.newDiv.style.top = a.y + 'px';
        $scope.newDiv.style.left = a.x + 'px';

        document.getElementById('imageDiv').appendChild($scope.newDiv);

        $scope.newDiv.onmousemove = function(e){$scope.mMove(e);};
        $scope.newDiv.onmouseup = function(e){$scope.mUp(e);};
	};

    /**
     * mUp is the mouseUp call back. This is called when a user is releases the mouse button.
     * When this is called, we obtain the mouse up location, and calculate the rectangle that
     * was formed by the user clicks. Once we have calculated this, we then create a new div
     * based on those values.
     * @param e {MouseEvent} The event object created by the mouse up event.
     */
    $scope.mUp = function(e){
        $scope.isDown = false;
        $($scope.newDiv).resizable({
            handles : "n, s, e, w, nw, se, sw",
            containment : "#draggable-container",
            stop : function(e, ui){
                smallest = {x : ui.position.left, y : ui.position.top};
                biggest = {x : ui.position.left + ui.size.width, y : ui.position.top + ui.size.height};
            }
        }).draggable({
            containment : "#draggable-container",
            stop : function(e, ui){
                biggest = {x : biggest.x + (ui.position.left - smallest.x), y : biggest.y + (ui.position.top - smallest.y)};
                smallest = {x : ui.position.left, y : ui.position.top};
            }
        });
    };

    $scope.mMove = function(e) {
        if($scope.isDown) {
            b.x = e.pageX + $scope.container.scrollLeft;
            b.y = e.pageY - $scope.container.offsetTop - $scope.container.scrollTop;

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

	var timeoutId;


	$scope.isOut = function() {
		$scope.currentComment = 0;
		if (timeoutId) {
			window.clearTimeout(timeoutId);
			timeoutId = null;
		}
	};

    $scope.isOver = function(commentId){

        $scope.currentComment = commentId;
        var comment = utilityFactory.findById($scope.post.comments, commentId);

		if (!timeoutId) {
			timeoutId = window.setTimeout(function() {
				timeoutId = null; // EDIT: added this line
					$("html, body").stop().animate({ scrollTop: comment.smallest.y - ( (window.innerHeight - comment.height) / 2) },500);
					$(".workspace").stop().animate({ scrollLeft: comment.smallest.x - ( ( (window.innerWidth *.75) - comment.width) / 2)},500);
			}, 500);
		}
        //window.scrollTo(0, comment.smallest.y - ( (window.innerHeight - comment.height) / 2));
        //$scope.container.scrollLeft = comment.smallest.x - ( ( (window.innerWidth *.75) - comment.width) / 2);
    };

	$scope.scrollSideBarOn = function(commentId) {
		$scope.currentComment = commentId;

		var comment = utilityFactory.findById($scope.post.comments, commentId);
		if (!timeoutId) {
			timeoutId = window.setTimeout(function() {
				timeoutId = null; // EDIT: added this line
				var p = $("#commentSide" + comment.number).position();
				$(".sidebar").stop().animate({ scrollTop: p.top},500);
			}, 500);
		}
	};

	$scope.scrollSideBarOff = function() {
		$scope.currentComment = 0;
		if (timeoutId) {
			window.clearTimeout(timeoutId);
			timeoutId = null;
		}
	};

	}]);
});