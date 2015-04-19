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
		'text': 'Save any content you want.',
		'todo': 'Task list'
	};

	const _cardDefaultContents = {
		'text': {
			'default': `Just click the edit button and enter any content you want.
							It's possible to remove all styles of your copied text using the "unstyle"-button.`
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