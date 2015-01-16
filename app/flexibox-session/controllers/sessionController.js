// ------------------------------------------------------------
// Controller placed outside of the dynamic view.  Handles the user
// login system.  Users are logged in on a session to session basis.
//-------------------------------------------------------------
define([
		'../module',
		'../namespace'
	],
function (module, namespace) {
	'use strict';

	var name = namespace + ".sessionController";
	module.controller(name, ['$scope','$rootScope', function ($scope, $rootScope) {

	$scope.username = "";     // username that's logged in
	$scope.fd = {};           // form data from the view

	// Set username to logged in name
	$scope.login = function() {
		$scope.username = $scope.fd.name;
	};

	// Log out user
	$scope.logout = function() {
		$scope.username = "";
	};


	}]);
});