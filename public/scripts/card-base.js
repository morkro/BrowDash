(function() {
	'use strict';
	
	/* Constants */
	var doc			= document.currentScript.ownerDocument;
	var template	= doc.querySelector('#card-base');
	var CardProto	= Object.create(HTMLDivElement.prototype);
	
	CardProto.availableColors = ['red', 'pink', 'blue', 'green', 'brown', 'white'];

	/**
	 * @description An instance of the element is created.
	 */
	CardProto.createdCallback = function () {
		this.root = this.createShadowRoot();
		this.root.appendChild( document.importNode(template.content, true) );
		
		this.host			= this;
		this.settings		= this.root.querySelector('.module__settings');
		this.confPalette	= this.root.querySelector('.settings__palette');
		this.palette		= this.root.querySelector('.module__theme');
		this.edit			= this.root.querySelector('.settings__edit');
		this.save			= this.root.querySelector('.settings__save');
		this.remove			= this.root.querySelector('.settings__remove');
		
		this.addEvents();
		this.validateHost();
	};


	
	/**
	 * @description	Sets eventListener on current card element.
	 * @private
	 */
	CardProto.addEvents = function () {
		this.settings.addEventListener('mouseover', this.enableEvent.bind(this));
		this.confPalette.addEventListener('click', this.togglePalette.bind(this));
		this.palette.addEventListener('click', this.modifyTheme.bind(this));
		this.edit.addEventListener('click', this.editCard.bind(this));
		this.save.addEventListener('click', this.saveCard.bind(this));
		this.remove.addEventListener('click', this.removeCard.bind(this));
	};

	/**
	 * @description	Checks if <card-base> is inside another host.
	 * @private
	 */
	CardProto.validateHost = function () {
		if (!!this.parentNode.host) {
			this.host = this.parentNode.host;
		} else { this.host = this; }
	};

	/**
	 * @description Dispatches 'settings' event.
	 */
	CardProto.enableEvent = function () {
		this.dispatchEvent( new Event('settings') );
	};

	/**
	 * @description Toggles class on host to move the palette list.
	 */
	CardProto.togglePalette = function () {
		this.validateHost();
		if (this.host.classList.contains('edit-theme')) {
			this.host.classList.remove('edit-theme');
		} else {
			this.host.classList.add('edit-theme');
		}
	};

	/**
	 * @description Gets the 'data-theme' value of clicked element and sends an event.
	 */
	CardProto.modifyTheme = function () {
		var theme = null;
		
		if (event.target.hasAttribute('data-theme')) {
			theme = event.target.getAttribute('data-theme');
		}
		
		window.dispatchEvent( 
			new CustomEvent('theme-change', { detail: theme })
		);
	};

	/**
	 * @description Adds 'is-edit' class to host and dispatches 'edit' event.
	 */
	CardProto.editCard = function () {
		this.validateHost();
		this.host.classList.add('fx', 'is-edit');
		this.edit.dispatchEvent( new Event('edit') );
	};

	/**
	 * @description Removes 'is-edit' class to host and dispatches 'save' event.
	 */
	CardProto.saveCard = function () {
		this.validateHost();
		this.host.classList.remove('is-edit', 'edit-theme');
		this.save.dispatchEvent( new Event('save') );

		this.host.addEventListener('transitionend', function (event) {
			this.host.classList.remove('fx');
		}.bind(this));
	};

	/**
	 * @description Adds 'is-delete' class to host and dispatches 'remove' event.
	 */
	CardProto.removeCard = function () {
		this.validateHost();
		this.host.classList.add('fx', 'is-delete');
		this.dispatchEvent( new Event('remove') );
	};
	
	/* Register element in document */
	document.registerElement('card-base', { prototype: CardProto });
})();