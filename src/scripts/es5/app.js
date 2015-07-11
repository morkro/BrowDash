(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Import dependencies */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsElements = require('./utils/elements');

var _utilsConstants = require('./utils/constants');

var _utilsHelper = require('./utils/helper');

var _viewsDialogSettings = require('./views/dialog.settings');

var _viewsDialogSettings2 = _interopRequireDefault(_viewsDialogSettings);

var _modulesTimer = require('./modules/timer');

var _modulesTimer2 = _interopRequireDefault(_modulesTimer);

var _modulesDialog = require('./modules/dialog');

var _modulesDialog2 = _interopRequireDefault(_modulesDialog);

var _modulesCard = require('./modules/card');

var _modulesCard2 = _interopRequireDefault(_modulesCard);

var _modulesLayoutmanager = require('./modules/layoutmanager');

var _modulesLayoutmanager2 = _interopRequireDefault(_modulesLayoutmanager);

/* Variables */
var browTimer = null;
var browGrid = null;

/**
 *	@description Validates the users timer settings.
 */
var validateTimer = function validateTimer() {
	browTimer = new _modulesTimer2['default'](_utilsElements.timer);
	var dateSettings = { dateFormat: null, abbreviations: false };

	if (!localStorage[_utilsConstants.BROW_SETTINGS]) {
		dateSettings.dateFormat = '24h';
		browTimer.setDateFormat({
			'format': dateSettings.dateFormat
		});
		localStorage.setItem(_utilsConstants.BROW_SETTINGS, JSON.stringify(dateSettings));
	} else {
		dateSettings = JSON.parse(localStorage[_utilsConstants.BROW_SETTINGS]);
		browTimer.setDateFormat({
			'format': dateSettings.dateFormat,
			'abbreviations': dateSettings.abbreviations
		});
	}

	browTimer.run();
};

/**
 * @description	Adds all dialog.
 */
var initDialogs = function initDialogs() {
	var currentLocation = window.location.href.slice(0, -1);

	[].forEach.call(_utilsElements.openDialog, function (item) {
		var dialogContent = item.getAttribute('data-dialog');
		var dialogCallback = false;

		if (dialogContent === 'settings') {
			dialogCallback = _viewsDialogSettings2['default'];
		}

		var browDialog = new _modulesDialog2['default']({
			elem: item,
			dialogElem: _utilsElements.dialog,
			content: currentLocation + '/markup/dialog-' + dialogContent + '.html',
			callback: dialogCallback,
			params: { Timer: _modulesTimer2['default'] }
		});

		browDialog.init();
	});
};

/**
 * @description	Gets localStorage, parses available cards and creates them.
 * @param			{Number|String} index
 */
var parseCardsFromStorage = function parseCardsFromStorage(index) {
	var storageItem = JSON.parse(localStorage.getItem(localStorage.key(index)));

	if (storageItem.module) {
		var browCard = new _modulesCard2['default']({
			type: storageItem.type,
			guid: storageItem.guid,
			content: storageItem.content,
			style: storageItem.style
		});
		_utilsElements.content.appendChild(browCard);
	}
};

/**
 * @description	Calls the LayoutManager class.
 */
var initLayoutManager = function initLayoutManager() {
	browGrid = new _modulesLayoutmanager2['default'](_utilsElements.content, _utilsElements.contentOverlay);
	browGrid.layout();
};

/**
 * @description	Checks localStorage and loads the users cards
 * @param			{Object} storage
 */
var validateBrowCards = function validateBrowCards() {
	if (!localStorage[_utilsConstants.BROW_CARDS] || localStorage.length <= 1) {
		localStorage.setItem(_utilsConstants.BROW_CARDS, true);
		var defaultCard = new _modulesCard2['default']({ type: 'text' });
		_utilsElements.content.appendChild(defaultCard);
	} else {
		for (var i = 0; i < localStorage.length; i++) {
			parseCardsFromStorage(i);
		}
	}
};

/**
 * @description	Checks clicked card type and appends it to the DOM.
 * @param			{Object} event
 */
var addNewCard = function addNewCard(event) {
	event.preventDefault();

	var selectedCard = this.getAttribute('data-create-card');
	var browCard = new _modulesCard2['default']({ type: '' + selectedCard });

	_utilsElements.content.appendChild(browCard);
	browGrid.add(browCard);
};

/**
 * @description	Bind events to elements.
 */
var addEvents = function addEvents() {
	[].forEach.call(_utilsElements.newCard, function (item) {
		item.addEventListener('click', addNewCard);
	});
};

/* Initialise app */
window.isEditMode = false;
validateBrowCards();
validateTimer();
initLayoutManager();
initDialogs();
_utilsHelper.setTheme();
addEvents();

},{"./modules/card":2,"./modules/dialog":3,"./modules/layoutmanager":4,"./modules/timer":6,"./utils/constants":7,"./utils/elements":8,"./utils/helper":9,"./views/dialog.settings":10}],2:[function(require,module,exports){
/**
 * @name				Card
 * @description	/
 */
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Card = (function () {
	function Card() {
		var config = arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Card);

		this.config = config;
		this.elem = this.createCard();
		this.initialiseCard();

		return this.elem;
	}

	/**
  * @description	Returns a new card element.
  * @return 			{HTMLElement}
  */

	Card.prototype.createCard = function createCard() {
		switch (this.config.type) {
			case 'text':
				return document.createElement('text-card');
			case 'weather':
				return document.createElement('weather-card');
			case 'todo':
				return document.createElement('todo-card');
			default:
				return document.createElement('text-card');
		}
	};

	/**
  * @description	Applies class element and calls initialise().
  */

	Card.prototype.initialiseCard = function initialiseCard() {
		this.elem.initialise(this.config);
		this.elem.classList.add('brow-content__module');
	};

	return Card;
})();

exports['default'] = Card;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
/**
 * @name				Dialog
 * @description	Shows/hides the dialog.
 */
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Dialog = (function () {
	function Dialog(config) {
		_classCallCheck(this, Dialog);

		this.elem = config.elem;
		this.button = this.elem.children[0];
		this.initButtonIcon = this.button.getAttribute('icon');
		this.path = config.content;
		this.callback = config.callback;
		this.callbackParams = config.params;
		this.dialogElem = config.dialogElem;
		this.dialogContainer = this.dialogElem.querySelector('.dialog__inner');
		this.dialogContent = null;
		this.isActive = false;
	}

	Dialog.prototype.init = function init() {
		this.addEvents();
	};

	/**
  *	@description	Loads the content
  * @param			{Object} event
  */

	Dialog.prototype.loadContent = function loadContent(event) {
		var _this = this;

		event.preventDefault();

		fetch(this.path).then(function (response) {
			return response.text();
		}).then(function (body) {
			_this.dialogContainer.innerHTML = body;
			_this.dialogContent = _this.dialogContainer.querySelector('.dialog__content');
			_this.button.setAttribute('icon', 'close');
			_this.button.setAttribute('color', 'white');
			document.body.classList.add('dialog-is-visible');
			_this.isActive = true;

			if (_this.callback) {
				_this.callback(_this);
			}
		});
	};

	/**
  *	@description	Closes the dialog
  * @param			{Object} event
 */

	Dialog.prototype.closeDialog = function closeDialog(event) {
		var bodyHasClass = document.body.classList.contains('dialog-is-visible');
		var isCloseBtn = event.target === this.elem;
		var isESCKey = event.keyCode === 27;

		if (this.isActive && bodyHasClass && isCloseBtn || isESCKey) {
			// Clear DOM
			this.dialogContainer.innerHTML = null;
			// Reset button
			this.button.setAttribute('icon', this.initButtonIcon);
			this.button.removeAttribute('color');
			// Remove class
			document.body.classList.remove('dialog-is-visible');
		}
	};

	/**
  *	@description	Validates if dialog is visible or not, closes/loads it.
  * @param			{Object} event
  */

	Dialog.prototype.loadOrCloseContent = function loadOrCloseContent(event) {
		var dialogIsOpen = document.body.classList.contains('dialog-is-visible');

		if (dialogIsOpen) {
			this.closeDialog(event);
		} else {
			this.loadContent(event);
		}
	};

	/**
  *	@description	Adds events
  */

	Dialog.prototype.addEvents = function addEvents() {
		this.elem.addEventListener('click', this.loadOrCloseContent.bind(this));
		window.addEventListener('keydown', this.closeDialog.bind(this));
	};

	return Dialog;
})();

exports['default'] = Dialog;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
/*globals Packery,Draggabilly*/

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsHelper = require('../utils/helper');

/**
 * @name				LayoutManager
 * @description	/
 */

var LayoutManager = (function () {
	function LayoutManager(container, overlay) {
		_classCallCheck(this, LayoutManager);

		this.transition = 0;
		this.dragOptions = {
			handle: '.brow-content__module /deep/ .dragg-area'
		};
		this.pkrOptions = {
			itemSelector: '.brow-content__module',
			transitionDuration: this.transition,
			columnWidth: '.brow-content--sizer',
			gutter: '.brow-content--gutter',
			stamp: '.is-stamp',
			isInitLayout: false
		};
		this.packery = new Packery(container, this.pkrOptions);
		this.content = container;
		this.overlay = overlay;
		this.addEvents();
		this.addDraggabilly();
	}

	/**
  * @description	Will initialise the Packery layout.
  */

	LayoutManager.prototype.layout = function layout() {
		this.packery.layout();
	};

	/**
  * @description	Adds a new item to the Packery layout.
  * @param 			{NodeList|HTMLElement} elem
  */

	LayoutManager.prototype.add = function add(elem) {
		this.packery.appended(elem);
		this.addDraggabilly();
	};

	/**
  * @description	Removes passed element from the Packery layout.
  * @param 			{NodeList|HTMLElement} config
  */

	LayoutManager.prototype.remove = function remove(elem) {
		this.packery.remove(elem);
		this.layout();
	};

	/**
  * @description	Makes an element sticky.
  * @param 			{NodeList|HTMLElement} config
  */

	LayoutManager.prototype.stamp = function stamp(elem) {
		this.packery.stamp(elem);
	};

	/**
  * @description	Unstamps an element.
  * @param 			{NodeList|HTMLElement} config
  */

	LayoutManager.prototype.unstamp = function unstamp(elem) {
		this.packery.unstamp(elem);
	};

	/**
  * @description	Initialises Draggabilly.
  */

	LayoutManager.prototype.addDraggabilly = function addDraggabilly() {
		var _this = this;

		var cards = this.packery.getItemElements();
		cards.forEach(function (item) {
			var draggie = new Draggabilly(item, _this.dragOptions);
			_this.packery.bindDraggabillyEvents(draggie);
			draggie.on('pointerDown', _this.validateEditMode.bind(draggie));
		});
	};

	/**
  * @description	Adds EventListener.
  */

	LayoutManager.prototype.addEvents = function addEvents() {
		window.addEventListener('card-edit', this.validateLayoutState.bind(this));
		window.addEventListener('card-save', this.validateLayoutState.bind(this));
		window.addEventListener('card-remove', this.validateLayoutState.bind(this));
		this.overlay.addEventListener('click', this.validateLayoutState.bind(this));
	};

	/**
  * @description	Deactivates editMode and removes classes from content overlay.
  */

	LayoutManager.prototype.deactivateEditMode = function deactivateEditMode() {
		var _this2 = this;

		window.isEditMode = false;
		this.overlay.classList.add('is-fading');
		setTimeout(function () {
			_this2.overlay.classList.remove('is-visible', 'is-fading');
		}, 100);
	};

	/**
  * @description	Checks event type and validates the layout's state.
  * @param  			{Object} event
  */

	LayoutManager.prototype.validateLayoutState = function validateLayoutState(event) {
		var elem = document.querySelector('[data-guid="' + event.detail + '"]');

		// activated editing mode
		if (event.type === 'card-edit') {
			window.isEditMode = true;
			this.overlay.classList.add('is-visible');
		}

		// saved card or remove card
		if (event.type === 'card-save' || event.type === 'card-remove') {
			this.deactivateEditMode();

			if (event.type === 'card-save') {
				this.layout();
				_utilsHelper.hasCustomCards();
			}

			if (event.type === 'card-remove') {
				this.remove(elem);
			}
		} else if (event.type === 'click' && window.isEditMode) {
			elem = this.content.querySelector('.is-edit');
			elem.saveToStorage();
			elem.classList.remove('fx', 'is-edit');
			this.deactivateEditMode();
		}
	};

	/**
  * @description	Checks if editMode is active and weither disables or enables the dragging.
  */

	LayoutManager.prototype.validateEditMode = function validateEditMode() {
		if (window.isEditMode) {
			this.disable();
		} else {
			this.enable();
		}
	};

	return LayoutManager;
})();

exports['default'] = LayoutManager;
module.exports = exports['default'];

},{"../utils/helper":9}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsElements = require('../utils/elements');

/**
 * @name				Snackbar
 * @description	/
 */

