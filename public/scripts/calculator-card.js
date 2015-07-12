(function() {
	'use strict';

	/* Constants */
	var doc			= document.currentScript.ownerDocument;
	var template	= doc.querySelector('#calculator-card');
	var CalculatorCard	= Object.create(HTMLDivElement.prototype);

	CalculatorCard.config = { module: true, type: 'calculator', content: {} };

	/**
	 * @description	Initialises data.
	 * @param 			{Object} config
	 */
	CalculatorCard.initialise = function (config) {
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

		this.root.children[1].setGUID(this.config.guid);
		this.saveToStorage();
	};

	/**
	 * @description	Saves this.config to localStorage.
	 */
	CalculatorCard.saveToStorage = function () {
		localStorage.setItem(this.config.guid, JSON.stringify(this.config));
	};

	/**
	 * @description	An instance of the element is created.
	 */
	CalculatorCard.createdCallback = function () {
		this.root = this.createShadowRoot();
		this.root.appendChild( document.importNode(template.content, true) );
	};

	/* Register element in document */
	document.registerElement('calculator-card', { prototype: CalculatorCard });
})();