/**
 * @name				WeatherCard
 * @description	/
 */
WeatherCard = (function () {
	'use strict';

	class WeatherCard {
		constructor (card) {
			this.parent			= card;
			this.wrapper		= document.createElement('div');
			this.temperatur	= this.createTemperatur();
			this.degrees		= { 'celsius' : '°C', 'fahrenheit' : '°F' };
			
			//this.coord		= { 'latitude': 0, 'longitude': 0, 'accuracy': 0 };

			this.wrapper.classList.add('content__weather');
			this.wrapper.appendChild( this.temperatur );

			// navigator.geolocation.getCurrentPosition(
			// 	this.geolocationSuccess,
			// 	this.geolocationError
			// );
		}

		/**
		 * @description	Returns the entire module wrapper element.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		get getContent () {
			return [ this.wrapper ];
		}

		createTemperatur () {
			let elem = document.createElement('span');
			let wrap = document.createElement('div');

			elem.innerText = '11°C';
			wrap.appendChild(elem);

			return wrap;
		}

		geolocationSuccess (position) {
			this.coord['latitude'] = position.coords.latitude;
			this.coord['longitude'] = position.coords.longitude;
			this.coord['accuracy'] = position.coords.accuracy;

			console.log(this);
			console.log('Your current position is:');
			console.log('Latitude : ' + position.coords.latitude);
			console.log('Longitude: ' + position.coords.longitude);
			console.log('More or less ' + position.coords.accuracy + ' meters.');
		}

		/**
		 * @description	Saves current content to localStorage.
		 * @public
		 */	
		updateStorage () {}

		edit () {}

		save () {}
	}

	return WeatherCard;
})();