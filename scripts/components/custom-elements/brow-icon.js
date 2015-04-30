(function() {
	'use strict';
	
	var importDoc	= document.currentScript.ownerDocument;
	var iconTmpl	= importDoc.querySelector('#brow-icon');
	var IconProto	= Object.create(HTMLDivElement.prototype);
	
	IconProto.createdCallback = function () {
		let root = this.createShadowRoot();
		root.appendChild( document.importNode(iconTmpl.content, true) );
	};
	
	document.registerElement('brow-icon', { prototype: IconProto });
})();