/**
 * @name				WeatherCard
 * @description	/
 */
WeatherCard = (function () {
	'use strict';

	class WeatherCard {
		constructor (card) {
			this.parent		= card;
			this.elem		= document.createElement('weather-card');
		}

		/**
		 * @description	Returns the entire module wrapper element.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		get getContent () {
			return this.elem;
		}

		/**
		 * @description	Saves current content to localStorage.
		 * @public
		 */	
		updateStorage () {
			this.parent.storage['content'] = {};
			localStorage[this.parent.guid] = JSON.stringify(this.parent.storage);
		}

		save () {
			this.updateStorage();
		}
	}

	return WeatherCard;
})();