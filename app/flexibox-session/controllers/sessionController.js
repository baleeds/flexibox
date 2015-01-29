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

	$scope.username = "";     // username that's logged in
	$scope.fd = {};           // form data from the view
	$scope.location = $location.path();

	// Log out user
	$scope.logout = function() {
		sessionFactory.logout();
		$scope.username = "";
		$location.path('/login');
	};


	}]);
});