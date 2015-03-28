/**
 * @name				Brow.Data
 * @description	Stores all module related data like default content.
 * @param			{Object} Brow
 * @return			{Function} Header
 * @return			{Function} Content
 */
Brow.Data = (function (Brow) {
	'use strict';

	/* Constants */
	const _cardDefaultTitles = {
		'basic': 'Storage all the things!',
		'todo': 'Task list',
		'weather': 'Weather'
	};

	const _cardDefaultContents = {
		'basic': {
			'default': 'What do you want to save?'
		}
	};

	/**
	 * @name				BrowDash.Data.Header
	 * @description	Returns the default title of each module
	 * @public
	 * @param			{String} type
	 */
	const _getDefaultHeader = function (type) {
		if (typeof type !== 'string') return;
		return _cardDefaultTitles[type];
	};

	/**
	 * @name				BrowDash.Data.Content
	 * @description	Returns the default content of each module
	 * @public
	 * @param			{String} type
	 */
	const _getDefaultContent = function (type) {
		if (typeof type !== 'string') return;
		return _cardDefaultContents[type];
	};	

	/* Public API */
	return {
		Header: _getDefaultHeader,
		Content: _getDefaultContent
	};
})(Brow);