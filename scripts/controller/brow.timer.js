/**
 * @name				BrowTimer
 * @description	Class which appends a time string to an element 
 *              	and updates it every second.
 */
BrowTimer = (function() {
	'use strict';

	class BrowTimer {
		constructor (elem) {
			if (!(elem && elem.nodeName)) {
				throw new Error('You haven\'t passed a valid HTMLElement!');
			}

			this.update	= 1000;
			this.elem	= elem;
		}

		/**
		 * @name 			BrowTimer.getTime
		 * @description	Creates a string with current time in HH:MM:SS
		 * @return			{String}
		 */
		getTime () {
			let _date			= new Date();
			let _dateHours		= (_date.getHours() < 10) ? '0' + _date.getHours() : _date.getHours();
			let _dateMinutes	= (_date.getMinutes() < 10) ? '0' + _date.getMinutes() : _date.getMinutes();
			let _dateSeconds	= (_date.getSeconds() < 10) ? '0' + _date.getSeconds() : _date.getSeconds();

			return _dateHours +':'+ _dateMinutes +':'+ _dateSeconds;
		}

		/**
		 * @name				BrowTimer.run
		 * @description	Sets the element in which the time should be displayed.
		 * @param			{Element} elem
		 * @return 			{HTMLElement}
		 */
		run () {
			let _this = this;
			
			this.elem.textContent = this.getTime();
			setInterval(function () {
				_this.elem.textContent = _this.getTime();
			}, this.update);

			return this.elem;
		}
	}

	return BrowTimer;
})();