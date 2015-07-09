(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Import dependencies */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsElements = require('./utils/elements');

var _utilsConstants = require('./utils/constants');

var _utilsHelper = require('./utils/helper');

var _viewsDialogSettings = require('./views/dialog.settings');

var _viewsDialogSettings2 = _interopRequireDefault(_viewsDialogSettings);

var _modulesBrowtimer = require('./modules/browtimer');

var _modulesBrowtimer2 = _interopRequireDefault(_modulesBrowtimer);

var _modulesBrowdialog = require('./modules/browdialog');

var _modulesBrowdialog2 = _interopRequireDefault(_modulesBrowdialog);

var _modulesBrowcard = require('./modules/browcard');

var _modulesBrowcard2 = _interopRequireDefault(_modulesBrowcard);

var _modulesBrowlayoutmanager = require('./modules/browlayoutmanager');

var _modulesBrowlayoutmanager2 = _interopRequireDefault(_modulesBrowlayoutmanager);

/* Variables */
var browTimer = null;
var browGrid = null;

/**
 *	@description Validates the users timer settings.
 */
var validateBrowTimer = function validateBrowTimer() {
	browTimer = new _modulesBrowtimer2['default'](_utilsElements.timer);
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

		var browDialog = new _modulesBrowdialog2['default']({
			elem: item,
			dialogElem: _utilsElements.dialog,
			content: currentLocation + '/markup/dialog-' + dialogContent + '.html',
			callback: dialogCallback,
			params: { browTimer: browTimer }
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
		var browCard = new _modulesBrowcard2['default']({
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
	browGrid = new _modulesBrowlayoutmanager2['default'](_utilsElements.content, _utilsElements.contentOverlay);
	browGrid.layout();
};

/**
 * @description	Checks localStorage and loads the users cards
 * @param			{Object} storage
 */
var validateBrowCards = function validateBrowCards() {
	if (!localStorage[_utilsConstants.BROW_CARDS] || localStorage.length <= 1) {
		localStorage.setItem(_utilsConstants.BROW_CARDS, true);
		var defaultCard = new _modulesBrowcard2['default']({ type: 'text' });
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
	var browCard = new _modulesBrowcard2['default']({ type: '' + selectedCard });

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
validateBrowTimer();
initLayoutManager();
initDialogs();
_utilsHelper.setTheme();
addEvents();

},{"./modules/browcard":2,"./modules/browdialog":3,"./modules/browlayoutmanager":4,"./modules/browtimer":5,"./utils/constants":6,"./utils/elements":7,"./utils/helper":8,"./views/dialog.settings":9}],2:[function(require,module,exports){
/**
 * @name				BrowCard
 * @description	/
 */
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BrowCard = (function () {
	function BrowCard() {
		var config = arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, BrowCard);

		this.config = config;
		this.elem = this.createCard();
		this.initialiseCard();

		return this.elem;
	}

	/**
  * @description	Returns a new card element.
  * @return 			{HTMLElement}
  */

	BrowCard.prototype.createCard = function createCard() {
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

	BrowCard.prototype.initialiseCard = function initialiseCard() {
		this.elem.initialise(this.config);
		this.elem.classList.add('brow-content__module');
	};

	return BrowCard;
})();

exports['default'] = BrowCard;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
/**
 * @name				BrowDialog
 * @description	Shows/hides the dialog.
 */
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BrowDialog = (function () {
	function BrowDialog(config) {
		_classCallCheck(this, BrowDialog);

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

	BrowDialog.prototype.init = function init() {
		this.addEvents();
	};

	/**
  *	@description	Loads the content
  * @param			{Object} event
  */

	BrowDialog.prototype.loadContent = function loadContent(event) {
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

	BrowDialog.prototype.closeDialog = function closeDialog(event) {
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

	BrowDialog.prototype.loadOrCloseContent = function loadOrCloseContent(event) {
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

	BrowDialog.prototype.addEvents = function addEvents() {
		this.elem.addEventListener('click', this.loadOrCloseContent.bind(this));
		window.addEventListener('keydown', this.closeDialog.bind(this));
	};

	return BrowDialog;
})();

exports['default'] = BrowDialog;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
/*globals Packery,Draggabilly*/

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsHelper = require('../utils/helper');

/**
 * @name				BrowLayoutManager
 * @description	/
 */

var BrowLayoutManager = (function () {
	function BrowLayoutManager(container, overlay) {
		_classCallCheck(this, BrowLayoutManager);

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
		console.log(this);
		this.addEvents();
		this.addDraggabilly();
	}

	/**
  * @description	Will initialise the Packery layout.
  */

	BrowLayoutManager.prototype.layout = function layout() {
		this.packery.layout();
	};

	/**
  * @description	Adds a new item to the Packery layout.
  * @param 			{NodeList|HTMLElement} elem
  */

	BrowLayoutManager.prototype.add = function add(elem) {
		this.packery.appended(elem);
		this.addDraggabilly();
	};

	/**
  * @description	Removes passed element from the Packery layout.
  * @param 			{NodeList|HTMLElement} config
  */

	BrowLayoutManager.prototype.remove = function remove(elem) {
		this.packery.remove(elem);
		this.layout();
	};

	/**
  * @description	Makes an element sticky.
  * @param 			{NodeList|HTMLElement} config
  */

	BrowLayoutManager.prototype.stamp = function stamp(elem) {
		this.packery.stamp(elem);
	};

	/**
  * @description	Unstamps an element.
  * @param 			{NodeList|HTMLElement} config
  */

	BrowLayoutManager.prototype.unstamp = function unstamp(elem) {
		this.packery.unstamp(elem);
	};

	/**
  * @description	Initialises Draggabilly.
  */

	BrowLayoutManager.prototype.addDraggabilly = function addDraggabilly() {
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

	BrowLayoutManager.prototype.addEvents = function addEvents() {
		window.addEventListener('card-edit', this.validateLayoutState.bind(this));
		window.addEventListener('card-save', this.validateLayoutState.bind(this));
		window.addEventListener('card-remove', this.validateLayoutState.bind(this));
		this.overlay.addEventListener('click', this.validateLayoutState.bind(this));
	};

	/**
  * @description	Deactivates editMode and removes classes from content overlay.
  */

	BrowLayoutManager.prototype.deactivateEditMode = function deactivateEditMode() {
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

	BrowLayoutManager.prototype.validateLayoutState = function validateLayoutState(event) {
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

	BrowLayoutManager.prototype.validateEditMode = function validateEditMode() {
		if (window.isEditMode) {
			this.disable();
		} else {
			this.enable();
		}
	};

	return BrowLayoutManager;
})();

exports['default'] = BrowLayoutManager;
module.exports = exports['default'];

},{"../utils/helper":8}],5:[function(require,module,exports){
/**
 * @name				BrowTimer
 * @description	Class which appends a time string to an element
 *              	and updates it every second.
 */
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BrowTimer = (function () {
	function BrowTimer(elem) {
		_classCallCheck(this, BrowTimer);

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

	BrowTimer.prototype.getTime = function getTime() {
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

	BrowTimer.prototype.getAbbreviation = function getAbbreviation(time) {
		if (typeof time !== 'number') {
			time = parseFloat(time);
		}

		return time >= 12 ? 'PM' : 'AM';
	};

	/**
  *	@description	Needs to be written.
  * @param			{Object} config
  */

	BrowTimer.prototype.setDateFormat = function setDateFormat(config) {
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

	BrowTimer.prototype.run = function run() {
		var _this = this;

		this.elem.textContent = this.getTime();

		setInterval(function () {
			_this.elem.textContent = _this.getTime();
		}, this.update);

		return this.elem;
	};

	return BrowTimer;
})();

exports['default'] = BrowTimer;
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"./constants":6}],9:[function(require,module,exports){
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
 * @description	Validates input fields, updates browTimer and saves to localStorage.
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

		this.callbackParams.browTimer.setDateFormat({ 'format': timeFormat });
		dateSettings.dateFormat = timeFormat;
		dateSettings.abbreviations = abbrCheckbox.checked;
	}

	// If abbreviation checkbox is clicked
	if (!event.target.disabled && event.target.id === 'settings--ampm') {
		this.callbackParams.browTimer.setDateFormat({ 'abbreviations': abbrCheckbox.checked });
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

},{"../utils/constants":6,"../utils/helper":8}]},{},[1,2,3,4,5,6,7,8,9])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvYXBwLmluaXQuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvbW9kdWxlcy9icm93Y2FyZC5qcyIsIi9Vc2Vycy9tb3Jrcm9nZS9EZXNrdG9wL1Byb2plY3RzL1BlcnNvbmFsL0Jyb3dEYXNoL3NyYy9zY3JpcHRzL2VzNi9tb2R1bGVzL2Jyb3dkaWFsb2cuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvbW9kdWxlcy9icm93bGF5b3V0bWFuYWdlci5qcyIsIi9Vc2Vycy9tb3Jrcm9nZS9EZXNrdG9wL1Byb2plY3RzL1BlcnNvbmFsL0Jyb3dEYXNoL3NyYy9zY3JpcHRzL2VzNi9tb2R1bGVzL2Jyb3d0aW1lci5qcyIsIi9Vc2Vycy9tb3Jrcm9nZS9EZXNrdG9wL1Byb2plY3RzL1BlcnNvbmFsL0Jyb3dEYXNoL3NyYy9zY3JpcHRzL2VzNi91dGlscy9jb25zdGFudHMuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvdXRpbHMvZWxlbWVudHMuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvdXRpbHMvaGVscGVyLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L3ZpZXdzL2RpYWxvZy5zZXR0aW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OzZCQ0M0RSxrQkFBa0I7OzhCQUNwRCxtQkFBbUI7OzJCQUNwQyxnQkFBZ0I7O21DQUNOLHlCQUF5Qjs7OztnQ0FDdEMscUJBQXFCOzs7O2lDQUNwQixzQkFBc0I7Ozs7K0JBQ3hCLG9CQUFvQjs7Ozt3Q0FDWCw2QkFBNkI7Ozs7O0FBRzNELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7Ozs7O0FBS3BCLElBQUksaUJBQWlCLEdBQUcsU0FBcEIsaUJBQWlCLEdBQWU7QUFDbkMsVUFBUyxHQUFHLGlEQWpCSixLQUFLLENBaUJtQixDQUFDO0FBQ2pDLEtBQUksWUFBWSxHQUFHLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUM7O0FBRTlELEtBQUksQ0FBQyxZQUFZLGlCQW5CVCxhQUFhLENBbUJXLEVBQUU7QUFDakMsY0FBWSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDaEMsV0FBUyxDQUFDLGFBQWEsQ0FBQztBQUN2QixXQUFRLEVBQUUsWUFBWSxDQUFDLFVBQVU7R0FDakMsQ0FBQyxDQUFDO0FBQ0gsY0FBWSxDQUFDLE9BQU8saUJBeEJiLGFBQWEsRUF3QmdCLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztFQUNsRSxNQUNJO0FBQ0osY0FBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxpQkEzQi9CLGFBQWEsQ0EyQmlDLENBQUMsQ0FBQztBQUN2RCxXQUFTLENBQUMsYUFBYSxDQUFDO0FBQ3ZCLFdBQVEsRUFBRSxZQUFZLENBQUMsVUFBVTtBQUNqQyxrQkFBZSxFQUFFLFlBQVksQ0FBQyxhQUFhO0dBQzNDLENBQUMsQ0FBQztFQUNIOztBQUVELFVBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztDQUNoQixDQUFDOzs7OztBQUtGLElBQUksV0FBVyxHQUFHLFNBQWQsV0FBVyxHQUFlO0FBQzdCLEtBQUksZUFBZSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFeEQsR0FBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGdCQTVDQSxVQUFVLEVBNENHLFVBQVUsSUFBSSxFQUFFO0FBQzNDLE1BQUksYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDckQsTUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDOztBQUUzQixNQUFJLGFBQWEsS0FBSyxVQUFVLEVBQUU7QUFDakMsaUJBQWMsbUNBQXlCLENBQUM7R0FDeEM7O0FBRUQsTUFBSSxVQUFVLEdBQUcsbUNBQWU7QUFDL0IsT0FBSSxFQUFFLElBQUk7QUFDVixhQUFVLGlCQXREZSxNQUFNLEFBc0RiO0FBQ2xCLFVBQU8sRUFBSyxlQUFlLHVCQUFrQixhQUFhLFVBQU87QUFDakUsV0FBUSxFQUFFLGNBQWM7QUFDeEIsU0FBTSxFQUFFLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBRTtHQUNyQixDQUFDLENBQUM7O0FBRUgsWUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO0VBQ2xCLENBQUMsQ0FBQztDQUNILENBQUM7Ozs7OztBQU1GLElBQUkscUJBQXFCLEdBQUcsU0FBeEIscUJBQXFCLENBQWEsS0FBSyxFQUFFO0FBQzVDLEtBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQzNCLFlBQVksQ0FBQyxPQUFPLENBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBRSxDQUMvQyxDQUFDOztBQUVGLEtBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtBQUN2QixNQUFJLFFBQVEsR0FBRyxpQ0FBYTtBQUMzQixPQUFJLEVBQUUsV0FBVyxDQUFDLElBQUk7QUFDdEIsT0FBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJO0FBQ3RCLFVBQU8sRUFBRSxXQUFXLENBQUMsT0FBTztBQUM1QixRQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUs7R0FDeEIsQ0FBQyxDQUFDO0FBQ0gsaUJBaEYyQyxPQUFPLENBZ0YxQyxXQUFXLENBQUUsUUFBUSxDQUFFLENBQUM7RUFDaEM7Q0FDRCxDQUFDOzs7OztBQUtGLElBQUksaUJBQWlCLEdBQUcsU0FBcEIsaUJBQWlCLEdBQWU7QUFDbkMsU0FBUSxHQUFHLHlEQXhGaUMsT0FBTyxpQkFBRSxjQUFjLENBd0ZSLENBQUM7QUFDNUQsU0FBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0NBQ2xCLENBQUM7Ozs7OztBQU1GLElBQUksaUJBQWlCLEdBQUcsU0FBcEIsaUJBQWlCLEdBQWU7QUFDbkMsS0FBSSxDQUFDLFlBQVksaUJBaEdNLFVBQVUsQ0FnR0osSUFBSSxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtBQUMxRCxjQUFZLENBQUMsT0FBTyxpQkFqR0UsVUFBVSxFQWlHQyxJQUFJLENBQUMsQ0FBQztBQUN2QyxNQUFJLFdBQVcsR0FBRyxpQ0FBYSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ2pELGlCQXBHMkMsT0FBTyxDQW9HMUMsV0FBVyxDQUFFLFdBQVcsQ0FBRSxDQUFDO0VBQ25DLE1BQU07QUFDTixPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM3Qyx3QkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUN6QjtFQUNEO0NBQ0QsQ0FBQzs7Ozs7O0FBTUYsSUFBSSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQWEsS0FBSyxFQUFFO0FBQ2pDLE1BQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFdkIsS0FBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3pELEtBQUksUUFBUSxHQUFHLGlDQUFhLEVBQUUsSUFBSSxPQUFLLFlBQVksQUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFekQsZ0JBdEg0QyxPQUFPLENBc0gzQyxXQUFXLENBQUUsUUFBUSxDQUFFLENBQUM7QUFDaEMsU0FBUSxDQUFDLEdBQUcsQ0FBRSxRQUFRLENBQUUsQ0FBQztDQUN6QixDQUFDOzs7OztBQUtGLElBQUksU0FBUyxHQUFHLFNBQVosU0FBUyxHQUFlO0FBQzNCLEdBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxnQkE5SG9CLE9BQU8sRUE4SGpCLFVBQUMsSUFBSSxFQUFLO0FBQ2xDLE1BQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7RUFDM0MsQ0FBQyxDQUFDO0NBQ0gsQ0FBQzs7O0FBR0YsTUFBTSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDMUIsaUJBQWlCLEVBQUUsQ0FBQztBQUNwQixpQkFBaUIsRUFBRSxDQUFDO0FBQ3BCLGlCQUFpQixFQUFFLENBQUM7QUFDcEIsV0FBVyxFQUFFLENBQUM7QUFDZCxhQXZJUyxRQUFRLEVBdUlQLENBQUM7QUFDWCxTQUFTLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7OztJQ3ZJTixRQUFRO0FBQ0QsVUFEUCxRQUFRLEdBQ2E7TUFBYixNQUFNLGdDQUFHLEVBQUU7O3dCQURuQixRQUFROztBQUVaLE1BQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLE1BQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzlCLE1BQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFdEIsU0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0VBQ2pCOzs7Ozs7O0FBUEksU0FBUSxXQWFiLFVBQVUsR0FBQyxzQkFBRztBQUNiLFVBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJO0FBQ3ZCLFFBQUssTUFBTTtBQUFFLFdBQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUFBLEFBQ3hELFFBQUssU0FBUztBQUFFLFdBQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUFBLEFBQzlELFFBQUssTUFBTTtBQUFFLFdBQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUFBLEFBQ3hEO0FBQVMsV0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQUEsR0FDcEQ7RUFDRDs7Ozs7O0FBcEJJLFNBQVEsV0F5QmIsY0FBYyxHQUFDLDBCQUFHO0FBQ2pCLE1BQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFFLElBQUksQ0FBQyxNQUFNLENBQUUsQ0FBQztBQUNwQyxNQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztFQUNoRDs7UUE1QkksUUFBUTs7O3FCQStCQyxRQUFROzs7Ozs7Ozs7Ozs7OztJQy9CakIsVUFBVTtBQUNILFVBRFAsVUFBVSxDQUNGLE1BQU0sRUFBRTt3QkFEaEIsVUFBVTs7QUFFZCxNQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDeEIsTUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxNQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELE1BQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUMzQixNQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDaEMsTUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ3BDLE1BQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNwQyxNQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDdkUsTUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsTUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7RUFDdEI7O0FBWkksV0FBVSxXQWNmLElBQUksR0FBQyxnQkFBRztBQUNQLE1BQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztFQUNqQjs7Ozs7OztBQWhCSSxXQUFVLFdBc0JmLFdBQVcsR0FBQyxxQkFBQyxLQUFLLEVBQUU7OztBQUNuQixPQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRXZCLE9BQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ2YsSUFBSSxDQUFDLFVBQUEsUUFBUTtVQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUU7R0FBQSxDQUFDLENBQ2pDLElBQUksQ0FBQyxVQUFBLElBQUksRUFBSTtBQUNiLFNBQUssZUFBZSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDdEMsU0FBSyxhQUFhLEdBQUcsTUFBSyxlQUFlLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDNUUsU0FBSyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxQyxTQUFLLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLFdBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2pELFNBQUssUUFBUSxHQUFHLElBQUksQ0FBQzs7QUFFckIsT0FBSSxNQUFLLFFBQVEsRUFBRTtBQUFFLFVBQUssUUFBUSxPQUFNLENBQUM7SUFBRTtHQUMzQyxDQUFDLENBQUM7RUFDSDs7Ozs7OztBQXJDSSxXQUFVLFdBNENmLFdBQVcsR0FBQyxxQkFBQyxLQUFLLEVBQUU7QUFDbkIsTUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDekUsTUFBSSxVQUFVLEdBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQzdDLE1BQUksUUFBUSxHQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssRUFBRSxDQUFDOztBQUVyQyxNQUFJLElBQUksQ0FBQyxRQUFRLElBQUksWUFBWSxJQUFJLFVBQVUsSUFBSSxRQUFRLEVBQUU7O0FBRTVELE9BQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7QUFFdEMsT0FBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN0RCxPQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFckMsV0FBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7R0FDcEQ7RUFDRDs7Ozs7OztBQTFESSxXQUFVLFdBZ0VmLGtCQUFrQixHQUFDLDRCQUFDLEtBQUssRUFBRTtBQUMxQixNQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7QUFFekUsTUFBSSxZQUFZLEVBQUU7QUFDakIsT0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUN4QixNQUNJO0FBQ0osT0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUN4QjtFQUNEOzs7Ozs7QUF6RUksV0FBVSxXQThFZixTQUFTLEdBQUMscUJBQUc7QUFDWixNQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDeEUsUUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQ2hFOztRQWpGSSxVQUFVOzs7cUJBb0ZELFVBQVU7Ozs7Ozs7Ozs7OzsyQkN0Rk0saUJBQWlCOzs7Ozs7O0lBTTFDLGlCQUFpQjtBQUNWLFVBRFAsaUJBQWlCLENBQ1QsU0FBUyxFQUFFLE9BQU8sRUFBRTt3QkFENUIsaUJBQWlCOztBQUVyQixNQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNwQixNQUFJLENBQUMsV0FBVyxHQUFHO0FBQ2xCLFNBQU0sRUFBRSwwQ0FBMEM7R0FDbEQsQ0FBQztBQUNGLE1BQUksQ0FBQyxVQUFVLEdBQUc7QUFDakIsZUFBWSxFQUFFLHVCQUF1QjtBQUNyQyxxQkFBa0IsRUFBRSxJQUFJLENBQUMsVUFBVTtBQUNuQyxjQUFXLEVBQUUsc0JBQXNCO0FBQ25DLFNBQU0sRUFBRSx1QkFBdUI7QUFDL0IsUUFBSyxFQUFFLFdBQVc7QUFDbEIsZUFBWSxFQUFFLEtBQUs7R0FDbkIsQ0FBQztBQUNGLE1BQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN2RCxNQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUN6QixNQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixTQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xCLE1BQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNqQixNQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7RUFDdEI7Ozs7OztBQXBCSSxrQkFBaUIsV0F5QnRCLE1BQU0sR0FBQyxrQkFBRztBQUNULE1BQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7RUFDdEI7Ozs7Ozs7QUEzQkksa0JBQWlCLFdBaUN0QixHQUFHLEdBQUMsYUFBQyxJQUFJLEVBQUU7QUFDVixNQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBRSxJQUFJLENBQUUsQ0FBQztBQUM5QixNQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7RUFDdEI7Ozs7Ozs7QUFwQ0ksa0JBQWlCLFdBMEN0QixNQUFNLEdBQUMsZ0JBQUMsSUFBSSxFQUFFO0FBQ2IsTUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUUsSUFBSSxDQUFFLENBQUM7QUFDNUIsTUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQ2Q7Ozs7Ozs7QUE3Q0ksa0JBQWlCLFdBbUR0QixLQUFLLEdBQUMsZUFBQyxJQUFJLEVBQUU7QUFDWixNQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUUsQ0FBQztFQUMzQjs7Ozs7OztBQXJESSxrQkFBaUIsV0EyRHRCLE9BQU8sR0FBQyxpQkFBQyxJQUFJLEVBQUU7QUFDZCxNQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBRSxJQUFJLENBQUUsQ0FBQztFQUM3Qjs7Ozs7O0FBN0RJLGtCQUFpQixXQWtFdEIsY0FBYyxHQUFDLDBCQUFHOzs7QUFDakIsTUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUMzQyxPQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3ZCLE9BQUksT0FBTyxHQUFHLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxNQUFLLFdBQVcsQ0FBQyxDQUFDO0FBQ3RELFNBQUssT0FBTyxDQUFDLHFCQUFxQixDQUFFLE9BQU8sQ0FBRSxDQUFDO0FBQzlDLFVBQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLE1BQUssZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FDL0QsQ0FBQyxDQUFDO0VBQ0g7Ozs7OztBQXpFSSxrQkFBaUIsV0E4RXRCLFNBQVMsR0FBQyxxQkFBRztBQUNaLFFBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzFFLFFBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzFFLFFBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzVFLE1BQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUM1RTs7Ozs7O0FBbkZJLGtCQUFpQixXQXdGdEIsa0JBQWtCLEdBQUMsOEJBQUc7OztBQUNyQixRQUFNLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUMxQixNQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDeEMsWUFBVSxDQUFDLFlBQU07QUFDaEIsVUFBSyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7R0FDekQsRUFBRSxHQUFHLENBQUMsQ0FBQztFQUNSOzs7Ozs7O0FBOUZJLGtCQUFpQixXQW9HdEIsbUJBQW1CLEdBQUMsNkJBQUMsS0FBSyxFQUFFO0FBQzNCLE1BQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLGtCQUFnQixLQUFLLENBQUMsTUFBTSxRQUFLLENBQUM7OztBQUduRSxNQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO0FBQy9CLFNBQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLE9BQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUN6Qzs7O0FBR0QsTUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLGFBQWEsRUFBRTtBQUMvRCxPQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzs7QUFFMUIsT0FBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtBQUMvQixRQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZCxpQkF6SEssY0FBYyxFQXlISCxDQUFDO0lBQ2pCOztBQUVELE9BQUksS0FBSyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUU7QUFDakMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQjtHQUNELE1BRUksSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFO0FBQ3JELE9BQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM5QyxPQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckIsT0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZDLE9BQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0dBQzFCO0VBQ0Q7Ozs7OztBQWpJSSxrQkFBaUIsV0FzSXRCLGdCQUFnQixHQUFDLDRCQUFHO0FBQ25CLE1BQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUN0QixPQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDZixNQUFNO0FBQ04sT0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQ2Q7RUFDRDs7UUE1SUksaUJBQWlCOzs7cUJBK0lSLGlCQUFpQjs7Ozs7Ozs7Ozs7Ozs7O0lDbEoxQixTQUFTO0FBQ0YsVUFEUCxTQUFTLENBQ0QsSUFBSSxFQUFFO3dCQURkLFNBQVM7O0FBRWIsTUFBSSxFQUFFLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFBLEFBQUMsRUFBRTtBQUM3QixTQUFNLElBQUksS0FBSyw0Q0FBMkMsQ0FBQztHQUMzRDs7QUFFRCxNQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixNQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixNQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNwQixNQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztFQUMzQjs7Ozs7OztBQVZJLFVBQVMsV0FnQmQsT0FBTyxHQUFDLG1CQUFHO0FBQ1YsTUFBSSxJQUFJLEdBQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUN6QixNQUFJLFNBQVMsR0FBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDakMsTUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3BDLE1BQUksV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNwQyxNQUFJLFFBQVEsR0FBSSxFQUFFLENBQUM7OztBQUduQixNQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxFQUFFO0FBQzFCLE9BQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN2QixZQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQztBQUNELFlBQVMsR0FBRyxBQUFDLFNBQVMsR0FBRyxFQUFFLEdBQUksU0FBUyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7R0FDbkQ7OztBQUdELE1BQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtBQUFFLFlBQVMsU0FBTyxTQUFTLEFBQUUsQ0FBQztHQUFFO0FBQ3BELE1BQUksV0FBVyxHQUFHLEVBQUUsRUFBRTtBQUFFLGNBQVcsU0FBTyxXQUFXLEFBQUUsQ0FBQztHQUFFO0FBQzFELE1BQUksV0FBVyxHQUFHLEVBQUUsRUFBRTtBQUFFLGNBQVcsU0FBTyxXQUFXLEFBQUUsQ0FBQztHQUFFOztBQUUxRCxTQUFVLFNBQVMsU0FBSSxXQUFXLFNBQUksV0FBVyxTQUFJLFFBQVEsQ0FBRztFQUNoRTs7Ozs7Ozs7QUFyQ0ksVUFBUyxXQTRDZCxlQUFlLEdBQUMseUJBQUMsSUFBSSxFQUFFO0FBQ3RCLE1BQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQzdCLE9BQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDeEI7O0FBRUQsU0FBTyxBQUFDLElBQUksSUFBSSxFQUFFLEdBQUksSUFBSSxHQUFHLElBQUksQ0FBQztFQUNsQzs7Ozs7OztBQWxESSxVQUFTLFdBd0RkLGFBQWEsR0FBQyx1QkFBQyxNQUFNLEVBQUU7QUFDdEIsTUFBSSxNQUFNLEVBQUU7QUFDWCxPQUFJLENBQUMsTUFBTSxHQUFHLEFBQUMsTUFBTSxDQUFDLE1BQU0sR0FBSSxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDNUQsT0FBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO0dBQzFDO0FBQ0QsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0VBQ1g7Ozs7Ozs7O0FBOURJLFVBQVMsV0FxRWQsR0FBRyxHQUFDLGVBQUc7OztBQUNOLE1BQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFdkMsYUFBVyxDQUFDLFlBQU07QUFDakIsU0FBSyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQUssT0FBTyxFQUFFLENBQUM7R0FDdkMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWhCLFNBQU8sSUFBSSxDQUFDLElBQUksQ0FBQztFQUNqQjs7UUE3RUksU0FBUzs7O3FCQWdGQSxTQUFTOzs7Ozs7O0FDckZqQixJQUFNLGFBQWEsR0FBRyxlQUFlLENBQUM7UUFBaEMsYUFBYSxHQUFiLGFBQWE7QUFDbkIsSUFBTSxRQUFRLEdBQUksWUFBWSxDQUFDO1FBQXpCLFFBQVEsR0FBUixRQUFRO0FBQ2QsSUFBTSxVQUFVLEdBQUksWUFBWSxDQUFDO1FBQTNCLFVBQVUsR0FBVixVQUFVO0FBQ2hCLElBQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQztRQUE1QixhQUFhLEdBQWIsYUFBYTs7Ozs7O0FDSG5CLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFBNUMsS0FBSyxHQUFMLEtBQUs7QUFDVCxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQTlDLE1BQU0sR0FBTixNQUFNO0FBQ1YsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUFsRCxRQUFRLEdBQVIsUUFBUTtBQUNaLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7UUFBaEQsT0FBTyxHQUFQLE9BQU87QUFDWCxJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFBN0QsY0FBYyxHQUFkLGNBQWM7QUFDbEIsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQXZELFVBQVUsR0FBVixVQUFVO0FBQ2QsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQW5ELE9BQU8sR0FBUCxPQUFPO0FBQ1gsSUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUF4RCxhQUFhLEdBQWIsYUFBYTs7Ozs7Ozt5QkNQaUMsYUFBYTs7Ozs7O0FBTXRFLElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsR0FBZTtBQUNqQyxLQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRXJCLEtBQUksWUFBWSxZQVRSLGFBQWEsQ0FTVSxFQUFFO0FBQ2hDLE1BQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxZQVYvQixhQUFhLENBVWlDLENBQUMsQ0FBQztBQUN2RCxVQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7RUFDNUI7O0FBRUQsUUFBTyxRQUFRLENBQUM7Q0FDaEIsQ0FBQzs7Ozs7QUFLRixJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFjLEdBQWU7QUFDbEMsS0FBSSxDQUFDLFlBQVksWUFyQk0sVUFBVSxDQXFCSixFQUFFO0FBQzlCLGNBQVksWUF0QlUsVUFBVSxDQXNCUixHQUFHLElBQUksQ0FBQztFQUNoQztDQUNELENBQUM7Ozs7O0FBS0YsSUFBTSxrQkFBa0IsR0FBRyxTQUFyQixrQkFBa0IsR0FBZTtBQUN0QyxLQUFJLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDNUIsTUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4RCxNQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNoRCxXQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztHQUM3RDtFQUNEO0NBQ0QsQ0FBQzs7Ozs7QUFLRixJQUFNLHNCQUFzQixHQUFHLFNBQXpCLHNCQUFzQixHQUFlO0FBQzFDLEtBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxZQTFDOUIsYUFBYSxDQTBDZ0MsQ0FBQyxDQUFDOzs7QUFHdkQsbUJBQWtCLEVBQUUsQ0FBQztBQUNyQixTQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFlBQVUsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUcsQ0FBQzs7QUFFN0QsS0FBSSxhQUFhLEVBQUUsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtBQUNoRCxVQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztFQUMvQztDQUNELENBQUM7Ozs7OztBQU1GLElBQU0scUJBQXFCLEdBQUcsU0FBeEIscUJBQXFCLENBQWEsS0FBSyxFQUFFO0FBQzlDLFNBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsWUFBVSxLQUFLLENBQUcsQ0FBQztDQUM5QyxDQUFDOzs7Ozs7QUFNRixJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBYSxLQUFLLEVBQUU7QUFDakMsS0FBSSxDQUFDLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7QUFDeEMsT0FBSyxjQW5FNkIsYUFBYSxBQW1FMUIsQ0FBQztFQUN0Qjs7QUFFRCxLQUFJLGFBQWEsRUFBRSxFQUFFO0FBQ3BCLHdCQUFzQixFQUFFLENBQUM7RUFDekIsTUFBTTtBQUNOLHVCQUFxQixDQUFFLEtBQUssQ0FBRSxDQUFDO0VBQy9CO0NBQ0QsQ0FBQzs7UUFHRCxhQUFhLEdBQWIsYUFBYTtRQUNiLGNBQWMsR0FBZCxjQUFjO1FBQ2QsUUFBUSxHQUFSLFFBQVE7UUFDUixxQkFBcUIsR0FBckIscUJBQXFCO1FBQ3JCLHNCQUFzQixHQUF0QixzQkFBc0I7Ozs7Ozs7OEJDbEZzQixvQkFBb0I7OzJCQUN6QixpQkFBaUI7Ozs7OztBQU16RCxJQUFJLFdBQVcsR0FBRyxTQUFkLFdBQVcsQ0FBYSxLQUFLLEVBQUU7QUFDbEMsS0FBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDOzs7QUFHbkYsS0FBSSxRQUFRLEdBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLGlCQVhqQyxhQUFhLENBV21DLENBQUMsQ0FBQzs7O0FBRzFELEtBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO0FBQ3BCLFVBQVEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxLQUFLLGtCQWZGLGFBQWEsQUFlSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQztFQUM1RDs7O0FBR0QsS0FBSSxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO0FBQ3JELFVBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLENBQUM7RUFDeEU7OztBQUdELEtBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssdUJBQXVCLEVBQUU7QUFDaEQsVUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUMsT0FBTyxDQUFDO0VBQ3JEOztBQUVELGFBQVksQ0FBQyxPQUFPLGlCQTVCWixhQUFhLEVBNEJlLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUM5RCxjQTVCdUIsUUFBUSxFQTRCckIsQ0FBQztDQUNYLENBQUM7Ozs7OztBQU1GLElBQUksZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLENBQWEsS0FBSyxFQUFFO0FBQ3ZDLEtBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDL0UsS0FBSSxZQUFZLEdBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN4RSxLQUFJLFVBQVUsR0FBSyxLQUFLLENBQUM7QUFDekIsS0FBSSxZQUFZLEdBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLGlCQXhDbkMsYUFBYSxDQXdDcUMsQ0FBQyxDQUFDOzs7QUFHNUQsS0FBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxzQkFBc0IsRUFBRTtBQUMvQyxNQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRTtBQUM1QixhQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ25CLGVBQVksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0dBQzlCLE1BQ0ksSUFBSSxjQUFjLENBQUMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRTtBQUMxRCxlQUFZLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUM3QixlQUFZLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztHQUM3Qjs7QUFFRCxNQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUN0RSxjQUFZLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUNyQyxjQUFZLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUM7RUFDbEQ7OztBQUdELEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxnQkFBZ0IsRUFBRTtBQUNuRSxNQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDdkYsY0FBWSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDO0VBQ2xEOztBQUVELGFBQVksQ0FBQyxPQUFPLGlCQWhFWixhQUFhLEVBZ0VlLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztDQUNsRSxDQUFDOzs7OztBQUtGLElBQUksc0JBQXNCLEdBQUcsU0FBekIsc0JBQXNCLEdBQWU7QUFDeEMsS0FBSSxXQUFXLEdBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN0RSxLQUFJLFlBQVksR0FBSSxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3hFLEtBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDL0UsS0FBSSxZQUFZLEdBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN4RSxLQUFJLGFBQWEsR0FBSSxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ2hGLEtBQUksWUFBWSxHQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxpQkE1RW5DLGFBQWEsQ0E0RXFDLENBQUMsQ0FBQzs7O0FBRzVELEtBQUksWUFBWSxDQUFDLFVBQVUsS0FBSyxLQUFLLEVBQUU7QUFDdEMsZ0JBQWMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0VBQy9CO0FBQ0QsYUFBWSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDO0FBQ2xELGFBQVksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDOzs7QUFHcEQsS0FBSSxhQXJGSSxhQUFhLEVBcUZGLEVBQUU7QUFDcEIsZUFBYSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztFQUNyRDs7O0FBR0QsWUFBVyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNuRSxhQUFZLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztDQUMvRCxDQUFDOztxQkFFYSxzQkFBc0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogSW1wb3J0IGRlcGVuZGVuY2llcyAqL1xuaW1wb3J0IHsgdGltZXIsIG9wZW5EaWFsb2csIGRpYWxvZywgbmV3Q2FyZCwgY29udGVudCwgY29udGVudE92ZXJsYXkgfSBmcm9tICcuL3V0aWxzL2VsZW1lbnRzJztcbmltcG9ydCB7IEJST1dfU0VUVElOR1MsIEJST1dfQ0FSRFMgfSBmcm9tICcuL3V0aWxzL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBzZXRUaGVtZSB9IGZyb20gJy4vdXRpbHMvaGVscGVyJztcbmltcG9ydCBkaWFsb2dTZXR0aW5nc0NhbGxiYWNrIGZyb20gJy4vdmlld3MvZGlhbG9nLnNldHRpbmdzJztcbmltcG9ydCBCcm93VGltZXIgZnJvbSAnLi9tb2R1bGVzL2Jyb3d0aW1lcic7XG5pbXBvcnQgQnJvd0RpYWxvZyBmcm9tICcuL21vZHVsZXMvYnJvd2RpYWxvZyc7XG5pbXBvcnQgQnJvd0NhcmQgZnJvbSAnLi9tb2R1bGVzL2Jyb3djYXJkJztcbmltcG9ydCBCcm93TGF5b3V0TWFuYWdlciBmcm9tICcuL21vZHVsZXMvYnJvd2xheW91dG1hbmFnZXInO1xuXG4vKiBWYXJpYWJsZXMgKi9cbmxldCBicm93VGltZXIgPSBudWxsO1xubGV0IGJyb3dHcmlkID0gbnVsbDtcblxuLyoqXG4gKlx0QGRlc2NyaXB0aW9uIFZhbGlkYXRlcyB0aGUgdXNlcnMgdGltZXIgc2V0dGluZ3MuXG4gKi9cbmxldCB2YWxpZGF0ZUJyb3dUaW1lciA9IGZ1bmN0aW9uICgpIHtcblx0YnJvd1RpbWVyID0gbmV3IEJyb3dUaW1lcih0aW1lcik7XG5cdGxldCBkYXRlU2V0dGluZ3MgPSB7IGRhdGVGb3JtYXQ6IG51bGwsIGFiYnJldmlhdGlvbnM6IGZhbHNlIH07XG5cblx0aWYgKCFsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pIHtcblx0XHRkYXRlU2V0dGluZ3MuZGF0ZUZvcm1hdCA9ICcyNGgnO1xuXHRcdGJyb3dUaW1lci5zZXREYXRlRm9ybWF0KHtcblx0XHRcdCdmb3JtYXQnOiBkYXRlU2V0dGluZ3MuZGF0ZUZvcm1hdFxuXHRcdH0pO1xuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKEJST1dfU0VUVElOR1MsIEpTT04uc3RyaW5naWZ5KGRhdGVTZXR0aW5ncykpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdGRhdGVTZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKTtcblx0XHRicm93VGltZXIuc2V0RGF0ZUZvcm1hdCh7XG5cdFx0XHQnZm9ybWF0JzogZGF0ZVNldHRpbmdzLmRhdGVGb3JtYXQsXG5cdFx0XHQnYWJicmV2aWF0aW9ucyc6IGRhdGVTZXR0aW5ncy5hYmJyZXZpYXRpb25zXG5cdFx0fSk7XG5cdH1cblxuXHRicm93VGltZXIucnVuKCk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0QWRkcyBhbGwgZGlhbG9nLlxuICovXG5sZXQgaW5pdERpYWxvZ3MgPSBmdW5jdGlvbiAoKSB7XG5cdGxldCBjdXJyZW50TG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zbGljZSgwLCAtMSk7XG5cblx0W10uZm9yRWFjaC5jYWxsKG9wZW5EaWFsb2csIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0bGV0IGRpYWxvZ0NvbnRlbnRcdD0gaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGlhbG9nJyk7XG5cdFx0bGV0IGRpYWxvZ0NhbGxiYWNrID0gZmFsc2U7XG5cblx0XHRpZiAoZGlhbG9nQ29udGVudCA9PT0gJ3NldHRpbmdzJykge1xuXHRcdFx0ZGlhbG9nQ2FsbGJhY2sgPSBkaWFsb2dTZXR0aW5nc0NhbGxiYWNrO1xuXHRcdH1cblxuXHRcdGxldCBicm93RGlhbG9nID0gbmV3IEJyb3dEaWFsb2coe1xuXHRcdFx0ZWxlbTogaXRlbSxcblx0XHRcdGRpYWxvZ0VsZW06IGRpYWxvZyxcblx0XHRcdGNvbnRlbnQ6IGAke2N1cnJlbnRMb2NhdGlvbn0vbWFya3VwL2RpYWxvZy0ke2RpYWxvZ0NvbnRlbnR9Lmh0bWxgLFxuXHRcdFx0Y2FsbGJhY2s6IGRpYWxvZ0NhbGxiYWNrLFxuXHRcdFx0cGFyYW1zOiB7IGJyb3dUaW1lciB9XG5cdFx0fSk7XG5cblx0XHRicm93RGlhbG9nLmluaXQoKTtcblx0fSk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0R2V0cyBsb2NhbFN0b3JhZ2UsIHBhcnNlcyBhdmFpbGFibGUgY2FyZHMgYW5kIGNyZWF0ZXMgdGhlbS5cbiAqIEBwYXJhbVx0XHRcdHtOdW1iZXJ8U3RyaW5nfSBpbmRleFxuICovXG5sZXQgcGFyc2VDYXJkc0Zyb21TdG9yYWdlID0gZnVuY3Rpb24gKGluZGV4KSB7XG5cdGxldCBzdG9yYWdlSXRlbSA9IEpTT04ucGFyc2UoXG5cdFx0bG9jYWxTdG9yYWdlLmdldEl0ZW0oIGxvY2FsU3RvcmFnZS5rZXkoaW5kZXgpIClcblx0KTtcblxuXHRpZiAoc3RvcmFnZUl0ZW0ubW9kdWxlKSB7XG5cdFx0bGV0IGJyb3dDYXJkID0gbmV3IEJyb3dDYXJkKHtcblx0XHRcdHR5cGU6IHN0b3JhZ2VJdGVtLnR5cGUsXG5cdFx0XHRndWlkOiBzdG9yYWdlSXRlbS5ndWlkLFxuXHRcdFx0Y29udGVudDogc3RvcmFnZUl0ZW0uY29udGVudCxcblx0XHRcdHN0eWxlOiBzdG9yYWdlSXRlbS5zdHlsZVxuXHRcdH0pO1xuXHRcdGNvbnRlbnQuYXBwZW5kQ2hpbGQoIGJyb3dDYXJkICk7XG5cdH1cbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRDYWxscyB0aGUgTGF5b3V0TWFuYWdlciBjbGFzcy5cbiAqL1xubGV0IGluaXRMYXlvdXRNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuXHRicm93R3JpZCA9IG5ldyBCcm93TGF5b3V0TWFuYWdlciggY29udGVudCwgY29udGVudE92ZXJsYXkgKTtcblx0YnJvd0dyaWQubGF5b3V0KCk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGxvY2FsU3RvcmFnZSBhbmQgbG9hZHMgdGhlIHVzZXJzIGNhcmRzXG4gKiBAcGFyYW1cdFx0XHR7T2JqZWN0fSBzdG9yYWdlXG4gKi9cbmxldCB2YWxpZGF0ZUJyb3dDYXJkcyA9IGZ1bmN0aW9uICgpIHtcblx0aWYgKCFsb2NhbFN0b3JhZ2VbQlJPV19DQVJEU10gfHwgbG9jYWxTdG9yYWdlLmxlbmd0aCA8PSAxKSB7XG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oQlJPV19DQVJEUywgdHJ1ZSk7XG5cdFx0bGV0IGRlZmF1bHRDYXJkID0gbmV3IEJyb3dDYXJkKHsgdHlwZTogJ3RleHQnIH0pO1xuXHRcdGNvbnRlbnQuYXBwZW5kQ2hpbGQoIGRlZmF1bHRDYXJkICk7XG5cdH0gZWxzZSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyBpKyspIHtcblx0XHRcdHBhcnNlQ2FyZHNGcm9tU3RvcmFnZShpKTtcblx0XHR9XG5cdH1cbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRDaGVja3MgY2xpY2tlZCBjYXJkIHR5cGUgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIERPTS5cbiAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IGV2ZW50XG4gKi9cbmxldCBhZGROZXdDYXJkID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0bGV0IHNlbGVjdGVkQ2FyZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWNyZWF0ZS1jYXJkJyk7XG5cdGxldCBicm93Q2FyZCA9IG5ldyBCcm93Q2FyZCh7IHR5cGU6IGAke3NlbGVjdGVkQ2FyZH1gIH0pO1xuXG5cdGNvbnRlbnQuYXBwZW5kQ2hpbGQoIGJyb3dDYXJkICk7XG5cdGJyb3dHcmlkLmFkZCggYnJvd0NhcmQgKTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRCaW5kIGV2ZW50cyB0byBlbGVtZW50cy5cbiAqL1xubGV0IGFkZEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcblx0W10uZm9yRWFjaC5jYWxsKG5ld0NhcmQsIChpdGVtKSA9PiB7XG5cdFx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZE5ld0NhcmQpO1xuXHR9KTtcbn07XG5cbi8qIEluaXRpYWxpc2UgYXBwICovXG53aW5kb3cuaXNFZGl0TW9kZSA9IGZhbHNlO1xudmFsaWRhdGVCcm93Q2FyZHMoKTtcbnZhbGlkYXRlQnJvd1RpbWVyKCk7XG5pbml0TGF5b3V0TWFuYWdlcigpO1xuaW5pdERpYWxvZ3MoKTtcbnNldFRoZW1lKCk7XG5hZGRFdmVudHMoKTsiLCIvKipcbiAqIEBuYW1lXHRcdFx0XHRCcm93Q2FyZFxuICogQGRlc2NyaXB0aW9uXHQvXG4gKi9cbmNsYXNzIEJyb3dDYXJkIHtcblx0Y29uc3RydWN0b3IgKGNvbmZpZyA9IHt9KSB7XG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XG5cdFx0dGhpcy5lbGVtID0gdGhpcy5jcmVhdGVDYXJkKCk7XG5cdFx0dGhpcy5pbml0aWFsaXNlQ2FyZCgpO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWxlbTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdFJldHVybnMgYSBuZXcgY2FyZCBlbGVtZW50LlxuXHQgKiBAcmV0dXJuIFx0XHRcdHtIVE1MRWxlbWVudH1cblx0ICovXG5cdGNyZWF0ZUNhcmQgKCkge1xuXHRcdHN3aXRjaCAodGhpcy5jb25maWcudHlwZSkge1xuXHRcdFx0Y2FzZSAndGV4dCc6IHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0LWNhcmQnKTtcblx0XHRcdGNhc2UgJ3dlYXRoZXInOiByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnd2VhdGhlci1jYXJkJyk7XG5cdFx0XHRjYXNlICd0b2RvJzogcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RvZG8tY2FyZCcpO1xuXHRcdFx0ZGVmYXVsdDogcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHQtY2FyZCcpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdEFwcGxpZXMgY2xhc3MgZWxlbWVudCBhbmQgY2FsbHMgaW5pdGlhbGlzZSgpLlxuXHQgKi9cblx0aW5pdGlhbGlzZUNhcmQgKCkge1xuXHRcdHRoaXMuZWxlbS5pbml0aWFsaXNlKCB0aGlzLmNvbmZpZyApO1xuXHRcdHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdicm93LWNvbnRlbnRfX21vZHVsZScpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJyb3dDYXJkOyIsIi8qKlxuICogQG5hbWVcdFx0XHRcdEJyb3dEaWFsb2dcbiAqIEBkZXNjcmlwdGlvblx0U2hvd3MvaGlkZXMgdGhlIGRpYWxvZy5cbiAqL1xuY2xhc3MgQnJvd0RpYWxvZyB7XG5cdGNvbnN0cnVjdG9yIChjb25maWcpIHtcblx0XHR0aGlzLmVsZW0gPSBjb25maWcuZWxlbTtcblx0XHR0aGlzLmJ1dHRvblx0PSB0aGlzLmVsZW0uY2hpbGRyZW5bMF07XG5cdFx0dGhpcy5pbml0QnV0dG9uSWNvbiA9IHRoaXMuYnV0dG9uLmdldEF0dHJpYnV0ZSgnaWNvbicpO1xuXHRcdHRoaXMucGF0aCA9IGNvbmZpZy5jb250ZW50O1xuXHRcdHRoaXMuY2FsbGJhY2sgPSBjb25maWcuY2FsbGJhY2s7XG5cdFx0dGhpcy5jYWxsYmFja1BhcmFtcyA9IGNvbmZpZy5wYXJhbXM7XG5cdFx0dGhpcy5kaWFsb2dFbGVtID0gY29uZmlnLmRpYWxvZ0VsZW07XG5cdFx0dGhpcy5kaWFsb2dDb250YWluZXJcdD0gdGhpcy5kaWFsb2dFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2dfX2lubmVyJyk7XG5cdFx0dGhpcy5kaWFsb2dDb250ZW50ID0gbnVsbDtcblx0XHR0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG5cdH1cblxuXHRpbml0ICgpIHtcblx0XHR0aGlzLmFkZEV2ZW50cygpO1xuXHR9XG5cblx0LyoqXG5cdCAqXHRAZGVzY3JpcHRpb25cdExvYWRzIHRoZSBjb250ZW50XG5cdCAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IGV2ZW50XG5cdCAqL1xuXHRsb2FkQ29udGVudCAoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0ZmV0Y2godGhpcy5wYXRoKVxuXHRcdC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLnRleHQoKSlcblx0XHQudGhlbihib2R5ID0+IHtcblx0XHRcdHRoaXMuZGlhbG9nQ29udGFpbmVyLmlubmVySFRNTCA9IGJvZHk7XG5cdFx0XHR0aGlzLmRpYWxvZ0NvbnRlbnQgPSB0aGlzLmRpYWxvZ0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nX19jb250ZW50Jyk7XG5cdFx0XHR0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2ljb24nLCAnY2xvc2UnKTtcblx0XHRcdHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZSgnY29sb3InLCAnd2hpdGUnKTtcblx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnZGlhbG9nLWlzLXZpc2libGUnKTtcblx0XHRcdHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuXG5cdFx0XHRpZiAodGhpcy5jYWxsYmFjaykgeyB0aGlzLmNhbGxiYWNrKHRoaXMpOyB9XG5cdFx0fSk7XG5cdH1cblxuXG5cdC8qKlxuXHQgKlx0QGRlc2NyaXB0aW9uXHRDbG9zZXMgdGhlIGRpYWxvZ1xuXHQgKiBAcGFyYW1cdFx0XHR7T2JqZWN0fSBldmVudFxuXHQqL1xuXHRjbG9zZURpYWxvZyAoZXZlbnQpIHtcblx0XHRsZXQgYm9keUhhc0NsYXNzXHQ9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWFsb2ctaXMtdmlzaWJsZScpO1xuXHRcdGxldCBpc0Nsb3NlQnRuXHRcdD0gZXZlbnQudGFyZ2V0ID09PSB0aGlzLmVsZW07XG5cdFx0bGV0IGlzRVNDS2V5XHRcdD0gZXZlbnQua2V5Q29kZSA9PT0gMjc7XG5cblx0XHRpZiAodGhpcy5pc0FjdGl2ZSAmJiBib2R5SGFzQ2xhc3MgJiYgaXNDbG9zZUJ0biB8fCBpc0VTQ0tleSkge1xuXHRcdFx0Ly8gQ2xlYXIgRE9NXG5cdFx0XHR0aGlzLmRpYWxvZ0NvbnRhaW5lci5pbm5lckhUTUwgPSBudWxsO1xuXHRcdFx0Ly8gUmVzZXQgYnV0dG9uXG5cdFx0XHR0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2ljb24nLCB0aGlzLmluaXRCdXR0b25JY29uKTtcblx0XHRcdHRoaXMuYnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnY29sb3InKTtcblx0XHRcdC8vIFJlbW92ZSBjbGFzc1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdkaWFsb2ctaXMtdmlzaWJsZScpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKlx0QGRlc2NyaXB0aW9uXHRWYWxpZGF0ZXMgaWYgZGlhbG9nIGlzIHZpc2libGUgb3Igbm90LCBjbG9zZXMvbG9hZHMgaXQuXG5cdCAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IGV2ZW50XG5cdCAqL1xuXHRsb2FkT3JDbG9zZUNvbnRlbnQgKGV2ZW50KSB7XG5cdFx0bGV0IGRpYWxvZ0lzT3BlbiA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWFsb2ctaXMtdmlzaWJsZScpO1xuXG5cdFx0aWYgKGRpYWxvZ0lzT3Blbikge1xuXHRcdFx0dGhpcy5jbG9zZURpYWxvZyhldmVudCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5sb2FkQ29udGVudChldmVudCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqXHRAZGVzY3JpcHRpb25cdEFkZHMgZXZlbnRzXG5cdCAqL1xuXHRhZGRFdmVudHMgKCkge1xuXHRcdHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMubG9hZE9yQ2xvc2VDb250ZW50LmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5jbG9zZURpYWxvZy5iaW5kKHRoaXMpKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBCcm93RGlhbG9nOyIsIi8qZ2xvYmFscyBQYWNrZXJ5LERyYWdnYWJpbGx5Ki9cblxuaW1wb3J0IHsgaGFzQ3VzdG9tQ2FyZHMgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuXG4vKipcbiAqIEBuYW1lXHRcdFx0XHRCcm93TGF5b3V0TWFuYWdlclxuICogQGRlc2NyaXB0aW9uXHQvXG4gKi9cbmNsYXNzIEJyb3dMYXlvdXRNYW5hZ2VyIHtcblx0Y29uc3RydWN0b3IgKGNvbnRhaW5lciwgb3ZlcmxheSkge1xuXHRcdHRoaXMudHJhbnNpdGlvbiA9IDA7XG5cdFx0dGhpcy5kcmFnT3B0aW9ucyA9IHtcblx0XHRcdGhhbmRsZTogJy5icm93LWNvbnRlbnRfX21vZHVsZSAvZGVlcC8gLmRyYWdnLWFyZWEnXG5cdFx0fTtcblx0XHR0aGlzLnBrck9wdGlvbnMgPSB7XG5cdFx0XHRpdGVtU2VsZWN0b3I6ICcuYnJvdy1jb250ZW50X19tb2R1bGUnLFxuXHRcdFx0dHJhbnNpdGlvbkR1cmF0aW9uOiB0aGlzLnRyYW5zaXRpb24sXG5cdFx0XHRjb2x1bW5XaWR0aDogJy5icm93LWNvbnRlbnQtLXNpemVyJyxcblx0XHRcdGd1dHRlcjogJy5icm93LWNvbnRlbnQtLWd1dHRlcicsXG5cdFx0XHRzdGFtcDogJy5pcy1zdGFtcCcsXG5cdFx0XHRpc0luaXRMYXlvdXQ6IGZhbHNlXG5cdFx0fTtcblx0XHR0aGlzLnBhY2tlcnkgPSBuZXcgUGFja2VyeShjb250YWluZXIsIHRoaXMucGtyT3B0aW9ucyk7XG5cdFx0dGhpcy5jb250ZW50ID0gY29udGFpbmVyO1xuXHRcdHRoaXMub3ZlcmxheSA9IG92ZXJsYXk7XG5cdFx0Y29uc29sZS5sb2codGhpcyk7XG5cdFx0dGhpcy5hZGRFdmVudHMoKTtcblx0XHR0aGlzLmFkZERyYWdnYWJpbGx5KCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRXaWxsIGluaXRpYWxpc2UgdGhlIFBhY2tlcnkgbGF5b3V0LlxuXHQgKi9cblx0bGF5b3V0ICgpIHtcblx0XHR0aGlzLnBhY2tlcnkubGF5b3V0KCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRBZGRzIGEgbmV3IGl0ZW0gdG8gdGhlIFBhY2tlcnkgbGF5b3V0LlxuXHQgKiBAcGFyYW0gXHRcdFx0e05vZGVMaXN0fEhUTUxFbGVtZW50fSBlbGVtXG5cdCAqL1xuXHRhZGQgKGVsZW0pIHtcblx0XHR0aGlzLnBhY2tlcnkuYXBwZW5kZWQoIGVsZW0gKTtcblx0XHR0aGlzLmFkZERyYWdnYWJpbGx5KCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRSZW1vdmVzIHBhc3NlZCBlbGVtZW50IGZyb20gdGhlIFBhY2tlcnkgbGF5b3V0LlxuXHQgKiBAcGFyYW0gXHRcdFx0e05vZGVMaXN0fEhUTUxFbGVtZW50fSBjb25maWdcblx0ICovXG5cdHJlbW92ZSAoZWxlbSkge1xuXHRcdHRoaXMucGFja2VyeS5yZW1vdmUoIGVsZW0gKTtcblx0XHR0aGlzLmxheW91dCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0TWFrZXMgYW4gZWxlbWVudCBzdGlja3kuXG5cdCAqIEBwYXJhbSBcdFx0XHR7Tm9kZUxpc3R8SFRNTEVsZW1lbnR9IGNvbmZpZ1xuXHQgKi9cblx0c3RhbXAgKGVsZW0pIHtcblx0XHR0aGlzLnBhY2tlcnkuc3RhbXAoIGVsZW0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdFVuc3RhbXBzIGFuIGVsZW1lbnQuXG5cdCAqIEBwYXJhbSBcdFx0XHR7Tm9kZUxpc3R8SFRNTEVsZW1lbnR9IGNvbmZpZ1xuXHQgKi9cblx0dW5zdGFtcCAoZWxlbSkge1xuXHRcdHRoaXMucGFja2VyeS51bnN0YW1wKCBlbGVtICk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRJbml0aWFsaXNlcyBEcmFnZ2FiaWxseS5cblx0ICovXG5cdGFkZERyYWdnYWJpbGx5ICgpIHtcblx0XHRsZXQgY2FyZHMgPSB0aGlzLnBhY2tlcnkuZ2V0SXRlbUVsZW1lbnRzKCk7XG5cdFx0Y2FyZHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHRcdFx0bGV0IGRyYWdnaWUgPSBuZXcgRHJhZ2dhYmlsbHkoaXRlbSwgdGhpcy5kcmFnT3B0aW9ucyk7XG5cdFx0XHR0aGlzLnBhY2tlcnkuYmluZERyYWdnYWJpbGx5RXZlbnRzKCBkcmFnZ2llICk7XG5cdFx0XHRkcmFnZ2llLm9uKCdwb2ludGVyRG93bicsIHRoaXMudmFsaWRhdGVFZGl0TW9kZS5iaW5kKGRyYWdnaWUpKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdEFkZHMgRXZlbnRMaXN0ZW5lci5cblx0ICovXG5cdGFkZEV2ZW50cyAoKSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NhcmQtZWRpdCcsIHRoaXMudmFsaWRhdGVMYXlvdXRTdGF0ZS5iaW5kKHRoaXMpKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2FyZC1zYXZlJywgdGhpcy52YWxpZGF0ZUxheW91dFN0YXRlLmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjYXJkLXJlbW92ZScsIHRoaXMudmFsaWRhdGVMYXlvdXRTdGF0ZS5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLm92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnZhbGlkYXRlTGF5b3V0U3RhdGUuYmluZCh0aGlzKSk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHREZWFjdGl2YXRlcyBlZGl0TW9kZSBhbmQgcmVtb3ZlcyBjbGFzc2VzIGZyb20gY29udGVudCBvdmVybGF5LlxuXHQgKi9cblx0ZGVhY3RpdmF0ZUVkaXRNb2RlICgpIHtcblx0XHR3aW5kb3cuaXNFZGl0TW9kZSA9IGZhbHNlO1xuXHRcdHRoaXMub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpcy1mYWRpbmcnKTtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHRoaXMub3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJywgJ2lzLWZhZGluZycpO1xuXHRcdH0sIDEwMCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRDaGVja3MgZXZlbnQgdHlwZSBhbmQgdmFsaWRhdGVzIHRoZSBsYXlvdXQncyBzdGF0ZS5cblx0ICogQHBhcmFtICBcdFx0XHR7T2JqZWN0fSBldmVudFxuXHQgKi9cblx0dmFsaWRhdGVMYXlvdXRTdGF0ZSAoZXZlbnQpIHtcblx0XHRsZXQgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWd1aWQ9XCIke2V2ZW50LmRldGFpbH1cIl1gKTtcblxuXHRcdC8vIGFjdGl2YXRlZCBlZGl0aW5nIG1vZGVcblx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NhcmQtZWRpdCcpIHtcblx0XHRcdHdpbmRvdy5pc0VkaXRNb2RlID0gdHJ1ZTtcblx0XHRcdHRoaXMub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpcy12aXNpYmxlJyk7XG5cdFx0fVxuXG5cdFx0Ly8gc2F2ZWQgY2FyZCBvciByZW1vdmUgY2FyZFxuXHRcdGlmIChldmVudC50eXBlID09PSAnY2FyZC1zYXZlJyB8fCBldmVudC50eXBlID09PSAnY2FyZC1yZW1vdmUnKSB7XG5cdFx0XHR0aGlzLmRlYWN0aXZhdGVFZGl0TW9kZSgpO1xuXG5cdFx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NhcmQtc2F2ZScpIHtcblx0XHRcdFx0dGhpcy5sYXlvdXQoKTtcblx0XHRcdFx0aGFzQ3VzdG9tQ2FyZHMoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdjYXJkLXJlbW92ZScpIHtcblx0XHRcdFx0dGhpcy5yZW1vdmUoZWxlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ2NsaWNrJyAmJiB3aW5kb3cuaXNFZGl0TW9kZSkge1xuXHRcdFx0ZWxlbSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcuaXMtZWRpdCcpO1xuXHRcdFx0ZWxlbS5zYXZlVG9TdG9yYWdlKCk7XG5cdFx0XHRlbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2Z4JywgJ2lzLWVkaXQnKTtcblx0XHRcdHRoaXMuZGVhY3RpdmF0ZUVkaXRNb2RlKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGlmIGVkaXRNb2RlIGlzIGFjdGl2ZSBhbmQgd2VpdGhlciBkaXNhYmxlcyBvciBlbmFibGVzIHRoZSBkcmFnZ2luZy5cblx0ICovXG5cdHZhbGlkYXRlRWRpdE1vZGUgKCkge1xuXHRcdGlmICh3aW5kb3cuaXNFZGl0TW9kZSkge1xuXHRcdFx0dGhpcy5kaXNhYmxlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZW5hYmxlKCk7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJyb3dMYXlvdXRNYW5hZ2VyOyIsIi8qKlxuICogQG5hbWVcdFx0XHRcdEJyb3dUaW1lclxuICogQGRlc2NyaXB0aW9uXHRDbGFzcyB3aGljaCBhcHBlbmRzIGEgdGltZSBzdHJpbmcgdG8gYW4gZWxlbWVudFxuICogICAgICAgICAgICAgIFx0YW5kIHVwZGF0ZXMgaXQgZXZlcnkgc2Vjb25kLlxuICovXG5jbGFzcyBCcm93VGltZXIge1xuXHRjb25zdHJ1Y3RvciAoZWxlbSkge1xuXHRcdGlmICghKGVsZW0gJiYgZWxlbS5ub2RlTmFtZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgWW91IGhhdmVuJ3QgcGFzc2VkIGEgdmFsaWQgSFRNTEVsZW1lbnQhYCk7XG5cdFx0fVxuXG5cdFx0dGhpcy51cGRhdGVcdD0gMTAwMDtcblx0XHR0aGlzLmVsZW1cdD0gZWxlbTtcblx0XHR0aGlzLmZvcm1hdCA9ICcyNGgnO1xuXHRcdHRoaXMuYWJicmV2aWF0aW9ucyA9IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0Q3JlYXRlcyBhIHN0cmluZyB3aXRoIGN1cnJlbnQgdGltZSBpbiBISDpNTTpTU1xuXHQgKiBAcmV0dXJuXHRcdFx0e1N0cmluZ31cblx0ICovXG5cdGdldFRpbWUgKCkge1xuXHRcdGxldCBkYXRlXHRcdFx0XHQ9IG5ldyBEYXRlKCk7XG5cdFx0bGV0IGRhdGVIb3Vyc1x0XHQ9IGRhdGUuZ2V0SG91cnMoKTtcblx0XHRsZXQgZGF0ZU1pbnV0ZXNcdD0gZGF0ZS5nZXRNaW51dGVzKCk7XG5cdFx0bGV0IGRhdGVTZWNvbmRzXHQ9IGRhdGUuZ2V0U2Vjb25kcygpO1xuXHRcdGxldCBkYXRlQWJiclx0XHQ9ICcnO1xuXG5cdFx0Ly8gSWYgdGltZSBmb3JtYXQgaXMgc2V0IHRvIDEyaCwgdXNlIDEyaC1zeXN0ZW0uXG5cdFx0aWYgKHRoaXMuZm9ybWF0ID09PSAnMTJoJykge1xuXHRcdFx0aWYgKHRoaXMuYWJicmV2aWF0aW9ucykge1xuXHRcdFx0XHRkYXRlQWJiciA9IHRoaXMuZ2V0QWJicmV2aWF0aW9uKGRhdGVIb3Vycyk7XG5cdFx0XHR9XG5cdFx0XHRkYXRlSG91cnMgPSAoZGF0ZUhvdXJzICUgMTIpID8gZGF0ZUhvdXJzICUgMTIgOiAxMjtcblx0XHR9XG5cblx0XHQvLyBBZGQgJzAnIGlmIGJlbG93IDEwXG5cdFx0aWYgKGRhdGVIb3VycyA8IDEwKSB7IGRhdGVIb3VycyA9IGAwJHtkYXRlSG91cnN9YDsgfVxuXHRcdGlmIChkYXRlTWludXRlcyA8IDEwKSB7IGRhdGVNaW51dGVzID0gYDAke2RhdGVNaW51dGVzfWA7IH1cblx0XHRpZiAoZGF0ZVNlY29uZHMgPCAxMCkgeyBkYXRlU2Vjb25kcyA9IGAwJHtkYXRlU2Vjb25kc31gOyB9XG5cblx0XHRyZXR1cm4gYCR7ZGF0ZUhvdXJzfToke2RhdGVNaW51dGVzfToke2RhdGVTZWNvbmRzfSAke2RhdGVBYmJyfWA7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRWYWxpZGF0ZXMgbnVtYmVyIGFuZCByZXR1cm5zIGVpdGhlciBBTSBvciBQTS5cblx0ICogQHBhcmFtIFx0XHRcdHtOdW1iZXJ9IHRpbWVcblx0ICogQHJldHVyblx0XHRcdHtTdHJpbmd9XG5cdCAqL1xuXHRnZXRBYmJyZXZpYXRpb24gKHRpbWUpIHtcblx0XHRpZiAodHlwZW9mIHRpbWUgIT09ICdudW1iZXInKSB7XG5cdFx0XHR0aW1lID0gcGFyc2VGbG9hdCh0aW1lKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gKHRpbWUgPj0gMTIpID8gJ1BNJyA6ICdBTSc7XG5cdH1cblxuXHQvKipcblx0ICpcdEBkZXNjcmlwdGlvblx0TmVlZHMgdG8gYmUgd3JpdHRlbi5cblx0ICogQHBhcmFtXHRcdFx0e09iamVjdH0gY29uZmlnXG5cdCAqL1xuXHRzZXREYXRlRm9ybWF0IChjb25maWcpIHtcblx0XHRpZiAoY29uZmlnKSB7XG5cdFx0XHR0aGlzLmZvcm1hdCA9IChjb25maWcuZm9ybWF0KSA/IGNvbmZpZy5mb3JtYXQgOiB0aGlzLmZvcm1hdDtcblx0XHRcdHRoaXMuYWJicmV2aWF0aW9ucyA9IGNvbmZpZy5hYmJyZXZpYXRpb25zO1xuXHRcdH1cblx0XHR0aGlzLnJ1bigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0U2V0cyB0aGUgZWxlbWVudCBpbiB3aGljaCB0aGUgdGltZSBzaG91bGQgYmUgZGlzcGxheWVkLlxuXHQgKiBAcGFyYW1cdFx0XHR7RWxlbWVudH0gZWxlbVxuXHQgKiBAcmV0dXJuIFx0XHRcdHtIVE1MRWxlbWVudH1cblx0ICovXG5cdHJ1biAoKSB7XG5cdFx0dGhpcy5lbGVtLnRleHRDb250ZW50ID0gdGhpcy5nZXRUaW1lKCk7XG5cblx0XHRzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHR0aGlzLmVsZW0udGV4dENvbnRlbnQgPSB0aGlzLmdldFRpbWUoKTtcblx0XHR9LCB0aGlzLnVwZGF0ZSk7XG5cblx0XHRyZXR1cm4gdGhpcy5lbGVtO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJyb3dUaW1lcjsiLCJleHBvcnQgY29uc3QgQlJPV19TRVRUSU5HUyA9ICdCUk9XX1NFVFRJTkdTJztcbmV4cG9ydCBjb25zdCBCUk9XX0tFWVx0XHQ9ICdCUk9XX1RIRU1FJztcbmV4cG9ydCBjb25zdCBCUk9XX0NBUkRTXHRcdD0gJ0JST1dfQ0FSRFMnO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfVEhFTUVcdD0gJ2JsdWUtYTQwMCc7IiwiZXhwb3J0IGxldCB0aW1lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy10aW1lcicpO1xuZXhwb3J0IGxldCBkaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtZGlhbG9nJyk7XG5leHBvcnQgbGV0IGNhcmRsaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWNhcmRsaXN0Jyk7XG5leHBvcnQgbGV0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY29udGVudCcpO1xuZXhwb3J0IGxldCBjb250ZW50T3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50X19vdmVybGF5Jyk7XG5leHBvcnQgbGV0IG9wZW5EaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcub3Blbi1kaWFsb2cnKTtcbmV4cG9ydCBsZXQgbmV3Q2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1uZXdjYXJkJyk7XG5leHBvcnQgbGV0IHNlbGVjdGlvbkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtc2VsZWN0aW9uJyk7IiwiaW1wb3J0IHsgQlJPV19TRVRUSU5HUywgQlJPV19DQVJEUywgREVGQVVMVF9USEVNRSB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdENoZWNrcyBpZiBjdXN0b20gdGhlbWUgc2V0dGluZ3MgYXJlIGF2YWlsYWJsZS5cbiAqIEByZXR1cm5cdFx0XHR7Qm9vbGVhbn1cbiAqL1xuY29uc3QgaXNDdXN0b21UaGVtZSA9IGZ1bmN0aW9uICgpIHtcblx0bGV0IGlzQ3VzdG9tID0gZmFsc2U7XG5cblx0aWYgKGxvY2FsU3RvcmFnZVtCUk9XX1NFVFRJTkdTXSkge1xuXHRcdGxldCBzZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKTtcblx0XHRpc0N1c3RvbSA9ICEhc2V0dGluZ3MudGhlbWU7XG5cdH1cblxuXHRyZXR1cm4gaXNDdXN0b207XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGlmIGN1c3RvbSBrZXkgaXMgc2V0LCBpZiBub3Q6IGRvIGl0LlxuICovXG5jb25zdCBoYXNDdXN0b21DYXJkcyA9IGZ1bmN0aW9uICgpIHtcblx0aWYgKCFsb2NhbFN0b3JhZ2VbQlJPV19DQVJEU10pIHtcblx0XHRsb2NhbFN0b3JhZ2VbQlJPV19DQVJEU10gPSB0cnVlO1xuXHR9XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIHZpYSByZWdleCBpZiBjbGFzc05hbWUgaXMgYSB0aGVtZS5cbiAqL1xuY29uc3QgY2hlY2tGb3JUaGVtZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuXHRsZXQgdGhlbWVSZWdFeCA9IC90aGVtZS0uKi87XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAodGhlbWVSZWdFeC50ZXN0KGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0W2ldKSkge1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdFtpXSApO1xuXHRcdH1cblx0fVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdFBhcnNlcyB0aGUgY3VzdG9tIHNldHRpbmdzIGZyb20gbG9jYWxTdG9yYWdlIGFuZCBzZXRzIGNsYXNzZXMuXG4gKi9cbmNvbnN0IHVwZGF0ZVRoZW1lRnJvbVN0b3JhZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdGxldCBzZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKTtcblx0Ly9sZXQgZGlhbG9nSXNPcGVuID0gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2RpYWxvZy1pcy12aXNpYmxlJyk7XG5cblx0Y2hlY2tGb3JUaGVtZUNsYXNzKCk7XG5cdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChgdGhlbWUtJHtzZXR0aW5ncy50aGVtZS5jb2xvcn1gKTtcblxuXHRpZiAoaXNDdXN0b21UaGVtZSgpICYmIHNldHRpbmdzLnRoZW1lLmhlYWRlcmJhcikge1xuXHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgndGhlbWUtaGVhZGVyYmFyJyk7XG5cdH1cbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRBZGRzIHRoZSB0aGVtZSBjbGFzcyB0byA8Ym9keT4gZnJvbSBpbml0aWFsIHNldHRpbmdzLlxuICogQHBhcmFtXHRcdFx0e1N0cmluZ30gdGhlbWVcbiAqL1xuY29uc3QgdXBkYXRlVGhlbWVGcm9tQ29uZmlnID0gZnVuY3Rpb24gKHRoZW1lKSB7XG5cdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChgdGhlbWUtJHt0aGVtZX1gKTtcbn07XG5cbi8qKlxuICpcdEBkZXNjcmlwdGlvblx0VXBkYXRlcyB0aGUgY3VycmVudCB0aGVtZS5cbiAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IHRoZW1lXG4gKi9cbmNvbnN0IHNldFRoZW1lID0gZnVuY3Rpb24gKHRoZW1lKSB7XG5cdGlmICghdGhlbWUgfHwgdHlwZW9mIHRoZW1lICE9PSAnc3RyaW5nJykge1xuXHRcdHRoZW1lID0gREVGQVVMVF9USEVNRTtcblx0fVxuXG5cdGlmIChpc0N1c3RvbVRoZW1lKCkpIHtcblx0XHR1cGRhdGVUaGVtZUZyb21TdG9yYWdlKCk7XG5cdH0gZWxzZSB7XG5cdFx0dXBkYXRlVGhlbWVGcm9tQ29uZmlnKCB0aGVtZSApO1xuXHR9XG59O1xuXG5leHBvcnQge1xuXHRpc0N1c3RvbVRoZW1lLFxuXHRoYXNDdXN0b21DYXJkcyxcblx0c2V0VGhlbWUsXG5cdHVwZGF0ZVRoZW1lRnJvbUNvbmZpZyxcblx0dXBkYXRlVGhlbWVGcm9tU3RvcmFnZVxufTsiLCJpbXBvcnQgeyBCUk9XX1NFVFRJTkdTLCBERUZBVUxUX1RIRU1FIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcbmltcG9ydCB7IGlzQ3VzdG9tVGhlbWUsIHNldFRoZW1lIH0gZnJvbSAnLi4vdXRpbHMvaGVscGVyJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdFZhbGlkYXRlcyBpbnB1dCBmaWVsZHMsIHVwZGF0ZXMgYnJvd1RoZW1lIGFuZCBzYXZlcyB0byBsb2NhbFN0b3JhZ2UuXG4gKiBAcGFyYW0gIFx0XHRcdHtPYmplY3R9IGV2ZW50XG4gKi9cbnZhciB1cGRhdGVUaGVtZSA9IGZ1bmN0aW9uIChldmVudCkge1xuXHRsZXQgY29sb3JIZWFkQ2hlY2tib3hcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR0aW5ncy0tY29sb3JlZGhlYWQnKTtcblx0Ly9sZXQgaXNUaGVtZUJ1dHRvblx0XHRcdD0gZXZlbnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1zZXR0aW5ncy10aGVtZScpO1xuXHQvL2xldCBpc1RoZW1lQ2hlY2tib3hcdFx0PSBldmVudC50YXJnZXQuaWQgPT09ICdzZXR0aW5ncy0tY29sb3JlZGhlYWQnO1xuXHRsZXQgc2V0dGluZ3NcdFx0XHRcdD0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pO1xuXG5cdC8vIElmIG5vIHRoZW1lIHNldHRpbmdzIGFyZSBzdG9yZWQgeWV0LlxuXHRpZiAoIXNldHRpbmdzLnRoZW1lKSB7XG5cdFx0c2V0dGluZ3MudGhlbWUgPSB7IGNvbG9yOiBERUZBVUxUX1RIRU1FLCBoZWFkZXJiYXI6IGZhbHNlIH07XG5cdH1cblxuXHQvLyBJcyB0aGVtZSBvcHRpb25cblx0aWYgKGV2ZW50LnRhcmdldC5oYXNBdHRyaWJ1dGUoJ2RhdGEtc2V0dGluZ3MtdGhlbWUnKSkge1xuXHRcdHNldHRpbmdzLnRoZW1lLmNvbG9yID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1zZXR0aW5ncy10aGVtZScpO1xuXHR9XG5cblx0Ly8gSWYgY29sb3JlZCBoZWFkZXIgYmFyIGlzIGNsaWNrZWRcblx0aWYgKGV2ZW50LnRhcmdldC5pZCA9PT0gJ3NldHRpbmdzLS1jb2xvcmVkaGVhZCcpIHtcblx0XHRzZXR0aW5ncy50aGVtZS5oZWFkZXJiYXIgPSBjb2xvckhlYWRDaGVja2JveC5jaGVja2VkO1xuXHR9XG5cblx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oQlJPV19TRVRUSU5HUywgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MpKTtcblx0c2V0VGhlbWUoKTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRWYWxpZGF0ZXMgaW5wdXQgZmllbGRzLCB1cGRhdGVzIGJyb3dUaW1lciBhbmQgc2F2ZXMgdG8gbG9jYWxTdG9yYWdlLlxuICogQHBhcmFtICBcdFx0XHR7T2JqZWN0fSBldmVudFxuICovXG52YXIgdXBkYXRlRGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChldmVudCkge1xuXHRsZXQgZm9ybWF0Q2hlY2tib3hcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR0aW5ncy0tZGF0ZWZvcm1hdCcpO1xuXHRsZXQgYWJickNoZWNrYm94XHRcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR0aW5ncy0tYW1wbScpO1xuXHRsZXQgdGltZUZvcm1hdFx0XHRcdD0gJzI0aCc7XG5cdGxldCBkYXRlU2V0dGluZ3NcdFx0PSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtCUk9XX1NFVFRJTkdTXSk7XG5cblx0Ly8gSWYgZGF0ZSBmb3JtYXQgY2hlY2tib3ggaXMgY2xpY2tlZFxuXHRpZiAoZXZlbnQudGFyZ2V0LmlkID09PSAnc2V0dGluZ3MtLWRhdGVmb3JtYXQnKSB7XG5cdFx0aWYgKCFmb3JtYXRDaGVja2JveC5jaGVja2VkKSB7XG5cdFx0XHR0aW1lRm9ybWF0ID0gJzEyaCc7XG5cdFx0XHRhYmJyQ2hlY2tib3guZGlzYWJsZWQgPSBmYWxzZTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoZm9ybWF0Q2hlY2tib3guY2hlY2tlZCAmJiAhYWJickNoZWNrYm94LmRpc2FibGVkKSB7XG5cdFx0XHRhYmJyQ2hlY2tib3guZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0YWJickNoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcblx0XHR9XG5cblx0XHR0aGlzLmNhbGxiYWNrUGFyYW1zLmJyb3dUaW1lci5zZXREYXRlRm9ybWF0KHsgJ2Zvcm1hdCc6IHRpbWVGb3JtYXQgfSk7XG5cdFx0ZGF0ZVNldHRpbmdzLmRhdGVGb3JtYXQgPSB0aW1lRm9ybWF0O1xuXHRcdGRhdGVTZXR0aW5ncy5hYmJyZXZpYXRpb25zID0gYWJickNoZWNrYm94LmNoZWNrZWQ7XG5cdH1cblxuXHQvLyBJZiBhYmJyZXZpYXRpb24gY2hlY2tib3ggaXMgY2xpY2tlZFxuXHRpZiAoIWV2ZW50LnRhcmdldC5kaXNhYmxlZCAmJiBldmVudC50YXJnZXQuaWQgPT09ICdzZXR0aW5ncy0tYW1wbScpIHtcblx0XHR0aGlzLmNhbGxiYWNrUGFyYW1zLmJyb3dUaW1lci5zZXREYXRlRm9ybWF0KHsgJ2FiYnJldmlhdGlvbnMnOiBhYmJyQ2hlY2tib3guY2hlY2tlZCB9KTtcblx0XHRkYXRlU2V0dGluZ3MuYWJicmV2aWF0aW9ucyA9IGFiYnJDaGVja2JveC5jaGVja2VkO1xuXHR9XG5cblx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oQlJPV19TRVRUSU5HUywgSlNPTi5zdHJpbmdpZnkoZGF0ZVNldHRpbmdzKSk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0QWRkcyBjYWxsYmFjayB0byBjb250ZW50IGluIGRpYWxvZyBhbmQgdmFsaWRhdGVzIDxpbnB1dD4gZmllbGRzLlxuICovXG52YXIgZGlhbG9nU2V0dGluZ3NDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcblx0bGV0IHRpbWVDb250ZW50XHRcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50X190aW1lJyk7XG5cdGxldCB0aGVtZUNvbnRlbnRcdFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnRfX3RoZW1lJyk7XG5cdGxldCBmb3JtYXRDaGVja2JveFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLS1kYXRlZm9ybWF0Jyk7XG5cdGxldCBhYmJyQ2hlY2tib3hcdFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLS1hbXBtJyk7XG5cdGxldCB0aGVtZUNoZWNrYm94XHRcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR0aW5ncy0tY29sb3JlZGhlYWQnKTtcblx0bGV0IGJyb3dTZXR0aW5nc1x0XHQ9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKTtcblxuXHQvLyBWYWxpZGF0ZSBkYXRlIHNldHRpbmdzIGFuZCB1cGRhdGUgRE9NXG5cdGlmIChicm93U2V0dGluZ3MuZGF0ZUZvcm1hdCA9PT0gJzEyaCcpIHtcblx0XHRmb3JtYXRDaGVja2JveC5jaGVja2VkID0gZmFsc2U7XG5cdH1cblx0YWJickNoZWNrYm94LmNoZWNrZWQgPSBicm93U2V0dGluZ3MuYWJicmV2aWF0aW9ucztcblx0YWJickNoZWNrYm94LmRpc2FibGVkID0gIWJyb3dTZXR0aW5ncy5hYmJyZXZpYXRpb25zO1xuXG5cdC8vIFZhbGlkYXRlIGhlYWRlciBiYXIgc2V0dGluZ3MgYW5kIHVwZGF0ZSBET01cblx0aWYgKGlzQ3VzdG9tVGhlbWUoKSkge1xuXHRcdHRoZW1lQ2hlY2tib3guY2hlY2tlZCA9IGJyb3dTZXR0aW5ncy50aGVtZS5oZWFkZXJiYXI7XG5cdH1cblxuXHQvLyBBZGQgZXZlbnRMaXN0ZW5lclxuXHR0aW1lQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHVwZGF0ZURhdGVGb3JtYXQuYmluZCh0aGlzKSk7XG5cdHRoZW1lQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHVwZGF0ZVRoZW1lLmJpbmQodGhpcykpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZGlhbG9nU2V0dGluZ3NDYWxsYmFjazsiXX0=
