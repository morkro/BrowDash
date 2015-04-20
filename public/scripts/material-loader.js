(function() {
	'use strict';
	
	var importDoc		= document.currentScript.ownerDocument;
	var loaderTmpl		= importDoc.querySelector('#material-loader');
	var LoaderProto	= Object.create(HTMLDivElement.prototype);
	
	LoaderProto.createdCallback = function () {
		const self = this;
		let root = this.createShadowRoot();
		root.appendChild( document.importNode(loaderTmpl.content, true) );
	};
	
	document.registerElement('material-loader', { prototype: LoaderProto });
})();