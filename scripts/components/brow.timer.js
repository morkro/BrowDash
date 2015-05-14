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
			this.format = '24h';
			this.abbreviations = false;
		}

		/**
		 * @description	Creates a string with current time in HH:MM:SS
		 * @return			{String}
		 */
		getTime () {
			let date				= new Date();
			let dateHours		= date.getHours();
			let dateMinutes	= date.getMinutes();
			let dateSeconds	= date.getSeconds();
			let dateAbbr		= '';

			// If time format is set to 12h, use 12h-system.
			if (this.format === '12h' && dateHours >= 12) {
				if (dateHours > 12) {
					dateHours -= 12;
				}
				if (this.abbreviations) {
					dateAbbr = this.getAbbreviation(dateHours);
				}
			}

			// Add '0' if below 10
			if (dateHours < 10) dateHours = `0${dateHours}`;
			if (dateMinutes < 10) dateMinutes = `0${dateMinutes}`;
			if (dateSeconds < 10) dateSeconds = `0${dateSeconds}`;

			return `${dateHours}:${dateMinutes}:${dateSeconds} ${dateAbbr}`;
		}

		/**
		 * @description	Validates number and returns either AM or PM.
		 * @param 			{Number} time
		 * @return			{String}
		 */
		getAbbreviation (time) {
			if (typeof time !== 'number') {
				time = parseFloat(time);
			}

			return (time >= 12) ? 'AM' : 'PM';
		}

		/**
		 *	@description	Needs to be written.
		 * @param			{Object} config
		 */
		setDateFormat (config) {
			if (!config) {
				config = { 'format': '24h' };
			}

			this.format = config.format;
			this.abbreviations = config.abbreviations;
			this.run();
		}

		/**
		 * @name				BrowTimer.run
		 * @description	Sets the element in which the time should be displayed.
		 * @param			{Element} elem
		 * @return 			{HTMLElement}
		 */
		run () {
			let self = this;
			
			this.elem.textContent = this.getTime();
			setInterval(function () {
				self.elem.textContent = self.getTime();
			}, this.update);

			return this.elem;
		}
	}

	return BrowTimer;
})();