(function() {
	'use strict';
	
	var importDoc		= document.currentScript.ownerDocument;
	var cardTemplate	= importDoc.querySelector('#weather-card');
	var CardProto		= Object.create(HTMLDivElement.prototype);
	
	CardProto.createdCallback = function () {
		const self = this;
		let root = this.createShadowRoot();
		root.appendChild( document.importNode(cardTemplate.content, true) );
	};
	
	document.registerElement('weather-card', { prototype: CardProto });
})();