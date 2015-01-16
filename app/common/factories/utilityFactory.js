// ------------------------------------------------------------
// Factory used for importing universal utilities into a controller
//-------------------------------------------------------------
define([
        '../module',
        '../namespace'
    ],
    function (module, namespace) {
        'use strict';

        var name = namespace + ".utilityFactory";
        module.factory(name, function() {
			var utilityFactory = {};

			// Find a subset of data by _id
			utilityFactory.findById = function(data, id) {
				for (var i = 0; i < data.length; i++) {
					if (data[i]._id == id) {
						return(data[i]);
					}
				}
				return "";
			};

			// Find index of a piece of data
			utilityFactory.findIndexById = function(data, id) {
				for (var i = 0; i < data.length; i++) {
					if (data[i]._id == id) {
						return(i);
					}
				}
				return "";
			};

			utilityFactory.randomColor = function(brightness) {
				//6 levels of brightness from 0 to 5, 0 being the darkest
				var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
				var mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
				var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){
					return Math.round(x/2.0);
				});
				return "rgb(" + mixedrgb.join(",") + ")";
			};

			return utilityFactory;

		});
	});