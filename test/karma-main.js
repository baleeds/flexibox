var allTestFiles = [];
var TEST_REGEXP = /(Spec|Test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\/test\/specs\//, 'specs/').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/app',
    paths: {
        "angular": "/base/dependencies/js/angular/angular.min",
        "angularRoute": "/base/dependencies/js/angular_route/angular-route.min",
        "angularSanitize": "/base/dependencies/js/angular_sanitize/angular-sanitize.min",
        "angularMocks": "/base/dependencies/js/angular_mocks/angular-mocks",
        "foundation": "/base/dependencies/js/foundation/foundation.min",
        "jquery": "/base/dependencies/js/jquery/jquery",
        "modernizr": "/base/dependencies/js/modernizr/modernizr",
        "specs": "/base/test/specs"
    },

    shim: {
        angular: {
            exports: "angular"
        },
        angularRoute: {
            deps: ["angular"]
        },
        angularSanitize: {
            deps: ["angular"]
        },
        angularMocks: {
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
    },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
