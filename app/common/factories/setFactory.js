// ------------------------------------------------------------
// Factory for the setController.  Used to manipulate posts and
// other set details.
//-------------------------------------------------------------
define([
		'../module',
		'../namespace'
	],
	function (module, namespace) {
		'use strict';

		var name = namespace + ".setFactory";
		module.factory(name, ['$http', function ($http) {

			var setFactory = {};
			
			// get a single set
			setFactory.getSet = function(pid, sid) {
				return $http.get('/api/projects/' + pid + '/sets/' + sid + '?includePosts=1');
			};

			// update a set's name and description
			setFactory.updateSet = function(pid, sid, fd) {
				return $http.put('/api/projects/' + pid + '/sets/' + sid, fd, {
					'content-type': 'multipart/form-data'
				});
			};

			// create a post in the set
			setFactory.createPost = function(pid, sid, fd) {
				return $http.post('/api/projects/' + pid + '/sets/' + sid + '/posts', fd, {
					'content-type': 'multipart/form-data'
				});
			};

			// delete a post in the set
			setFactory.deletePost = function(pid, sid, id) {
				return $http.delete('/api/projects/' + pid + '/sets/' + sid + '/posts/' + id);
			};

			// Upload an image to filesystem to be used in a post
			setFactory.uploadFile = function(files) {
				var fd = new FormData();
				fd.append("image", files[0]);

				return $http.post("/api/upload", fd, {
					headers: {'Content-Type': undefined },
					transformRequest: angular.identity
				});
			};

			// Delete an image by URL
			setFactory.deleteUpload = function(url) {
				return $http.delete('/api/upload/' + url.substring(8));
			};

			
			return setFactory;
		}]);
	});