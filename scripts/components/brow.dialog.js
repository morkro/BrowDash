/**
 * @name				BrowDialog
 * @description	Shows/hides the dialog.
 * @param			{Object} Brow
 */
BrowDialog = (function (Brow) {
	'use strict';

	class BrowDialog {
		constructor (config) {
			this.elem				= config.elem;
			this.path				= config.content;
			this.dialogOverlay	= Brow.Settings.getElem()['DIALOG_OVERLAY'];
			this.dialogElem		= Brow.Settings.getElem()['DIALOG'];
			this.dialogContainer	= this.dialogElem.querySelector('.dialog__inner');
			this.dialogSidebar	= this.dialogElem.querySelector('.dialog__sidebar__list');
			this.dialogTheme		= this.dialogElem.querySelector('.settings__theme');
			
			this.addEvents();
		}

		/**
		 *	@description	Loads the content
		 * @private
		 * @param			{Object} event
		 */
		showContent (event) {
			event.preventDefault();
			let _self = this;

			fetch(this.path)
			.then(function (response) {
				return response.text();
			})
			.then(function (body) {
				_self.dialogContainer.innerHTML = body;
			});

			this.dialogElem.classList.add('show');
			this.dialogOverlay.classList.add('show');
		}

		/**
		 *	@description	Closes the dialog
		 * @private
		 * @param			{Object} event
		 */
		closeDialog (event) {
			let _curTarget			= event.target;
			let _curKeyCode		= event.keyCode;
			let _dialogIsShown	= this.dialogElem.classList.contains('show');
			let _isCloseBtn		= _curTarget.classList.contains('dialog__close');
			let _isOutsideDialog	= _curTarget === this.dialogElem && _dialogIsShown;
			let _isESCKey			= _curKeyCode === 27;

			if (_isCloseBtn || _isOutsideDialog || _isESCKey && _dialogIsShown) {
				this.dialogContainer.innerHTML = null;
				this.dialogElem.classList.remove('show');
				this.dialogOverlay.classList.remove('show');
			}
		}

		/**
		 * @description	Gets the color attribute of the clicked element and updates the theme.
		 * @private
		 * @param			{Object} event
		 */
		chooseTheme (event) {
			event.preventDefault();

			if (event.target.hasAttribute('data-settings-theme')) {
				let _themeColor = { theme: event.target.getAttribute('data-settings-theme') };
				localStorage[Brow.Settings.BROW_KEY] = JSON.stringify(_themeColor);
				Brow.Settings.setTheme(_themeColor);
			}
		}

		/**
		 * @name				Brow.Dialog.start
		 *	@description	Adds events
		 * @private
		 */
		addEvents () {
			this.elem.addEventListener('click', this.showContent.bind(this) );
			this.dialogElem.addEventListener('click', this.closeDialog.bind(this) );
			window.addEventListener('keydown', this.closeDialog.bind(this) );
		}
	}

	return BrowDialog;
})(Brow);