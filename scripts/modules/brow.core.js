/**
 * @description	Initialise Brow object.
 * @type 			{Object}
 */
var Brow = window.Brow = {};

/**
 * @name				Brow.isEditMode
 * @description	Saves the current application state.
 * @public
 */
Brow.isEditMode = false;

/**
 * @name				Brow.activeCard
 * @description	Holds current state of an active card.
 * @public
 */
Brow.activeCard = null;

/**
 * @name				Brow.GUID
 * @description	Returns a Globally Unique Identifer as string
 * @public
 * @return			{String}
 */
Brow.GUID = (function () {
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