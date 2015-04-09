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
		let _curKeyCode		= event.keyCode;
		let _dialogIsShown	= dialogElem.classList.contains('show');
		let _isCloseBtn		= _curTarget.classList.contains('dialog__close');
		let _isOutsideDialog	= _curTarget === dialogElem && _dialogIsShown;
		let _isESCKey			= _curKeyCode === 27;

		if (_isCloseBtn || _isOutsideDialog || _isESCKey && _dialogIsShown) {
			dialogElem.classList.remove('show');
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

		if (event.target.hasAttribute('data-settings-theme')) {
			let _themeColor = { theme: event.target.getAttribute('data-settings-theme') };
			localStorage[Brow.Settings.BROW_KEY] = JSON.stringify(_themeColor);
			Brow.Settings.setTheme(_themeColor);
		}
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
		window.addEventListener('keydown', _closeSettings);
	};
	
	/* Public API */
	return {
		addEvents: addEvents
	};
})(Brow);