(function() {
	'use strict';
	
	var importDoc		= document.currentScript.ownerDocument;
	var cardTemplate	= importDoc.querySelector('#card-base');
	var CardProto		= Object.create(HTMLDivElement.prototype);
	
	CardProto.createdCallback = function () {
		let root = this.createShadowRoot();
		root.appendChild( document.importNode(cardTemplate.content, true) );
		
		this.settings	= root.querySelector('.module__settings');
		this.edit		= root.querySelector('.settings__edit');
		this.save		= root.querySelector('.settings__save');
		this.remove		= root.querySelector('.settings__remove');
		
		this.settings.addEventListener('mouseover', this.enableEvent.bind(this));
		this.edit.addEventListener('click', this.enableEdit.bind(this.edit));
		this.save.addEventListener('click', this.enableSave.bind(this.save));
		this.remove.addEventListener('click', this.enableRemove.bind(this.remove));
	};

	CardProto.enableEvent = function () {
		this.dispatchEvent(new Event('card-settings'));
	};

	CardProto.enableEdit = function () {
		this.dispatchEvent(new Event('card-edit'));
	};

	CardProto.enableSave = function () {
		this.dispatchEvent(new Event('card-save'));
	};

	CardProto.enableRemove = function () {
		this.dispatchEvent(new Event('card-remove'));
	};
	
	document.registerElement('card-base', { prototype: CardProto });
})();