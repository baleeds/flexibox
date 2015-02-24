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

		var name = namespace + ".projectController";
		module.controller(name,
			['$scope', '$rootScope', '$log', namespaceCommon + '.projectFactory', '$routeParams', namespaceCommon + '.utilityFactory', namespaceCommon + '.setFactory',
			function ($scope, $rootScope, $log, projectFactory, $routeParams, utilityFactory, setFactory) {
	
			var logger = $log.getInstance(name);      // logger
			$scope.project = {};                      // Local instance of focused project.  Only contains project name, description, set.name, set.description
			$scope.formData = {};                     // Data from the new set modal
			$scope.editableSet = {};
			var oldSet = {};

			// On controller load, populate local instance of focused project
			projectFactory.getProject($routeParams.projectId)
				.success(function(project) {
					$scope.project = project;
				})
				.error(function(project) {
					logger.error('projectController - Error getting project by id: ' + project);
				});

			$scope.setEditable = function(setId) {
				$scope.editableSet = utilityFactory.findById($scope.project.sets, setId);
				oldSet.name = $scope.editableSet.name;
				oldSet.description = $scope.editableSet.description;
				$scope.newTags = $scope.editableSet.tags.slice(0); // use slice to copy data as opposed to point to it.
			};

			$scope.confirmEdit = function() {
				$scope.editableSet.tags = $scope.newTags;
				setFactory.updateSet($scope.project._id, $scope.editableSet._id, $scope.editableSet)
					.success(function (set) {
						//
					}).error(function (err) {
						//
					});
				oldSet = {};
				$scope.newTags = [];
			};

			$scope.cancelEdit = function() {
				$scope.editableSet.name = oldSet.name;
				$scope.editableSet.description = oldSet.description;
				$scope.newTags = [];
				$scope.newTag = "";
			};

			// Add a set to a project based on form data
			$scope.addSet = function() {
				$scope.formData.tags = $scope.newTags;
				var fd = $scope.formData;
				projectFactory.createSet($routeParams.projectId, fd)
					.success(function(project) {
						$scope.formData = {};
						$scope.project = project;
					})
					.error(function(project) {
						logger.error('projectController - Error adding set to project: ' + project);
					});
				$scope.newTags = [];
			};

			// Delete a set based on ID
			$scope.deleteSet = function(id) {
				projectFactory.deleteSet($routeParams.projectId, id)
					.success(function(project) {
						$scope.project = project;
					})
					.error(function(project) {
						logger.error('projectController - Error deleting set from project: ' + project);
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
		}]);
	});