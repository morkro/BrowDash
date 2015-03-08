var Brow = window.Brow = {};

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
				.toString(16)
				.substring(1);
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
		'basic': 'Storage all the things!',
		'todo': 'Task list',
		'weather': 'Weather'
	};
	const _cardDefaultContents = {
		'basic': {
			'default': 'What do you want to save?'
		}
	};

	/**
	 * @name				Brow.Data.Header
	 * @description	Returns the default title of each module
	 * @public
	 * @param			{String} type
	 */
	const _getDefaultHeader = function (type) {
		if (typeof type !== 'string') return;
		return _cardDefaultTitles[type];
	};

	/**
	 * @name				Brow.Data.Content
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
 * @name				Brow.Settings
 * @description	Shows/hides the modal, saves and parses the users personal theming settings.
 * @param			{Object} Brow
 * @return			{Function} Open
 * @return			{Function} Initial
 */
Brow.Settings = (function (Brow) {
	'use strict';

	/* Constants */
	const OVERLAY	= document.querySelector('#brow__overlay');
	const DIALOG	= document.querySelector('#brow__dialog');
	const SIDEBAR	= document.querySelector('.dialog__sidebar__list');
	const THEME		= document.querySelector('.settings__theme');

	/* Variables */
	var settingsBtn	= null;
	var themeList		= null;

	/**
	 *	@description	Opens the settings dialog
	 * @private
	 * @param			{Object} event
	 */
	const _showSettings = function (event) {
		event.preventDefault();
		OVERLAY.classList.add('show');
		DIALOG.classList.add('show');
	};

	/**
	 *	@description	Closes the settings dialog
	 * @private
	 * @param			{Object} event
	 */
	const _closeSettings = function (event) {
		let _curTarget			= event.target;
		let _isCloseBtn		= _curTarget.classList.contains('dialog__close');
		let _isOutsideDialog	= _curTarget === this && this.classList.contains('show');

		if (_isCloseBtn || _isOutsideDialog) {
			this.classList.remove('show');
			OVERLAY.classList.remove('show');
		}
	};

	/**
	 * @description	Checks if custom theme settings are available.
	 * @private
	 * @return			{Object}
	 */
	const _isCustomTheme = function () {
		let CUSTOM = localStorage['BROW_THEME'];
		return CUSTOM;
	};

	/**
	 * @description	Checks if theme object is in localStorage and adds classes to DOM.
	 * @private
	 * @param			{Object} settings
	 */
	const _updateAndValidateTheme = function (settings) {
		themeList = THEME.querySelectorAll('[data-settings-theme]');

		if (_isCustomTheme()) {
			_updateThemeFromStorage( _isCustomTheme() );
		} else {
			_updateThemeFromInitial( settings.theme );
		}
	};

	/**
	 * @description	Parses the custom settings from localStorage and sets classes.
	 * @private
	 * @param			{String} storage
	 */
	const _updateThemeFromStorage = function (storage) {
		storage = JSON.parse(localStorage['BROW_THEME']);
		document.body.className = '';
		document.body.classList.add('theme-'+ storage.theme);

		[].forEach.call(themeList, function (item) {
			if (item.classList.contains('active')) {
				item.classList.remove('active');
			}
		});
		THEME.querySelector('[data-settings-theme="'+ storage.theme +'"]').classList.add('active');
	};

	/**
	 * @description	Adds the theme class to <body> from initial settings.
	 * @private
	 * @param			{String} settings
	 */
	const _updateThemeFromInitial = function (settings) {
		document.body.classList.add('theme-'+ settings);
		THEME.querySelector('[data-settings-theme="'+ settings +'"]').classList.add('active');
	};

	/**
	 * @description	Gets the color attribute of the clicked element and updates the theme.
	 * @private
	 * @param			{Object} event
	 */
	const _chooseTheme = function (event) {
		event.preventDefault();
		let _themeColor = { theme: event.target.getAttribute('data-settings-theme') };
		localStorage['BROW_THEME'] = JSON.stringify(_themeColor);
		_updateAndValidateTheme(_themeColor);
	};

	/**
	 * @description	/
	 * @private
	 * @param			{Object} settings
	 */
	const _updateSettingsContent = function (event) {
		let _sidebarElem		= event.target;
		let _contentName		= _sidebarElem.getAttribute('href').split('-')[1];
		let _contentElem		= DIALOG.querySelector('.dialog__content__' + _contentName);
		let _curActiveElems	= DIALOG.querySelectorAll('.active');

		// if link is clicked
		if (_sidebarElem.classList.contains('sidebar__list__item')) {
			event.preventDefault();
			if (!_contentElem.classList.contains('active')) {
				[].forEach.call(_curActiveElems, function(elem) {
					elem.classList.remove('active');
				});
				_contentElem.classList.add('active');
				_sidebarElem.classList.add('active');
			}
		}
	};

	/**
	 * @name				Brow.Settings.Initial
	 *	@description	Updates the current theme.
	 * @public
	 * @param			{Object} settings
	 */
	const _initSettings = function (settings) {
		SIDEBAR.querySelector('.active');
		_updateAndValidateTheme(settings);
	};

	/**
	 * @name				Brow.Settings.Open
	 *	@description	Adds events
	 * @public
	 * @param			{HTMLElement} elem
	 */
	const _addEvents = function (elem) {
		settingsBtn = elem;
		settingsBtn.addEventListener('click', _showSettings);
		DIALOG.addEventListener('click', _closeSettings);
		SIDEBAR.addEventListener('click', _updateSettingsContent);
		THEME.addEventListener('click', _chooseTheme);
	};

	/* Public API */
	return {
		Open: _addEvents,
		Initial: _initSettings
	};
})(Brow);
/**
 * @name				Brow.DateTimer
 * @description	Creates a time string and refreshes it every second.
 * @param			{Object} Brow
 * @return			{Function} Append
 */
