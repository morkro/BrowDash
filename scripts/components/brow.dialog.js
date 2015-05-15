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
			this.callback			= config.callback;
			this.dialogOverlay	= Brow.Settings.getElem()['DIALOG_OVERLAY'];
			this.dialogElem		= Brow.Settings.getElem()['DIALOG'];
			this.dialogContainer	= this.dialogElem.querySelector('.dialog__inner');
			this.dialogContent	= null;

			this.addEvents();
		}

		/**
		 *	@description	Loads the content
		 * @private
		 * @param			{Object} event
		 */
		showContent (event) {
			let _self = this;
			event.preventDefault();
			
			fetch(this.path)
			.then(function (response) {
				return response.text();
			})
			.then(function (body) {
				_self.dialogContainer.innerHTML = body;
				_self.dialogContent = _self.dialogContainer.querySelector('.dialog__content');
				if (_self.callback) _self.callback(this);
			});

			this.dialogElem.classList.add('show');
			this.dialogOverlay.classList.add('is-visible');
		}

		/**
		 *	@description	Closes the dialog
		 * @private
		 * @param			{Object} event
		 */
		closeDialog (event) {
			let _self				= this;
			let _curTarget			= event.target;
			let _curKeyCode		= event.keyCode;
			let _dialogIsShown	= this.dialogElem.classList.contains('show');
			let _isCloseBtn		= _curTarget.classList.contains('dialog__close');
			let _isOutsideDialog	= _curTarget === this.dialogElem && _dialogIsShown;
			let _isESCKey			= _curKeyCode === 27;

			if (_isCloseBtn || _isOutsideDialog || _isESCKey && _dialogIsShown) {
				this.dialogContainer.innerHTML = null;
				this.dialogElem.classList.remove('show');
				this.dialogOverlay.classList.add('is-fading');
				setTimeout(function () {
					_self.dialogOverlay.classList.remove('is-visible', 'is-fading');
				}, 100);
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