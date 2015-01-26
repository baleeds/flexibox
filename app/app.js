// ------------------------------------------------------------
// Defines our main FlexiBox module.  Includes injecting angular
// components into module.  
//-------------------------------------------------------------
define([
		"angular",
		"namespace",
		"./common/namespace",
		"./flexibox-home/namespace",
		"./flexibox-set/namespace",
		"./flexibox-project/namespace",
		"./flexibox-post/namespace",
		"./flexibox-session/namespace",
		"./flexibox-login/namespace",
		"./flexibox-signup/namespace",
		"jquery",
		"foundation",
		"angularRoute",
		"angularSanitize",
		"./common/module.require",
		"./flexibox-home/module.require",
		"./flexibox-project/module.require",
		"./flexibox-set/module.require",
		"./flexibox-post/module.require",
		"./flexibox-session/module.require",
		"./flexibox-login/module.require",
		"./flexibox-signup/module.require"
	],
	function (angular, namespace, namespaceCommon, namespaceIndex, namespaceSet, namespaceProject, namespacePost, namespaceSession, namespaceLogin, namespaceSignup) {
		"use strict";

		var app = angular.module(namespace,
		[
			'ngRoute',
			'ngSanitize',
			namespaceCommon,
			namespaceIndex,
			namespaceProject,
			namespaceSet,
			namespacePost,
			namespaceSession,
			namespaceLogin,
			namespaceSignup
      ]).run(["$log", function($log) {
            
         // Configure enhanced logging
         $log.getInstance = function(context) {
            return {
               log   : enhanceLogging($log.log, context),
               info  : enhanceLogging($log.info, context),
               warn  : enhanceLogging($log.warn, context),
               debug : enhanceLogging($log.debug, context),
               error : enhanceLogging($log.error, context)
            };
         };
         
         function enhanceLogging(loggingFunc, context) {
            return function() {
               var modifiedArguments = [].slice.call(arguments);
               modifiedArguments[0] = [new Date().toString() + '::[' + context + '] > '] + modifiedArguments[0];
               loggingFunc.apply(null, modifiedArguments);
            };
         }
      }]);
		return app;
	});
