/**
 * @name				Dialog
 * @description	Shows/hides the dialog.
 */
class Dialog {
	constructor (config) {
		this.elem = config.elem;
		this.button	= this.elem.children[0];
		this.initButtonIcon = this.button.getAttribute('icon');
		this.path = config.content;
		this.callback = config.callback;
		this.callbackParams = config.params;
		this.dialogElem = config.dialogElem;
		this.dialogContainer	= this.dialogElem.querySelector('.dialog__inner');
		this.dialogContent = null;
		this.isActive = false;
	}

	init () {
		this.addEvents();
	}

	/**
	 *	@description	Loads the content
	 * @param			{Object} event
	 */
	loadContent (event) {
		event.preventDefault();

		fetch(this.path)
		.then(response => response.text())
		.then(body => {
			this.dialogContainer.innerHTML = body;
			this.dialogContent = this.dialogContainer.querySelector('.dialog__content');
			this.button.setAttribute('icon', 'close');
			this.button.setAttribute('color', 'white');
			document.body.classList.add('dialog-is-visible');
			this.isActive = true;

			if (this.callback) { this.callback(this); }
		});
	}


	/**
	 *	@description	Closes the dialog
	 * @param			{Object} event
	*/
	closeDialog (event) {
		let bodyHasClass	= document.body.classList.contains('dialog-is-visible');
		let isCloseBtn		= event.target === this.elem;
		let isESCKey		= event.keyCode === 27;

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
	 * @param			{Object} event
	 */
	loadOrCloseContent (event) {
		let dialogIsOpen = document.body.classList.contains('dialog-is-visible');
		this.elem.blur();

		if (dialogIsOpen) {
			this.closeDialog(event);
		}
		else {
			this.loadContent(event);
		}
	}

	/**
	 *	@description	Adds events
	 */
	addEvents () {
		this.elem.addEventListener('click', this.loadOrCloseContent.bind(this));
		window.addEventListener('keydown', this.closeDialog.bind(this));
	}
}

export default Dialog;