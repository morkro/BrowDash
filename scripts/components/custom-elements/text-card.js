(function() {
	'use strict';

	/* Constants */
	var doc			= document.currentScript.ownerDocument;
	var template	= doc.querySelector('#text-card');
	var TextCard	= Object.create(HTMLDivElement.prototype);

	TextCard.config = { module: true, type: 'text', content: {} };
	TextCard.default = {
		headline: 'What do you want to write?',
		copy: `Just mark any text to format it.`
	};

	/**
	 * @description	Initialises data.
	 * @param 			{Object} config
	 */
	TextCard.initialise = function (config) {
		// Assign GUID
		if (config.guid) {
			this.config.guid = config.guid;
		} else {
			this.config.guid = this.root.children[1].GUID();
		}

		// Eval content
		if (config.content && typeof config.content === 'object') {
			this.config.content = config.content;	
		} else {
			this.config.content = {};
		}

		// Headline?
		if (this.config.content.headline) {
			this.headlineElement.innerHTML = this.config.content.headline;
		} else {
			this.headlineElement.innerHTML = this.default.headline;
		}

		// Text?
		if (this.config.content.text) {
			this.textElement.innerHTML	= this.config.content.text;
		} else {
			this.textElement.innerHTML = this.default.copy;
		}
		
		this.root.children[1].setGUID(this.config.guid);
		this.saveToStorage();
	};

	/**
	 * @description	Saves this.config to localStorage.
	 */
	TextCard.saveToStorage = function () {
		localStorage.setItem(this.config.guid, JSON.stringify(this.config));
	};

	/**
	 * @description	An instance of the element is created.
	 */
	TextCard.createdCallback = function () {
		this.root = this.createShadowRoot();
		this.root.appendChild( document.importNode(template.content, true) );
		
		// Editor
		this.editor	= this.root.querySelector('.module__editor');
		this.editor.addEventListener('click', this.execEditor.bind(this), true);
		// Headline
		this.headlineElement	= document.createElement('h1');
		this.headlineElement.addEventListener('input', this.evalContent.bind(this));
		// Copy
		this.textElement = document.createElement('div');
		this.textElement.addEventListener('input', this.evalContent.bind(this));

		this.appendContent();
	};

	/**
	 * @description	Sets contenteditable, updates content and appends to <text-card>.
	 */
	TextCard.appendContent = function () {
		this.headlineElement.contentEditable = true;
		this.textElement.contentEditable = true;

		this.updateContent();

		// Append elements
		this.appendChild( this.headlineElement );
		this.appendChild( this.textElement );
	};

	/**
	 * @description	Stores content of <h1> and <p>.
	 */	
	TextCard.updateContent = function () {
		this.config.content.headline = this.headlineElement.innerHTML;
		this.config.content.text = this.textElement.innerHTML;
	};

	/**
	 * @description	Saves to localStorage on each input event.
	 * @param 			{Object} event
	 */
	TextCard.evalContent = function (event) {
		this.updateContent();
		this.saveToStorage();
	};

	/**
	 * @description	Executes text formatting.
	 * @param 			{Object} event
	 */
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