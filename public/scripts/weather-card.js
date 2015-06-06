(function() {
	'use strict';
	
	/* Constants */
	var doc				= document.currentScript.ownerDocument;
	var template		= doc.querySelector('#weather-card');
	var WeatherCard	= Object.create(HTMLDivElement.prototype);
	
	WeatherCard.coord			= { 'latitude': 0, 'longitude': 0, 'accuracy': 0 };
	WeatherCard.curCity		= null;
	WeatherCard.celsius		= 0;
	WeatherCard.fahrenheit	= 0;
	WeatherCard.curWeather	= 'cloudy';
	WeatherCard.daytime		= 'day';
	WeatherCard.tempElem		= null;
	WeatherCard.storage		= { temperature: 'celsius' };

	/**
	 * @description	An instance of the element is created.
	 */
	WeatherCard.createdCallback = function () {
		this.root		= this.createShadowRoot();
		this.root.appendChild( document.importNode(template.content, true) );
		this.settings	= this.root.querySelector('.weather__settings ul');
		this.inputC		= this.root.querySelector('#celsius');
		this.inputF		= this.root.querySelector('#fahrenheit');
		this.icon		= document.createElement('svg-icon');
		this.city		= document.createElement('h1');
		this.location	= document.createElement('h2');
		this.tempElem	= document.createElement('span');

		this.setAttribute('loading', '');
		this.setAttribute('weather', `${this.curWeather}`);
		this.setAttribute('time', `${this.daytime}`);
		this.setTemperature('celsius');
		this.appendContent();

		this.settings.addEventListener('click', this.validateSettings.bind(this));

		this.getGeolocation();
	};

	/**
	 * @description	Saves the users input.
	 */
	WeatherCard.validateSettings = function (event) {
		if (event.target.type === 'radio') {
			this.setTemperature(event.target.id);
		}
	};

	/**
	 * @description	Gets current geolocation and saves the values.
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
			// Create content
			this.updateContent();
			this.removeAttribute('loading');
			this.setTemperature(this.storage.temperature);
		}.bind(this))
		.catch(function (error) {
			console.log(error);
		});
	};

	/**
	 * @description	Saves the weather string and sets 'weather=""' attribute.
	 * @param  {String} weather
	 */
	WeatherCard.validateWeather = function (weather) {
		this.curWeather = weather.toString().toLowerCase();
		this.setAttribute('weather', `${this.curWeather}`);
	};

	/**
	 * @description	Validates current time and sets 'time=""' attribute.
	 * @param  {Object} config
	 */
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
	 * @description	Sets temperature as string in element.
	 * @return 			{HTMLElement}
	 */	
	WeatherCard.setTemperature = function (degrees) {
		let tempOutput = `${this.celsius}°C`;

		if (degrees === 'fahrenheit') {
			tempOutput = `${this.fahrenheit}°F`;
			this.inputF.checked = true;
		}
		else {
			this.inputC.checked = true;	
		}

		this.tempElem.innerText = tempOutput;
		this.storage.temperature = degrees;
	};

	/**
	 * @description	Takes a number and calculates celsius/fahrenheit. 
	 * @param {Number} temp
	 */
	WeatherCard.kelvinCalculator = function (temp) {
		let absZeroTempInC	= 273.15; // -273.15 °C
		this.celsius			= Math.floor(temp - absZeroTempInC);
		this.fahrenheit		= Math.floor(this.celsius * 1.8 + 32);
	};

	/**
	 * @description	Validates this.daytime & this.curWeather and returns string.
	 * @return {String}
	 */
	WeatherCard.validateCurrentWeather = function () {
		let curWeather = this.curWeather;

		if (curWeather === 'clear' && this.daytime === 'night') {
			curWeather = 'night';
		}
		else if (curWeather === 'clear' && this.daytime === 'day') {
			curWeather = 'sunny';
		}
		else {
			curWeather = 'sunny';
		}

		return curWeather;
	};

	/**
	 * @description	Creates all content elements and appends them to <weather-card>.
	 */
	WeatherCard.appendContent = function () {
		// City
		this.city.classList.add('weather__city');
		// Location
		this.location.classList.add('weather__place');
		// Temperature
		this.tempElem.classList.add('weather__degrees');

		this.updateContent();

		// Append elements
		this.appendChild( this.tempElem );
		this.appendChild( this.icon );
		this.appendChild( this.city );
		this.appendChild( this.location );
	};

	/**
	 * @description	Updates all elements.
	 */
	WeatherCard.updateContent = function () {
		let _curWeather	= this.validateCurrentWeather();
		let _curCity		= (!!this.curCity) ? this.curCity : 'Where are you again?';

		this.icon.setAttribute('icon', _curWeather);
		this.city.innerText = _curCity;
		this.location.innerText = 'Current location';
	};

	WeatherCard.edit = function () {};

	/**
	 * @description	Saves the current state of temperature settings.
	 */
	WeatherCard.save = function () {
		this.setTemperature(this.storage.temperature);
	};	
	
	/* Register element in document */
	document.registerElement('weather-card', { prototype: WeatherCard });
})();