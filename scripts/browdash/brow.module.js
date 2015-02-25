/* Because ES6: */
/* jshint strict:false */

Brow.Module = (function (Brow) {
	/* Constnats */

	/* Variables */

	/**
	 * Creates a basic module containing a <p> tag.
	 * @return {HTMLElement}
	 */
	const _returnBasicModule = function () {
		var _cParagraphElem	= document.createElement('p');
		var defaultContent	= Brow.Data.Content('basic')['default'];
		_cParagraphElem.setAttribute('data-basic-preview', defaultContent);
		return _cParagraphElem;
	};

	/* Public API */
	return {
		Basic: _returnBasicModule
	};
})(Brow);