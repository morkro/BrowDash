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
		let dialogContentPath = `${currentLocation}/views/dialog-${dialogContent}.html`;

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