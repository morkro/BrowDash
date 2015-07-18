(function() {
	'use strict';

	/* Constants */
	var doc			= document.currentScript.ownerDocument;
	var template	= doc.querySelector('#calendar-card');
	var CalendarCard	= Object.create(HTMLDivElement.prototype);

	CalendarCard.config = { module: true, type: 'calendar', content: {} };

	/**
	 * @description	Initialises data.
	 * @param 			{Object} config
	 */
	CalendarCard.initialise = function (config) {
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

		// Set default appearence
		if (!this.config.content.month) {
			this.config.content.month = 'colored';
		}

		// Set theme
		if (!this.config.content.theme) {
			this.config.content.theme = 'blue-a400';
		}

		this.root.children[1].setGUID(this.config.guid);
		this.saveToStorage();
		this.setMonthAppearance(this.config.content.month);
		this.setTheme(this.config.content.theme);
	};

	/**
	 * @description	Saves this.config to localStorage.
	 */
	CalendarCard.saveToStorage = function () {
		localStorage.setItem(this.config.guid, JSON.stringify(this.config));
	};

	/**
	 * @description	An instance of the element is created.
	 */
	CalendarCard.createdCallback = function () {
		this.root = this.createShadowRoot();
		this.root.appendChild( document.importNode(template.content, true) );

		// month
		this.settingsMonth = this.root.querySelector('.settings-month');
		this.monthColored = this.root.querySelector('#colored');
		this.monthBlank = this.root.querySelector('#blank');
		this.settingsMonth.addEventListener('click', this.validateMonthAppearance.bind(this))
		// theme
		this.theme = this.root.querySelector('.settings-theme');
		this.theme.addEventListener('click', this.validateTheme.bind(this));
	};

	CalendarCard.validateTheme = function (event) {
		if (event.target.hasAttribute('data-settings-theme')) {
			this.setTheme(event.target.getAttribute('data-settings-theme'));
			this.saveToStorage();
		}
	};

	CalendarCard.validateMonthAppearance = function (event) {
		if (event.target.type === 'radio') {
			this.setMonthAppearance(event.target.id);
			this.saveToStorage();
		}
	};

	CalendarCard.setMonthAppearance = function (month) {
		if (month === 'colored') {
			this.monthColored.checked = true;
		}
		else {
			this.monthBlank.checked = true;
		}

		this.config.content.month = month;
		this.setAttribute('appearance', month);
	};

	CalendarCard.setTheme = function (theme) {
		var curTheme = this.theme.querySelector('.is-active');
		var activeTheme = this.root.querySelector('[data-settings-theme="'+ theme +'"]');

		this.config.content.theme = theme;
		curTheme.classList.remove('is-active');
		activeTheme.classList.add('is-active');
		this.setAttribute('theme', theme);
	};

	/* Register element in document */
	document.registerElement('calendar-card', { prototype: CalendarCard });
})();