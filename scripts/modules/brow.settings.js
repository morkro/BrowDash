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
		var _curTarget			= event.target;
		var _isCloseBtn		= _curTarget.classList.contains('dialog__close');
		var _isOutsideDialog	= _curTarget === this && this.classList.contains('show');

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
		var CUSTOM = localStorage['BROW_THEME'];
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
		var _themeColor = { theme: event.target.getAttribute('data-settings-theme') };
		localStorage['BROW_THEME'] = JSON.stringify(_themeColor);
		_updateAndValidateTheme(_themeColor);
	};

	/**
	 * @description	/
	 * @private
	 * @param			{Object} settings
	 */
	const _updateSettingsContent = function (event) {
		var _sidebarElem		= event.target;
		var _contentName		= _sidebarElem.getAttribute('href').split('-')[1];
		var _contentElem		= DIALOG.querySelector('.dialog__content__' + _contentName);
		var _curActiveElems	= DIALOG.querySelectorAll('.active');

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