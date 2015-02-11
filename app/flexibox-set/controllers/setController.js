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

		var name = namespace + '.setController';
		module.controller(name,
			['$scope', '$rootScope', '$log', namespaceCommon + '.setFactory', '$routeParams', namespaceCommon + '.utilityFactory',
			function ($scope, $rootScope, $log, setFactory, $routeParams, utilityFactory) {

			var logger = $log.getInstance(name);

			$scope.backURL = {};           // URL used to go back to the project
			$scope.set = {};               // local instance of focused set
			$scope.formData = {};          // data from form in upload modal
			var newImageURL = "";          // stores URL of most recently uploaded image
			$scope.imageUp = 0;            // determines whether an image was uploaded
			$scope.imageButtonState = "";  // text to be displayed on image button (uploading..., delete)

			// On controller load, populate local instance of focused set
			setFactory.getSet($routeParams.projectId, $routeParams.setId)
				.success(function(set) {
					$scope.backURL = $routeParams.projectId;
					$scope.set = set;
				})
				.error(function(project) {
					logger.error('setController - Error getting project by id: ' + project);
				});

			// Update set name and description
			$scope.updateSet = function(project) {
				// update set
			};

			// Upload an image to filesystem and set newImageURL
			$scope.uploadFile = function(files) {
				if (files[0].type === "image/jpeg" || files[0].type === "image/png") {
					$scope.imageButtonState = "Uploading...";
					setFactory.uploadFile(files)

						.success(function(data) {
							newImageURL = data.imageURL;
							$scope.imageButtonState = "Remove";
							$scope.imageUp = 1;
						})
						.error(function(imageURL) {
							logger.error('setController - Error uploading file: ' + imageURL);
						});
				} else {
					alert("Error: Invalid File Type.  Please choose a PNG or JPEG image.");
					$scope.dReset('imageForm');
				}
			};

			// Add a post to the local project using form data and newImageUrl
			$scope.addPost = function() {
				var fd = $scope.formData;
				fd.imageURL = newImageURL;
				setFactory.createPost($routeParams.projectId, $routeParams.setId, fd)
					.success(function(set) {
						newImageURL = {};
						$scope.formData = {};
						$scope.imageUp = 0;
						$scope.imageButtonState = "";
						$scope.set = set;
					})
					.error(function(project) {
						logger.error('setController - Error creating post: ' + project);
					});
			};

			// Clear form 
			$scope.clearForm = function() {
				$scope.formData = {};
			};

			// Reset the image upload.  Includes deleting the image.
			$scope.resetImage = function() {
				if ($scope.imageButtonState === "Remove" || $scope.imageButtonState === "Uploading...") {
					setFactory.deleteUpload(newImageURL.replace("\\", "/"))
						.success(function(data) {
							newImageURL = "";
							$scope.imageUp = 0;
							$scope.imageButtonState = "";
						})
						.error(function(data) {
							$scope.imageButtonState = "";
							logger.error('setController - Error resetting image: ' + data);
						});
				}
			};

			// Delete post.  Includes deleting the image from filesystem.
			$scope.deletePost = function(id) {
				var deleteImg = utilityFactory.findById($scope.set.posts, id).imageURL;
				setFactory.deleteUpload(deleteImg.replace("\\", "/"))
					.success(function(data) {
						//
					})
					.error(function(data) {
						logger.error('setController - Error resetting image: ' + data);
					});

				setFactory.deletePost($routeParams.projectId, $routeParams.setId, id)
					.success(function(set) {
						$scope.set = set;
					})
					.error(function(data) {
						logger.error('setController - Error deleting posts: ' + data);
					});
			};
		}]);
	});