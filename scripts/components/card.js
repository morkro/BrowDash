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
		let btn			= root.querySelector('.module__heading__button');
		btn.addEventListener('click', this.openSettings.bind(this));
	};
	CardProto.openSettings = function () {
		this.dispatchEvent(new Event('btn-settings'));
	};
	
	document.registerElement('card-base', { prototype: CardProto });
})();