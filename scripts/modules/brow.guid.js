/**
 * @name				BrowGUID
 * @description	Returns a Globally Unique Identifer as string
 * @public
 * @return			{String}
 */
BrowGUID = (function () {
	'use strict';
	
	const s4 = function s4 () {
		return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16).substring(1);
	};

	return function() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
	};
})();