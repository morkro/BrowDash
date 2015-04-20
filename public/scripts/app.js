/**
 * @description	Initialise Brow object.
 * @type 			{Object}
 */
var Brow = window.Brow = {};

/**
 * @name				Brow.isEditMode
 * @description	Saves the current application state.
 * @public
 */
Brow.isEditMode = false;

/**
 * @name				Brow.activeCard
 * @description	Holds current state of an active card.
 * @public
 */
Brow.activeCard = null;

/**
 * @name				Brow.GUID
 * @description	Returns a Globally Unique Identifer as string
 * @public
 * @return			{String}
 */
Brow.GUID = (function () {
	'use strict';
	
	const s4 = function s4 () {
		return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16).substring(1);
	};

	return function() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
	};
})();
/**
 * @name				Brow.Data
 * @description	Stores all module related data like default content.
 * @param			{Object} Brow
 * @return			{Function} Header
 * @return			{Function} Content
 */
Brow.Data = (function (Brow) {
	'use strict';

	/* Constants */
	const _cardDefaultTitles = {
		'text': 'Save any content you want.',
		'todo': 'Task list'
	};

	const _cardDefaultContents = {
		'text': {
			'default': `Just click the edit button and enter any content you want.
							It's possible to remove all styles of your copied text using the "unstyle"-button.`
		}
	};

	/**
	 * @name				BrowDash.Data.Header
	 * @description	Returns the default title of each module
	 * @public
	 * @param			{String} type
	 */
	const _getDefaultHeader = function (type) {
		if (typeof type !== 'string') return;
		return _cardDefaultTitles[type];
	};

	/**
	 * @name				BrowDash.Data.Content
	 * @description	Returns the default content of each module
	 * @public
	 * @param			{String} type
	 */
	const _getDefaultContent = function (type) {
		if (typeof type !== 'string') return;
		return _cardDefaultContents[type];
	};	

	/* Public API */
	return {
		Header: _getDefaultHeader,
		Content: _getDefaultContent
	};
})(Brow);
/**
 * @name				Brow.Dialog
 * @description	Shows/hides the dialog. Sets new theme.
 * @todo  			Needs to be more modular. Should be able to load dynamic content.
 * @param			{Object} Brow
 * @return			{Function} addEvents
 */
Brow.Dialog = (function (Brow) {
	'use strict';

	/* Variables */
	var settingsBtn		= null;
	
	var dialogOverlay		= null;
	var dialogElem			= null;
	var dialogContainer	= null;
	var dialogTheme		= null;
	var dialogThemeList	= null;
	var dialogSidebar		= null;

	/**
	 *	@description	Opens the settings dialog
	 * @private
	 * @param			{Object} event
	 */
	const _showSettings = function (event) {
		event.preventDefault();
		
		let currentLocation = window.location.href.slice(0, -1);
		let dialogContent = this.getAttribute('data-dialog');
		let dialogContentPath = `${currentLocation}/markup/dialog-${dialogContent}.html`;

		_loadDialogContent(dialogContentPath);
		dialogElem.classList.add('show');
		dialogOverlay.classList.add('show');
	};

	/**
	 *	@description	Closes the settings dialog
	 * @private
	 * @param			{Object} event
	 */
	const _closeSettings = function (event) {
		let _curTarget			= event.target;
		let _curKeyCode		= event.keyCode;
		let _dialogIsShown	= dialogElem.classList.contains('show');
		let _isCloseBtn		= _curTarget.classList.contains('dialog__close');
		let _isOutsideDialog	= _curTarget === dialogElem && _dialogIsShown;
		let _isESCKey			= _curKeyCode === 27;

		if (_isCloseBtn || _isOutsideDialog || _isESCKey && _dialogIsShown) {
			dialogContainer.innerHTML = null;
			dialogElem.classList.remove('show');
			dialogOverlay.classList.remove('show');
		}
	};

	/**
	 *	@description	Loads the dialog content and appends it.
	 * @private
	 * @param			{String} path
	 */
	const _loadDialogContent = function (path) {
		fetch(path)
			.then(function (response) {
				return response.text();
			})
			.then(function (body) {
				dialogContainer.innerHTML = body;
			});
	};

	/**
	 * @description	Gets the color attribute of the clicked element and updates the theme.
	 * @private
	 * @param			{Object} event
	 */
	const _chooseTheme = function (event) {
		event.preventDefault();

		if (event.target.hasAttribute('data-settings-theme')) {
			let _themeColor = { theme: event.target.getAttribute('data-settings-theme') };
			localStorage[Brow.Settings.BROW_KEY] = JSON.stringify(_themeColor);
			Brow.Settings.setTheme(_themeColor);
		}
	};

	/**
	 * @name				Brow.Dialog.start
	 *	@description	Adds events
	 * @public
	 * @param			{HTMLElement} elem
	 */
	const addEvents = function () {
		settingsBtn			= Brow.Settings.getElem()['onClickDialog'];
		dialogElem			= Brow.Settings.getElem()['DIALOG'];
		dialogOverlay		= Brow.Settings.getElem()['DIALOG_OVERLAY'];
		dialogContainer	= dialogElem.querySelector('.dialog__inner');
		dialogSidebar		= dialogElem.querySelector('.dialog__sidebar__list');
		dialogTheme			= dialogElem.querySelector('.settings__theme');
		
		[].forEach.call(settingsBtn, function (btn) {
			btn.addEventListener('click', _showSettings);
		});
		dialogElem.addEventListener('click', _closeSettings);
		//dialogTheme.addEventListener('click', _chooseTheme);
		window.addEventListener('keydown', _closeSettings);
	};
	
	/* Public API */
	return {
		addEvents: addEvents
	};
})(Brow);
/**
 * @name				Brow.Settings
 * @description	Stores all necessary HTMLElements, sets the theme and 
 *              	runs all other modules.	
 * @param			{Object} Brow
 * @return			{Function} setTheme
 * @return			{Function} useElements
 * @return			{Function} getElem
 * @return			{Function} start
 * @return			{String} BROW_KEY
 */
