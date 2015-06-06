/**
 * @name				Brow.Settings
 * @description	Stores all necessary HTMLElements, sets the theme and 
 *              	runs all other modules.	Also contains the DOM handling for the
 *              	dialog modules. Which isn't nice. Need to find a better pattern here.
 * @param			{Object} Brow
 * @return			{Function} setTheme
 * @return			{Function} useElements
 * @return			{Function} getElem
 * @return			{Function} start
 */
Brow.Settings = (function (Brow) {
	'use strict';

	/* Constants */
	const BROW_KEY				= 'BROW_THEME';
	const BROW_CARDS			= 'BROW_CARDS';
	const BROW_SETTINGS		= 'BROW_SETTINGS';
	const DEFAULT_THEME		= 'blue-a400';

	/* Variables */
	var isSelectionState	= false;
	var browGrid			= null;
	var browTimer			= null;
	var browElements		= {
		onClickDialog : null,
		onClickNewCard : null,
		onClickSelectionList : null,
		SELECTION : null,
		CONTENT : null,
		CONTENT_OVERLAY : null,
		DIALOG : null,
		TIMER : null
	};

	/**
	 * @description	Adds event listener.
	 * @private
	 */
	const _addEvents = function () {
		// Elements
		[].forEach.call(browElements.onClickNewCard, function (item) {
			item.addEventListener('click', _addNewCard);
		});
	};

	/**
	 * @description	Checks if custom theme settings are available.
	 * @private
	 * @return			{Boolean}
	 */
	const _isCustomTheme = function () {
		let isCustom = false;

		if (localStorage[BROW_SETTINGS]) {
			let settings = JSON.parse(localStorage[BROW_SETTINGS]);
			isCustom = !!settings['theme'];
		}

		return isCustom;
	};

	/**
	 * @description	Parses the custom settings from localStorage and sets classes.
	 * @private
	 */
	const _updateThemeFromStorage = function () {
		let settings = JSON.parse(localStorage[BROW_SETTINGS]);
		let dialogIsOpen = document.body.classList.contains('dialog-is-visible');

		_checkForThemeClass();
		document.body.classList.add(`theme-${settings.theme.color}`);

		if (_isCustomTheme() && settings.theme.headerbar) {
			document.body.classList.add('theme-headerbar');
		}
	};

	/**
	 * @description	Adds the theme class to <body> from initial settings.
	 * @private
	 * @param			{String} theme
	 */
	const _updateThemeFromConfig = function (theme) {
		document.body.classList.add(`theme-${theme}`);
	};

	const _checkForThemeClass = function () {
		let themeRegEx = /theme-.*/;
		for (let i = document.body.classList.length; i--;) {
			if (themeRegEx.test(document.body.classList[i])) {
				document.body.classList.remove( document.body.classList[i] );
			}
		}
	};

	/**
	 * @description	Calls the LayoutManager class.
	 * @private
	 */
	const _initLayoutManager = function () {
		browGrid = new BrowLayoutManager( browElements['CONTENT'] );
		browGrid.layout();
	};

	/**
	 * @description	Checks localStorage and loads the users cards
	 * @private
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
				content: storageItem['content'],
				style: storageItem['style']
			});
			browElements['CONTENT'].appendChild( browCard );
		}
	};

	/**
	 * @description	Checks if custom key is set, if not: do it.
	 * @private
	 */
	const _checkIfCustomBrowCards = function () {
		if (!localStorage[BROW_CARDS]) {
			localStorage[BROW_CARDS] = true;
		}
	};

	/**
	 * @description	Checks clicked card type and appends it to the DOM.
	 * @private
	 * @param			{Object} event
	 */
	const _addNewCard = function (event) {
		event.preventDefault();

		let selectedCard	= this.getAttribute('data-create-card');
		let browCard		= new BrowCard({ type: `${selectedCard}` });

		browElements['CONTENT'].appendChild( browCard );
		browGrid.add( browCard );
	};

	/**
	 *	@description	Validates the users timer settings.
	 * @private
	 */
	const _validateBrowTimer = function ()  {
		browTimer = new BrowTimer( browElements['TIMER'] );
		let dateSettings = { dateFormat : null, abbreviations : false };

		if (!localStorage[BROW_SETTINGS]) {
			dateSettings['dateFormat'] = '24h';
			browTimer.setDateFormat({
				'format': dateSettings.dateFormat
			});
			localStorage.setItem(BROW_SETTINGS, JSON.stringify(dateSettings));
		}
		else {
			dateSettings = JSON.parse(localStorage[BROW_SETTINGS]);
			browTimer.setDateFormat({
				'format': dateSettings.dateFormat, 
				'abbreviations': dateSettings.abbreviations
			});
		}

		browTimer.run();
	};

	/**
	 * @description	Adds callback to content in dialog and validates <input> fields.
	 * @private
	 */
	const _dialogSettingsCallback = function () {
		let timeContent		= this.dialogContent.querySelector('.content__time');
		let themeContent		= this.dialogContent.querySelector('.content__theme');
		let formatCheckbox	= this.dialogContent.querySelector('#settings--dateformat');
		let abbrCheckbox		= this.dialogContent.querySelector('#settings--ampm');
		let themeCheckbox		= this.dialogContent.querySelector('#settings--coloredhead');
		let browSettings		= JSON.parse(localStorage[BROW_SETTINGS]);

		// Validate date settings and update DOM
		if (browSettings['dateFormat'] === '12h') {
			formatCheckbox.checked = false;
		}
		abbrCheckbox.checked = browSettings['abbreviations'];
		abbrCheckbox.disabled = !browSettings['abbreviations'];

		// Validate header bar settings and update DOM
		if (_isCustomTheme()) {
			themeCheckbox.checked = browSettings.theme.headerbar;
		}

		// Add eventListener
		timeContent.addEventListener('click', _updateDateFormat.bind(this));
		themeContent.addEventListener('click', _updateTheme.bind(this));
	};

	/**
	 * @description	Validates input fields, updates browTheme and saves to localStorage.
	 * @private
	 * @param  			{Object} event
	 */
	const _updateTheme = function (event) {
		let colorHeadCheckbox	= this.dialogContent.querySelector('#settings--coloredhead');
		let isThemeButton			= event.target.hasAttribute('data-settings-theme');
		let isThemeCheckbox		= event.target.id === 'settings--coloredhead';
		let settings				= JSON.parse(localStorage[BROW_SETTINGS]);

		// If no theme settings are stored yet.
		if (!settings.theme) {
			settings['theme'] = { color: DEFAULT_THEME, headerbar: false };
		}

		// Is theme option
		if (event.target.hasAttribute('data-settings-theme')) {
			settings.theme.color = event.target.getAttribute('data-settings-theme');
		}

		// If colored header bar is clicked
		if (event.target.id === 'settings--coloredhead') {
			settings.theme.headerbar = colorHeadCheckbox.checked;
		}

		localStorage.setItem(BROW_SETTINGS, JSON.stringify(settings));
		setTheme();
	};

	/**
	 * @description	Validates input fields, updates browTimer and saves to localStorage.
	 * @private
	 * @param  			{Object} event
	 */
	const _updateDateFormat = function (event) {
		let formatCheckbox	= this.dialogContent.querySelector('#settings--dateformat');
		let abbrCheckbox		= this.dialogContent.querySelector('#settings--ampm');
		let timeFormat			= '24h';
		let dateSettings		= JSON.parse(localStorage[BROW_SETTINGS]);

		// If date format checkbox is clicked
		if (event.target.id === 'settings--dateformat') {
			if (!formatCheckbox.checked) {
				timeFormat = '12h';
				abbrCheckbox.disabled = false;	
			}
			else if (formatCheckbox.checked && !abbrCheckbox.disabled) {
				abbrCheckbox.disabled = true;
				abbrCheckbox.checked = false;
			}

			browTimer.setDateFormat({ 'format': timeFormat });
			dateSettings['dateFormat'] = timeFormat;
			dateSettings['abbreviations'] = abbrCheckbox.checked;
		}

		// If abbreviation checkbox is clicked
		if (!event.target.disabled && event.target.id === 'settings--ampm') {
			browTimer.setDateFormat({ 'abbreviations': abbrCheckbox.checked });
			dateSettings['abbreviations'] = abbrCheckbox.checked;
		}

		localStorage.setItem(BROW_SETTINGS, JSON.stringify(dateSettings));
	};

	/**
	 * @description	Adds all dialog.
	 * @private
	 * @todo 			Make more modular.
	 */
	const _initDialogs = function () {
		let currentLocation = window.location.href.slice(0, -1);
		
		[].forEach.call(browElements['onClickDialog'], function (item) {
			let dialogContent		= item.getAttribute('data-dialog');
			let dialogCallback	= false;

			if (dialogContent === 'settings') {
				dialogCallback = _dialogSettingsCallback;
			}

			let browDialog = new BrowDialog({
				elem: item,
				content: `${currentLocation}/markup/dialog-${dialogContent}.html`,
				callback: dialogCallback
			});
		});
	};

	/**
	 * @name				Brow.Settings.useElements
	 *	@description	Assigns app specific elements for further usage.
	 * @private
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
			TIMER : config.TIMER
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
	 *	@description	Updates the current theme.
	 * @public
	 * @param			{Object} theme
	 */
	const setTheme = function (theme) {
		if (!theme || typeof theme !== 'string') {
			theme = DEFAULT_THEME;
		}

		if (_isCustomTheme()) {
			_updateThemeFromStorage();
		} else {
			_updateThemeFromConfig( theme );
		}
	};

	/**
	 * @name				Brow.Settings.start
	 *	@description	Calls all necessary modules which are required to run the app.
	 * @public
	 */
	const initialiseAndStartApp = function () {
		_initDialogs();
		_validateBrowTimer();
		_validateBrowCards();
		_initLayoutManager();
		_addEvents();
		setTheme();
	};
	
	/* Public API */
	return {
		setTheme : setTheme,
		useElements : useElements,
		getElem : getElem,
		start : initialiseAndStartApp,
		checkCustom : _checkIfCustomBrowCards
	};
})(Brow);