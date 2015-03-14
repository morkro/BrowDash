(function (window) {
	'use strict';

	function BrowDash (options) {
		if (!options) {
			throw new Error('No options passed!');
		}
		
		this.theme		= BrowDash.Settings.Initial( options.theme );
		this.settings	= BrowDash.Settings.Open( options.settings );
		this.timer		= BrowDash.DateTimer.Append( options.timer );
		this.cards		= BrowDash.Cards.Options({
			appendCards: options.content,
			createCards: options.create
		});
		this.init = BrowDash.Cards.Initialise('BROW_CUSTOM');
	}

	window.BrowDash = BrowDash;

})(window);
/**
 * @name				BrowDash.GUID
 * @description	Returns a Globally Unique Identifer as string
 * @public
 * @return			{String}
 */
BrowDash.GUID = (function () {
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
 * @name				BrowDash.Data
 * @description	Stores all module related data like default content.
 * @param			{Object} BrowDash
 * @return			{Function} Header
 * @return			{Function} Content
 */
BrowDash.Data = (function (BrowDash) {
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
})(BrowDash);
/**
 * @name				BrowDash.Settings
 * @description	Shows/hides the modal, saves and parses the users personal theming settings.
 * @param			{Object} BrowDash
 * @return			{Function} Open
 * @return			{Function} Initial
 */
BrowDash.Settings = (function (BrowDash) {
	'use strict';

	/* Constants */
	const OVERLAY	= document.querySelector('#brow__overlay');
	const DIALOG	= document.querySelector('#brow__dialog');
	const SIDEBAR	= document.querySelector('.dialog__sidebar__list');
	const THEME		= document.querySelector('.settings__theme');
	const BROW_KEY = 'BROW_THEME';

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
		let CUSTOM = localStorage[BROW_KEY];
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
		storage = JSON.parse(localStorage[BROW_KEY]);
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
		localStorage[BROW_KEY] = JSON.stringify(_themeColor);
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
	 * @name				BrowDash.Settings.Initial
	 *	@description	Updates the current theme.
	 * @public
	 * @param			{Object} settings
	 */
	const _initSettings = function (settings) {
		SIDEBAR.querySelector('.active');
		_updateAndValidateTheme(settings);
	};

	/**
	 * @name				BrowDash.Settings.Open
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
})(BrowDash);
/**
 * @name				BrowDash.DateTimer
 * @description	Creates a time string and refreshes it every second.
 * @param			{Object} BrowDash
 * @return			{Function} Append
 */
BrowDash.DateTimer = (function (BrowDash) {
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
	 * @name				BrowDash.DateTimer.Append
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
})(BrowDash);
BrowDash.Module = (function (BrowDash) {
	'use strict';

	/* Constnats */
	const AVAILABLE_MODULES = [
		'basic', 'weather'
	];

	/* Variables */
	var curCardType = null;
	var curCardElem = null;
	var curBasicModule = {
		headline: null,
		content: null
	};

	/**
	 * @description	Creates a basic module containing a <p> tag.
	 * @private
	 * @return {HTMLElement}
	 */
	const _returnBasicModule = function () {
		let _cParagraphElem	= document.createElement('p');
		let _defaultContent	= BrowDash.Data.Content('basic')['default'];
		_cParagraphElem.setAttribute('data-basic-preview', _defaultContent);
		return _cParagraphElem;
	};

	/**
	 * @description	Validates the given object and calls different editing functions.
	 * @private
	 * @param  {Object} options
	 */
	const _validateModuleEditMode = function (options) {
		if (!options || typeof options !== 'object') {
			throw new Error('No options passed!');
		}
		curCardType = options.type;
		curCardElem = options.elem;

		if (AVAILABLE_MODULES[curCardType]) {
			switch (curCardType) {
				case 'basic':
					_activateBasicEditMode(curCardElem);
					break;
			}
		} else {
			throw new Error('Module ['+ curCardType + '] isn\'t available!');
		}
	};

	/**
	 * [_validateModuleSaving description]
	 * @param  {[type]} elem [description]
	 * @return {[type]}      [description]
	 */
	const _validateModuleSaving = function (elem) {
		switch (curCardType) {
			case 'basic':
				_saveBasicState();
				break;
		}
	};

	/**
	 * [_saveBasicState description]
	 * @param  {[type]} cardElem [description]
	 * @return {[type]}          [description]
	 */
	const _saveBasicState = function (cardElem) {
		curBasicModule['headline'].removeAttribute('contenteditable');
		curBasicModule['content'].removeAttribute('contenteditable');
		curBasicModule['headline']	= null;
		curBasicModule['content']	= null;
		curCardElem						= null;
	};

	/**
	 * [_activateBasicEditMode description]
	 * @param  {[type]} cardElem [description]
	 * @return {[type]}          [description]
	 */
	const _activateBasicEditMode = function (cardElem) {
		curBasicModule['headline']	= cardElem.querySelector('h1');
		curBasicModule['content']	= cardElem.querySelector('p');
		curBasicModule['headline'].setAttribute('contenteditable', true);
		curBasicModule['content'].setAttribute('contenteditable', true);
	};

	/* Public API */
	return {
		Basic: _returnBasicModule,
		Edit: _validateModuleEditMode,
		Save: _validateModuleSaving
	};
})(BrowDash);
/**
 * @name				BrowDash.Cards
 * @description	Is responsible for general card management like creating new cards,
 *                applying events, deleting/editing and saving them, saving/parsing content.
 * @param			{Object} BrowDash
 * @return			{Function} Initialise
 * @return			{Function} Options
 * @return			{Function} Create
 */
BrowDash.Cards = (function (BrowDash) {
	'use strict';

	/* Constants */
	const MAIN		= document.querySelector('#brow__content');
	const OVERLAY	= MAIN.querySelector('.content__overlay');

	/* Variables */
	var BrowDashCustom			= false;
	var BrowDashCardCount		= 0;
	
	var BrowDashCardElem			= null;
	var BrowDashCardSettings	= null;
	var BrowDashCardEdit			= null;
	var BrowDashCardSave			= null;
	var BrowDashCardRemove		= null;
	var BrowDashCustomKey		= null;
	
	var appContent					= null; 
	var createButton				= null;
	var isEditMode					= false;

	/**
	 * @name				BrowDash.Cards.Options
	 * @description	Sets all elements to variables.
	 * @public
	 * @param			{Object} options
	 */
	const _setOptions = function (options) {
		appContent		= options.appendCards;
		createButton	= options.createCards;

		/* Add events */
		createButton.addEventListener('click', _addNewCard);
		//MAIN.addEventListener('keyup', _saveCardsToStorage);
		document.documentElement.addEventListener('click', _closeCardSettings);
	};

	/**
	 * @name				BrowDash.Cards.Initialise
	 * @description	Checks localStorage and loads the users cards
	 * @public
	 * @param			{Object} storage
	 */
	const _initialiseCards = function (storage) {
		BrowDashCustomKey = storage;
		if (!localStorage[BrowDashCustomKey]) {
			_createCard({ type: 'basic' });
		} else {
			_parseCardsFromStorage();
		}
	};

	/**
	 * @description	Removes style attribute on settings container
	 * @private
	 * @param  {Object} event
	 */
	const _closeCardSettings = function (event) {
		let settingsAreVisible	= null;
		let targetIsNotBtn		= null;

		if (BrowDashCardSettings) {
			settingsAreVisible	= BrowDashCardSettings.style.display === 'block';
			targetIsNotBtn			= event.target !== BrowDashCardElem;
			if (targetIsNotBtn && settingsAreVisible) {
				BrowDashCardSettings.style.display = null;
			}
		}
	};

	/**
	 * @description	Removes all previous stored card settings
	 * @private
	 */
	const _removePrevCardSettings = function () {
		if (BrowDashCardElem !== null) {
			BrowDashCardElem		= null;
			BrowDashCardSettings.style.display = null;
			BrowDashCardSettings	= null;
			BrowDashCardEdit		= null;
			BrowDashCardSave		= null;
			BrowDashCardRemove	= null;
		}
	};

	/**
	 * @description	Sets eventListener on current card element.
	 * @private
	 * @param {Object} event
	 */
	const _setCardEvents = function (event) {
		// If previous settings aren't closed yet.
		_removePrevCardSettings();

		BrowDashCardSettings	= event.target.settings;
		BrowDashCardEdit		= event.target.edit;
		BrowDashCardSave		= event.target.save;
		BrowDashCardRemove	= event.target.remove;
		BrowDashCardElem		= event.target;

		BrowDashCardEdit.addEventListener('click', _activateCardEditMode);
		BrowDashCardSave.addEventListener('click', _saveCardChanges);
		BrowDashCardRemove.addEventListener('click', _removeCard);
		BrowDashCardSettings.style.display = 'block';
	};

	/**
	 * @description	Shows the save button and makes editing possible.
	 * @private
	 * @param  {Object} event
	 */
	const _activateCardEditMode = function (event) {
		let _curCardType = BrowDashCardElem.getAttribute('data-module-type');

		isEditMode = true;
		BrowDashCardElem.classList.add('editmode');
		OVERLAY.classList.add('show');
		BrowDashCardEdit.parentNode.classList.add('hidden');
		BrowDashCardSave.parentNode.classList.remove('hidden');
		BrowDashCardSettings.style.display = null;
		createButton.classList.add('editmode');

		BrowDash.Module.Edit({
			type: _curCardType,
			elem: BrowDashCardElem
		});
	};

	/**
	 * @description	Shows the edit button and saves the content to localStorage.
	 * @private
	 * @param  {Object} event
	 */
	const _saveCardChanges = function (event) {
		isEditMode = false;
		BrowDashCardElem.classList.remove('editmode');
		OVERLAY.classList.remove('show');
		BrowDashCardEdit.parentNode.classList.remove('hidden');
		BrowDashCardSave.parentNode.classList.add('hidden');
		BrowDashCardSettings.style.display = null;
		createButton.classList.remove('editmode');
		BrowDash.Module.Save();
	};

	/**
	 * @description	Removes a card from localStorage.
	 * @private
	 * @param  {Object} event
	 */
	const _removeCard = function (event) {
		event.preventDefault();
		let _curCardGUI = BrowDashCardElem.getAttribute('data-module-guid');
		let _isCreateBtnInEditMode = createButton.classList.contains('editmode');
		// Remove item
		if (_isCreateBtnInEditMode || isEditMode) {
			createButton.classList.remove('editmode');
		}
		isEditMode = false;
		OVERLAY.classList.remove('show');
		localStorage.removeItem(_curCardGUI);
		MAIN.removeChild(BrowDashCardElem);
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
		if (!BrowDashCustom) {
			BrowDashCustom = true;
			localStorage[BrowDashCustomKey] = true;
		}
	};

	/**
	 * @name				BrowDash.Cards.Create
	 * @description	Creates a new card module
	 * @public
	 * @param			{Object} config
	 */
	const _createCard = function (config) {
		let _cardType	= (config.type) ? config.type : 'basic';
		let _cardTitle	= (config.title) ? config.title : BrowDash.Data.Header(config.type);
		let _cardCount	= (config.count) ? config.count : 1;
		let _cardGUID	= (config.guid) ? config.guid : BrowDash.GUID();
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
		//if (typeof title !== 'string' && typeof title !== undefined) title.toString();
		_cHeadElem.textContent = title;
		return _cHeadElem;
	};

	const _createCardContent = function (type) {
		let container = document.createElement('div');
		container.classList.add('content__' + type);

		switch (type) {
			case 'basic':
				container.appendChild( BrowDash.Module.Basic() );
				break;
			default:
				container.appendChild( BrowDash.Module.Basic() );
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
})(BrowDash);
(function (window) {
	'use strict';

	const APP = new BrowDash({
		theme: 'blue-a400',
		timer: document.querySelector('.trigger-timer'),
		settings: document.querySelector('.trigger-settings'),
		create: document.querySelector('.trigger-newcard'),
		content: document.querySelector('.trigger-content')
	});

})(window);