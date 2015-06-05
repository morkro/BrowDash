(function() {
	'use strict';
	
	/* Constants */
	var doc			= document.currentScript.ownerDocument;
	var template	= doc.querySelector('#text-card');
	var TextCard	= Object.create(HTMLDivElement.prototype);

	TextCard.headlineElement	= null;
	TextCard.textElement			= null;
	TextCard.storage				= { headline: null, text: null };

	/**
	 * @description	An instance of the element is created.
	 */
	TextCard.createdCallback = function () {
		this.root = this.createShadowRoot();
		this.root.appendChild( document.importNode(template.content, true) );

		this.editor = this.root.querySelector('.module__editor');
		this.editor.addEventListener('click', this.execEditor.bind(this), true);
	};

	/**
	 * @description	An instance was inserted into the document.
	 */
	TextCard.attachedCallback = function () {
		this.headlineElement = this.querySelector('h1');
		this.textElement = this.querySelector('div');
	};

	/**
	 * @description	Sets 'contenteditable="true"' to all elements.
	 * @public
	 */	
	TextCard.edit = function () {
		this.headlineElement.setAttribute('contenteditable', true);
		this.textElement.setAttribute('contenteditable', true);
	};

	/**
	 * @description	Removes attributes and stores data internally.
	 * @public
	 */	
	TextCard.save = function () {
		this.storeInternalData();
		this.headlineElement.removeAttribute('contenteditable');
		this.textElement.removeAttribute('contenteditable');
	};

	/**
	 * @description	Stores content of <h1> and <p>.
	 * @public
	 */	
	TextCard.storeInternalData = function () {
		this.storage['headline'] = this.headlineElement.innerHTML;
		this.storage['text'] = this.textElement.innerHTML;
	};

	TextCard.execEditor = function (event) {
		let target		= event.target;
		let btn			= 'BUTTON';
		let targetAttr	= null;

		while (target.nodeName !== btn) {
			target = target.parentNode;
		}

		targetAttr = target.getAttribute('data-editor-option');
		document.execCommand(targetAttr, true, null);
	};

	/* Register element in document */	
	document.registerElement('text-card', { prototype: TextCard });
})();