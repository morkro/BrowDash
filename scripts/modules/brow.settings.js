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
	 * @name				BrowDash.Settings.Theme
	 *	@description	Updates the current theme.
	 * @public
	 * @param			{Object} settings
	 */
	const setTheme = function (settings) {
		SIDEBAR.querySelector('.active');
		_updateAndValidateTheme(settings);
		return settings;
	};

	/**
	 * @name				BrowDash.Settings.Open
	 *	@description	Adds events
	 * @public
	 * @param			{HTMLElement} elem
	 */
	const addEvents = function (elem) {
		if (!elem) {
			throw new Error('HTMLElement missing!');
		}
		settingsBtn = elem;
		settingsBtn.addEventListener('click', _showSettings);
		DIALOG.addEventListener('click', _closeSettings);
		SIDEBAR.addEventListener('click', _updateSettingsContent);
		THEME.addEventListener('click', _chooseTheme);
	};

	/* Public API */
	return {
		Open: addEvents,
		Theme: setTheme
	};
})(BrowDash);


BrowSettings = (function () {
	'use strict';

	function BrowSettings (options) {
		if (!options || typeof options !== 'object') {
			options = { 'theme': 'blue-a400', 'onclick': null };
		}

		this.theme = options.theme;

		//this.theme = this.setTheme( options.theme );
	}

	/**
	 * @name				BrowDash.Settings.Theme
	 *	@description	Updates the current theme.
	 * @public
	 * @param			{Object} settings
	 */
	BrowSettings.prototype.addElements = function (config) {
		console.log(config);
		//console.log(this.foo);
		/*SIDEBAR.querySelector('.active');
		_updateAndValidateTheme(settings);
		return settings;*/
	};

	return BrowSettings;
});