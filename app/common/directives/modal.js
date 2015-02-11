// ------------------------------------------------------------
// A directive used to close modals that are generated
// after foundation.js is called
//-------------------------------------------------------------
define([
        '../module'
    ],
    function (module) {
        'use strict';

        var name = "modal";
        module.directive(name, function() {
			return {
				restrict: 'A',
				link: function($scope, elem, attrs) {

					$scope.dClose = function(e) {
						$("#" + e).modal('hide');
					};

					$scope.dOpen = function(e) {
						$("#" + e).modal('show');
					};

				}
			};
		});
    });