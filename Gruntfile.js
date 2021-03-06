"use strict"
var path = require('path');

module.exports = function (grunt) {

    // Set up basic config for requirejs, include config that is common to all the requirejs.optimize() calls.
    var baseConfig = {
        baseUrl: "./app",
        locale: "en-us",

        paths: {
            // Gotcha: paths will be relative to the baseUrl defined above.
            // Non-bower dependencies should be stored in "vendor" dir.

            "angular": "../dependencies/js/angular/angular.min",
            "jquery": "../dependencies/js/jquery/jquery",
            "jqueryUI": "../dependencies/js/jquery-ui/jquery-ui.min",
            "angularRoute": "../dependencies/js/angular-route/angular-route.min",
            "angularRouteStyles": "../dependencies/js/angular-route-styles/route-styles",
            "angularSanitize": "../dependencies/js/angular-sanitize/angular-sanitize.min",
            "bootstrap": "../dependencies/js/openstyle/bootstrap",

            "FlexiBox": "../<%=pkg.name%>"
        }
    };

    // Function used to mix in baseConfig to a new config target
    function mix(target) {
        for (var prop in baseConfig) {
            if (baseConfig.hasOwnProperty(prop)) {
                target[prop] = baseConfig[prop];
            }
        }
        return target;
    }

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        dirs: {
            output: "dist",
            jsOutput: "dist/js",
            dependencies: "dependencies"
        },
        bower: {
            // Download dependencies and copy relevant files to dependencies folder (see bower.json)
            // Gotcha: bower.json must reference direct http url's to github to bypass firewall issues with git url's
            install: {
                options: {
                    targetDir: "<%=dirs.dependencies%>",
                    verbose: true, // Enable logging
                    layout : function(type, component, src){
                        if(type == "fonts"){
                            return path.join("css", type);
                        }
                        return path.join(type, component);
                    }
                }
            }
        },
        requirejs: {
            // Generate combined files.  Let requirejs load dependencies as needed
            compile: {
                // Version with no third party dependencies
                options: mix({
                    optimize: "none",
                    include: ["main"],
                    exclude: ["angular"],
                    out: "<%=dirs.jsOutput%>/<%=pkg.name%>.js"
                })
            },
            compile_min: {
                // Minified version with no third party dependencies
                options: mix({
                    optimize: "uglify2",
                    include: ["main"],
                    exclude: ["angular"],
                    out: "<%=dirs.jsOutput%>/<%=pkg.name%>.min.js"
                })
            },
            compile_full: {
                // Version with third party dependencies
                options: mix({
                    optimize: "none",
                    include: ["../<%=dirs.jsOutput%>/<%=pkg.name%>"], // Use built component file
                    exclude: [],
                    out: "<%=dirs.jsOutput%>/<%=pkg.name%>.full.js"
                })
            },
            compile_full_min: {
                // Minified version with third party dependencies
                options: mix({
                    optimize: "uglify2",
                    include: ["../<%=dirs.jsOutput%>/<%=pkg.name%>.min"], // Use built component file
                    exclude: [],
                    out: "<%=dirs.jsOutput%>/<%=pkg.name%>.full.min.js"
                })
            }
        },
        clean: {
            build: ["<%=dirs.output%>/*", "!<%=dirs.output%>/index.html", "<%=dirs.dependencies%>"]
        },
        copy: {
            requirejs: {
                src: "<%=dirs.dependencies%>/js/requirejs/require.js",
                dest: "<%= dirs.jsOutput %>/",
                expand: true,
                flatten: true
            },
            angular: {
                src: "vendor/js/angular/angular-1.2.9.js",
                dest: "<%= dirs.jsOutput %>/",
                expand: true,
                flatten: true
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        jasmine_node: {
            task_name: {
                options: {
                    coverage: {
                        print: 'summary', // none, summary, detail, both
                        relativize: true,
                        thresholds: {
                            statements: 0,
                            branches: 0,
                            lines: 0,
                            functions: 0
                        },
                        reportDir: 'reports/coverage',
                        report: [
                            'cobertura'
                        ],
                        collect: false,
                        excludes: []
                    },
                    forceExit: true,
                    match: '.',
                    matchAll: false,
                    specFolders: ['test/specs/DaoTests', 'test/specs/ServerTests'],
                    extensions: 'js',
                    specNameMatcher: 'spec',
                    captureExceptions: true,
                    junitreport: {
                        report: true,
                        savePath: 'reports/results/',
                        useDotNotation: true,
                        consolidate: true
                    }
                },
                src: ['server.js', 'server/**/*.js']
            }
        },

        uglify: {
            //uglify can be used to minify individual files. This can be used in cooperation with
            //file watchers in WebStorm to rapidly develop and test minified code.
            //Source maps are included so that developers are happy!
            dev : {
                options: {
                    mangle : {
                        except : ['require', '$', 'angular']
                    },
                    sourceMap : true
                },
                files : [{
                    expand: true,
                    cwd: 'app',
                    src: '**/*.js',
                    dest: 'dist'
                }]
            },
            production : {
                options: {
                    mangle : {
                        except : ['require', '$', 'angular']
                    },
                    sourceMap : false
                },
                files : [{
                    expand: true,
                    cwd: 'app',
                    src: '**/*.js',
                    dest: 'dist'
                }]
            }
        }
    });

    // Enable logging
    //grunt.log.writeflags(grunt.config.get("requirejs.compile"), "Compile config:");
    //grunt.log.writeflags(grunt.config.get("requirejs.compile_min"), "Compile min config:");
    //grunt.log.writeflags(grunt.config.get("requirejs.compile_full"), "Compile full config:");
    //grunt.log.writeflags(grunt.config.get("requirejs.compile_full_min"), "Compile full min config:");

    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-requirejs");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-jasmine-node-coverage");
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    // Default task
    //grunt.registerTask("default", ["bower", "requirejs", "copy"]);
    grunt.registerTask("default", ["clean", "bower", "uglify:dev", "copy"]);

    // Development task
    //grunt.registerTask("development", ["clean", "bower", "requirejs:compile", "requirejs:compile_full"]);
    grunt.registerTask("development", ["clean", "bower", "uglify:dev"]);

    // Production task
    grunt.registerTask("production", ["clean", "bower", "uglify:production", "copy"]);

    //Testing
    grunt.registerTask("test", ["karma", "jasmine_node"]);

};