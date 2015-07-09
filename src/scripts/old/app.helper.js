(function (window) {
	'use strict';

	/**
	 * @description	Allows to loop over NodeList ('querySelectorAll').
	 */
	NodeList.prototype.forEach = Array.prototype.forEach;

	String.prototype.capitalize = function () {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};

})(window);