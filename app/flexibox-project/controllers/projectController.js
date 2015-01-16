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
			['$scope', '$rootScope', '$log', namespaceCommon + '.projectFactory', '$routeParams', namespaceCommon + '.utilityFactory',
			function ($scope, $rootScope, $log, projectFactory, $routeParams, utilityFactory) {
	
			var logger = $log.getInstance(name);      // logger
			$scope.project = {};                      // Local instance of focused project.  Only contains project name, description, set.name, set.description
			$scope.formData = {};                     // Data from the new set modal


			// On controller load, populate local instance of focused project
			projectFactory.getProject($routeParams.projectId)
				.success(function(project) {
					$scope.project = project;
				})
				.error(function(project) {
					logger.error('projectController - Error getting project by id: ' + project);
				});

			// Update a project to match local instance
			$scope.updateSet = function(id) {
				// update set
			};

			// Add a set to a project based on form data
			$scope.addSet = function() {
				var fd = $scope.formData;

				projectFactory.createSet($routeParams.projectId, fd)
					.success(function(project) {
						$scope.formData = {};
						$scope.project = project;
					})
					.error(function(project) {
						logger.error('projectController - Error adding set to project: ' + project);
					});
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


			$(document).foundation(); // Load foundation when view loads

		}]);
	});