Brow.Settings = (function (Brow) {
	'use strict';

	/* Constants */
	const BROW_KEY			= 'BROW_THEME';
	const BROW_CARDS		= 'BROW_CARDS';
	const DEFAULT_THEME	= 'blue-a400';

	/* Variables */
	var browElements = {
		onClickDialog : null,
		onClickNewCard : null,
		onClickSelectionList : null,
		SELECTION : null,
		CONTENT : null,
		CONTENT_OVERLAY : null,
		DIALOG : null,
		DIALOG_OVERLAY : null
	};
	var isSelectionState = false;

	/**
	 * @description	Adds event listener.
	 * @private
	 */
	const _addEvents = function () {
		browElements.onClickSelectionList.addEventListener('mouseover', _showCardList);
		browElements.CONTENT_OVERLAY.addEventListener('click', _checkCardMode);
		browElements.SELECTION.addEventListener('mouseout', _closeCardList);
		[].forEach.call(browElements.onClickNewCard, function (item) {
			item.addEventListener('click', _addNewCard);
		});
	};

	/**
	 * @description	Checks if custom theme settings are available.
	 * @private
	 * @return			{Object}
	 */
	const _isCustomTheme = function () {
		let CUSTOM = localStorage[BROW_KEY];
		return CUSTOM;
	};

	/**
	 * @description	Parses the custom settings from localStorage and sets classes.
	 * @private
	 * @param			{String} storage
	 */
	const _updateThemeFromStorage = function (storage) {
		storage = JSON.parse(localStorage[BROW_KEY]);
		document.body.className = '';
		document.body.classList.add('theme-'+ storage.theme);
	};

	/**
	 * @description	Adds the theme class to <body> from initial settings.
	 * @private
	 * @param			{String} theme
	 */
	const _updateThemeFromConfig = function (theme) {
		document.body.classList.add('theme-'+ theme);
	};

	/**
	 * @description	Checks localStorage and loads the users cards
	 * @public
	 * @param			{Object} storage
	 */
	const _validateBrowCards = function (storage) {
		if (!localStorage[BROW_CARDS] || localStorage.length <= 1) {
			let defaultCard = new BrowCard({ type: 'text' });
			browElements['CONTENT'].appendChild( defaultCard );
		} else {
			for (let i = localStorage.length; i--;) {
				_parseCardsFromStorage(i);
			}
		}
	};

	/**
	 * @description	Checks if custom key is set, if not: do it.
	 * @public
	 */
	const _checkIfCustomBrowCards = function () {
		if (!localStorage[BROW_CARDS]) {
			localStorage[BROW_CARDS] = true;
		}
	};

	/**
	 * @description	Gets localStorage, parses available cards and creates them.
	 * @private
	 * @param			{Number|String} index
	 */	
	const _parseCardsFromStorage = function (index) {
		let storageItem = JSON.parse( localStorage.getItem( localStorage.key(index) ) );
		if (storageItem['module']) {
			let browCard = new BrowCard({
				type: storageItem['type'],
				guid: storageItem['guid'],
				title: storageItem['title'],
				content: storageItem['content']
			});
			browElements['CONTENT'].appendChild( browCard );
		}
	};

	/**
	 * @description	Displays list of cards.
	 * @private
	 * @param			{Object} event
	 */
	const _showCardList = function (event) {
		event.preventDefault();
		browElements.SELECTION.removeEventListener(_closeCardList);

		if (!Brow.isEditMode) {
			isSelectionState = true;
			browElements['SELECTION'].classList.add('show');
		}
	};

	/**
	 * @description	Hides list of cards on mouseout.
	 * @private
	 * @param			{Object} event
	 */
	const _closeCardList = function (event) {
		let movedOut = event.toElement === document.documentElement;
		let selectionIsVisible = browElements['SELECTION'].classList.contains('show');

		browElements.onClickSelectionList.removeEventListener(_showCardList);

		if (movedOut && isSelectionState) {
			browElements['SELECTION'].classList.add('hide');
			setTimeout(function () {
				browElements['SELECTION'].classList.remove('show', 'hide');
			}, 300);
		}
	};

	/**
	 * @description	Checks clicked card type and appends it to the DOM.
	 * @private
	 * @param			{Object} event
	 */
	const _addNewCard = function (event) {
		event.preventDefault();
		let selectedCard = this.getAttribute('data-create-card');
		browElements['CONTENT'].appendChild( new BrowCard({ type: `${selectedCard}` }) );
	};

	/**
	 * @description	Saves state of active card.
	 * @private
	 * @param			{Object} event
	 */
	const _checkCardMode = function (event) {
		if (Brow.isEditMode && Brow.activeCard.isEditMode) {
			Brow.activeCard.saveState();
		}
	};

	/**
	 * @name				Brow.Settings.setTheme
	 *	@description	Updates the current theme.
	 * @public
	 * @param			{Object} theme
	 */
	const setTheme = function (theme) {
		if (!theme || typeof theme !== 'string') {
			theme = DEFAULT_THEME;
		}

		if (_isCustomTheme()) {
			_updateThemeFromStorage( _isCustomTheme() );
		} else {
			_updateThemeFromConfig( theme );
		}
	};

	/**
	 * @name				Brow.Settings.useElements
	 *	@description	Assigns app specific elements for further usage.
	 * @public
	 * @param			{Object} config
	 */
	const useElements = function (config) {
		if (!config || typeof config !== 'object') {
			throw new Error('No valid options passed!');
		}

		browElements = {
			onClickDialog : config.onClickDialog,
			onClickNewCard : config.onClickNewCard,
			onClickSelectionList : config.onClickSelectionList,
			SELECTION : config.SELECTION,
			CONTENT : config.CONTENT,
			CONTENT_OVERLAY : config.CONTENT_OVERLAY,
			DIALOG : config.DIALOG,
			DIALOG_OVERLAY : config.DIALOG_OVERLAY
		};
	};

	/**
	 * @name				Brow.Settings.getElem
	 *	@description	Returns the elements object
	 * @public
	 * @return			{Object}
	 */
	const getElem = function () {
		return browElements;
	};

	/**
	 * @name				Brow.Settings.start
	 *	@description	Calls all necessary modules which are required to run the app.
	 * @public
	 */
	const initialiseAndStartApp = function () {
		Brow.Dialog.addEvents();
		_addEvents();
		_validateBrowCards();
	};
	
	/* Public API */
	return {
		setTheme : setTheme,
		useElements : useElements,
		getElem : getElem,
		start : initialiseAndStartApp,
		checkCustom : _checkIfCustomBrowCards,
		BROW_KEY : BROW_KEY,
	};
})(Brow);
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
/**
 * @name				BrowCard
 * @description	/
 */
