// ------------------------------------------------------------
// A directive used to reset forms that are stubborn (file input)
//-------------------------------------------------------------
define([
        '../module',
        '../namespace'
    ],
    function (module, namespace) {
        'use strict';

        var name = "resetable";
        module.directive(name, function() {
			return {
				restrict: 'A',
				link: function($scope, elem, attrs) {

					$scope.dReset = function(e) {
						$("#" + e)[0].reset();
					};
				}
			};
		});

    });