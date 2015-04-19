/**
 * @name				WeatherCard
 * @description	/
 */
WeatherCard = (function () {
	'use strict';

	class WeatherCard {
		constructor (card) {
			this.parent			= card;
			this.elem			= document.createElement('weather-card');
			this.temperatur	= this.createTemperatur();
			this.content		= this.createContent();
			this.degrees		= { 'celsius' : '°C', 'fahrenheit' : '°F' };
			
			//this.coord		= { 'latitude': 0, 'longitude': 0, 'accuracy': 0 };
			// navigator.geolocation.getCurrentPosition(
			// 	this.geolocationSuccess,
			// 	this.geolocationError
			// );
			
			let self = this;
			
			this.elem.setAttribute('weather', 'cloudy');
			this.elem.appendChild( this.temperatur );
			this.content.forEach(function (elem) {
				self.elem.appendChild( elem );
			});
		}

		/**
		 * @description	Returns the entire module wrapper element.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		get getContent () {
			return this.elem;
		}

		createTemperatur () {
			let degrees = document.createElement('span');

			degrees.classList.add('weather__degrees');
			degrees.innerText = '11°C';

			return degrees;
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

		createContent () {
			let city = document.createElement('h1');
			let location = document.createElement('h2');
			city.classList.add('weather__city');
			city.innerText = 'Berlin';
			location.classList.add('weather__place');
			location.innerText = 'Current location';

			return [city, location];
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