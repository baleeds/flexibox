// ------------------------------------------------------------
// Controller placed outside of the dynamic view.  Handles the user
// login system.  Users are logged in on a session to session basis.
//-------------------------------------------------------------
define([
		'../module',
		'../namespace',
		'../../common/namespace'
	],
	function (module, namespace, namespaceCommon) {
		'use strict';

		var name = namespace + ".sessionController";
		module.controller(name, ['$scope','$rootScope', namespaceCommon + '.sessionFactory', '$location', function ($scope,
																													$rootScope, sessionFactory, $location) {

            $scope.ROOT = ROOT;
			$scope.user = {}; // user that is currently logged in
			var posts = {};
			var currentPostIndex = {};
			var mainURL = "";

			sessionFactory.getCurrentUser()
				.success(function(user) {
					$scope.user = user;
				})
				.error(function(err) {
					// Do nothing
				});

			$rootScope.$on('userChanged', function(event, newUser) {
				$scope.user = newUser;
			});

			$scope.fd = {};           // form data from the view
			$scope.location = $location.path();


			// Log out user
			$scope.logout = function() {
				sessionFactory.logout();
				$scope.user = null;
				sessionFactory.user = null;
				$location.path('/login');
			};

			$scope.range = function(n) {
				return new Array(n);
			};

			$scope.setPosts = function(p, currentP, ROOT, backURL, setId) {
				posts = p;
				currentPostIndex = currentP;
				console.log(p);
				console.log(currentP);
				mainURL = ROOT + "/projects/" + backURL + "/" + setId + "/";
				console.log(mainURL);
			};

			$scope.moveLeft = function() {
				if (currentPostIndex > 0 && typeof posts[currentPostIndex - 1] !== 'undefined') {
					currentPostIndex = currentPostIndex - 1;
					$location.path(mainURL + posts[currentPostIndex]._id);
				}
			};

			$scope.moveRight = function() {
				if (typeof posts[currentPostIndex + 1] !== 'undefined') {
					currentPostIndex = currentPostIndex + 1;
					$location.path(mainURL + posts[currentPostIndex]._id);
				}
			};


		}]);
	});