BrowCard = (function () {
	'use strict';

	class BrowCard {
		constructor (config) {
			if (!config) config = {};

			this.isEditMode	= false;
			this.type			= (config.type) ? config.type : 'text';
			this.guid			= (config.guid) ? config.guid : Brow.GUID();
			this.content		= (config.content) ? config.content : {};
			this.config			= { elem: null };
			this.storage		= { module: true, type: this.type, guid: this.guid, content: this.content };
			this.saveState		= this.saveCardChanges;
			this.wrapper		= null;

			return this.createCard();
		}

		/**
		 * @name				BrowCard.createCard
		 * @description	Creates a new card module
		 * @public
		 */
		createCard () {
			switch (this.type) {
				case 'text':
					this.wrapper = new TextCard( this );
					break;
				case 'weather':
					this.wrapper = new WeatherCard( this );
					break;
				default:
					this.wrapper = new TextCard( this );
					break;
			}

			this.wrapper.getContent.setAttribute('data-module-guid', this.guid);
			this.wrapper.getContent.setAttribute('data-module-type', this.type);
			this.addEvents( this.wrapper.getContent );

			return this.wrapper.getContent;
		}

		/**
		 * @description	Sets eventListener on current card element.
		 * @private
		 * @param			{Object} event
		 */
		addEvents (elem) {
			let self = this;

			elem.addEventListener('card-settings', function (event) {
				if (self.config.elem === null) {
					self.config.elem = event.target;
				}
			});
			elem.addEventListener('card-edit', function (event) {
				self.activateEditMode(event);
			});
			elem.addEventListener('card-save', function (event) {
				self.saveCardChanges(event);
			});
			elem.addEventListener('card-remove', function (event) {
				self.removeCard(event);
			});
		}

		/**
		 * @description	Shows the save button and makes editing possible.
		 * @private
		 * @param			{Object} event
		 */
		activateEditMode (event) {
			// config
			Brow.isEditMode = true;
			Brow.activeCard = this;
			this.isEditMode = true;
			this.wrapper.edit();

			// visual
			this.config.elem.classList.add('editmode');
			Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.add('show');
		}

		/**
		 * @description	Shows the edit button and saves the content to localStorage.
		 * @private
		 * @param			{Object} event
		 */
		saveCardChanges (event) {
			// config
			Brow.isEditMode = false;
			Brow.activeCard = null;
			this.isEditMode = false;
			this.wrapper.save();
			Brow.Settings.checkCustom();

			// visual
			this.config.elem.classList.remove('editmode');
			Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
		}

		/**
		 * @description	Removes a card from localStorage.
		 * @private
		 * @param			{Object} event
		 */
		removeCard (event) {
			let curCardGUI = this.config.elem.getAttribute('data-module-guid');
			let self = this;

			this.config.elem.classList.add('deletemode');
			this.config.elem.addEventListener('transitionend', function (event) {
				// Only listen to the last transition.
				if (event.propertyName === 'transform') {
					Brow.isEditMode = false;
					this.isEditMode = false;
					localStorage.removeItem(curCardGUI);
					Brow.Settings.getElem()['CONTENT'].removeChild( self.config.elem );
					Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
				}
			});
		}
	}

	return BrowCard;
})();
/**
 * @name				TextCard
 * @description	/
 */
