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
			this.coord		= { 'latitude': 0, 'longitude': 0, 'accuracy': 0 };
			this.city		= null;
			this.degrees	= null;
			this.weather	= 'cloudy';
			this.daytime	= 'day';

			this.elem.setAttribute('loading', '');
			this.elem.setAttribute('weather', `${this.weather}`);
			this.elem.setAttribute('time', `${this.daytime}`);
			this.getGeolocation();
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
		 * @description	Returns an element containing current degrees.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		createTemperatur (degrees) {
			let degreeElem = document.createElement('span');
			degreeElem.classList.add('weather__degrees');
			degreeElem.innerText = `${degrees}°C`;

			return degreeElem;
		}

		/**
		 * @description	Creates all content elements and appends them to <weather-card>.
		 */
		createContent () {
			let city = document.createElement('h1');
			let location = document.createElement('h2');
			let temperatur = this.createTemperatur(this.degrees);

			// City
			city.classList.add('weather__city');
			city.innerText = this.city;
			// Location
			location.classList.add('weather__place');
			location.innerText = 'Current location';

			// Append elements
			this.elem.appendChild( temperatur );
			this.elem.appendChild( city );
			this.elem.appendChild( location );
			this.elem.removeAttribute('loading');
		}

		/**
		 * @description	Gets current geolocation and saves the values.
		 * @private
		 * @todo 			Add error callback.
		 */	
		getGeolocation () {
			let self = this;
			navigator.geolocation.getCurrentPosition(
				// Success
				function (position) {
					self.coord['latitude']	= position.coords.latitude;
					self.coord['longitude']	= position.coords.longitude;
					self.coord['accuracy']	= position.coords.accuracy;
					self.getWeatherFromAPI();
				},
				// Error
				function (error) {
					console.log(error);
				}
			);
		}

		/**
		 * @description	Uses OpenWeatherMap.org to fetch the weather data.
		 * @private
		 */	
		getWeatherFromAPI () {
			let weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${this.coord.latitude}&lon=${this.coord.longitude}`;
			let self = this;

			fetch(weatherURL)
			.then(function (response) { return response.text(); })
			.then(function (response) {
				let weatherResponse = JSON.parse(response);
				
				// Set values
				self.city = weatherResponse.name;
				self.kelvinCalculator( weatherResponse.main.temp );
				self.validateWeather( weatherResponse.weather[0].main );
				self.validateDaytime( weatherResponse.sys );
				// Create content
				self.createContent();

				console.log(weatherResponse);
				console.log(self);
			})
			.catch(function (error) {
				console.log(error);
			});
		}

		validateDaytime (config) {
			const MS		= 1000; // milliseconds
			let now		= new Date();
			let sunrise	= new Date(config.sunrise * MS);
			let sunset	= new Date(config.sunset * MS);
			let isNight	= now >= sunset;
			let isDay	= now <= sunrise;

			if (isNight) {
				this.daytime = 'night';
				this.elem.removeAttribute('weather');
			}
			else if (isDay) { 
				this.daytime = 'day';
			}

			this.elem.setAttribute('time', `${this.daytime}`);
		}

		kelvinCalculator (temp) {
			let absZeroTempInC	= 273.15; // -273.15 °C
			let absZeroTempInF	= 459.67; // -459.67 °F
			let calcCelcius		= Math.floor(temp - absZeroTempInC);
			this.degrees = calcCelcius;
		}

		/**
		 * @description	Saves the weather string and sets attribute.
		 * @param  {String} weather
		 */
		validateWeather (weather) {
			this.weather = weather.toString().toLowerCase();
			this.elem.setAttribute('weather', `${this.weather}`);
		}

		/**
		 * @description	Saves current content to localStorage.
		 * @public
		 */	
		updateStorage () {
			this.parent.storage['content'] = {};
			localStorage[this.parent.guid] = JSON.stringify(this.parent.storage);
		}

		edit () {}

		save () {
			this.updateStorage();
		}
	}

	return WeatherCard;
})();