Brow.DateTimer = (function (Brow) {
	'use strict';

	/**
	 * @description	Creates a string with current time in HH:MM:SS
	 * @private
	 * @return			{String}
	 */
	const _getTime = function () {
		let _date			= new Date();
		let _dateHours		= (_date.getHours() < 10) ? '0' + _date.getHours() : _date.getHours();
		let _dateMinutes	= (_date.getMinutes() < 10) ? '0' + _date.getMinutes() : _date.getMinutes();
		let _dateSeconds	= (_date.getSeconds() < 10) ? '0' + _date.getSeconds() : _date.getSeconds();

		return _dateHours +':'+ _dateMinutes +':'+ _dateSeconds;
	};

	/**
	 * @name				Brow.DateTimer.Append
	 * @description	Sets the element in which the time should be displayed.
	 * @public
	 * @param			{Element} elem
	 */
	const _setElem = function (elem) {
		elem.textContent = _getTime();
		setInterval(function () {
			elem.textContent = _getTime();
		}, 1000);
	};

	/* Public API */
	return {
		Append: _setElem
	};
})(Brow);
Brow.Module = (function (Brow) {
	'use strict';

	/* Constnats */
	const AVAILABLE_MODULES = [
		'basic', 'weather'
	];

	/* Variables */

	/**
	 * Creates a basic module containing a <p> tag.
	 * @return {HTMLElement}
	 */
	const _returnBasicModule = function () {
		let _cParagraphElem	= document.createElement('p');
		let defaultContent	= Brow.Data.Content('basic')['default'];
		_cParagraphElem.setAttribute('data-basic-preview', defaultContent);
		return _cParagraphElem;
	};

	const _validateModuleEditMode = function (moduleType) {
		console.log(moduleType);
	};

	/* Public API */
	return {
		Basic: _returnBasicModule,
		Edit: _validateModuleEditMode
	};
})(Brow);
/**
 * @name				Brow.Cards
 * @description	Is responsible for general card management like creating new cards,
 *                applying events, deleting/editing and saving them, saving/parsing content.
 * @param			{Object} Brow
 * @return			{Function} Initialise
 * @return			{Function} Options
 * @return			{Function} Create
 */