TextCard = (function () {
	'use strict';

	class TextCard {
		constructor (card) {
			this.parent		= card;
			this.elem		= document.createElement('text-card');
			this.headline	= this.createHeadline();
			this.content	= this.previewContent();

			this.elem.appendChild( this.headline );
			this.elem.appendChild( this.content );
		}

		/**
		 * @description	Sets the preview content
		 * @public
		 * @return 			{HTMLElement}
		 */
		previewContent () {
			let textElem			= document.createElement('p');
			let defaultContent	= Brow.Data.Content('text')['default'];
			let storedContent		= this.parent.content.text;
			
			if (storedContent) {
				textElem.innerHTML = storedContent;
			}

			textElem.setAttribute('data-text-preview', defaultContent);
			return textElem;
		}

		/**
		 * @description	Creates the heading
		 * @private
		 * @return 			{HTMLElement}
		 */	
		createHeadline () {
			let headElem = document.createElement('h1');
			let cardHasTitle = this.parent.content.headline;
			headElem.innerHTML = (cardHasTitle) ? cardHasTitle : Brow.Data.Header('text');
			return headElem;
		}

		/**
		 * @description	Returns the entire module <text-card> element.
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
			this.parent.storage['content'] = {
				text: this.content.innerHTML,
				headline: this.headline.innerHTML
			};
			localStorage[this.parent.guid] = JSON.stringify(this.parent.storage);
		}

		/**
		 * @description	Sets 'contenteditable="true"' to all elements.
		 * @public
		 */	
		edit () {
			this.content.setAttribute('contenteditable', true);
			this.headline.setAttribute('contenteditable', true);
		}

		/**
		 * @description	Removes attributes, updates Object and saves it to localStorage.
		 * @public
		 */	
		save () {
			this.content.removeAttribute('contenteditable');
			this.headline.removeAttribute('contenteditable');
			this.parent.content.headline = this.headline.innerHTML;
			this.updateStorage();
		}
	}

	return TextCard;
})();
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
			this.conditions = ['thunderstorm', 'drizzle', 'rain', 'snow', 'atmosphere', 'clouds', 'extreme', 'additional', 'clear'];

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
(function (window) {
	'use strict';

	const TIMER		= new BrowTimer( document.querySelector('.trigger-timer') );
	const BROW		= Brow.Settings;
	const SETTINGS	= BROW.useElements({
		onClickDialog : document.querySelectorAll('.open-dialog'),
		onClickNewCard : document.querySelectorAll('.trigger-newcard'),
		onClickSelectionList : document.querySelector('.trigger-selection'),
		SELECTION : document.querySelector('.trigger-cardlist'),
		CONTENT : document.querySelector('.trigger-content'),
		CONTENT_OVERLAY : document.querySelector('.content__overlay'),
		DIALOG : document.querySelector('.trigger-dialog'),
		DIALOG_OVERLAY: document.querySelector('#brow__overlay')
	});

	TIMER.run();
	BROW.setTheme('blue-a400');
	BROW.start();

})(window);