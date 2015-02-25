/* Because ES6: */
/* jshint strict:false */

Brow.DateTimer = (function (Brow) {
	/**
	 * @description	Creates a string with current time.
	 * @private
	 * @return			{String}
	 */
	const _getTime = function () {
		var _date = new Date();
		var _dateHours = (_date.getHours() < 10) ? '0' + _date.getHours() : _date.getHours();
		var _dateMinutes = (_date.getMinutes() < 10) ? '0' + _date.getMinutes() : _date.getMinutes();
		var _dateSeconds = (_date.getSeconds() < 10) ? '0' + _date.getSeconds() : _date.getSeconds();

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