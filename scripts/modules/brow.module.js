Brow.Module = (function (Brow) {
	'use strict';

	/* Constnats */
	const AVAILABLE_MODULES = [
		'basic', 'weather'
	];

	/* Variables */

	/**
	 * Creates a basic module containing a <p> tag.
	 * @return {HTMLElement}
	 */
	const _returnBasicModule = function () {
		let _cParagraphElem	= document.createElement('p');
		let defaultContent	= Brow.Data.Content('basic')['default'];
		_cParagraphElem.setAttribute('data-basic-preview', defaultContent);
		return _cParagraphElem;
	};

	const _validateModuleEditMode = function (moduleType) {
		console.log(moduleType);
	};

	/* Public API */
	return {
		Basic: _returnBasicModule,
		Edit: _validateModuleEditMode
	};
})(Brow);