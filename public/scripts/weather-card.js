(function() {
	'use strict';
	
	/* Constants */
	var doc				= document.currentScript.ownerDocument;
	var template		= doc.querySelector('#weather-card');
	var WeatherCard	= Object.create(HTMLDivElement.prototype);
	
	WeatherCard.coord			= { 'latitude': 0, 'longitude': 0, 'accuracy': 0 };
	WeatherCard.curCity		= null;
	WeatherCard.curDegrees	= null;
	WeatherCard.curWeather	= 'cloudy';
	WeatherCard.daytime		= 'day';

	WeatherCard.createdCallback = function () {
		let root = this.createShadowRoot();
		root.appendChild( document.importNode(template.content, true) );

		this.setAttribute('loading', '');
		this.setAttribute('weather', `${this.curWeather}`);
		this.setAttribute('time', `${this.daytime}`);
		this.getGeolocation();
	};

	/**
	 * @description	Gets current geolocation and saves the values.
	 * @public
	 * @todo 			Add error callback.
	 */	
	WeatherCard.getGeolocation = function () {
		navigator.geolocation.getCurrentPosition(
			// Success
			function (position) {
				this.coord['latitude']	= position.coords.latitude;
				this.coord['longitude']	= position.coords.longitude;
				this.coord['accuracy']	= position.coords.accuracy;
				this.getWeatherFromAPI();
			}.bind(this),
			// Error
			function (error) {
				console.log(error);
			}
		);
	};

	/**
	 * @description	Uses OpenWeatherMap.org to fetch the weather data.
	 * @private
	 */	
	WeatherCard.getWeatherFromAPI = function () {
		let weatherURL = `http://api.openweathermap.org/data/2.5/weather
								?lat=${this.coord.latitude}
								&lon=${this.coord.longitude}`;

		fetch(weatherURL)
		.then(function (response) { return response.text(); })
		.then(function (response) {
			let weatherResponse = JSON.parse(response);
			
			// Set values
			this.curCity = weatherResponse.name;
			this.kelvinCalculator( weatherResponse.main.temp );
			this.validateWeather( weatherResponse.weather[0].main );
			this.validateDaytime( weatherResponse.sys );
			// // Create content
			this.createContent();

			//console.log(weatherResponse);
		}.bind(this))
		.catch(function (error) {
			console.log(error);
		});
	};

	/**
	 * @description	Saves the weather string and sets attribute.
	 * @param  {String} weather
	 */
	WeatherCard.validateWeather = function (weather) {
		this.curWeather = weather.toString().toLowerCase();
		this.setAttribute('weather', `${this.curWeather}`);
	};

	WeatherCard.validateDaytime = function (config) {
		const MS		= 1000; // milliseconds
		let now		= new Date();
		let sunrise	= new Date(config.sunrise * MS);
		let sunset	= new Date(config.sunset * MS);
		let isNight	= now >= sunset;
		let isDay	= now <= sunrise;

		if (isNight) {
			this.daytime = 'night';
			this.removeAttribute('weather');
		}
		else if (isDay) { 
			this.daytime = 'day';
		}

		this.setAttribute('time', `${this.daytime}`);
	};

	/**
	 * @description	Returns an element containing current degrees.
	 * @public
	 * @return 			{HTMLElement}
	 */	
	WeatherCard.createTemperatur = function (degrees) {
		let degreeElem = document.createElement('span');
		degreeElem.classList.add('weather__degrees');
		degreeElem.innerText = `${degrees}°C`;

		return degreeElem;
	};

	WeatherCard.kelvinCalculator = function (temp) {
		let absZeroTempInC	= 273.15; // -273.15 °C
		let calcCelcius		= Math.floor(temp - absZeroTempInC);
		let calcFahrenheit	= Math.floor(calcCelcius * 1.8 + 32);
		this.curDegrees		= calcCelcius;
	};

	/**
	 * @description	Creates all content elements and appends them to <weather-card>.
	 */
	WeatherCard.createContent = function () {
		let icon			= document.createElement('svg-icon');
		let city			= document.createElement('h1');
		let location	= document.createElement('h2');
		let temperatur	= this.createTemperatur(this.curDegrees);
		let curWeather = this.curWeather;

		if (curWeather === 'clear' && this.daytime === 'night') {
			curWeather = 'night';
		}
		else if (curWeather === 'clear' && this.daytime === 'day') {
			curWeather = 'sunny';
		}

		// Icon
		icon.setAttribute('icon', curWeather);
		// City
		city.classList.add('weather__city');
		city.innerText = this.curCity;
		// Location
		location.classList.add('weather__place');
		location.innerText = 'Current location';

		// Append elements
		this.appendChild( temperatur );
		this.appendChild( icon );
		this.appendChild( city );
		this.appendChild( location );
		this.removeAttribute('loading');
	};

	WeatherCard.edit = function () {
		console.log('edit');
	};
	
	/* Register element in document */
	document.registerElement('weather-card', { prototype: WeatherCard });
})();