Brow.Cards = (function (Brow) {
	'use strict';

	/* Constants */
	const MAIN		= document.querySelector('#brow__content');
	const OVERLAY	= MAIN.querySelector('.content__overlay');

	/* Variables */
	var browCustom			= false;
	var browCardCount		= 0;

	var browCardElem		= null;
	var browCardSettings	= null;
	var browCardEdit		= null;
	var browCardSave		= null;
	var browCardRemove	= null;
	var browCustomKey		= null;
	
	var appContent			= null; 
	var createButton		= null;
	var isEditMode			= false;

	/**
	 * @name				Brow.Cards.Options
	 * @description	Sets all elements to variables.
	 * @public
	 * @param			{Object} options
	 */
	const _setOptions = function (options) {
		appContent = options.appendCards;
		createButton = options.createCards;

		/* Add events */
		createButton.addEventListener('click', _addNewCard);
		//MAIN.addEventListener('keyup', _saveCardsToStorage);
		document.documentElement.addEventListener('click', _closeCardSettings);

		return this;
	};

	/**
	 * @name				Brow.Cards.Init
	 * @description	Checks localStorage and loads the users cards
	 * @public
	 * @param			{Object} storage
	 */
	const _initialiseCards = function (storage) {
		browCustomKey = storage;
		if (!localStorage[browCustomKey]) {
			_createCard({ type: 'basic' });
		} else {
			_parseCardsFromStorage();
		}
	};

	/**
	 * Removes style attribute on settings container
	 * @private
	 * @param  {Object} event
	 */
	const _closeCardSettings = function (event) {
		let settingsAreVisible	= null;
		let targetIsNotBtn		= null;

		if (browCardSettings) {
			settingsAreVisible	= browCardSettings.style.display === 'block';
			targetIsNotBtn			= event.target !== browCardElem;
			if (targetIsNotBtn && settingsAreVisible) {
				browCardSettings.style.display = null;
			}
		}
	};

	/**
	 * Removes all previous stored card settings
	 * @private
	 */
	const _removePrevCardSettings = function () {
		if (browCardElem !== null) {
			browCardElem		= null;
			browCardSettings.style.display = null;
			browCardSettings	= null;
			browCardEdit		= null;
			browCardSave		= null;
			browCardRemove		= null;
		}
	};

	/**
	 * Sets eventListener on current card element.
	 * @param {Object} event
	 */
	const _setCardEvents = function (event) {
		// If previous settings aren't closed yet.
		_removePrevCardSettings();

		browCardSettings	= event.target.settings;
		browCardEdit		= event.target.edit;
		browCardSave		= event.target.save;
		browCardRemove		= event.target.remove;
		browCardElem		= event.target;

		browCardEdit.addEventListener('click', _activateCardEditMode);
		browCardSave.addEventListener('click', _saveCardChanges);
		browCardRemove.addEventListener('click', _removeCard);
		browCardSettings.style.display = 'block';
	};

	/**
	 * Shows the save button and makes editing possible.
	 * @param  {Object} event
	 */
	const _activateCardEditMode = function (event) {
		let _curCardType = browCardElem.getAttribute('data-module-type');

		isEditMode = true;
		browCardElem.classList.add('editmode');
		OVERLAY.classList.add('show');
		browCardEdit.parentNode.classList.add('hidden');
		browCardSave.parentNode.classList.remove('hidden');
		browCardSettings.style.display = null;
		createButton.classList.add('editmode');

		Brow.Module.Edit( _curCardType );
	};

	/**
	 * Shows the edit button and saves the content to localStorage.
	 * @param  {Object} event
	 */
	const _saveCardChanges = function (event) {
		isEditMode = false;
		browCardElem.classList.remove('editmode');
		OVERLAY.classList.remove('show');
		browCardEdit.parentNode.classList.remove('hidden');
		browCardSave.parentNode.classList.add('hidden');
		browCardSettings.style.display = null;
		createButton.classList.remove('editmode');
	};

	/**
	 * Removes a card from localStorage.
	 * @param  {Object} event
	 */
	const _removeCard = function (event) {
		event.preventDefault();
		let _curCardGUI = browCardElem.getAttribute('data-module-guid');
		let _isCreateBtnInEditMode = createButton.classList.contains('editmode');
		// Remove item
		if (_isCreateBtnInEditMode || isEditMode) {
			createButton.classList.remove('editmode');
		}
		isEditMode = false;
		OVERLAY.classList.remove('show');
		localStorage.removeItem(_curCardGUI);
		MAIN.removeChild(browCardElem);
	};

	/**
	 * @description	Gets localStorage list, parses and creates cards.
	 * @private
	 */
	const _parseCardsFromStorage = function () {
		let storageItem = null;
		let loopStorage = function loopStorage (index) {
			storageItem = JSON.parse( localStorage.getItem( localStorage.key(index) ) );
			if (storageItem['module']) {
				_createCard({
					type: storageItem['type'],
					title: storageItem['title'],
					guid: storageItem['guid'],
					content: storageItem['content']
				});
			}	
		};

		for (let i = localStorage.length; i--;) {
			loopStorage(i);
		}
	};

	/**
	 * @description	Creates a JSON objet of the card elements content
	 *						and saves in localStorage.
	 * @private
	 * @param			{Event} event
	 */
	const _saveCardsToStorage = function (event) {
		let _module = event.target.parentElement;
		let _moduleGUID = _module.getAttribute('data-module-guid');
		let _moduleType = _module.getAttribute('data-module-type');
		let _moduleSettings = {
			module: true,
			guid: _moduleGUID,
			type: _moduleType,
			title: event.target.textContent,
			content: null
		};

		// Set custom dependency to localStorage
		_setCustomBool();
		if (_module.nodeName === 'CARD-BASE') {
			localStorage[_moduleGUID] = JSON.stringify(_moduleSettings);
		}
	};

	/**
	 * @description	Gives variables a boolean :)
	 * @private
	 */
	const _setCustomBool = function () {
		if (!browCustom) {
			browCustom = true;
			localStorage[browCustomKey] = true;
		}
	};

	/**
	 * @name				Brow.Cards.Create
	 * @description	Creates a new card module
	 * @public
	 * @param			{Object} config
	 */
	const _createCard = function (config) {
		let _cardType	= (config.type) ? config.type : 'basic';
		let _cardTitle	= (config.title) ? config.title : Brow.Data.Header(config.type);
		let _cardCount	= (config.count) ? config.count : 1;
		let _cardGUID	= (config.guid) ? config.guid : Brow.GUID();
		let _cardWrapper = null;

		for (let i = _cardCount; i--;) {
			// Create basic element
			_cardWrapper = document.createElement('card-base');
			_cardWrapper.setAttribute('data-module-guid', _cardGUID);
			_cardWrapper.setAttribute('data-module-type', _cardType);
			// Apply header
			_cardWrapper.appendChild( _createCardHeadline( _cardTitle ) );
			// Apply card content
			_cardWrapper.appendChild( _createCardContent( _cardType ) );
			// Apply to page
			appContent.appendChild(_cardWrapper);
			// Apply event listener
			_cardWrapper.addEventListener('btn-settings', _setCardEvents);
		}
	};

	/**
	 * @description	Creates the heading for new cards
	 * @private
	 * @param			{String} title
	 */	
	const _createCardHeadline = function (title) {
		let _cHeadElem = document.createElement('h1');
		if (typeof title !== 'string') title.toString();
		_cHeadElem.textContent = title;
		return _cHeadElem;
	};

	const _createCardContent = function (type) {
		let container = document.createElement('div');
		container.classList.add('content__' + type);

		switch (type) {
			case 'basic':
				container.appendChild( Brow.Module.Basic() );
				break;
			default:
				container.appendChild( Brow.Module.Basic() );
				break;
		}

		return container;
	};

	/**
	 * @description	On click button, adds a card element
	 * @private
	 */
	const _addNewCard = function (event) {
		event.preventDefault();	
		if (!isEditMode) {
			_createCard({
				type: 'basic'
			});
			createButton.removeEventListener('click', _addNewCard, true);
		}
	};

	/* Public API */
	return {
		Initialise: _initialiseCards,
		Options: _setOptions,
		Create: _createCard
	};
})(Brow);
(function (window, undefined) {
	'use strict';

	/* Constants */
	const TIMER					= document.querySelector('.trigger-timer');
	const CONTENT				= document.querySelector('.trigger-content');
	const ADD_BUTTON			= document.querySelector('.trigger-cards');
	const SETTINGS_BUTTON	= document.querySelector('.trigger-settings');

	/* Timer in header */
	Brow.DateTimer.Append(TIMER);

	/* Sets default theme and binds element to show the settings dialog */
	Brow.Settings.Initial({ theme: 'blue-a400' });
	Brow.Settings.Open(SETTINGS_BUTTON);

	/* 
	 * Gets several options to display the cards & sets the
	 * string as a condition to initialse the app.
	 */
	Brow.Cards.Options({
		appendCards: CONTENT,
		createCards: ADD_BUTTON
	}).Initialise('BROW_CUSTOM');

})(window, undefined);