var Snackbar = (function () {
	function Snackbar() {
		_classCallCheck(this, Snackbar);

		this.duration = 2000;
		this.elem = _utilsElements.snackbar;
		this.message = 'Ooops, something went wrong! :(';
	}

	Snackbar.prototype.alert = function alert() {
		var msg = arguments[0] === undefined ? this.message : arguments[0];

		this.message = msg.trim();
		this.show();
	};

	Snackbar.prototype.show = function show() {
		var _this = this;

		this.elem.innerText = this.createParagraph();
		this.elem.classList.add('is-visible');
		setTimeout(function () {
			_this.elem.classList.remove('is-visible');
			_this.elem.innerText = null;
		}, this.duration);
	};

	Snackbar.prototype.createParagraph = function createParagraph() {
		var p = document.createElement('p');
		p.innerText = this.message;
		return p;
	};

	return Snackbar;
})();

exports['default'] = Snackbar;
module.exports = exports['default'];

},{"../utils/elements":8}],6:[function(require,module,exports){
/**
 * @name				Timer
 * @description	Class which appends a time string to an element
 *              	and updates it every second.
 */
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Timer = (function () {
	function Timer(elem) {
		_classCallCheck(this, Timer);

		if (!(elem && elem.nodeName)) {
			throw new Error('You haven\'t passed a valid HTMLElement!');
		}

		this.update = 1000;
		this.elem = elem;
		this.format = '24h';
		this.abbreviations = false;
	}

	/**
  * @description	Creates a string with current time in HH:MM:SS
  * @return			{String}
  */

	Timer.prototype.getTime = function getTime() {
		var date = new Date();
		var dateHours = date.getHours();
		var dateMinutes = date.getMinutes();
		var dateSeconds = date.getSeconds();
		var dateAbbr = '';

		// If time format is set to 12h, use 12h-system.
		if (this.format === '12h') {
			if (this.abbreviations) {
				dateAbbr = this.getAbbreviation(dateHours);
			}
			dateHours = dateHours % 12 ? dateHours % 12 : 12;
		}

		// Add '0' if below 10
		if (dateHours < 10) {
			dateHours = '0' + dateHours;
		}
		if (dateMinutes < 10) {
			dateMinutes = '0' + dateMinutes;
		}
		if (dateSeconds < 10) {
			dateSeconds = '0' + dateSeconds;
		}

		return dateHours + ':' + dateMinutes + ':' + dateSeconds + ' ' + dateAbbr;
	};

	/**
  * @description	Validates number and returns either AM or PM.
  * @param 			{Number} time
  * @return			{String}
  */

	Timer.prototype.getAbbreviation = function getAbbreviation(time) {
		if (typeof time !== 'number') {
			time = parseFloat(time);
		}

		return time >= 12 ? 'PM' : 'AM';
	};

	/**
  *	@description	Needs to be written.
  * @param			{Object} config
  */

	Timer.prototype.setDateFormat = function setDateFormat(config) {
		if (config) {
			this.format = config.format ? config.format : this.format;
			this.abbreviations = config.abbreviations;
		}
		this.run();
	};

	/**
  * @description	Sets the element in which the time should be displayed.
  * @param			{Element} elem
  * @return 			{HTMLElement}
  */

	Timer.prototype.run = function run() {
		var _this = this;

		this.elem.textContent = this.getTime();

		setInterval(function () {
			_this.elem.textContent = _this.getTime();
		}, this.update);

		return this.elem;
	};

	return Timer;
})();

exports['default'] = Timer;
module.exports = exports['default'];

},{}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var BROW_SETTINGS = 'BROW_SETTINGS';
exports.BROW_SETTINGS = BROW_SETTINGS;
var BROW_KEY = 'BROW_THEME';
exports.BROW_KEY = BROW_KEY;
var BROW_CARDS = 'BROW_CARDS';
exports.BROW_CARDS = BROW_CARDS;
var DEFAULT_THEME = 'blue-a400';
exports.DEFAULT_THEME = DEFAULT_THEME;

},{}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var timer = document.querySelector('.js-timer');
exports.timer = timer;
var dialog = document.querySelector('.js-dialog');
exports.dialog = dialog;
var cardlist = document.querySelector('.js-cardlist');
exports.cardlist = cardlist;
var content = document.querySelector('.js-content');
exports.content = content;
var contentOverlay = document.querySelector('.content__overlay');
exports.contentOverlay = contentOverlay;
var openDialog = document.querySelectorAll('.open-dialog');
exports.openDialog = openDialog;
var newCard = document.querySelectorAll('.js-newcard');
exports.newCard = newCard;
var selectionList = document.querySelector('.js-selection');
exports.selectionList = selectionList;
var snackbar = document.querySelector('.js-snackbar');
exports.snackbar = snackbar;

},{}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _constants = require('./constants');

/**
 * @description	Checks if custom theme settings are available.
 * @return			{Boolean}
 */
var isCustomTheme = function isCustomTheme() {
	var isCustom = false;

	if (localStorage[_constants.BROW_SETTINGS]) {
		var settings = JSON.parse(localStorage[_constants.BROW_SETTINGS]);
		isCustom = !!settings.theme;
	}

	return isCustom;
};

/**
 * @description	Checks if custom key is set, if not: do it.
 */
var hasCustomCards = function hasCustomCards() {
	if (!localStorage[_constants.BROW_CARDS]) {
		localStorage[_constants.BROW_CARDS] = true;
	}
};

/**
 * @description	Checks via regex if className is a theme.
 */
var checkForThemeClass = function checkForThemeClass() {
	var themeRegEx = /theme-.*/;
	for (var i = 0; i < document.body.classList.length; i++) {
		if (themeRegEx.test(document.body.classList[i])) {
			document.body.classList.remove(document.body.classList[i]);
		}
	}
};

/**
 * @description	Parses the custom settings from localStorage and sets classes.
 */
var updateThemeFromStorage = function updateThemeFromStorage() {
	var settings = JSON.parse(localStorage[_constants.BROW_SETTINGS]);
	//let dialogIsOpen = document.body.classList.contains('dialog-is-visible');

	checkForThemeClass();
	document.body.classList.add('theme-' + settings.theme.color);

	if (isCustomTheme() && settings.theme.headerbar) {
		document.body.classList.add('theme-headerbar');
	}
};

/**
 * @description	Adds the theme class to <body> from initial settings.
 * @param			{String} theme
 */
var updateThemeFromConfig = function updateThemeFromConfig(theme) {
	document.body.classList.add('theme-' + theme);
};

/**
 *	@description	Updates the current theme.
 * @param			{Object} theme
 */
var setTheme = function setTheme(theme) {
	if (!theme || typeof theme !== 'string') {
		theme = _constants.DEFAULT_THEME;
	}

	if (isCustomTheme()) {
		updateThemeFromStorage();
	} else {
		updateThemeFromConfig(theme);
	}
};

exports.isCustomTheme = isCustomTheme;
exports.hasCustomCards = hasCustomCards;
exports.setTheme = setTheme;
exports.updateThemeFromConfig = updateThemeFromConfig;
exports.updateThemeFromStorage = updateThemeFromStorage;

},{"./constants":7}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utilsConstants = require('../utils/constants');

var _utilsHelper = require('../utils/helper');

/**
 * @description	Validates input fields, updates browTheme and saves to localStorage.
 * @param  			{Object} event
 */
var updateTheme = function updateTheme(event) {
	var colorHeadCheckbox = this.dialogContent.querySelector('#settings--coloredhead');
	//let isThemeButton			= event.target.hasAttribute('data-settings-theme');
	//let isThemeCheckbox		= event.target.id === 'settings--coloredhead';
	var settings = JSON.parse(localStorage[_utilsConstants.BROW_SETTINGS]);

	// If no theme settings are stored yet.
	if (!settings.theme) {
		settings.theme = { color: _utilsConstants.DEFAULT_THEME, headerbar: false };
	}

	// Is theme option
	if (event.target.hasAttribute('data-settings-theme')) {
		settings.theme.color = event.target.getAttribute('data-settings-theme');
	}

	// If colored header bar is clicked
	if (event.target.id === 'settings--coloredhead') {
		settings.theme.headerbar = colorHeadCheckbox.checked;
	}

	localStorage.setItem(_utilsConstants.BROW_SETTINGS, JSON.stringify(settings));
	_utilsHelper.setTheme();
};

/**
 * @description	Validates input fields, updates Timer and saves to localStorage.
 * @param  			{Object} event
 */
var updateDateFormat = function updateDateFormat(event) {
	var formatCheckbox = this.dialogContent.querySelector('#settings--dateformat');
	var abbrCheckbox = this.dialogContent.querySelector('#settings--ampm');
	var timeFormat = '24h';
	var dateSettings = JSON.parse(localStorage[_utilsConstants.BROW_SETTINGS]);

	// If date format checkbox is clicked
	if (event.target.id === 'settings--dateformat') {
		if (!formatCheckbox.checked) {
			timeFormat = '12h';
			abbrCheckbox.disabled = false;
		} else if (formatCheckbox.checked && !abbrCheckbox.disabled) {
			abbrCheckbox.disabled = true;
			abbrCheckbox.checked = false;
		}

		this.callbackParams.Timer.setDateFormat({ 'format': timeFormat });
		dateSettings.dateFormat = timeFormat;
		dateSettings.abbreviations = abbrCheckbox.checked;
	}

	// If abbreviation checkbox is clicked
	if (!event.target.disabled && event.target.id === 'settings--ampm') {
		this.callbackParams.Timer.setDateFormat({ 'abbreviations': abbrCheckbox.checked });
		dateSettings.abbreviations = abbrCheckbox.checked;
	}

	localStorage.setItem(_utilsConstants.BROW_SETTINGS, JSON.stringify(dateSettings));
};

/**
 * @description	Adds callback to content in dialog and validates <input> fields.
 */
var dialogSettingsCallback = function dialogSettingsCallback() {
	var timeContent = this.dialogContent.querySelector('.content__time');
	var themeContent = this.dialogContent.querySelector('.content__theme');
	var formatCheckbox = this.dialogContent.querySelector('#settings--dateformat');
	var abbrCheckbox = this.dialogContent.querySelector('#settings--ampm');
	var themeCheckbox = this.dialogContent.querySelector('#settings--coloredhead');
	var browSettings = JSON.parse(localStorage[_utilsConstants.BROW_SETTINGS]);

	// Validate date settings and update DOM
	if (browSettings.dateFormat === '12h') {
		formatCheckbox.checked = false;
	}
	abbrCheckbox.checked = browSettings.abbreviations;
	abbrCheckbox.disabled = !browSettings.abbreviations;

	// Validate header bar settings and update DOM
	if (_utilsHelper.isCustomTheme()) {
		themeCheckbox.checked = browSettings.theme.headerbar;
	}

	// Add eventListener
	timeContent.addEventListener('click', updateDateFormat.bind(this));
	themeContent.addEventListener('click', updateTheme.bind(this));
};

