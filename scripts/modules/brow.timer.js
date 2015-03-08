/**
 * @name				Brow.DateTimer
 * @description	Creates a time string and refreshes it every second.
 * @param			{Object} Brow
 * @return			{Function} Append
 */
Brow.DateTimer = (function (Brow) {
	'use strict';

	/**
	 * @description	Creates a string with current time in HH:MM:SS
	 * @private
	 * @return			{String}
	 */
	const _getTime = function () {
		let _date			= new Date();
		let _dateHours		= (_date.getHours() < 10) ? '0' + _date.getHours() : _date.getHours();
		let _dateMinutes	= (_date.getMinutes() < 10) ? '0' + _date.getMinutes() : _date.getMinutes();
		let _dateSeconds	= (_date.getSeconds() < 10) ? '0' + _date.getSeconds() : _date.getSeconds();

		return _dateHours +':'+ _dateMinutes +':'+ _dateSeconds;
	};

	/**
	 * @name				Brow.DateTimer.Append
	 * @description	Sets the element in which the time should be displayed.
	 * @public
	 * @param			{Element} elem
	 */
	const _setElem = function (elem) {
		elem.textContent = _getTime();
		setInterval(function () {
			elem.textContent = _getTime();
		}, 1000);
	};

	/* Public API */
	return {
		Append: _setElem
	};
})(Brow);