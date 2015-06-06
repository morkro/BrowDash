(function (window) {
	'use strict';

	/**
	 * @description	Allows to loop over NodeList ('querySelectorAll').
	 */
	NodeList.prototype.forEach = Array.prototype.forEach;
	
})(window);