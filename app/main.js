// ------------------------------------------------------------
// Manages dependencies using requirejs.  Bootstraps Angular to document.
//-------------------------------------------------------------
require.config({
	waitSeconds: 1000,
	paths: {
		"angular": "../dependencies/js/angular/angular.min",
		"angularRoute": "../dependencies/js/angular-route/angular-route.min",
		"angularRouteStyles": "../dependencies/js/angular-route-styles/route-styles",
		"angularSanitize": "../dependencies/js/angular-sanitize/angular-sanitize.min",
		"bootstrap": "../dependencies/js/openstyle/bootstrap",
		"jquery": "../dependencies/js/jquery/jquery"
	},

	shim: {
		app: {
			deps: ["angular","bootstrap", "angularRoute","angularSanitize"]
		},
		angular: {
			exports: "angular"
		},
		angularRoute: {
			deps: ["angular"]
		},
        angularRouteStyles : {
            deps: ["angularRoute"]
        },
		angularSanitize: {
			deps: ["angular"]
		},
		bootstrap: {
			deps: ["jquery"],
			exports: "bootstrap"
		},
		jquery: {
			exports: "jquery"
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
