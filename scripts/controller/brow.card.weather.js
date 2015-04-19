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

			this.elem.setAttribute('loading', null);
			this.elem.setAttribute('weather', `${this.weather}`);
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
				console.log(weatherResponse);
				// Set values
				self.city = weatherResponse.name;
				self.kelvinCalculator( weatherResponse.main.temp );
				self.validateWeather( weatherResponse.weather[0].main );
				// Create content
				self.createContent();
			});
		}

		kelvinCalculator (temp) {
			console.log(temp);
			let absZeroTempInC	= 273.15; // -273.15 °C
			let absZeroTempInF	= 459.67; // -459.67 °F
			let calcCelcius		= Math.floor(temp - absZeroTempInC);
			this.degrees = calcCelcius;
		}

		validateWeather (weather) {
			weather = weather.toString().toLowerCase();

			switch (weather) {
				case 'clear':
					this.weather = weather;
					this.elem.setAttribute('weather', `${this.weather}`);
					break;
			}
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