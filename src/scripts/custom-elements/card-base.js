(function() {
	'use strict';
	
	/* Constants */
	var doc			= document.currentScript.ownerDocument;
	var template	= doc.querySelector('#card-base');
	var CardProto	= Object.create(HTMLDivElement.prototype);
	
	/**
	 * @description	Returns a Globally Unique Identifer as string
	 * @return			{String}
	 */
	CardProto.GUID = function () {
		var perf = performance.now();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (perf + Math.random() * 16) % 16 | 0;
			perf = Math.floor(perf / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uuid;
	};

	/**
	 * @description	Sets an UUID to host element.
	 */
	CardProto.setGUID = function (guid) {
		let _guid = guid ? guid : this.GUID();
		this.getHost().setAttribute('data-guid', _guid);
	};

	/**
	 * @description	An instance of the element is created.
	 */
	CardProto.createdCallback = function () {
		this.root = this.createShadowRoot();
		this.root.appendChild( document.importNode(template.content, true) );
		
		this.confPalette	= this.root.querySelector('.settings__palette');
		this.palette		= this.root.querySelector('.module__theme');
		this.edit			= this.root.querySelector('.settings__edit');
		this.save			= this.root.querySelector('.settings__save');
		this.remove			= this.root.querySelector('.settings__remove');
		
		this.addEvents();
	};

	/**
	 * @description	Sets eventListener on current card element.
	 */
	CardProto.addEvents = function () {
		this.confPalette.addEventListener('click', this.togglePalette.bind(this));
		this.palette.addEventListener('click', this.modifyTheme.bind(this));
		this.edit.addEventListener('click', this.editCard.bind(this));
		this.save.addEventListener('click', this.saveCard.bind(this));
		this.remove.addEventListener('click', this.removeCard.bind(this));
	};

	/**
	 * @description	Checks if <card-base> is inside another host.
	 */
	CardProto.getHost = function () {
		let _host = this;
		if (!!this.parentNode.host) {
			_host = this.parentNode.host;
		}
		return _host;
	};

	/**
	 * @description Toggles class on host to move the palette list.
	 */
	CardProto.togglePalette = function () {
		let _host = this.getHost();
		if (_host.classList.contains('edit-theme')) {
			_host.classList.remove('edit-theme');
		} else {
			_host.classList.add('edit-theme');
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
		let host = this.getHost();
		let detail = { detail: host.getAttribute('data-guid') };
		let editEvent = new CustomEvent('card-edit', detail);

		host.classList.add('fx', 'is-edit');
		window.dispatchEvent(editEvent);
	};

	/**
	 * @description Removes 'is-edit' class to host and dispatches 'save' event.
	 */
	CardProto.saveCard = function () {
		let host = this.getHost();
		let detail = { detail: host.getAttribute('data-guid') };
		let saveEvent = new CustomEvent('card-save', detail);
		
		host.saveToStorage();
		window.dispatchEvent(saveEvent);

		host.classList.remove('is-edit', 'edit-theme');
		host.addEventListener('transitionend', 
			function () { host.classList.remove('fx'); }
		);
	};

	/**
	 * @description Adds 'is-delete' class to host, dispatches 'card-remove' event
	 *              and removes it from localStorage.
	 */
	CardProto.removeCard = function () {
		let host = this.getHost();
		let detail = { detail: host.getAttribute('data-guid') };
		let removeEvent = new CustomEvent('card-remove', detail);

		host.classList.add('fx', 'is-delete');
		host.addEventListener('transitionend', function (event) {
			if (event.propertyName === 'transform') {
				window.dispatchEvent(removeEvent);
				localStorage.removeItem( detail.detail );
			}
		});
	};
	
	/* Register element in document */
	document.registerElement('card-base', { prototype: CardProto });
})();