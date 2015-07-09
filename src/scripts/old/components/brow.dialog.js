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
			this.button				= this.elem.children[0];
			this.initButtonIcon	= this.button.getAttribute('icon');
			this.path				= config.content;
			this.callback			= config.callback;
			this.dialogElem		= Brow.Settings.getElem()['DIALOG'];
			this.dialogContainer	= this.dialogElem.querySelector('.dialog__inner');
			this.dialogContent	= null;
			this.isActive			= false;
			
			this.addEvents();
		}

		/**
		 *	@description	Loads the content
		 * @private
		 * @param			{Object} event
		 */
		loadContent (event) {
			let self = this;
			event.preventDefault();

			fetch(this.path)
			.then(function (response) {
				return response.text();
			})
			.then(function (body) {
				self.dialogContainer.innerHTML = body;
				self.dialogContent = self.dialogContainer.querySelector('.dialog__content');
				self.button.setAttribute('icon', 'close');
				self.button.setAttribute('color', 'white');
				document.body.classList.add('dialog-is-visible');
				self.isActive = true;

				if (self.callback) self.callback(self);
			});
		}


		/**
		 *	@description	Closes the dialog
		 * @private
		 * @param			{Object} event
		 */
		closeDialog (event) {
			let bodyHasClass		= document.body.classList.contains('dialog-is-visible');
			let isCloseBtn			= event.target === this.elem;
			let isESCKey			= event.keyCode === 27;

			if (this.isActive && bodyHasClass && isCloseBtn || isESCKey) {
				// Clear DOM
				this.dialogContainer.innerHTML = null;
				// Reset button
				this.button.setAttribute('icon', this.initButtonIcon);
				this.button.removeAttribute('color');
				// Remove class
				document.body.classList.remove('dialog-is-visible');
			}
		}

		/**
		 *	@description	Validates if dialog is visible or not, closes/loads it.
		 * @private
		 * @param			{Object} event
		 */
		loadOrCloseContent (event) {
			let dialogIsOpen = document.body.classList.contains('dialog-is-visible');

			if (dialogIsOpen) {
				this.closeDialog(event);
			}
			else {
				this.loadContent(event);
			}
		}

		/**
		 *	@description	Adds events
		 * @private
		 */
		addEvents () {
			this.elem.addEventListener('click', this.loadOrCloseContent.bind(this) );
			window.addEventListener('keydown', this.closeDialog.bind(this));
		}
	}

	return BrowDialog;
})(Brow);