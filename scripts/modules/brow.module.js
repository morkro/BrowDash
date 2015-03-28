Brow.Module = (function (Brow) {
	'use strict';

	/* Constnats */
	const AVAILABLE_MODULES = [
		'basic', 
		'weather'
	];

	/* Variables */
	var curCardType = null;
	var curCardElem = null;
	var curBasicModule = {
		headline: null,
		content: null
	};

	/**
	 * @description	Creates a basic module containing a <p> tag.
	 * @private
	 * @return {HTMLElement}
	 */
	const returnBasicModule = function () {
		let _cParagraphElem	= document.createElement('p');
		let _defaultContent	= Brow.Data.Content('basic')['default'];
		_cParagraphElem.setAttribute('data-basic-preview', _defaultContent);
		return _cParagraphElem;
	};

	/**
	 * @description	Validates the given object and calls different editing functions.
	 * @private
	 * @param  {Object} options
	 */
	const validateModuleEditMode = function (options) {
		if (!options || typeof options !== 'object') {
			throw new Error('No options passed!');
		}
		curCardType = options.type;
		curCardElem = options.elem;

		if (AVAILABLE_MODULES[curCardType]) {
			switch (curCardType) {
				case 'basic':
					_activateBasicEditMode(curCardElem);
					break;
			}
		} else {
			throw new Error('Module ['+ curCardType + '] isn\'t available!');
		}
	};

	/**
	 * [_validateModuleSaving description]
	 * @param  {[type]} elem [description]
	 * @return {[type]}      [description]
	 */
	const validateModuleSaving = function (elem) {
		switch (curCardType) {
			case 'basic':
				_saveBasicState();
				break;
		}
	};

	/**
	 * [_saveBasicState description]
	 * @param  {[type]} cardElem [description]
	 * @return {[type]}          [description]
	 */
	const _saveBasicState = function (cardElem) {
		curBasicModule['headline'].removeAttribute('contenteditable');
		curBasicModule['content'].removeAttribute('contenteditable');
		curBasicModule['headline']	= null;
		curBasicModule['content']	= null;
		curCardElem						= null;
	};

	/**
	 * [_activateBasicEditMode description]
	 * @param  {[type]} cardElem [description]
	 * @return {[type]}          [description]
	 */
	const _activateBasicEditMode = function (cardElem) {
		curBasicModule['headline']	= cardElem.querySelector('h1');
		curBasicModule['content']	= cardElem.querySelector('p');
		curBasicModule['headline'].setAttribute('contenteditable', true);
		curBasicModule['content'].setAttribute('contenteditable', true);
	};

	/* Public API */
	return {
		Basic: returnBasicModule,
		Edit: validateModuleEditMode,
		Save: validateModuleSaving
	};
})(Brow);