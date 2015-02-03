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

            /**
             * updatePost is supposed to update a specific post (image). However, this isn't
             * currently implemented in the Express API. This function calls PUT on the URL:
             *            '/projects/:project_id/sets/:set_id/posts/:post_id'
             * This URL mapping is found in the postRoutes.js file.
             *
             * @param pid {String} :project_id for the URL
             * @param sid {String} :set_id for the URL
             * @param id {String} :post_id for the URL
             * @param fd {FormData} The form data containing the comment information
             * @returns {HttpPromise} The Angular Promise that is returned because of the HTTP PUT.
             */
			postFactory.updatePost = function(pid, sid, id, fd) {
				return $http.put('/api/projects/' + pid + '/sets/' + sid + '/posts/' + id, fd, {
					'content-type': 'multipart/form-data'
				});
			};

            /**
             * addComment is the factory method for adding a comment to a specific image. This
             * calls POST on the API at the URL:
             *           '/projects/:project_id/sets/:set_id/posts/:post_id/comments'
             * This URL mapping is found in the commentRoutes.js file. This tells the server
             * to add a new comment to an image.
             *
             * Included in the fd (FormData):
             *      txt : {String} The content of the comment
             *      smallest : {Point} The smallest coordinate (x, y) of the box (upper left corner)
             *      width : {Number} The width of the comment box
             *      height : {Number} The height of the comment box
             *      color : {String} The color of the comment box
             *      number : {Number} The number comment this is???
             *
             * @param pid {String} :project_id for the URL
             * @param sid {String} :set_id for the URL
             * @param id {String} :post_id for the URL
             * @param fd {FormData} The form data containing the comment information
             * @returns {HttpPromise} The Angular Promise that is returned as a result of the HTTP POST
             */
			postFactory.addComment = function(pid, sid, id, fd) {
				return $http.post('/api/projects/' + pid + '/sets/' + sid + '/posts/' + id + '/comments', fd, {
					'content-type': 'multipart/form-data'
				});
			};

            /**
             * addReply is the factory method used to add a reply to a specific comment. This calls
             * POST on the API at the URL:
             *           '/projects/:project_id/sets/:set_id/posts/:post_id/comments/:comment_id'
             * This URL mapping is found in the commentRoutes.js file. This essentially tells the server
             * to add a response for a comment according to the form data included in the request.
             *
             * Included in fd (FormData) is:
             *     txt : {String} The content of the reply.
             *
             * @param pid {String} :project_id for the URL.
             * @param sid {String} :set_id for the URL.
             * @param tid {String} :post_id for the URL.
             * @param id {String} :comment_id for the URL.
             * @param fd {FormData} The form data for this reply.
             * @returns {HttpPromise} The Angular Promise that is returned as a result of the POST request.
             */
			postFactory.addReply = function(pid, sid, tid, id, fd) {
				return $http.post('/api/projects/' + pid + '/sets/' + sid + '/posts/' + tid + '/comments/' + id, fd, {
					'content-type': 'multipart/form-data'
				});
			};

			return postFactory;
		}]);
	});