exports['default'] = dialogSettingsCallback;
module.exports = exports['default'];

},{"../utils/constants":7,"../utils/helper":9}]},{},[1,2,3,4,5,6,7,8,9,10])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvYXBwLmluaXQuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvbW9kdWxlcy9jYXJkLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvZGlhbG9nLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvbGF5b3V0bWFuYWdlci5qcyIsIi9Vc2Vycy9tb3Jrcm9nZS9EZXNrdG9wL1Byb2plY3RzL1BlcnNvbmFsL0Jyb3dEYXNoL3NyYy9zY3JpcHRzL2VzNi9tb2R1bGVzL3NuYWNrYmFyLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvdGltZXIuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvdXRpbHMvY29uc3RhbnRzLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L3V0aWxzL2VsZW1lbnRzLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L3V0aWxzL2hlbHBlci5qcyIsIi9Vc2Vycy9tb3Jrcm9nZS9EZXNrdG9wL1Byb2plY3RzL1BlcnNvbmFsL0Jyb3dEYXNoL3NyYy9zY3JpcHRzL2VzNi92aWV3cy9kaWFsb2cuc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs2QkNDNEUsa0JBQWtCOzs4QkFDcEQsbUJBQW1COzsyQkFDcEMsZ0JBQWdCOzttQ0FDTix5QkFBeUI7Ozs7NEJBQzFDLGlCQUFpQjs7Ozs2QkFDaEIsa0JBQWtCOzs7OzJCQUNwQixnQkFBZ0I7Ozs7b0NBQ1AseUJBQXlCOzs7OztBQUduRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDckIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDOzs7OztBQUtwQixJQUFJLGFBQWEsR0FBRyxTQUFoQixhQUFhLEdBQWU7QUFDL0IsVUFBUyxHQUFHLDZDQWpCSixLQUFLLENBaUJlLENBQUM7QUFDN0IsS0FBSSxZQUFZLEdBQUcsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsQ0FBQzs7QUFFOUQsS0FBSSxDQUFDLFlBQVksaUJBbkJULGFBQWEsQ0FtQlcsRUFBRTtBQUNqQyxjQUFZLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUNoQyxXQUFTLENBQUMsYUFBYSxDQUFDO0FBQ3ZCLFdBQVEsRUFBRSxZQUFZLENBQUMsVUFBVTtHQUNqQyxDQUFDLENBQUM7QUFDSCxjQUFZLENBQUMsT0FBTyxpQkF4QmIsYUFBYSxFQXdCZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0VBQ2xFLE1BQ0k7QUFDSixjQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLGlCQTNCL0IsYUFBYSxDQTJCaUMsQ0FBQyxDQUFDO0FBQ3ZELFdBQVMsQ0FBQyxhQUFhLENBQUM7QUFDdkIsV0FBUSxFQUFFLFlBQVksQ0FBQyxVQUFVO0FBQ2pDLGtCQUFlLEVBQUUsWUFBWSxDQUFDLGFBQWE7R0FDM0MsQ0FBQyxDQUFDO0VBQ0g7O0FBRUQsVUFBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO0NBQ2hCLENBQUM7Ozs7O0FBS0YsSUFBSSxXQUFXLEdBQUcsU0FBZCxXQUFXLEdBQWU7QUFDN0IsS0FBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV4RCxHQUFFLENBQUMsT0FBTyxDQUFDLElBQUksZ0JBNUNBLFVBQVUsRUE0Q0csVUFBVSxJQUFJLEVBQUU7QUFDM0MsTUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNyRCxNQUFJLGNBQWMsR0FBRyxLQUFLLENBQUM7O0FBRTNCLE1BQUksYUFBYSxLQUFLLFVBQVUsRUFBRTtBQUNqQyxpQkFBYyxtQ0FBeUIsQ0FBQztHQUN4Qzs7QUFFRCxNQUFJLFVBQVUsR0FBRywrQkFBVztBQUMzQixPQUFJLEVBQUUsSUFBSTtBQUNWLGFBQVUsaUJBdERlLE1BQU0sQUFzRGI7QUFDbEIsVUFBTyxFQUFLLGVBQWUsdUJBQWtCLGFBQWEsVUFBTztBQUNqRSxXQUFRLEVBQUUsY0FBYztBQUN4QixTQUFNLEVBQUUsRUFBRSxLQUFLLDJCQUFBLEVBQUU7R0FDakIsQ0FBQyxDQUFDOztBQUVILFlBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztFQUNsQixDQUFDLENBQUM7Q0FDSCxDQUFDOzs7Ozs7QUFNRixJQUFJLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixDQUFhLEtBQUssRUFBRTtBQUM1QyxLQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUMzQixZQUFZLENBQUMsT0FBTyxDQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUUsQ0FDL0MsQ0FBQzs7QUFFRixLQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUU7QUFDdkIsTUFBSSxRQUFRLEdBQUcsNkJBQVM7QUFDdkIsT0FBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJO0FBQ3RCLE9BQUksRUFBRSxXQUFXLENBQUMsSUFBSTtBQUN0QixVQUFPLEVBQUUsV0FBVyxDQUFDLE9BQU87QUFDNUIsUUFBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLO0dBQ3hCLENBQUMsQ0FBQztBQUNILGlCQWhGMkMsT0FBTyxDQWdGMUMsV0FBVyxDQUFFLFFBQVEsQ0FBRSxDQUFDO0VBQ2hDO0NBQ0QsQ0FBQzs7Ozs7QUFLRixJQUFJLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixHQUFlO0FBQ25DLFNBQVEsR0FBRyxxREF4RmlDLE9BQU8saUJBQUUsY0FBYyxDQXdGWixDQUFDO0FBQ3hELFNBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztDQUNsQixDQUFDOzs7Ozs7QUFNRixJQUFJLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixHQUFlO0FBQ25DLEtBQUksQ0FBQyxZQUFZLGlCQWhHTSxVQUFVLENBZ0dKLElBQUksWUFBWSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7QUFDMUQsY0FBWSxDQUFDLE9BQU8saUJBakdFLFVBQVUsRUFpR0MsSUFBSSxDQUFDLENBQUM7QUFDdkMsTUFBSSxXQUFXLEdBQUcsNkJBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUM3QyxpQkFwRzJDLE9BQU8sQ0FvRzFDLFdBQVcsQ0FBRSxXQUFXLENBQUUsQ0FBQztFQUNuQyxNQUFNO0FBQ04sT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDN0Msd0JBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDekI7RUFDRDtDQUNELENBQUM7Ozs7OztBQU1GLElBQUksVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFhLEtBQUssRUFBRTtBQUNqQyxNQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRXZCLEtBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN6RCxLQUFJLFFBQVEsR0FBRyw2QkFBUyxFQUFFLElBQUksT0FBSyxZQUFZLEFBQUUsRUFBRSxDQUFDLENBQUM7O0FBRXJELGdCQXRINEMsT0FBTyxDQXNIM0MsV0FBVyxDQUFFLFFBQVEsQ0FBRSxDQUFDO0FBQ2hDLFNBQVEsQ0FBQyxHQUFHLENBQUUsUUFBUSxDQUFFLENBQUM7Q0FDekIsQ0FBQzs7Ozs7QUFLRixJQUFJLFNBQVMsR0FBRyxTQUFaLFNBQVMsR0FBZTtBQUMzQixHQUFFLENBQUMsT0FBTyxDQUFDLElBQUksZ0JBOUhvQixPQUFPLEVBOEhqQixVQUFDLElBQUksRUFBSztBQUNsQyxNQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0VBQzNDLENBQUMsQ0FBQztDQUNILENBQUM7OztBQUdGLE1BQU0sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQzFCLGlCQUFpQixFQUFFLENBQUM7QUFDcEIsYUFBYSxFQUFFLENBQUM7QUFDaEIsaUJBQWlCLEVBQUUsQ0FBQztBQUNwQixXQUFXLEVBQUUsQ0FBQztBQUNkLGFBdklTLFFBQVEsRUF1SVAsQ0FBQztBQUNYLFNBQVMsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7O0lDdklOLElBQUk7QUFDRyxVQURQLElBQUksR0FDaUI7TUFBYixNQUFNLGdDQUFHLEVBQUU7O3dCQURuQixJQUFJOztBQUVSLE1BQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLE1BQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzlCLE1BQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFdEIsU0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0VBQ2pCOzs7Ozs7O0FBUEksS0FBSSxXQWFULFVBQVUsR0FBQyxzQkFBRztBQUNiLFVBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJO0FBQ3ZCLFFBQUssTUFBTTtBQUFFLFdBQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUFBLEFBQ3hELFFBQUssU0FBUztBQUFFLFdBQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUFBLEFBQzlELFFBQUssTUFBTTtBQUFFLFdBQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUFBLEFBQ3hEO0FBQVMsV0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQUEsR0FDcEQ7RUFDRDs7Ozs7O0FBcEJJLEtBQUksV0F5QlQsY0FBYyxHQUFDLDBCQUFHO0FBQ2pCLE1BQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFFLElBQUksQ0FBQyxNQUFNLENBQUUsQ0FBQztBQUNwQyxNQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztFQUNoRDs7UUE1QkksSUFBSTs7O3FCQStCSyxJQUFJOzs7Ozs7Ozs7Ozs7OztJQy9CYixNQUFNO0FBQ0MsVUFEUCxNQUFNLENBQ0UsTUFBTSxFQUFFO3dCQURoQixNQUFNOztBQUVWLE1BQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN4QixNQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLE1BQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkQsTUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQzNCLE1BQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNoQyxNQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDcEMsTUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3BDLE1BQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN2RSxNQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztBQUMxQixNQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztFQUN0Qjs7QUFaSSxPQUFNLFdBY1gsSUFBSSxHQUFDLGdCQUFHO0FBQ1AsTUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0VBQ2pCOzs7Ozs7O0FBaEJJLE9BQU0sV0FzQlgsV0FBVyxHQUFDLHFCQUFDLEtBQUssRUFBRTs7O0FBQ25CLE9BQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFdkIsT0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDZixJQUFJLENBQUMsVUFBQSxRQUFRO1VBQUksUUFBUSxDQUFDLElBQUksRUFBRTtHQUFBLENBQUMsQ0FDakMsSUFBSSxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ2IsU0FBSyxlQUFlLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUN0QyxTQUFLLGFBQWEsR0FBRyxNQUFLLGVBQWUsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM1RSxTQUFLLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzFDLFNBQUssTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDM0MsV0FBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDakQsU0FBSyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVyQixPQUFJLE1BQUssUUFBUSxFQUFFO0FBQUUsVUFBSyxRQUFRLE9BQU0sQ0FBQztJQUFFO0dBQzNDLENBQUMsQ0FBQztFQUNIOzs7Ozs7O0FBckNJLE9BQU0sV0E0Q1gsV0FBVyxHQUFDLHFCQUFDLEtBQUssRUFBRTtBQUNuQixNQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN6RSxNQUFJLFVBQVUsR0FBSSxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDN0MsTUFBSSxRQUFRLEdBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7O0FBRXJDLE1BQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxZQUFZLElBQUksVUFBVSxJQUFJLFFBQVEsRUFBRTs7QUFFNUQsT0FBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDOztBQUV0QyxPQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3RELE9BQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVyQyxXQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztHQUNwRDtFQUNEOzs7Ozs7O0FBMURJLE9BQU0sV0FnRVgsa0JBQWtCLEdBQUMsNEJBQUMsS0FBSyxFQUFFO0FBQzFCLE1BQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUV6RSxNQUFJLFlBQVksRUFBRTtBQUNqQixPQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3hCLE1BQ0k7QUFDSixPQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3hCO0VBQ0Q7Ozs7OztBQXpFSSxPQUFNLFdBOEVYLFNBQVMsR0FBQyxxQkFBRztBQUNaLE1BQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN4RSxRQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDaEU7O1FBakZJLE1BQU07OztxQkFvRkcsTUFBTTs7Ozs7Ozs7Ozs7OzJCQ3RGVSxpQkFBaUI7Ozs7Ozs7SUFNMUMsYUFBYTtBQUNOLFVBRFAsYUFBYSxDQUNMLFNBQVMsRUFBRSxPQUFPLEVBQUU7d0JBRDVCLGFBQWE7O0FBRWpCLE1BQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLE1BQUksQ0FBQyxXQUFXLEdBQUc7QUFDbEIsU0FBTSxFQUFFLDBDQUEwQztHQUNsRCxDQUFDO0FBQ0YsTUFBSSxDQUFDLFVBQVUsR0FBRztBQUNqQixlQUFZLEVBQUUsdUJBQXVCO0FBQ3JDLHFCQUFrQixFQUFFLElBQUksQ0FBQyxVQUFVO0FBQ25DLGNBQVcsRUFBRSxzQkFBc0I7QUFDbkMsU0FBTSxFQUFFLHVCQUF1QjtBQUMvQixRQUFLLEVBQUUsV0FBVztBQUNsQixlQUFZLEVBQUUsS0FBSztHQUNuQixDQUFDO0FBQ0YsTUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZELE1BQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQ3pCLE1BQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLE1BQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNqQixNQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7RUFDdEI7Ozs7OztBQW5CSSxjQUFhLFdBd0JsQixNQUFNLEdBQUMsa0JBQUc7QUFDVCxNQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQ3RCOzs7Ozs7O0FBMUJJLGNBQWEsV0FnQ2xCLEdBQUcsR0FBQyxhQUFDLElBQUksRUFBRTtBQUNWLE1BQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFFLElBQUksQ0FBRSxDQUFDO0FBQzlCLE1BQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztFQUN0Qjs7Ozs7OztBQW5DSSxjQUFhLFdBeUNsQixNQUFNLEdBQUMsZ0JBQUMsSUFBSSxFQUFFO0FBQ2IsTUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUUsSUFBSSxDQUFFLENBQUM7QUFDNUIsTUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQ2Q7Ozs7Ozs7QUE1Q0ksY0FBYSxXQWtEbEIsS0FBSyxHQUFDLGVBQUMsSUFBSSxFQUFFO0FBQ1osTUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUUsSUFBSSxDQUFFLENBQUM7RUFDM0I7Ozs7Ozs7QUFwREksY0FBYSxXQTBEbEIsT0FBTyxHQUFDLGlCQUFDLElBQUksRUFBRTtBQUNkLE1BQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFFLElBQUksQ0FBRSxDQUFDO0VBQzdCOzs7Ozs7QUE1REksY0FBYSxXQWlFbEIsY0FBYyxHQUFDLDBCQUFHOzs7QUFDakIsTUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUMzQyxPQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3ZCLE9BQUksT0FBTyxHQUFHLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxNQUFLLFdBQVcsQ0FBQyxDQUFDO0FBQ3RELFNBQUssT0FBTyxDQUFDLHFCQUFxQixDQUFFLE9BQU8sQ0FBRSxDQUFDO0FBQzlDLFVBQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLE1BQUssZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FDL0QsQ0FBQyxDQUFDO0VBQ0g7Ozs7OztBQXhFSSxjQUFhLFdBNkVsQixTQUFTLEdBQUMscUJBQUc7QUFDWixRQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxRSxRQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxRSxRQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM1RSxNQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDNUU7Ozs7OztBQWxGSSxjQUFhLFdBdUZsQixrQkFBa0IsR0FBQyw4QkFBRzs7O0FBQ3JCLFFBQU0sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQzFCLE1BQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN4QyxZQUFVLENBQUMsWUFBTTtBQUNoQixVQUFLLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztHQUN6RCxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQ1I7Ozs7Ozs7QUE3RkksY0FBYSxXQW1HbEIsbUJBQW1CLEdBQUMsNkJBQUMsS0FBSyxFQUFFO0FBQzNCLE1BQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLGtCQUFnQixLQUFLLENBQUMsTUFBTSxRQUFLLENBQUM7OztBQUduRSxNQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO0FBQy9CLFNBQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLE9BQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUN6Qzs7O0FBR0QsTUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLGFBQWEsRUFBRTtBQUMvRCxPQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzs7QUFFMUIsT0FBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtBQUMvQixRQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZCxpQkF4SEssY0FBYyxFQXdISCxDQUFDO0lBQ2pCOztBQUVELE9BQUksS0FBSyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUU7QUFDakMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQjtHQUNELE1BRUksSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFO0FBQ3JELE9BQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM5QyxPQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckIsT0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZDLE9BQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0dBQzFCO0VBQ0Q7Ozs7OztBQWhJSSxjQUFhLFdBcUlsQixnQkFBZ0IsR0FBQyw0QkFBRztBQUNuQixNQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUU7QUFDdEIsT0FBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ2YsTUFBTTtBQUNOLE9BQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztHQUNkO0VBQ0Q7O1FBM0lJLGFBQWE7OztxQkE4SUosYUFBYTs7Ozs7Ozs7Ozs2QkN0SkgsbUJBQW1COzs7Ozs7O0lBTXRDLFFBQVE7QUFDRixVQUROLFFBQVEsR0FDQzt3QkFEVCxRQUFROztBQUVaLE1BQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLE1BQUksQ0FBQyxJQUFJLGtCQVRGLFFBQVEsQUFTSyxDQUFDO0FBQ3JCLE1BQUksQ0FBQyxPQUFPLEdBQUcsaUNBQWlDLENBQUM7RUFDakQ7O0FBTEksU0FBUSxXQU9iLEtBQUssR0FBQSxpQkFBcUI7TUFBcEIsR0FBRyxnQ0FBRyxJQUFJLENBQUMsT0FBTzs7QUFDdkIsTUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDMUIsTUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0VBQ1o7O0FBVkksU0FBUSxXQVliLElBQUksR0FBQSxnQkFBRzs7O0FBQ04sTUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQzdDLE1BQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN0QyxZQUFVLENBQUMsWUFBTTtBQUNoQixTQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3pDLFNBQUssSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7R0FDM0IsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDbEI7O0FBbkJJLFNBQVEsV0FxQmIsZUFBZSxHQUFBLDJCQUFHO0FBQ2pCLE1BQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEMsR0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzNCLFNBQU8sQ0FBQyxDQUFDO0VBQ1Q7O1FBekJJLFFBQVE7OztxQkE0QkMsUUFBUTs7Ozs7Ozs7Ozs7Ozs7O0lDN0JqQixLQUFLO0FBQ0UsVUFEUCxLQUFLLENBQ0csSUFBSSxFQUFFO3dCQURkLEtBQUs7O0FBRVQsTUFBSSxFQUFFLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFBLEFBQUMsRUFBRTtBQUM3QixTQUFNLElBQUksS0FBSyw0Q0FBMkMsQ0FBQztHQUMzRDs7QUFFRCxNQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixNQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixNQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNwQixNQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztFQUMzQjs7Ozs7OztBQVZJLE1BQUssV0FnQlYsT0FBTyxHQUFDLG1CQUFHO0FBQ1YsTUFBSSxJQUFJLEdBQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUN6QixNQUFJLFNBQVMsR0FBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDakMsTUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3BDLE1BQUksV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNwQyxNQUFJLFFBQVEsR0FBSSxFQUFFLENBQUM7OztBQUduQixNQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxFQUFFO0FBQzFCLE9BQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN2QixZQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQztBQUNELFlBQVMsR0FBRyxBQUFDLFNBQVMsR0FBRyxFQUFFLEdBQUksU0FBUyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7R0FDbkQ7OztBQUdELE1BQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtBQUFFLFlBQVMsU0FBTyxTQUFTLEFBQUUsQ0FBQztHQUFFO0FBQ3BELE1BQUksV0FBVyxHQUFHLEVBQUUsRUFBRTtBQUFFLGNBQVcsU0FBTyxXQUFXLEFBQUUsQ0FBQztHQUFFO0FBQzFELE1BQUksV0FBVyxHQUFHLEVBQUUsRUFBRTtBQUFFLGNBQVcsU0FBTyxXQUFXLEFBQUUsQ0FBQztHQUFFOztBQUUxRCxTQUFVLFNBQVMsU0FBSSxXQUFXLFNBQUksV0FBVyxTQUFJLFFBQVEsQ0FBRztFQUNoRTs7Ozs7Ozs7QUFyQ0ksTUFBSyxXQTRDVixlQUFlLEdBQUMseUJBQUMsSUFBSSxFQUFFO0FBQ3RCLE1BQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQzdCLE9BQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDeEI7O0FBRUQsU0FBTyxBQUFDLElBQUksSUFBSSxFQUFFLEdBQUksSUFBSSxHQUFHLElBQUksQ0FBQztFQUNsQzs7Ozs7OztBQWxESSxNQUFLLFdBd0RWLGFBQWEsR0FBQyx1QkFBQyxNQUFNLEVBQUU7QUFDdEIsTUFBSSxNQUFNLEVBQUU7QUFDWCxPQUFJLENBQUMsTUFBTSxHQUFHLEFBQUMsTUFBTSxDQUFDLE1BQU0sR0FBSSxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDNUQsT0FBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO0dBQzFDO0FBQ0QsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0VBQ1g7Ozs7Ozs7O0FBOURJLE1BQUssV0FxRVYsR0FBRyxHQUFDLGVBQUc7OztBQUNOLE1BQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFdkMsYUFBVyxDQUFDLFlBQU07QUFDakIsU0FBSyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQUssT0FBTyxFQUFFLENBQUM7R0FDdkMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWhCLFNBQU8sSUFBSSxDQUFDLElBQUksQ0FBQztFQUNqQjs7UUE3RUksS0FBSzs7O3FCQWdGSSxLQUFLOzs7Ozs7O0FDckZiLElBQU0sYUFBYSxHQUFHLGVBQWUsQ0FBQztRQUFoQyxhQUFhLEdBQWIsYUFBYTtBQUNuQixJQUFNLFFBQVEsR0FBSSxZQUFZLENBQUM7UUFBekIsUUFBUSxHQUFSLFFBQVE7QUFDZCxJQUFNLFVBQVUsR0FBSSxZQUFZLENBQUM7UUFBM0IsVUFBVSxHQUFWLFVBQVU7QUFDaEIsSUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDO1FBQTVCLGFBQWEsR0FBYixhQUFhOzs7Ozs7QUNIbkIsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUE1QyxLQUFLLEdBQUwsS0FBSztBQUNULElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7UUFBOUMsTUFBTSxHQUFOLE1BQU07QUFDVixJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQWxELFFBQVEsR0FBUixRQUFRO0FBQ1osSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUFoRCxPQUFPLEdBQVAsT0FBTztBQUNYLElBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUE3RCxjQUFjLEdBQWQsY0FBYztBQUNsQixJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFBdkQsVUFBVSxHQUFWLFVBQVU7QUFDZCxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFBbkQsT0FBTyxHQUFQLE9BQU87QUFDWCxJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQXhELGFBQWEsR0FBYixhQUFhO0FBQ2pCLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7UUFBbEQsUUFBUSxHQUFSLFFBQVE7Ozs7Ozs7eUJDUnNDLGFBQWE7Ozs7OztBQU10RSxJQUFNLGFBQWEsR0FBRyxTQUFoQixhQUFhLEdBQWU7QUFDakMsS0FBSSxRQUFRLEdBQUcsS0FBSyxDQUFDOztBQUVyQixLQUFJLFlBQVksWUFUUixhQUFhLENBU1UsRUFBRTtBQUNoQyxNQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksWUFWL0IsYUFBYSxDQVVpQyxDQUFDLENBQUM7QUFDdkQsVUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO0VBQzVCOztBQUVELFFBQU8sUUFBUSxDQUFDO0NBQ2hCLENBQUM7Ozs7O0FBS0YsSUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBYyxHQUFlO0FBQ2xDLEtBQUksQ0FBQyxZQUFZLFlBckJNLFVBQVUsQ0FxQkosRUFBRTtBQUM5QixjQUFZLFlBdEJVLFVBQVUsQ0FzQlIsR0FBRyxJQUFJLENBQUM7RUFDaEM7Q0FDRCxDQUFDOzs7OztBQUtGLElBQU0sa0JBQWtCLEdBQUcsU0FBckIsa0JBQWtCLEdBQWU7QUFDdEMsS0FBSSxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzVCLE1BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDeEQsTUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDaEQsV0FBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7R0FDN0Q7RUFDRDtDQUNELENBQUM7Ozs7O0FBS0YsSUFBTSxzQkFBc0IsR0FBRyxTQUF6QixzQkFBc0IsR0FBZTtBQUMxQyxLQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksWUExQzlCLGFBQWEsQ0EwQ2dDLENBQUMsQ0FBQzs7O0FBR3ZELG1CQUFrQixFQUFFLENBQUM7QUFDckIsU0FBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxZQUFVLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFHLENBQUM7O0FBRTdELEtBQUksYUFBYSxFQUFFLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7QUFDaEQsVUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7RUFDL0M7Q0FDRCxDQUFDOzs7Ozs7QUFNRixJQUFNLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixDQUFhLEtBQUssRUFBRTtBQUM5QyxTQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFlBQVUsS0FBSyxDQUFHLENBQUM7Q0FDOUMsQ0FBQzs7Ozs7O0FBTUYsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQWEsS0FBSyxFQUFFO0FBQ2pDLEtBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO0FBQ3hDLE9BQUssY0FuRTZCLGFBQWEsQUFtRTFCLENBQUM7RUFDdEI7O0FBRUQsS0FBSSxhQUFhLEVBQUUsRUFBRTtBQUNwQix3QkFBc0IsRUFBRSxDQUFDO0VBQ3pCLE1BQU07QUFDTix1QkFBcUIsQ0FBRSxLQUFLLENBQUUsQ0FBQztFQUMvQjtDQUNELENBQUM7O1FBR0QsYUFBYSxHQUFiLGFBQWE7UUFDYixjQUFjLEdBQWQsY0FBYztRQUNkLFFBQVEsR0FBUixRQUFRO1FBQ1IscUJBQXFCLEdBQXJCLHFCQUFxQjtRQUNyQixzQkFBc0IsR0FBdEIsc0JBQXNCOzs7Ozs7OzhCQ2xGc0Isb0JBQW9COzsyQkFDekIsaUJBQWlCOzs7Ozs7QUFNekQsSUFBSSxXQUFXLEdBQUcsU0FBZCxXQUFXLENBQWEsS0FBSyxFQUFFO0FBQ2xDLEtBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs7O0FBR25GLEtBQUksUUFBUSxHQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxpQkFYakMsYUFBYSxDQVdtQyxDQUFDLENBQUM7OztBQUcxRCxLQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRTtBQUNwQixVQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsS0FBSyxrQkFmRixhQUFhLEFBZUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUM7RUFDNUQ7OztBQUdELEtBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsRUFBRTtBQUNyRCxVQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0VBQ3hFOzs7QUFHRCxLQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLHVCQUF1QixFQUFFO0FBQ2hELFVBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQztFQUNyRDs7QUFFRCxhQUFZLENBQUMsT0FBTyxpQkE1QlosYUFBYSxFQTRCZSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDOUQsY0E1QnVCLFFBQVEsRUE0QnJCLENBQUM7Q0FDWCxDQUFDOzs7Ozs7QUFNRixJQUFJLGdCQUFnQixHQUFHLFNBQW5CLGdCQUFnQixDQUFhLEtBQUssRUFBRTtBQUN2QyxLQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQy9FLEtBQUksWUFBWSxHQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDeEUsS0FBSSxVQUFVLEdBQUssS0FBSyxDQUFDO0FBQ3pCLEtBQUksWUFBWSxHQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxpQkF4Q25DLGFBQWEsQ0F3Q3FDLENBQUMsQ0FBQzs7O0FBRzVELEtBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssc0JBQXNCLEVBQUU7QUFDL0MsTUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUU7QUFDNUIsYUFBVSxHQUFHLEtBQUssQ0FBQztBQUNuQixlQUFZLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztHQUM5QixNQUNJLElBQUksY0FBYyxDQUFDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUU7QUFDMUQsZUFBWSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDN0IsZUFBWSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7R0FDN0I7O0FBRUQsTUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7QUFDbEUsY0FBWSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDckMsY0FBWSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDO0VBQ2xEOzs7QUFHRCxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssZ0JBQWdCLEVBQUU7QUFDbkUsTUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsZUFBZSxFQUFFLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ25GLGNBQVksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQztFQUNsRDs7QUFFRCxhQUFZLENBQUMsT0FBTyxpQkFoRVosYUFBYSxFQWdFZSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Q0FDbEUsQ0FBQzs7Ozs7QUFLRixJQUFJLHNCQUFzQixHQUFHLFNBQXpCLHNCQUFzQixHQUFlO0FBQ3hDLEtBQUksV0FBVyxHQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDdEUsS0FBSSxZQUFZLEdBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN4RSxLQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQy9FLEtBQUksWUFBWSxHQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDeEUsS0FBSSxhQUFhLEdBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNoRixLQUFJLFlBQVksR0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksaUJBNUVuQyxhQUFhLENBNEVxQyxDQUFDLENBQUM7OztBQUc1RCxLQUFJLFlBQVksQ0FBQyxVQUFVLEtBQUssS0FBSyxFQUFFO0FBQ3RDLGdCQUFjLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztFQUMvQjtBQUNELGFBQVksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQztBQUNsRCxhQUFZLENBQUMsUUFBUSxHQUFHLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQzs7O0FBR3BELEtBQUksYUFyRkksYUFBYSxFQXFGRixFQUFFO0FBQ3BCLGVBQWEsQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7RUFDckQ7OztBQUdELFlBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbkUsYUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Q0FDL0QsQ0FBQzs7cUJBRWEsc0JBQXNCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIEltcG9ydCBkZXBlbmRlbmNpZXMgKi9cbmltcG9ydCB7IHRpbWVyLCBvcGVuRGlhbG9nLCBkaWFsb2csIG5ld0NhcmQsIGNvbnRlbnQsIGNvbnRlbnRPdmVybGF5IH0gZnJvbSAnLi91dGlscy9lbGVtZW50cyc7XG5pbXBvcnQgeyBCUk9XX1NFVFRJTkdTLCBCUk9XX0NBUkRTIH0gZnJvbSAnLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHsgc2V0VGhlbWUgfSBmcm9tICcuL3V0aWxzL2hlbHBlcic7XG5pbXBvcnQgZGlhbG9nU2V0dGluZ3NDYWxsYmFjayBmcm9tICcuL3ZpZXdzL2RpYWxvZy5zZXR0aW5ncyc7XG5pbXBvcnQgVGltZXIgZnJvbSAnLi9tb2R1bGVzL3RpbWVyJztcbmltcG9ydCBEaWFsb2cgZnJvbSAnLi9tb2R1bGVzL2RpYWxvZyc7XG5pbXBvcnQgQ2FyZCBmcm9tICcuL21vZHVsZXMvY2FyZCc7XG5pbXBvcnQgTGF5b3V0TWFuYWdlciBmcm9tICcuL21vZHVsZXMvbGF5b3V0bWFuYWdlcic7XG5cbi8qIFZhcmlhYmxlcyAqL1xubGV0IGJyb3dUaW1lciA9IG51bGw7XG5sZXQgYnJvd0dyaWQgPSBudWxsO1xuXG4vKipcbiAqXHRAZGVzY3JpcHRpb24gVmFsaWRhdGVzIHRoZSB1c2VycyB0aW1lciBzZXR0aW5ncy5cbiAqL1xubGV0IHZhbGlkYXRlVGltZXIgPSBmdW5jdGlvbiAoKSB7XG5cdGJyb3dUaW1lciA9IG5ldyBUaW1lcih0aW1lcik7XG5cdGxldCBkYXRlU2V0dGluZ3MgPSB7IGRhdGVGb3JtYXQ6IG51bGwsIGFiYnJldmlhdGlvbnM6IGZhbHNlIH07XG5cblx0aWYgKCFsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pIHtcblx0XHRkYXRlU2V0dGluZ3MuZGF0ZUZvcm1hdCA9ICcyNGgnO1xuXHRcdGJyb3dUaW1lci5zZXREYXRlRm9ybWF0KHtcblx0XHRcdCdmb3JtYXQnOiBkYXRlU2V0dGluZ3MuZGF0ZUZvcm1hdFxuXHRcdH0pO1xuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKEJST1dfU0VUVElOR1MsIEpTT04uc3RyaW5naWZ5KGRhdGVTZXR0aW5ncykpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdGRhdGVTZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKTtcblx0XHRicm93VGltZXIuc2V0RGF0ZUZvcm1hdCh7XG5cdFx0XHQnZm9ybWF0JzogZGF0ZVNldHRpbmdzLmRhdGVGb3JtYXQsXG5cdFx0XHQnYWJicmV2aWF0aW9ucyc6IGRhdGVTZXR0aW5ncy5hYmJyZXZpYXRpb25zXG5cdFx0fSk7XG5cdH1cblxuXHRicm93VGltZXIucnVuKCk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0QWRkcyBhbGwgZGlhbG9nLlxuICovXG5sZXQgaW5pdERpYWxvZ3MgPSBmdW5jdGlvbiAoKSB7XG5cdGxldCBjdXJyZW50TG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zbGljZSgwLCAtMSk7XG5cblx0W10uZm9yRWFjaC5jYWxsKG9wZW5EaWFsb2csIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0bGV0IGRpYWxvZ0NvbnRlbnRcdD0gaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGlhbG9nJyk7XG5cdFx0bGV0IGRpYWxvZ0NhbGxiYWNrID0gZmFsc2U7XG5cblx0XHRpZiAoZGlhbG9nQ29udGVudCA9PT0gJ3NldHRpbmdzJykge1xuXHRcdFx0ZGlhbG9nQ2FsbGJhY2sgPSBkaWFsb2dTZXR0aW5nc0NhbGxiYWNrO1xuXHRcdH1cblxuXHRcdGxldCBicm93RGlhbG9nID0gbmV3IERpYWxvZyh7XG5cdFx0XHRlbGVtOiBpdGVtLFxuXHRcdFx0ZGlhbG9nRWxlbTogZGlhbG9nLFxuXHRcdFx0Y29udGVudDogYCR7Y3VycmVudExvY2F0aW9ufS9tYXJrdXAvZGlhbG9nLSR7ZGlhbG9nQ29udGVudH0uaHRtbGAsXG5cdFx0XHRjYWxsYmFjazogZGlhbG9nQ2FsbGJhY2ssXG5cdFx0XHRwYXJhbXM6IHsgVGltZXIgfVxuXHRcdH0pO1xuXG5cdFx0YnJvd0RpYWxvZy5pbml0KCk7XG5cdH0pO1xufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdEdldHMgbG9jYWxTdG9yYWdlLCBwYXJzZXMgYXZhaWxhYmxlIGNhcmRzIGFuZCBjcmVhdGVzIHRoZW0uXG4gKiBAcGFyYW1cdFx0XHR7TnVtYmVyfFN0cmluZ30gaW5kZXhcbiAqL1xubGV0IHBhcnNlQ2FyZHNGcm9tU3RvcmFnZSA9IGZ1bmN0aW9uIChpbmRleCkge1xuXHRsZXQgc3RvcmFnZUl0ZW0gPSBKU09OLnBhcnNlKFxuXHRcdGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBsb2NhbFN0b3JhZ2Uua2V5KGluZGV4KSApXG5cdCk7XG5cblx0aWYgKHN0b3JhZ2VJdGVtLm1vZHVsZSkge1xuXHRcdGxldCBicm93Q2FyZCA9IG5ldyBDYXJkKHtcblx0XHRcdHR5cGU6IHN0b3JhZ2VJdGVtLnR5cGUsXG5cdFx0XHRndWlkOiBzdG9yYWdlSXRlbS5ndWlkLFxuXHRcdFx0Y29udGVudDogc3RvcmFnZUl0ZW0uY29udGVudCxcblx0XHRcdHN0eWxlOiBzdG9yYWdlSXRlbS5zdHlsZVxuXHRcdH0pO1xuXHRcdGNvbnRlbnQuYXBwZW5kQ2hpbGQoIGJyb3dDYXJkICk7XG5cdH1cbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRDYWxscyB0aGUgTGF5b3V0TWFuYWdlciBjbGFzcy5cbiAqL1xubGV0IGluaXRMYXlvdXRNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuXHRicm93R3JpZCA9IG5ldyBMYXlvdXRNYW5hZ2VyKCBjb250ZW50LCBjb250ZW50T3ZlcmxheSApO1xuXHRicm93R3JpZC5sYXlvdXQoKTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRDaGVja3MgbG9jYWxTdG9yYWdlIGFuZCBsb2FkcyB0aGUgdXNlcnMgY2FyZHNcbiAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IHN0b3JhZ2VcbiAqL1xubGV0IHZhbGlkYXRlQnJvd0NhcmRzID0gZnVuY3Rpb24gKCkge1xuXHRpZiAoIWxvY2FsU3RvcmFnZVtCUk9XX0NBUkRTXSB8fCBsb2NhbFN0b3JhZ2UubGVuZ3RoIDw9IDEpIHtcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShCUk9XX0NBUkRTLCB0cnVlKTtcblx0XHRsZXQgZGVmYXVsdENhcmQgPSBuZXcgQ2FyZCh7IHR5cGU6ICd0ZXh0JyB9KTtcblx0XHRjb250ZW50LmFwcGVuZENoaWxkKCBkZWZhdWx0Q2FyZCApO1xuXHR9IGVsc2Uge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRwYXJzZUNhcmRzRnJvbVN0b3JhZ2UoaSk7XG5cdFx0fVxuXHR9XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGNsaWNrZWQgY2FyZCB0eXBlIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBET00uXG4gKiBAcGFyYW1cdFx0XHR7T2JqZWN0fSBldmVudFxuICovXG5sZXQgYWRkTmV3Q2FyZCA9IGZ1bmN0aW9uIChldmVudCkge1xuXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdGxldCBzZWxlY3RlZENhcmQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1jcmVhdGUtY2FyZCcpO1xuXHRsZXQgYnJvd0NhcmQgPSBuZXcgQ2FyZCh7IHR5cGU6IGAke3NlbGVjdGVkQ2FyZH1gIH0pO1xuXG5cdGNvbnRlbnQuYXBwZW5kQ2hpbGQoIGJyb3dDYXJkICk7XG5cdGJyb3dHcmlkLmFkZCggYnJvd0NhcmQgKTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRCaW5kIGV2ZW50cyB0byBlbGVtZW50cy5cbiAqL1xubGV0IGFkZEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcblx0W10uZm9yRWFjaC5jYWxsKG5ld0NhcmQsIChpdGVtKSA9PiB7XG5cdFx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZE5ld0NhcmQpO1xuXHR9KTtcbn07XG5cbi8qIEluaXRpYWxpc2UgYXBwICovXG53aW5kb3cuaXNFZGl0TW9kZSA9IGZhbHNlO1xudmFsaWRhdGVCcm93Q2FyZHMoKTtcbnZhbGlkYXRlVGltZXIoKTtcbmluaXRMYXlvdXRNYW5hZ2VyKCk7XG5pbml0RGlhbG9ncygpO1xuc2V0VGhlbWUoKTtcbmFkZEV2ZW50cygpOyIsIi8qKlxuICogQG5hbWVcdFx0XHRcdENhcmRcbiAqIEBkZXNjcmlwdGlvblx0L1xuICovXG5jbGFzcyBDYXJkIHtcblx0Y29uc3RydWN0b3IgKGNvbmZpZyA9IHt9KSB7XG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XG5cdFx0dGhpcy5lbGVtID0gdGhpcy5jcmVhdGVDYXJkKCk7XG5cdFx0dGhpcy5pbml0aWFsaXNlQ2FyZCgpO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWxlbTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdFJldHVybnMgYSBuZXcgY2FyZCBlbGVtZW50LlxuXHQgKiBAcmV0dXJuIFx0XHRcdHtIVE1MRWxlbWVudH1cblx0ICovXG5cdGNyZWF0ZUNhcmQgKCkge1xuXHRcdHN3aXRjaCAodGhpcy5jb25maWcudHlwZSkge1xuXHRcdFx0Y2FzZSAndGV4dCc6IHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0LWNhcmQnKTtcblx0XHRcdGNhc2UgJ3dlYXRoZXInOiByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnd2VhdGhlci1jYXJkJyk7XG5cdFx0XHRjYXNlICd0b2RvJzogcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RvZG8tY2FyZCcpO1xuXHRcdFx0ZGVmYXVsdDogcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHQtY2FyZCcpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdEFwcGxpZXMgY2xhc3MgZWxlbWVudCBhbmQgY2FsbHMgaW5pdGlhbGlzZSgpLlxuXHQgKi9cblx0aW5pdGlhbGlzZUNhcmQgKCkge1xuXHRcdHRoaXMuZWxlbS5pbml0aWFsaXNlKCB0aGlzLmNvbmZpZyApO1xuXHRcdHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdicm93LWNvbnRlbnRfX21vZHVsZScpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmQ7IiwiLyoqXG4gKiBAbmFtZVx0XHRcdFx0RGlhbG9nXG4gKiBAZGVzY3JpcHRpb25cdFNob3dzL2hpZGVzIHRoZSBkaWFsb2cuXG4gKi9cbmNsYXNzIERpYWxvZyB7XG5cdGNvbnN0cnVjdG9yIChjb25maWcpIHtcblx0XHR0aGlzLmVsZW0gPSBjb25maWcuZWxlbTtcblx0XHR0aGlzLmJ1dHRvblx0PSB0aGlzLmVsZW0uY2hpbGRyZW5bMF07XG5cdFx0dGhpcy5pbml0QnV0dG9uSWNvbiA9IHRoaXMuYnV0dG9uLmdldEF0dHJpYnV0ZSgnaWNvbicpO1xuXHRcdHRoaXMucGF0aCA9IGNvbmZpZy5jb250ZW50O1xuXHRcdHRoaXMuY2FsbGJhY2sgPSBjb25maWcuY2FsbGJhY2s7XG5cdFx0dGhpcy5jYWxsYmFja1BhcmFtcyA9IGNvbmZpZy5wYXJhbXM7XG5cdFx0dGhpcy5kaWFsb2dFbGVtID0gY29uZmlnLmRpYWxvZ0VsZW07XG5cdFx0dGhpcy5kaWFsb2dDb250YWluZXJcdD0gdGhpcy5kaWFsb2dFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2dfX2lubmVyJyk7XG5cdFx0dGhpcy5kaWFsb2dDb250ZW50ID0gbnVsbDtcblx0XHR0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG5cdH1cblxuXHRpbml0ICgpIHtcblx0XHR0aGlzLmFkZEV2ZW50cygpO1xuXHR9XG5cblx0LyoqXG5cdCAqXHRAZGVzY3JpcHRpb25cdExvYWRzIHRoZSBjb250ZW50XG5cdCAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IGV2ZW50XG5cdCAqL1xuXHRsb2FkQ29udGVudCAoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0ZmV0Y2godGhpcy5wYXRoKVxuXHRcdC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLnRleHQoKSlcblx0XHQudGhlbihib2R5ID0+IHtcblx0XHRcdHRoaXMuZGlhbG9nQ29udGFpbmVyLmlubmVySFRNTCA9IGJvZHk7XG5cdFx0XHR0aGlzLmRpYWxvZ0NvbnRlbnQgPSB0aGlzLmRpYWxvZ0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nX19jb250ZW50Jyk7XG5cdFx0XHR0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2ljb24nLCAnY2xvc2UnKTtcblx0XHRcdHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZSgnY29sb3InLCAnd2hpdGUnKTtcblx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnZGlhbG9nLWlzLXZpc2libGUnKTtcblx0XHRcdHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuXG5cdFx0XHRpZiAodGhpcy5jYWxsYmFjaykgeyB0aGlzLmNhbGxiYWNrKHRoaXMpOyB9XG5cdFx0fSk7XG5cdH1cblxuXG5cdC8qKlxuXHQgKlx0QGRlc2NyaXB0aW9uXHRDbG9zZXMgdGhlIGRpYWxvZ1xuXHQgKiBAcGFyYW1cdFx0XHR7T2JqZWN0fSBldmVudFxuXHQqL1xuXHRjbG9zZURpYWxvZyAoZXZlbnQpIHtcblx0XHRsZXQgYm9keUhhc0NsYXNzXHQ9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWFsb2ctaXMtdmlzaWJsZScpO1xuXHRcdGxldCBpc0Nsb3NlQnRuXHRcdD0gZXZlbnQudGFyZ2V0ID09PSB0aGlzLmVsZW07XG5cdFx0bGV0IGlzRVNDS2V5XHRcdD0gZXZlbnQua2V5Q29kZSA9PT0gMjc7XG5cblx0XHRpZiAodGhpcy5pc0FjdGl2ZSAmJiBib2R5SGFzQ2xhc3MgJiYgaXNDbG9zZUJ0biB8fCBpc0VTQ0tleSkge1xuXHRcdFx0Ly8gQ2xlYXIgRE9NXG5cdFx0XHR0aGlzLmRpYWxvZ0NvbnRhaW5lci5pbm5lckhUTUwgPSBudWxsO1xuXHRcdFx0Ly8gUmVzZXQgYnV0dG9uXG5cdFx0XHR0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2ljb24nLCB0aGlzLmluaXRCdXR0b25JY29uKTtcblx0XHRcdHRoaXMuYnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnY29sb3InKTtcblx0XHRcdC8vIFJlbW92ZSBjbGFzc1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdkaWFsb2ctaXMtdmlzaWJsZScpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKlx0QGRlc2NyaXB0aW9uXHRWYWxpZGF0ZXMgaWYgZGlhbG9nIGlzIHZpc2libGUgb3Igbm90LCBjbG9zZXMvbG9hZHMgaXQuXG5cdCAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IGV2ZW50XG5cdCAqL1xuXHRsb2FkT3JDbG9zZUNvbnRlbnQgKGV2ZW50KSB7XG5cdFx0bGV0IGRpYWxvZ0lzT3BlbiA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWFsb2ctaXMtdmlzaWJsZScpO1xuXG5cdFx0aWYgKGRpYWxvZ0lzT3Blbikge1xuXHRcdFx0dGhpcy5jbG9zZURpYWxvZyhldmVudCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5sb2FkQ29udGVudChldmVudCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqXHRAZGVzY3JpcHRpb25cdEFkZHMgZXZlbnRzXG5cdCAqL1xuXHRhZGRFdmVudHMgKCkge1xuXHRcdHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMubG9hZE9yQ2xvc2VDb250ZW50LmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5jbG9zZURpYWxvZy5iaW5kKHRoaXMpKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBEaWFsb2c7IiwiLypnbG9iYWxzIFBhY2tlcnksRHJhZ2dhYmlsbHkqL1xuXG5pbXBvcnQgeyBoYXNDdXN0b21DYXJkcyB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5cbi8qKlxuICogQG5hbWVcdFx0XHRcdExheW91dE1hbmFnZXJcbiAqIEBkZXNjcmlwdGlvblx0L1xuICovXG5jbGFzcyBMYXlvdXRNYW5hZ2VyIHtcblx0Y29uc3RydWN0b3IgKGNvbnRhaW5lciwgb3ZlcmxheSkge1xuXHRcdHRoaXMudHJhbnNpdGlvbiA9IDA7XG5cdFx0dGhpcy5kcmFnT3B0aW9ucyA9IHtcblx0XHRcdGhhbmRsZTogJy5icm93LWNvbnRlbnRfX21vZHVsZSAvZGVlcC8gLmRyYWdnLWFyZWEnXG5cdFx0fTtcblx0XHR0aGlzLnBrck9wdGlvbnMgPSB7XG5cdFx0XHRpdGVtU2VsZWN0b3I6ICcuYnJvdy1jb250ZW50X19tb2R1bGUnLFxuXHRcdFx0dHJhbnNpdGlvbkR1cmF0aW9uOiB0aGlzLnRyYW5zaXRpb24sXG5cdFx0XHRjb2x1bW5XaWR0aDogJy5icm93LWNvbnRlbnQtLXNpemVyJyxcblx0XHRcdGd1dHRlcjogJy5icm93LWNvbnRlbnQtLWd1dHRlcicsXG5cdFx0XHRzdGFtcDogJy5pcy1zdGFtcCcsXG5cdFx0XHRpc0luaXRMYXlvdXQ6IGZhbHNlXG5cdFx0fTtcblx0XHR0aGlzLnBhY2tlcnkgPSBuZXcgUGFja2VyeShjb250YWluZXIsIHRoaXMucGtyT3B0aW9ucyk7XG5cdFx0dGhpcy5jb250ZW50ID0gY29udGFpbmVyO1xuXHRcdHRoaXMub3ZlcmxheSA9IG92ZXJsYXk7XG5cdFx0dGhpcy5hZGRFdmVudHMoKTtcblx0XHR0aGlzLmFkZERyYWdnYWJpbGx5KCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRXaWxsIGluaXRpYWxpc2UgdGhlIFBhY2tlcnkgbGF5b3V0LlxuXHQgKi9cblx0bGF5b3V0ICgpIHtcblx0XHR0aGlzLnBhY2tlcnkubGF5b3V0KCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRBZGRzIGEgbmV3IGl0ZW0gdG8gdGhlIFBhY2tlcnkgbGF5b3V0LlxuXHQgKiBAcGFyYW0gXHRcdFx0e05vZGVMaXN0fEhUTUxFbGVtZW50fSBlbGVtXG5cdCAqL1xuXHRhZGQgKGVsZW0pIHtcblx0XHR0aGlzLnBhY2tlcnkuYXBwZW5kZWQoIGVsZW0gKTtcblx0XHR0aGlzLmFkZERyYWdnYWJpbGx5KCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRSZW1vdmVzIHBhc3NlZCBlbGVtZW50IGZyb20gdGhlIFBhY2tlcnkgbGF5b3V0LlxuXHQgKiBAcGFyYW0gXHRcdFx0e05vZGVMaXN0fEhUTUxFbGVtZW50fSBjb25maWdcblx0ICovXG5cdHJlbW92ZSAoZWxlbSkge1xuXHRcdHRoaXMucGFja2VyeS5yZW1vdmUoIGVsZW0gKTtcblx0XHR0aGlzLmxheW91dCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0TWFrZXMgYW4gZWxlbWVudCBzdGlja3kuXG5cdCAqIEBwYXJhbSBcdFx0XHR7Tm9kZUxpc3R8SFRNTEVsZW1lbnR9IGNvbmZpZ1xuXHQgKi9cblx0c3RhbXAgKGVsZW0pIHtcblx0XHR0aGlzLnBhY2tlcnkuc3RhbXAoIGVsZW0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdFVuc3RhbXBzIGFuIGVsZW1lbnQuXG5cdCAqIEBwYXJhbSBcdFx0XHR7Tm9kZUxpc3R8SFRNTEVsZW1lbnR9IGNvbmZpZ1xuXHQgKi9cblx0dW5zdGFtcCAoZWxlbSkge1xuXHRcdHRoaXMucGFja2VyeS51bnN0YW1wKCBlbGVtICk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRJbml0aWFsaXNlcyBEcmFnZ2FiaWxseS5cblx0ICovXG5cdGFkZERyYWdnYWJpbGx5ICgpIHtcblx0XHRsZXQgY2FyZHMgPSB0aGlzLnBhY2tlcnkuZ2V0SXRlbUVsZW1lbnRzKCk7XG5cdFx0Y2FyZHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHRcdFx0bGV0IGRyYWdnaWUgPSBuZXcgRHJhZ2dhYmlsbHkoaXRlbSwgdGhpcy5kcmFnT3B0aW9ucyk7XG5cdFx0XHR0aGlzLnBhY2tlcnkuYmluZERyYWdnYWJpbGx5RXZlbnRzKCBkcmFnZ2llICk7XG5cdFx0XHRkcmFnZ2llLm9uKCdwb2ludGVyRG93bicsIHRoaXMudmFsaWRhdGVFZGl0TW9kZS5iaW5kKGRyYWdnaWUpKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdEFkZHMgRXZlbnRMaXN0ZW5lci5cblx0ICovXG5cdGFkZEV2ZW50cyAoKSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NhcmQtZWRpdCcsIHRoaXMudmFsaWRhdGVMYXlvdXRTdGF0ZS5iaW5kKHRoaXMpKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2FyZC1zYXZlJywgdGhpcy52YWxpZGF0ZUxheW91dFN0YXRlLmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjYXJkLXJlbW92ZScsIHRoaXMudmFsaWRhdGVMYXlvdXRTdGF0ZS5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLm92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnZhbGlkYXRlTGF5b3V0U3RhdGUuYmluZCh0aGlzKSk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHREZWFjdGl2YXRlcyBlZGl0TW9kZSBhbmQgcmVtb3ZlcyBjbGFzc2VzIGZyb20gY29udGVudCBvdmVybGF5LlxuXHQgKi9cblx0ZGVhY3RpdmF0ZUVkaXRNb2RlICgpIHtcblx0XHR3aW5kb3cuaXNFZGl0TW9kZSA9IGZhbHNlO1xuXHRcdHRoaXMub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpcy1mYWRpbmcnKTtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHRoaXMub3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJywgJ2lzLWZhZGluZycpO1xuXHRcdH0sIDEwMCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRDaGVja3MgZXZlbnQgdHlwZSBhbmQgdmFsaWRhdGVzIHRoZSBsYXlvdXQncyBzdGF0ZS5cblx0ICogQHBhcmFtICBcdFx0XHR7T2JqZWN0fSBldmVudFxuXHQgKi9cblx0dmFsaWRhdGVMYXlvdXRTdGF0ZSAoZXZlbnQpIHtcblx0XHRsZXQgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWd1aWQ9XCIke2V2ZW50LmRldGFpbH1cIl1gKTtcblxuXHRcdC8vIGFjdGl2YXRlZCBlZGl0aW5nIG1vZGVcblx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NhcmQtZWRpdCcpIHtcblx0XHRcdHdpbmRvdy5pc0VkaXRNb2RlID0gdHJ1ZTtcblx0XHRcdHRoaXMub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpcy12aXNpYmxlJyk7XG5cdFx0fVxuXG5cdFx0Ly8gc2F2ZWQgY2FyZCBvciByZW1vdmUgY2FyZFxuXHRcdGlmIChldmVudC50eXBlID09PSAnY2FyZC1zYXZlJyB8fCBldmVudC50eXBlID09PSAnY2FyZC1yZW1vdmUnKSB7XG5cdFx0XHR0aGlzLmRlYWN0aXZhdGVFZGl0TW9kZSgpO1xuXG5cdFx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NhcmQtc2F2ZScpIHtcblx0XHRcdFx0dGhpcy5sYXlvdXQoKTtcblx0XHRcdFx0aGFzQ3VzdG9tQ2FyZHMoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdjYXJkLXJlbW92ZScpIHtcblx0XHRcdFx0dGhpcy5yZW1vdmUoZWxlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ2NsaWNrJyAmJiB3aW5kb3cuaXNFZGl0TW9kZSkge1xuXHRcdFx0ZWxlbSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcuaXMtZWRpdCcpO1xuXHRcdFx0ZWxlbS5zYXZlVG9TdG9yYWdlKCk7XG5cdFx0XHRlbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2Z4JywgJ2lzLWVkaXQnKTtcblx0XHRcdHRoaXMuZGVhY3RpdmF0ZUVkaXRNb2RlKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGlmIGVkaXRNb2RlIGlzIGFjdGl2ZSBhbmQgd2VpdGhlciBkaXNhYmxlcyBvciBlbmFibGVzIHRoZSBkcmFnZ2luZy5cblx0ICovXG5cdHZhbGlkYXRlRWRpdE1vZGUgKCkge1xuXHRcdGlmICh3aW5kb3cuaXNFZGl0TW9kZSkge1xuXHRcdFx0dGhpcy5kaXNhYmxlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZW5hYmxlKCk7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExheW91dE1hbmFnZXI7IiwiaW1wb3J0IHsgc25hY2tiYXIgfSBmcm9tICcuLi91dGlscy9lbGVtZW50cyc7XG5cbi8qKlxuICogQG5hbWVcdFx0XHRcdFNuYWNrYmFyXG4gKiBAZGVzY3JpcHRpb25cdC9cbiAqL1xuY2xhc3MgU25hY2tiYXIge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmR1cmF0aW9uID0gMjAwMDtcblx0XHR0aGlzLmVsZW0gPSBzbmFja2Jhcjtcblx0XHR0aGlzLm1lc3NhZ2UgPSAnT29vcHMsIHNvbWV0aGluZyB3ZW50IHdyb25nISA6KCc7XG5cdH1cblxuXHRhbGVydChtc2cgPSB0aGlzLm1lc3NhZ2UpIHtcblx0XHR0aGlzLm1lc3NhZ2UgPSBtc2cudHJpbSgpO1xuXHRcdHRoaXMuc2hvdygpO1xuXHR9XG5cblx0c2hvdygpIHtcblx0XHR0aGlzLmVsZW0uaW5uZXJUZXh0ID0gdGhpcy5jcmVhdGVQYXJhZ3JhcGgoKTtcblx0XHR0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnaXMtdmlzaWJsZScpO1xuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcblx0XHRcdHRoaXMuZWxlbS5pbm5lclRleHQgPSBudWxsO1xuXHRcdH0sIHRoaXMuZHVyYXRpb24pO1xuXHR9XG5cblx0Y3JlYXRlUGFyYWdyYXBoKCkge1xuXHRcdGxldCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXHRcdHAuaW5uZXJUZXh0ID0gdGhpcy5tZXNzYWdlO1xuXHRcdHJldHVybiBwO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNuYWNrYmFyOyIsIi8qKlxuICogQG5hbWVcdFx0XHRcdFRpbWVyXG4gKiBAZGVzY3JpcHRpb25cdENsYXNzIHdoaWNoIGFwcGVuZHMgYSB0aW1lIHN0cmluZyB0byBhbiBlbGVtZW50XG4gKiAgICAgICAgICAgICAgXHRhbmQgdXBkYXRlcyBpdCBldmVyeSBzZWNvbmQuXG4gKi9cbmNsYXNzIFRpbWVyIHtcblx0Y29uc3RydWN0b3IgKGVsZW0pIHtcblx0XHRpZiAoIShlbGVtICYmIGVsZW0ubm9kZU5hbWUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFlvdSBoYXZlbid0IHBhc3NlZCBhIHZhbGlkIEhUTUxFbGVtZW50IWApO1xuXHRcdH1cblxuXHRcdHRoaXMudXBkYXRlXHQ9IDEwMDA7XG5cdFx0dGhpcy5lbGVtXHQ9IGVsZW07XG5cdFx0dGhpcy5mb3JtYXQgPSAnMjRoJztcblx0XHR0aGlzLmFiYnJldmlhdGlvbnMgPSBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdENyZWF0ZXMgYSBzdHJpbmcgd2l0aCBjdXJyZW50IHRpbWUgaW4gSEg6TU06U1Ncblx0ICogQHJldHVyblx0XHRcdHtTdHJpbmd9XG5cdCAqL1xuXHRnZXRUaW1lICgpIHtcblx0XHRsZXQgZGF0ZVx0XHRcdFx0PSBuZXcgRGF0ZSgpO1xuXHRcdGxldCBkYXRlSG91cnNcdFx0PSBkYXRlLmdldEhvdXJzKCk7XG5cdFx0bGV0IGRhdGVNaW51dGVzXHQ9IGRhdGUuZ2V0TWludXRlcygpO1xuXHRcdGxldCBkYXRlU2Vjb25kc1x0PSBkYXRlLmdldFNlY29uZHMoKTtcblx0XHRsZXQgZGF0ZUFiYnJcdFx0PSAnJztcblxuXHRcdC8vIElmIHRpbWUgZm9ybWF0IGlzIHNldCB0byAxMmgsIHVzZSAxMmgtc3lzdGVtLlxuXHRcdGlmICh0aGlzLmZvcm1hdCA9PT0gJzEyaCcpIHtcblx0XHRcdGlmICh0aGlzLmFiYnJldmlhdGlvbnMpIHtcblx0XHRcdFx0ZGF0ZUFiYnIgPSB0aGlzLmdldEFiYnJldmlhdGlvbihkYXRlSG91cnMpO1xuXHRcdFx0fVxuXHRcdFx0ZGF0ZUhvdXJzID0gKGRhdGVIb3VycyAlIDEyKSA/IGRhdGVIb3VycyAlIDEyIDogMTI7XG5cdFx0fVxuXG5cdFx0Ly8gQWRkICcwJyBpZiBiZWxvdyAxMFxuXHRcdGlmIChkYXRlSG91cnMgPCAxMCkgeyBkYXRlSG91cnMgPSBgMCR7ZGF0ZUhvdXJzfWA7IH1cblx0XHRpZiAoZGF0ZU1pbnV0ZXMgPCAxMCkgeyBkYXRlTWludXRlcyA9IGAwJHtkYXRlTWludXRlc31gOyB9XG5cdFx0aWYgKGRhdGVTZWNvbmRzIDwgMTApIHsgZGF0ZVNlY29uZHMgPSBgMCR7ZGF0ZVNlY29uZHN9YDsgfVxuXG5cdFx0cmV0dXJuIGAke2RhdGVIb3Vyc306JHtkYXRlTWludXRlc306JHtkYXRlU2Vjb25kc30gJHtkYXRlQWJicn1gO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0VmFsaWRhdGVzIG51bWJlciBhbmQgcmV0dXJucyBlaXRoZXIgQU0gb3IgUE0uXG5cdCAqIEBwYXJhbSBcdFx0XHR7TnVtYmVyfSB0aW1lXG5cdCAqIEByZXR1cm5cdFx0XHR7U3RyaW5nfVxuXHQgKi9cblx0Z2V0QWJicmV2aWF0aW9uICh0aW1lKSB7XG5cdFx0aWYgKHR5cGVvZiB0aW1lICE9PSAnbnVtYmVyJykge1xuXHRcdFx0dGltZSA9IHBhcnNlRmxvYXQodGltZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICh0aW1lID49IDEyKSA/ICdQTScgOiAnQU0nO1xuXHR9XG5cblx0LyoqXG5cdCAqXHRAZGVzY3JpcHRpb25cdE5lZWRzIHRvIGJlIHdyaXR0ZW4uXG5cdCAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IGNvbmZpZ1xuXHQgKi9cblx0c2V0RGF0ZUZvcm1hdCAoY29uZmlnKSB7XG5cdFx0aWYgKGNvbmZpZykge1xuXHRcdFx0dGhpcy5mb3JtYXQgPSAoY29uZmlnLmZvcm1hdCkgPyBjb25maWcuZm9ybWF0IDogdGhpcy5mb3JtYXQ7XG5cdFx0XHR0aGlzLmFiYnJldmlhdGlvbnMgPSBjb25maWcuYWJicmV2aWF0aW9ucztcblx0XHR9XG5cdFx0dGhpcy5ydW4oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdFNldHMgdGhlIGVsZW1lbnQgaW4gd2hpY2ggdGhlIHRpbWUgc2hvdWxkIGJlIGRpc3BsYXllZC5cblx0ICogQHBhcmFtXHRcdFx0e0VsZW1lbnR9IGVsZW1cblx0ICogQHJldHVybiBcdFx0XHR7SFRNTEVsZW1lbnR9XG5cdCAqL1xuXHRydW4gKCkge1xuXHRcdHRoaXMuZWxlbS50ZXh0Q29udGVudCA9IHRoaXMuZ2V0VGltZSgpO1xuXG5cdFx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0dGhpcy5lbGVtLnRleHRDb250ZW50ID0gdGhpcy5nZXRUaW1lKCk7XG5cdFx0fSwgdGhpcy51cGRhdGUpO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWxlbTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaW1lcjsiLCJleHBvcnQgY29uc3QgQlJPV19TRVRUSU5HUyA9ICdCUk9XX1NFVFRJTkdTJztcbmV4cG9ydCBjb25zdCBCUk9XX0tFWVx0XHQ9ICdCUk9XX1RIRU1FJztcbmV4cG9ydCBjb25zdCBCUk9XX0NBUkRTXHRcdD0gJ0JST1dfQ0FSRFMnO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfVEhFTUVcdD0gJ2JsdWUtYTQwMCc7IiwiZXhwb3J0IGxldCB0aW1lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy10aW1lcicpO1xuZXhwb3J0IGxldCBkaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtZGlhbG9nJyk7XG5leHBvcnQgbGV0IGNhcmRsaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWNhcmRsaXN0Jyk7XG5leHBvcnQgbGV0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY29udGVudCcpO1xuZXhwb3J0IGxldCBjb250ZW50T3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50X19vdmVybGF5Jyk7XG5leHBvcnQgbGV0IG9wZW5EaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcub3Blbi1kaWFsb2cnKTtcbmV4cG9ydCBsZXQgbmV3Q2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1uZXdjYXJkJyk7XG5leHBvcnQgbGV0IHNlbGVjdGlvbkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtc2VsZWN0aW9uJyk7XG5leHBvcnQgbGV0IHNuYWNrYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXNuYWNrYmFyJyk7IiwiaW1wb3J0IHsgQlJPV19TRVRUSU5HUywgQlJPV19DQVJEUywgREVGQVVMVF9USEVNRSB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdENoZWNrcyBpZiBjdXN0b20gdGhlbWUgc2V0dGluZ3MgYXJlIGF2YWlsYWJsZS5cbiAqIEByZXR1cm5cdFx0XHR7Qm9vbGVhbn1cbiAqL1xuY29uc3QgaXNDdXN0b21UaGVtZSA9IGZ1bmN0aW9uICgpIHtcblx0bGV0IGlzQ3VzdG9tID0gZmFsc2U7XG5cblx0aWYgKGxvY2FsU3RvcmFnZVtCUk9XX1NFVFRJTkdTXSkge1xuXHRcdGxldCBzZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKTtcblx0XHRpc0N1c3RvbSA9ICEhc2V0dGluZ3MudGhlbWU7XG5cdH1cblxuXHRyZXR1cm4gaXNDdXN0b207XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGlmIGN1c3RvbSBrZXkgaXMgc2V0LCBpZiBub3Q6IGRvIGl0LlxuICovXG5jb25zdCBoYXNDdXN0b21DYXJkcyA9IGZ1bmN0aW9uICgpIHtcblx0aWYgKCFsb2NhbFN0b3JhZ2VbQlJPV19DQVJEU10pIHtcblx0XHRsb2NhbFN0b3JhZ2VbQlJPV19DQVJEU10gPSB0cnVlO1xuXHR9XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIHZpYSByZWdleCBpZiBjbGFzc05hbWUgaXMgYSB0aGVtZS5cbiAqL1xuY29uc3QgY2hlY2tGb3JUaGVtZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuXHRsZXQgdGhlbWVSZWdFeCA9IC90aGVtZS0uKi87XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAodGhlbWVSZWdFeC50ZXN0KGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0W2ldKSkge1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdFtpXSApO1xuXHRcdH1cblx0fVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdFBhcnNlcyB0aGUgY3VzdG9tIHNldHRpbmdzIGZyb20gbG9jYWxTdG9yYWdlIGFuZCBzZXRzIGNsYXNzZXMuXG4gKi9cbmNvbnN0IHVwZGF0ZVRoZW1lRnJvbVN0b3JhZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdGxldCBzZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKTtcblx0Ly9sZXQgZGlhbG9nSXNPcGVuID0gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2RpYWxvZy1pcy12aXNpYmxlJyk7XG5cblx0Y2hlY2tGb3JUaGVtZUNsYXNzKCk7XG5cdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChgdGhlbWUtJHtzZXR0aW5ncy50aGVtZS5jb2xvcn1gKTtcblxuXHRpZiAoaXNDdXN0b21UaGVtZSgpICYmIHNldHRpbmdzLnRoZW1lLmhlYWRlcmJhcikge1xuXHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgndGhlbWUtaGVhZGVyYmFyJyk7XG5cdH1cbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRBZGRzIHRoZSB0aGVtZSBjbGFzcyB0byA8Ym9keT4gZnJvbSBpbml0aWFsIHNldHRpbmdzLlxuICogQHBhcmFtXHRcdFx0e1N0cmluZ30gdGhlbWVcbiAqL1xuY29uc3QgdXBkYXRlVGhlbWVGcm9tQ29uZmlnID0gZnVuY3Rpb24gKHRoZW1lKSB7XG5cdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChgdGhlbWUtJHt0aGVtZX1gKTtcbn07XG5cbi8qKlxuICpcdEBkZXNjcmlwdGlvblx0VXBkYXRlcyB0aGUgY3VycmVudCB0aGVtZS5cbiAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IHRoZW1lXG4gKi9cbmNvbnN0IHNldFRoZW1lID0gZnVuY3Rpb24gKHRoZW1lKSB7XG5cdGlmICghdGhlbWUgfHwgdHlwZW9mIHRoZW1lICE9PSAnc3RyaW5nJykge1xuXHRcdHRoZW1lID0gREVGQVVMVF9USEVNRTtcblx0fVxuXG5cdGlmIChpc0N1c3RvbVRoZW1lKCkpIHtcblx0XHR1cGRhdGVUaGVtZUZyb21TdG9yYWdlKCk7XG5cdH0gZWxzZSB7XG5cdFx0dXBkYXRlVGhlbWVGcm9tQ29uZmlnKCB0aGVtZSApO1xuXHR9XG59O1xuXG5leHBvcnQge1xuXHRpc0N1c3RvbVRoZW1lLFxuXHRoYXNDdXN0b21DYXJkcyxcblx0c2V0VGhlbWUsXG5cdHVwZGF0ZVRoZW1lRnJvbUNvbmZpZyxcblx0dXBkYXRlVGhlbWVGcm9tU3RvcmFnZVxufTsiLCJpbXBvcnQgeyBCUk9XX1NFVFRJTkdTLCBERUZBVUxUX1RIRU1FIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcbmltcG9ydCB7IGlzQ3VzdG9tVGhlbWUsIHNldFRoZW1lIH0gZnJvbSAnLi4vdXRpbHMvaGVscGVyJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdFZhbGlkYXRlcyBpbnB1dCBmaWVsZHMsIHVwZGF0ZXMgYnJvd1RoZW1lIGFuZCBzYXZlcyB0byBsb2NhbFN0b3JhZ2UuXG4gKiBAcGFyYW0gIFx0XHRcdHtPYmplY3R9IGV2ZW50XG4gKi9cbnZhciB1cGRhdGVUaGVtZSA9IGZ1bmN0aW9uIChldmVudCkge1xuXHRsZXQgY29sb3JIZWFkQ2hlY2tib3hcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR0aW5ncy0tY29sb3JlZGhlYWQnKTtcblx0Ly9sZXQgaXNUaGVtZUJ1dHRvblx0XHRcdD0gZXZlbnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1zZXR0aW5ncy10aGVtZScpO1xuXHQvL2xldCBpc1RoZW1lQ2hlY2tib3hcdFx0PSBldmVudC50YXJnZXQuaWQgPT09ICdzZXR0aW5ncy0tY29sb3JlZGhlYWQnO1xuXHRsZXQgc2V0dGluZ3NcdFx0XHRcdD0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pO1xuXG5cdC8vIElmIG5vIHRoZW1lIHNldHRpbmdzIGFyZSBzdG9yZWQgeWV0LlxuXHRpZiAoIXNldHRpbmdzLnRoZW1lKSB7XG5cdFx0c2V0dGluZ3MudGhlbWUgPSB7IGNvbG9yOiBERUZBVUxUX1RIRU1FLCBoZWFkZXJiYXI6IGZhbHNlIH07XG5cdH1cblxuXHQvLyBJcyB0aGVtZSBvcHRpb25cblx0aWYgKGV2ZW50LnRhcmdldC5oYXNBdHRyaWJ1dGUoJ2RhdGEtc2V0dGluZ3MtdGhlbWUnKSkge1xuXHRcdHNldHRpbmdzLnRoZW1lLmNvbG9yID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1zZXR0aW5ncy10aGVtZScpO1xuXHR9XG5cblx0Ly8gSWYgY29sb3JlZCBoZWFkZXIgYmFyIGlzIGNsaWNrZWRcblx0aWYgKGV2ZW50LnRhcmdldC5pZCA9PT0gJ3NldHRpbmdzLS1jb2xvcmVkaGVhZCcpIHtcblx0XHRzZXR0aW5ncy50aGVtZS5oZWFkZXJiYXIgPSBjb2xvckhlYWRDaGVja2JveC5jaGVja2VkO1xuXHR9XG5cblx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oQlJPV19TRVRUSU5HUywgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MpKTtcblx0c2V0VGhlbWUoKTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRWYWxpZGF0ZXMgaW5wdXQgZmllbGRzLCB1cGRhdGVzIFRpbWVyIGFuZCBzYXZlcyB0byBsb2NhbFN0b3JhZ2UuXG4gKiBAcGFyYW0gIFx0XHRcdHtPYmplY3R9IGV2ZW50XG4gKi9cbnZhciB1cGRhdGVEYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdGxldCBmb3JtYXRDaGVja2JveFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLS1kYXRlZm9ybWF0Jyk7XG5cdGxldCBhYmJyQ2hlY2tib3hcdFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLS1hbXBtJyk7XG5cdGxldCB0aW1lRm9ybWF0XHRcdFx0PSAnMjRoJztcblx0bGV0IGRhdGVTZXR0aW5nc1x0XHQ9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKTtcblxuXHQvLyBJZiBkYXRlIGZvcm1hdCBjaGVja2JveCBpcyBjbGlja2VkXG5cdGlmIChldmVudC50YXJnZXQuaWQgPT09ICdzZXR0aW5ncy0tZGF0ZWZvcm1hdCcpIHtcblx0XHRpZiAoIWZvcm1hdENoZWNrYm94LmNoZWNrZWQpIHtcblx0XHRcdHRpbWVGb3JtYXQgPSAnMTJoJztcblx0XHRcdGFiYnJDaGVja2JveC5kaXNhYmxlZCA9IGZhbHNlO1xuXHRcdH1cblx0XHRlbHNlIGlmIChmb3JtYXRDaGVja2JveC5jaGVja2VkICYmICFhYmJyQ2hlY2tib3guZGlzYWJsZWQpIHtcblx0XHRcdGFiYnJDaGVja2JveC5kaXNhYmxlZCA9IHRydWU7XG5cdFx0XHRhYmJyQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdHRoaXMuY2FsbGJhY2tQYXJhbXMuVGltZXIuc2V0RGF0ZUZvcm1hdCh7ICdmb3JtYXQnOiB0aW1lRm9ybWF0IH0pO1xuXHRcdGRhdGVTZXR0aW5ncy5kYXRlRm9ybWF0ID0gdGltZUZvcm1hdDtcblx0XHRkYXRlU2V0dGluZ3MuYWJicmV2aWF0aW9ucyA9IGFiYnJDaGVja2JveC5jaGVja2VkO1xuXHR9XG5cblx0Ly8gSWYgYWJicmV2aWF0aW9uIGNoZWNrYm94IGlzIGNsaWNrZWRcblx0aWYgKCFldmVudC50YXJnZXQuZGlzYWJsZWQgJiYgZXZlbnQudGFyZ2V0LmlkID09PSAnc2V0dGluZ3MtLWFtcG0nKSB7XG5cdFx0dGhpcy5jYWxsYmFja1BhcmFtcy5UaW1lci5zZXREYXRlRm9ybWF0KHsgJ2FiYnJldmlhdGlvbnMnOiBhYmJyQ2hlY2tib3guY2hlY2tlZCB9KTtcblx0XHRkYXRlU2V0dGluZ3MuYWJicmV2aWF0aW9ucyA9IGFiYnJDaGVja2JveC5jaGVja2VkO1xuXHR9XG5cblx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oQlJPV19TRVRUSU5HUywgSlNPTi5zdHJpbmdpZnkoZGF0ZVNldHRpbmdzKSk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0QWRkcyBjYWxsYmFjayB0byBjb250ZW50IGluIGRpYWxvZyBhbmQgdmFsaWRhdGVzIDxpbnB1dD4gZmllbGRzLlxuICovXG52YXIgZGlhbG9nU2V0dGluZ3NDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcblx0bGV0IHRpbWVDb250ZW50XHRcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50X190aW1lJyk7XG5cdGxldCB0aGVtZUNvbnRlbnRcdFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnRfX3RoZW1lJyk7XG5cdGxldCBmb3JtYXRDaGVja2JveFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLS1kYXRlZm9ybWF0Jyk7XG5cdGxldCBhYmJyQ2hlY2tib3hcdFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLS1hbXBtJyk7XG5cdGxldCB0aGVtZUNoZWNrYm94XHRcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR0aW5ncy0tY29sb3JlZGhlYWQnKTtcblx0bGV0IGJyb3dTZXR0aW5nc1x0XHQ9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKTtcblxuXHQvLyBWYWxpZGF0ZSBkYXRlIHNldHRpbmdzIGFuZCB1cGRhdGUgRE9NXG5cdGlmIChicm93U2V0dGluZ3MuZGF0ZUZvcm1hdCA9PT0gJzEyaCcpIHtcblx0XHRmb3JtYXRDaGVja2JveC5jaGVja2VkID0gZmFsc2U7XG5cdH1cblx0YWJickNoZWNrYm94LmNoZWNrZWQgPSBicm93U2V0dGluZ3MuYWJicmV2aWF0aW9ucztcblx0YWJickNoZWNrYm94LmRpc2FibGVkID0gIWJyb3dTZXR0aW5ncy5hYmJyZXZpYXRpb25zO1xuXG5cdC8vIFZhbGlkYXRlIGhlYWRlciBiYXIgc2V0dGluZ3MgYW5kIHVwZGF0ZSBET01cblx0aWYgKGlzQ3VzdG9tVGhlbWUoKSkge1xuXHRcdHRoZW1lQ2hlY2tib3guY2hlY2tlZCA9IGJyb3dTZXR0aW5ncy50aGVtZS5oZWFkZXJiYXI7XG5cdH1cblxuXHQvLyBBZGQgZXZlbnRMaXN0ZW5lclxuXHR0aW1lQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHVwZGF0ZURhdGVGb3JtYXQuYmluZCh0aGlzKSk7XG5cdHRoZW1lQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHVwZGF0ZVRoZW1lLmJpbmQodGhpcykpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZGlhbG9nU2V0dGluZ3NDYWxsYmFjazsiXX0=
