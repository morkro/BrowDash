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
			this.confTemp	= this.parent.content.temperature;

			if (!!this.confTemp) {
				console.log(this.confTemp);
				this.elem.setTemperature(this.confTemp);
			}
		}

		/**
		 * @description	Returns the entire module wrapper element.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		get getContent () {
			return this.elem;
		}

		save () {
			this.elem.save();
			this.parent.storage['content'] = this.elem.storage;
			localStorage[this.parent.guid] = JSON.stringify(this.parent.storage);
		}
	}

	return WeatherCard;
})();