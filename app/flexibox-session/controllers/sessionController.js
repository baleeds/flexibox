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

		}]);
	});