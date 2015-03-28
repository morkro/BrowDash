/**
 * @description	Initialise Brow object.
 * @type 			{Object}
 */
var Brow = window.Brow = {};

/**
 * @name				Brow.isEditMode
 * @description	/
 * @public
 */
Brow.isEditMode = false;

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
})(Brow);
/**
 * @name				BrowTimer
 * @description	Class which appends a time string to an element 
 *              	and updates it every second.
 */
BrowTimer = (function() {
	'use strict';

	function BrowTimer (elem) {
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
	BrowTimer.prototype.getTime = function () {
		let _date			= new Date();
		let _dateHours		= (_date.getHours() < 10) ? '0' + _date.getHours() : _date.getHours();
		let _dateMinutes	= (_date.getMinutes() < 10) ? '0' + _date.getMinutes() : _date.getMinutes();
		let _dateSeconds	= (_date.getSeconds() < 10) ? '0' + _date.getSeconds() : _date.getSeconds();

		return _dateHours +':'+ _dateMinutes +':'+ _dateSeconds;
	};

	/**
	 * @name				BrowTimer.run
	 * @description	Sets the element in which the time should be displayed.
	 * @param			{Element} elem
	 * @return 			{HTMLElement}
	 */
	BrowTimer.prototype.run = function () {
		let _this = this;
		
		this.elem.textContent = this.getTime();
		setInterval(function () {
			_this.elem.textContent = _this.getTime();
		}, this.update);

		return this.elem;
	};

	return BrowTimer;
})();

/* ACTIVATE WHEN CHROME 42 IS AVAILABLE */
// class BrowTimer {
// 	constructor (elem) {
// 		if (!(elem && elem.nodeName)) {
// 			throw new Error('You haven\'t passed a valid HTMLElement!');
// 		}

// 		this.elem = elem;
// 		this.update = 1000;
// 	}

// 	/**
// 	 * @name 			BrowTimer.getTime
// 	 * @description	Creates a string with current time in HH:MM:SS
// 	 * @public
// 	 * @return			{String}
// 	 */
// 	getTime() {
// 		const _date			= new Date();
// 		let _dateHours		= (_date.getHours() < 10) ? '0' + _date.getHours() : _date.getHours();
// 		let _dateMinutes	= (_date.getMinutes() < 10) ? '0' + _date.getMinutes() : _date.getMinutes();
// 		let _dateSeconds	= (_date.getSeconds() < 10) ? '0' + _date.getSeconds() : _date.getSeconds();

// 		return _dateHours +':'+ _dateMinutes +':'+ _dateSeconds;
// 	}

// 	/**
// 	 * @name				BrowTimer.run
// 	 * @description	Sets the element in which the time should be displayed.
// 	 * @public
// 	 * @param			{Element} elem
// 	 */
// 	run() {
// 		this.elem.textContent = this.getTime();
// 		setInterval(function () {
// 			this.elem.textContent = this.getTime();
// 		}, this.update);
// 	}
// }
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
		let _isCloseBtn		= _curTarget.classList.contains('dialog__close');
		let _isOutsideDialog	= _curTarget === this && this.classList.contains('show');

		if (_isCloseBtn || _isOutsideDialog) {
			this.classList.remove('show');
			dialogOverlay.classList.remove('show');
		}
	};

	/**
	 * @description	Gets the color attribute of the clicked element and updates the theme.
	 * @private
	 * @param			{Object} event
	 */
	const _chooseTheme = function (event) {
		event.preventDefault();
		let _themeColor = { theme: event.target.getAttribute('data-settings-theme') };
		localStorage[Brow.Settings.BROW_KEY] = JSON.stringify(_themeColor);
		Brow.Settings.setTheme(_themeColor);
	};

	/**
	 * @description	/
	 * @private
	 * @param			{Object} settings
	 */
	const _updateSettingsContent = function (event) {
		let _sidebarElem		= event.target;
		let _contentName		= _sidebarElem.getAttribute('href').split('-')[1];
		let _contentElem		= dialogElem.querySelector('.dialog__content__' + _contentName);
		let _curActiveElems	= dialogElem.querySelectorAll('.active');

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
	 * @name				Brow.Dialog.start
	 *	@description	Adds events
	 * @public
	 * @param			{HTMLElement} elem
	 */
	const addEvents = function () {
		settingsBtn		= Brow.Settings.getElem()['onClickSettings'];
		dialogElem		= Brow.Settings.getElem()['DIALOG'];
		dialogOverlay	= Brow.Settings.getElem()['DIALOG_OVERLAY'];
		dialogSidebar	= dialogElem.querySelector('.dialog__sidebar__list');
		dialogTheme		= dialogElem.querySelector('.settings__theme');
		
		settingsBtn.addEventListener('click', _showSettings);
		dialogElem.addEventListener('click', _closeSettings);
		dialogSidebar.addEventListener('click', _updateSettingsContent);
		dialogTheme.addEventListener('click', _chooseTheme);
	};
	
	/* Public API */
	return {
		addEvents: addEvents
	};
})(Brow);
Brow.Module = (function (Brow) {
	'use strict';

	/* Constnats */
	const AVAILABLE_MODULES = [
		'basic', 
		'weather'
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
	const returnBasicModule = function () {
		let _cParagraphElem	= document.createElement('p');
		let _defaultContent	= Brow.Data.Content('basic')['default'];
		_cParagraphElem.setAttribute('data-basic-preview', _defaultContent);
		return _cParagraphElem;
	};

	/**
	 * @description	Validates the given object and calls different editing functions.
	 * @private
	 * @param  {Object} options
	 */
	const validateModuleEditMode = function (options) {
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
	const validateModuleSaving = function (elem) {
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
		Basic: returnBasicModule,
		Edit: validateModuleEditMode,
		Save: validateModuleSaving
	};
})(Brow);
BrowCard = (function () {
	'use strict';

	function BrowCard (config) {
		if (!config) config = {};

		this.type	= (config.type) ? config.type : 'basic';
		this.title	= (config.title) ? config.title : Brow.Data.Header(config.type);
		this.guid	= (config.guid) ? config.guid : Brow.GUID();
		this.config = { settings: null, edit: null, save: null, remove: null, elem: null };
		this.isEditMode = false;

		return this.createCard();
	}

	BrowCard.prototype.createCard = function () {
		let baseElem = document.createElement('card-base');
		let self = this;

		baseElem.setAttribute('data-module-guid', this.guid);
		baseElem.setAttribute('data-module-type', this.type);
		baseElem.appendChild( this.createHeadline( this.title ) );
		baseElem.addEventListener('btn-settings', function (event) {
			self.addEvents(event);
		});

		return baseElem;
	};

	/**
	 * @description	Creates the heading for new cards
	 * @private
	 * @param			{String} title
	 */	
	BrowCard.prototype.createHeadline = function (title) {
		let headElem = document.createElement('h1');
		headElem.textContent = title;
		return headElem;
	};

	/**
	 * @description	Sets eventListener on current card element.
	 * @private
	 * @param			{Object} event
	 */
	BrowCard.prototype.addEvents = function (event) {
		let self = this;

		this.config.elem		= event.target;
		this.config.settings	= event.target.settings;
		this.config.edit		= event.target.edit;
		this.config.save		= event.target.save;
		this.config.remove	= event.target.remove;

		this.config.settings.style.display = 'block';
		this.config.edit.addEventListener('click', function (event) {
			event.preventDefault();
			self.activateCardEditMode(event);
		});
		this.config.save.addEventListener('click', function (event) {
			event.preventDefault();
			self.saveCardChanges(event);
		});
		this.config.remove.addEventListener('click', function (event) {
			event.preventDefault();
			self.removeCard(event);
		});
	};

	/**
	 * @description	Shows the save button and makes editing possible.
	 * @private
	 * @param			{Object} event
	 */
	BrowCard.prototype.activateCardEditMode = function (event) {
		Brow.isEditMode = true;
		this.isEditMode = true;

		this.config.elem.classList.add('editmode');
		this.config.edit.parentNode.classList.add('hidden');
		this.config.save.parentNode.classList.remove('hidden');
		this.config.settings.style.display = null;

		Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.add('show');
	};

	/**
	 * @description	Shows the edit button and saves the content to localStorage.
	 * @private
	 * @param			{Object} event
	 */
	BrowCard.prototype.saveCardChanges = function (event) {
		Brow.isEditMode = false;
		this.isEditMode = false;

		this.config.elem.classList.remove('editmode');
		this.config.edit.parentNode.classList.remove('hidden');
		this.config.save.parentNode.classList.add('hidden');
		this.config.settings.style.display = null;

		Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
	};

	/**
	 * @description	Removes a card from localStorage.
	 * @private
	 * @param			{Object} event
	 */
	BrowCard.prototype.removeCard = function (event) {
		let curCardGUI = this.config.elem.getAttribute('data-module-guid');

		Brow.isEditMode = false;
		this.isEditMode = false;

		localStorage.removeItem(curCardGUI);
		Brow.Settings.getElem()['CONTENT'].removeChild( this.config.elem );
		Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
	};

	return BrowCard;
})();
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
	const BROW_CUSTOM		= 'BROW_CUSTOM';
	const DEFAULT_THEME	= 'blue-a400';

	/* Variables */
	var browElements = {
		onClickSettings : null,
		onClickNewCard : null,
		CONTENT : null,
		CONTENT_OVERLAY : null,
		DIALOG : null,
		DIALOG_OVERLAY : null
	};

	/**
	 * @description	Adds event listener.
	 * @private
	 */
	const _addEvents = function () {
		browElements.onClickNewCard.addEventListener('click', _createNewCard);
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
		if (!localStorage[BROW_CUSTOM]) {
			let defaultCard = new BrowCard({ type: 'basic' });
			browElements['CONTENT'].appendChild( defaultCard );
		} else {
			console.log('lolool found lots of cards!');
			//_parseCardsFromStorage();
		}
	};

	const _createNewCard = function (event) {
		event.preventDefault();
		if (!Brow.isEditMode) {
			let defaultCard = new BrowCard({ type: 'basic' });
			browElements['CONTENT'].appendChild( defaultCard );
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
			onClickSettings : config.onClickSettings,
			onClickNewCard : config.onClickNewCard,
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
		BROW_KEY : BROW_KEY
	};	
})(Brow);
(function (window) {
	'use strict';

	const TIMER		= new BrowTimer( document.querySelector('.trigger-timer') );
	const BROW		= Brow.Settings;
	const SETTINGS	= BROW.useElements({
		onClickSettings : document.querySelector('.trigger-settings'),
		onClickNewCard : document.querySelector('.trigger-newcard'),
		CONTENT : document.querySelector('.trigger-content'),
		CONTENT_OVERLAY : document.querySelector('.content__overlay'),
		DIALOG : document.querySelector('.trigger-dialog'),
		DIALOG_OVERLAY: document.querySelector('#brow__overlay')
	});

	TIMER.run();
	BROW.setTheme('blue-a400');
	BROW.start();

})(window);