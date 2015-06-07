(function (window) {
	'use strict';

	/**
	 * @description	Allows to loop over NodeList ('querySelectorAll').
	 */
	NodeList.prototype.forEach = Array.prototype.forEach;

	String.prototype.capitalize = function () {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};

	/**
	 * @description	Returns a Globally Unique Identifer as string
	 * @return			{String}
	 */
	window.uuid = function () {
		var perf = performance.now();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (perf + Math.random() * 16) % 16 | 0;
			perf = Math.floor(perf / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uuid;
	};
	
})(window);