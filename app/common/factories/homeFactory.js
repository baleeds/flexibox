// ------------------------------------------------------------
// Factory used in the homeController.  Has ability to manipulate
// projects.
//-------------------------------------------------------------
define([
		'../module',
		'../namespace'
	],
	function (module, namespace) {
		'use strict';

		var name = namespace + ".homeFactory";
		module.factory(name, ['$http', function ($http) {

			var homeFactory = {};

			// Get all projects
			homeFactory.getProjects = function() {
				return $http.get('/api/projects');
			};

			homeFactory.getUserProjects = function(fd) {
				console.log("Project ID: " + fd.projects[0]);
				return $http.get('/api/projects/userProjects', fd);
			};

			// Create a project from form data
			homeFactory.createProject = function(fd) {
				return $http.post('/api/projects', fd, {
					'content-type': 'multipart/form-data'
				});
			};

			homeFactory.updateUserProjects = function(fd){
				return $http.post('/api/users/updateProjects', fd)
			};
			// Delete a project by ID
			homeFactory.deleteProject = function(id) {
				return $http.delete('/api/projects/' + id);
			};

			homeFactory.deleteUserProject = function(id){
				return $http.delete('/api/users/projects/' + id)
			};


			// Update a project's persistence to match project object
			homeFactory.updateProject = function(id, fd) {
				return $http.put('/api/projects/' + id, fd, {
					'content-type': 'multipart/form-data'
				});
			};

			return homeFactory;
		}]);
	});