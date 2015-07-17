(function() {
	'use strict';

	/* Constants */
	var doc			= document.currentScript.ownerDocument;
	var template	= doc.querySelector('#calculator-card');
	var CalculatorCard	= Object.create(HTMLDivElement.prototype);

	CalculatorCard.config = { module: true, type: 'calculator', content: {} };
	CalculatorCard.decimalAdded = false;
	CalculatorCard.timeOut = 2000;
	CalculatorCard.hasNoDigits = /[^\d.\-\+()/*÷×\s]/g;

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

		// Set possible default mood
		if (!this.config.content.mood) {
			this.config.content.mood = 'dark';
		}

		// Set theme
		if (!this.config.content.theme) {
			this.config.content.theme = 'red';
		}

		this.root.children[1].setGUID(this.config.guid);
		this.saveToStorage();
		this.setMood(this.config.content.mood);
		this.setTheme(this.config.content.theme);
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

		// input view
		this.mathResult = this.root.querySelector('#calc-input');
		this.mathResult.addEventListener('keydown', this.evalCalcSubmit.bind(this));
		// button
		this.options = this.root.querySelector('.calc-options');
		this.options.addEventListener('click', this.evalCalcOptions.bind(this));
		// icons
		this.icons = this.root.querySelectorAll('svg-icon');
		// mood
		this.mood = this.root.querySelector('.settings-mood');
		this.moodDark = this.root.querySelector('#dark');
		this.moodLight = this.root.querySelector('#light');
		this.mood.addEventListener('click', this.validateMood.bind(this));
		// theme
		this.theme = this.root.querySelector('.settings-theme');
		this.theme.addEventListener('click', this.validateTheme.bind(this));
	};

	CalculatorCard.validateTheme = function (event) {
		if (event.target.hasAttribute('data-settings-theme')) {
			this.setTheme(event.target.getAttribute('data-settings-theme'));
			this.saveToStorage();
		}
	};

	/**
	 * @description	Saves the users input.
	 */
	CalculatorCard.validateMood = function (event) {
		if (event.target.type === 'radio') {
			this.setMood(event.target.id);
			this.saveToStorage();
		}
	};

	CalculatorCard.setIconColor = function (color) {
		[].forEach.call(this.icons, function (item) {
			item.setAttribute('color', color);
		});
	};

	CalculatorCard.setMood = function (mood) {
		var moodColor = 'black';

		if (mood === 'dark') {
			this.moodDark.checked = true;
			moodColor = 'white';
		}
		else {
			this.moodLight.checked = true;
		}

		this.config.content.mood = mood;
		this.setIconColor(moodColor);
		this.setAttribute('mood', mood);
	};

	CalculatorCard.setTheme = function (theme) {
		var curTheme = this.theme.querySelector('.is-active');
		var activeTheme = this.root.querySelector('[data-settings-theme="'+ theme +'"]');

		this.config.content.theme = theme;
		curTheme.classList.remove('is-active');
		activeTheme.classList.add('is-active');
		this.setAttribute('theme', theme);
	};

	CalculatorCard.getButton = function (elem) {
		if (elem && elem.nodeName === 'BUTTON') {
			return elem;
		} else if (elem && elem.nodeName === 'SVG-ICON') {
			return elem.parentNode;
		} else {
			return false;
		}
	};

	CalculatorCard.hasClass = function (elem, name) {
		return elem && elem.classList.contains('calc-' + name);
	};

	CalculatorCard.evalCalcSubmit = function (event) {
		const ENTER = 13;
		if (event.keyCode === ENTER) {
			event.preventDefault();
			this.calculateMathResult();
		}
	};

	CalculatorCard.evalCalcOptions = function (event) {
		event.preventDefault();
		var elem = event.target;
		var btn = this.getButton(elem);
		var btnType = btn.getAttribute('data-calculator');

		// If backspace is pressed
		if (btnType === 'backspace') {
			this.backspaceMath(event);
			this.decimalAdded = false;
		}
		// If clear is pressed
		else if (btnType === 'clear') {
			this.clearMath(event);
			this.decimalAdded = false;
		}
		// If decimal is added
		else if (btnType === 'decimal') {
			if (!this.decimalAdded) {
				this.displayCalculatorValue('.');
				this.decimalAdded = true;
			}
		}
		// Result
		else if (btnType === 'equal') {
			this.calculateMathResult();
		}
		else {
			this.displayCalculatorValue(btnType);
		}
	};

	CalculatorCard.calculateMathResult = function () {
		var result = this.mathResult.value;
		var cleanResult = result.replace(/[^0-9.\-\+()×÷/*]/g, '').replace(/×/g, '*').replace(/÷/g, '/');

		if (this.hasNoDigits.test(result)) {
			this.mathResult.value = `I only calculate digits!`;
			setTimeout(this.clearMath.bind(this), this.timeOut);
		}
		else if (cleanResult.length) {
			// This might be a valid use case for 'eval()'.
			// I know it's considered evil, but I don't want to include
			// a bloated library nor writing my own parser for that.
			// I'm not sending data anywhere anyway. If you still
			// think I'm doing something really bad, please drop me a line
			// and I rethink my decision!
			this.mathResult.value = eval(cleanResult);
		}
	};

	CalculatorCard.clearMath = function () {
		this.mathResult.value = null;
	};

	CalculatorCard.backspaceMath = function () {
		this.mathResult.value = this.mathResult.value.slice(0, -1);
	};

	CalculatorCard.displayCalculatorValue = function (value) {
		this.mathResult.value += value;
	};

	/* Register element in document */
	document.registerElement('calculator-card', { prototype: CalculatorCard });
})();