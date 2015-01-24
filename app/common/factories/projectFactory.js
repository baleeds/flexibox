// ------------------------------------------------------------
// Factory for the projectController.  Used to manipulate sets
// and other project details.
//-------------------------------------------------------------
define([
		'../module',
		'../namespace'
	],
	function (module, namespace) {
		'use strict';

		var name = namespace + ".projectFactory";
		module.factory(name, ['$http', function ($http) {

			var projectFactory = {};
			
			// Get one project by ID
			projectFactory.getProject = function(id) {
				return $http.get('/api/projects/' + id + '?includeSets=1');
			};

			projectFactory.createSet = function(pid, fd) {
				return $http.post('/api/projects/' + pid + '/sets', fd, {
					'content-type': 'multipart/form-data'
				});
			};

			projectFactory.deleteSet = function(pid, sid) {
				return $http.delete('/api/projects/' + pid + '/sets/' + sid);
			};

			projectFactory.updateSet = function(pid, sid, fd) {
				return $http.put('/api/projects/' + pid + '/sets/' + sid, fd, {
					'content-type': 'multipart/form-data'
				});
			};

			return projectFactory;
		}]);
	});