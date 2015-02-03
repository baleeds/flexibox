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

    /**
     * mDown is the mouseDown call back. This is called when a user is depresses the mouse button.
     * When this is called, we obtain the mouse down location, and store it.
     * @param e {MouseEvent} The event object created by the mouse down event.
     */
	$scope.mDown = function(e) {
		if ($scope.newDiv !== 0) {
			document.getElementById('imageDiv').removeChild($scope.newDiv);
			$scope.newDiv = 0;
		}
		a.x = e.offsetX;
		a.y = e.offsetY;
	};

    /**
     * mUp is the mouseUp call back. This is called when a user is releases the mouse button.
     * When this is called, we obtain the mouse up location, and calculate the rectangle that
     * was formed by the user clicks. Once we have calculated this, we then create a new div
     * based on those values.
     * @param e {MouseEvent} The event object created by the mouse up event.
     */
    $scope.mUp = function(e) {
		b.x = e.offsetX;
		b.y = e.offsetY;

		console.log(a);
		console.log(b);

		smallest.x = ((a.x < b.x) ? a.x : b.x);
		smallest.y = ((a.y < b.y) ? a.y : b.y);

		biggest.x = ((a.x > b.x) ? a.x : b.x);
		biggest.y = ((a.y > b.y) ? a.y : b.y);

		$scope.newDiv = document.createElement("div");
		$scope.newDiv.style.width = (biggest.x - smallest.x) + 'px';
		$scope.newDiv.style.height = (biggest.y - smallest.y) + 'px';
		$scope.newDiv.style.top = smallest.y + 'px';
		$scope.newDiv.style.left = smallest.x + 'px';
		$scope.newDiv.className = 'flexiBox maybe';
		$scope.newDiv.innerHTML = '<div class="flexiNumber">New</div>';

		document.getElementById('imageDiv').appendChild($scope.newDiv);

	};

	$(document).foundation(); // Load foundation when view loads

	}]);
});