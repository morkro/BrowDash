(function() {
	'use strict';
	
	var importDoc		= document.currentScript.ownerDocument;
	var cardTemplate	= importDoc.querySelector('#card');
	var CardProto		= Object.create(HTMLDivElement.prototype);
	
	CardProto.createdCallback = function () {
		let root = this.createShadowRoot();
		root.appendChild( document.importNode(cardTemplate.content, true) );
		
		this.settings	= root.querySelector('.module__heading__settings');
		this.edit		= root.querySelector('.heading__settings__edit');
		this.save		= root.querySelector('.heading__settings__save');
		this.remove		= root.querySelector('.heading__settings__remove');
		
		this.settings.addEventListener('mouseover', this.enableEvent.bind(this));
		this.edit.addEventListener('click', this.enableEdit.bind(this.edit));
		this.save.addEventListener('click', this.enableSave.bind(this.save));
		this.remove.addEventListener('click', this.enableRemove.bind(this.remove));
	};

	CardProto.enableEvent = function () {
		this.dispatchEvent(new Event('btn-settings'));
	};

	CardProto.enableEdit = function () {
		this.dispatchEvent(new Event('btn-edit'));
	};

	CardProto.enableSave = function () {
		this.dispatchEvent(new Event('btn-save'));
	};

	CardProto.enableRemove = function () {
		this.dispatchEvent(new Event('btn-remove'));
	};
	
	document.registerElement('card-base', { prototype: CardProto });
})();