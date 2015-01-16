// ------------------------------------------------------------
// Manages dependencies using requirejs.  Bootstraps Angular to document.
//-------------------------------------------------------------
require.config({
	waitSeconds: 1000,
	paths: {
		"angular": "../dependencies/js/angular/angular.min",
		"angularRoute": "../dependencies/js/angular_route/angular-route.min",
		"angularSanitize": "../dependencies/js/angular_sanitize/angular-sanitize.min",
		"foundation": "../dependencies/js/foundation/foundation.min",
		"jquery": "../dependencies/js/jquery/jquery",
		"modernizr": "../dependencies/js/modernizr/modernizr"
	},

	shim: {
		app: {
			deps: ["angular","foundation", "angularRoute","angularSanitize"]
		},
		angular: {
			exports: "angular"
		},
		angularRoute: {
			deps: ["angular"]
		},
		angularSanitize: {
			deps: ["angular"]
		},
		foundation: {
			deps: ["jquery"],
			exports: "foundation"
		},
		jquery: {
			exports: "jquery"
		},
		modernizr: {
			exports: "modernizr"
		}
	}
});

require([
	"angular",
	"namespace",
	"app",
	"routes"
	],
	function (angular, namespace) {
		angular.element(document).ready(function() {
		angular.bootstrap(document, [namespace]);
	});
});
