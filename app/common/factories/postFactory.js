// ------------------------------------------------------------
// Factory used in the postController.  Used to manipulate comments
// and other post details.
//-------------------------------------------------------------
define([
        '../module',
        '../namespace'
    ],
    function (module, namespace) {
        'use strict';

        var name = namespace + ".postFactory";
        module.factory(name, ['$http', function ($http) {

			var postFactory = {};
			
			// Get post by id
			postFactory.getPost = function(pid, sid, id) {
				return $http.get('/api/projects/' + pid + '/sets/' + sid + '/posts/' + id + '?includeComments=1');
			};

			// Update post name and description
			postFactory.updatePost = function(pid, sid, id, fd) {
				return $http.put('/api/projects/' + pid + '/sets/' + sid + '/posts/' + id, fd, {
					'content-type': 'multipart/form-data'
				});
			};
			
			// Add a comment to the post
			postFactory.addComment = function(pid, sid, id, fd) {
				return $http.post('/api/projects/' + pid + '/sets/' + sid + '/posts/' + id + '/comments', fd, {
					'content-type': 'multipart/form-data'
				});
			};

			return postFactory;
		}]);
	});