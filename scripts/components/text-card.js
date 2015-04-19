(function() {
	'use strict';
	
	var importDoc		= document.currentScript.ownerDocument;
	var cardTemplate	= importDoc.querySelector('#text-card');
	var CardProto		= Object.create(HTMLDivElement.prototype);
	
	CardProto.createdCallback = function () {
		const self = this;
		let root = this.createShadowRoot();
		root.appendChild( document.importNode(cardTemplate.content, true) );

		this.cardEditor = {
			bold : root.querySelector('[data-editor-option="bold"]'),
			italic : root.querySelector('[data-editor-option="italic"]'),
			underline : root.querySelector('[data-editor-option="underline"]'),
			strikethrough : root.querySelector('[data-editor-option="strikethrough"]'),
			link : root.querySelector('[data-editor-option="link"]'),
			unstyle : root.querySelector('[data-editor-option="unstyle"]')
		};
	};
	
	document.registerElement('text-card', { prototype: CardProto });
})();