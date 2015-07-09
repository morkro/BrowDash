(function() {
	'use strict';
	
	/* Constants */
	var importDoc	= document.currentScript.ownerDocument;
	var iconTmpl	= importDoc.querySelector('#svg-icon');
	var IconProto	= Object.create(HTMLDivElement.prototype);
	
	/**
	 * @description	An instance of the element is created.
	 */
	IconProto.createdCallback = function () {
		let root			= this.createShadowRoot();
		root.appendChild( document.importNode(iconTmpl.content, true) );
		let iconAttr	= this.getAttribute('icon');
		this.svg			= root.querySelector('#icon');
		this.svg.children[0].setAttribute('xlink:href', `#${iconAttr}`);
	};

	/**
	 * @description	An instance was inserted into the document.
	 */
	IconProto.attributeChangedCallback = function (attrName, oldVal, newVal) {
		// Maybe a good use case for generator functions?
		if (attrName === 'icon') {
			this.svg.children[0].setAttribute('xlink:href', `#${newVal}`); 
		}
	};
	
	document.registerElement('svg-icon', { prototype: IconProto });
})();