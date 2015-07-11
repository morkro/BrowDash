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

var _modulesSnackbar = require('./modules/snackbar');

var _modulesSnackbar2 = _interopRequireDefault(_modulesSnackbar);

/* Variables */
var browTimer = null;
var browGrid = null;
var onlineCounter = 0;

/**
 * @description Validates if user is online/offline and sends proper notification.
 */
var validateOnOfflineState = function validateOnOfflineState() {
	var snack = new _modulesSnackbar2['default']();

	if (onlineCounter) {
		if (!navigator.onLine) {
			snack.alert('Your internet connection suddenly went offline. BrowDash will still work like before, but some cards might not update.');
		} else {
			snack.alert('Your internet connection is stable again, awesome!');
		}
	}

	onlineCounter++;
};

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
	window.addEventListener('online', validateOnOfflineState);
	window.addEventListener('offline', validateOnOfflineState);
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
validateOnOfflineState();
_utilsHelper.setTheme();
addEvents();

},{"./modules/card":2,"./modules/dialog":3,"./modules/layoutmanager":4,"./modules/snackbar":5,"./modules/timer":6,"./utils/constants":7,"./utils/elements":8,"./utils/helper":9,"./views/dialog.settings":10}],2:[function(require,module,exports){
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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsElements = require('../utils/elements');

/**
 * @name				Snackbar
 * @description	/
 */

var Snackbar = (function () {
	function Snackbar() {
		_classCallCheck(this, Snackbar);

		this.duration = 10000;
		this.elem = _utilsElements.snackbar;
		this['default'] = 'Ooops, something went wrong! :(';
		this.message = null;
	}

	Snackbar.prototype.alert = function alert() {
		var msg = arguments[0] === undefined ? this['default'] : arguments[0];

		this.message = msg.trim();
		this.show();
		console.log('this');
	};

	Snackbar.prototype.show = function show() {
		var _this = this;

		this.elem.innerHTML = null;
		this.elem.appendChild(this.createParagraph());
		this.elem.classList.add('is-visible');
		setTimeout(function () {
			_this.elem.classList.remove('is-visible');
			_this.message = null;
		}, this.duration);
	};

	Snackbar.prototype.createParagraph = function createParagraph() {
		var p = document.createElement('p');
		p.innerText = this.message;
		return p;
	};

	_createClass(Snackbar, [{
		key: 'setDuration',
		set: function set(duration) {
			this.duration = duration;
		}
	}]);

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvYXBwLmluaXQuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvbW9kdWxlcy9jYXJkLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvZGlhbG9nLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvbGF5b3V0bWFuYWdlci5qcyIsIi9Vc2Vycy9tb3Jrcm9nZS9EZXNrdG9wL1Byb2plY3RzL1BlcnNvbmFsL0Jyb3dEYXNoL3NyYy9zY3JpcHRzL2VzNi9tb2R1bGVzL3NuYWNrYmFyLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvdGltZXIuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvdXRpbHMvY29uc3RhbnRzLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L3V0aWxzL2VsZW1lbnRzLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L3V0aWxzL2hlbHBlci5qcyIsIi9Vc2Vycy9tb3Jrcm9nZS9EZXNrdG9wL1Byb2plY3RzL1BlcnNvbmFsL0Jyb3dEYXNoL3NyYy9zY3JpcHRzL2VzNi92aWV3cy9kaWFsb2cuc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs2QkNDNEUsa0JBQWtCOzs4QkFDcEQsbUJBQW1COzsyQkFDcEMsZ0JBQWdCOzttQ0FDTix5QkFBeUI7Ozs7NEJBQzFDLGlCQUFpQjs7Ozs2QkFDaEIsa0JBQWtCOzs7OzJCQUNwQixnQkFBZ0I7Ozs7b0NBQ1AseUJBQXlCOzs7OytCQUM5QixvQkFBb0I7Ozs7O0FBR3pDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDOzs7OztBQUt0QixJQUFJLHNCQUFzQixHQUFHLFNBQXpCLHNCQUFzQixHQUFlO0FBQ3hDLEtBQUksS0FBSyxHQUFHLGtDQUFjLENBQUM7O0FBRTNCLEtBQUksYUFBYSxFQUFFO0FBQ2xCLE1BQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQ3RCLFFBQUssQ0FBQyxLQUFLLDBIQUEwSCxDQUFDO0dBQ3RJLE1BQ0k7QUFDSixRQUFLLENBQUMsS0FBSyxzREFBc0QsQ0FBQztHQUNsRTtFQUNEOztBQUVELGNBQWEsRUFBRSxDQUFDO0NBQ2hCLENBQUM7Ozs7O0FBS0YsSUFBSSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxHQUFlO0FBQy9CLFVBQVMsR0FBRyw2Q0FyQ0osS0FBSyxDQXFDZSxDQUFDO0FBQzdCLEtBQUksWUFBWSxHQUFHLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUM7O0FBRTlELEtBQUksQ0FBQyxZQUFZLGlCQXZDVCxhQUFhLENBdUNXLEVBQUU7QUFDakMsY0FBWSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDaEMsV0FBUyxDQUFDLGFBQWEsQ0FBQztBQUN2QixXQUFRLEVBQUUsWUFBWSxD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ZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIEltcG9ydCBkZXBlbmRlbmNpZXMgKi9cbmltcG9ydCB7IHRpbWVyLCBvcGVuRGlhbG9nLCBkaWFsb2csIG5ld0NhcmQsIGNvbnRlbnQsIGNvbnRlbnRPdmVybGF5IH0gZnJvbSAnLi91dGlscy9lbGVtZW50cyc7XG5pbXBvcnQgeyBCUk9XX1NFVFRJTkdTLCBCUk9XX0NBUkRTIH0gZnJvbSAnLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHsgc2V0VGhlbWUgfSBmcm9tICcuL3V0aWxzL2hlbHBlcic7XG5pbXBvcnQgZGlhbG9nU2V0dGluZ3NDYWxsYmFjayBmcm9tICcuL3ZpZXdzL2RpYWxvZy5zZXR0aW5ncyc7XG5pbXBvcnQgVGltZXIgZnJvbSAnLi9tb2R1bGVzL3RpbWVyJztcbmltcG9ydCBEaWFsb2cgZnJvbSAnLi9tb2R1bGVzL2RpYWxvZyc7XG5pbXBvcnQgQ2FyZCBmcm9tICcuL21vZHVsZXMvY2FyZCc7XG5pbXBvcnQgTGF5b3V0TWFuYWdlciBmcm9tICcuL21vZHVsZXMvbGF5b3V0bWFuYWdlcic7XG5pbXBvcnQgU25hY2tiYXIgZnJvbSAnLi9tb2R1bGVzL3NuYWNrYmFyJztcblxuLyogVmFyaWFibGVzICovXG5sZXQgYnJvd1RpbWVyID0gbnVsbDtcbmxldCBicm93R3JpZCA9IG51bGw7XG5sZXQgb25saW5lQ291bnRlciA9IDA7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIFZhbGlkYXRlcyBpZiB1c2VyIGlzIG9ubGluZS9vZmZsaW5lIGFuZCBzZW5kcyBwcm9wZXIgbm90aWZpY2F0aW9uLlxuICovXG5sZXQgdmFsaWRhdGVPbk9mZmxpbmVTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0bGV0IHNuYWNrID0gbmV3IFNuYWNrYmFyKCk7XG5cblx0aWYgKG9ubGluZUNvdW50ZXIpIHtcblx0XHRpZiAoIW5hdmlnYXRvci5vbkxpbmUpIHtcblx0XHRcdHNuYWNrLmFsZXJ0KGBZb3VyIGludGVybmV0IGNvbm5lY3Rpb24gc3VkZGVubHkgd2VudCBvZmZsaW5lLiBCcm93RGFzaCB3aWxsIHN0aWxsIHdvcmsgbGlrZSBiZWZvcmUsIGJ1dCBzb21lIGNhcmRzIG1pZ2h0IG5vdCB1cGRhdGUuYCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0c25hY2suYWxlcnQoYFlvdXIgaW50ZXJuZXQgY29ubmVjdGlvbiBpcyBzdGFibGUgYWdhaW4sIGF3ZXNvbWUhYCk7XG5cdFx0fVxuXHR9XG5cblx0b25saW5lQ291bnRlcisrO1xufTtcblxuLyoqXG4gKlx0QGRlc2NyaXB0aW9uIFZhbGlkYXRlcyB0aGUgdXNlcnMgdGltZXIgc2V0dGluZ3MuXG4gKi9cbmxldCB2YWxpZGF0ZVRpbWVyID0gZnVuY3Rpb24gKCkge1xuXHRicm93VGltZXIgPSBuZXcgVGltZXIodGltZXIpO1xuXHRsZXQgZGF0ZVNldHRpbmdzID0geyBkYXRlRm9ybWF0OiBudWxsLCBhYmJyZXZpYXRpb25zOiBmYWxzZSB9O1xuXG5cdGlmICghbG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKSB7XG5cdFx0ZGF0ZVNldHRpbmdzLmRhdGVGb3JtYXQgPSAnMjRoJztcblx0XHRicm93VGltZXIuc2V0RGF0ZUZvcm1hdCh7XG5cdFx0XHQnZm9ybWF0JzogZGF0ZVNldHRpbmdzLmRhdGVGb3JtYXRcblx0XHR9KTtcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShCUk9XX1NFVFRJTkdTLCBKU09OLnN0cmluZ2lmeShkYXRlU2V0dGluZ3MpKTtcblx0fVxuXHRlbHNlIHtcblx0XHRkYXRlU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtCUk9XX1NFVFRJTkdTXSk7XG5cdFx0YnJvd1RpbWVyLnNldERhdGVGb3JtYXQoe1xuXHRcdFx0J2Zvcm1hdCc6IGRhdGVTZXR0aW5ncy5kYXRlRm9ybWF0LFxuXHRcdFx0J2FiYnJldmlhdGlvbnMnOiBkYXRlU2V0dGluZ3MuYWJicmV2aWF0aW9uc1xuXHRcdH0pO1xuXHR9XG5cblx0YnJvd1RpbWVyLnJ1bigpO1xufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdEFkZHMgYWxsIGRpYWxvZy5cbiAqL1xubGV0IGluaXREaWFsb2dzID0gZnVuY3Rpb24gKCkge1xuXHRsZXQgY3VycmVudExvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc2xpY2UoMCwgLTEpO1xuXG5cdFtdLmZvckVhY2guY2FsbChvcGVuRGlhbG9nLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdGxldCBkaWFsb2dDb250ZW50XHQ9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWRpYWxvZycpO1xuXHRcdGxldCBkaWFsb2dDYWxsYmFjayA9IGZhbHNlO1xuXG5cdFx0aWYgKGRpYWxvZ0NvbnRlbnQgPT09ICdzZXR0aW5ncycpIHtcblx0XHRcdGRpYWxvZ0NhbGxiYWNrID0gZGlhbG9nU2V0dGluZ3NDYWxsYmFjaztcblx0XHR9XG5cblx0XHRsZXQgYnJvd0RpYWxvZyA9IG5ldyBEaWFsb2coe1xuXHRcdFx0ZWxlbTogaXRlbSxcblx0XHRcdGRpYWxvZ0VsZW06IGRpYWxvZyxcblx0XHRcdGNvbnRlbnQ6IGAke2N1cnJlbnRMb2NhdGlvbn0vbWFya3VwL2RpYWxvZy0ke2RpYWxvZ0NvbnRlbnR9Lmh0bWxgLFxuXHRcdFx0Y2FsbGJhY2s6IGRpYWxvZ0NhbGxiYWNrLFxuXHRcdFx0cGFyYW1zOiB7IFRpbWVyIH1cblx0XHR9KTtcblxuXHRcdGJyb3dEaWFsb2cuaW5pdCgpO1xuXHR9KTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRHZXRzIGxvY2FsU3RvcmFnZSwgcGFyc2VzIGF2YWlsYWJsZSBjYXJkcyBhbmQgY3JlYXRlcyB0aGVtLlxuICogQHBhcmFtXHRcdFx0e051bWJlcnxTdHJpbmd9IGluZGV4XG4gKi9cbmxldCBwYXJzZUNhcmRzRnJvbVN0b3JhZ2UgPSBmdW5jdGlvbiAoaW5kZXgpIHtcblx0bGV0IHN0b3JhZ2VJdGVtID0gSlNPTi5wYXJzZShcblx0XHRsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggbG9jYWxTdG9yYWdlLmtleShpbmRleCkgKVxuXHQpO1xuXG5cdGlmIChzdG9yYWdlSXRlbS5tb2R1bGUpIHtcblx0XHRsZXQgYnJvd0NhcmQgPSBuZXcgQ2FyZCh7XG5cdFx0XHR0eXBlOiBzdG9yYWdlSXRlbS50eXBlLFxuXHRcdFx0Z3VpZDogc3RvcmFnZUl0ZW0uZ3VpZCxcblx0XHRcdGNvbnRlbnQ6IHN0b3JhZ2VJdGVtLmNvbnRlbnQsXG5cdFx0XHRzdHlsZTogc3RvcmFnZUl0ZW0uc3R5bGVcblx0XHR9KTtcblx0XHRjb250ZW50LmFwcGVuZENoaWxkKCBicm93Q2FyZCApO1xuXHR9XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2FsbHMgdGhlIExheW91dE1hbmFnZXIgY2xhc3MuXG4gKi9cbmxldCBpbml0TGF5b3V0TWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcblx0YnJvd0dyaWQgPSBuZXcgTGF5b3V0TWFuYWdlciggY29udGVudCwgY29udGVudE92ZXJsYXkgKTtcblx0YnJvd0dyaWQubGF5b3V0KCk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGxvY2FsU3RvcmFnZSBhbmQgbG9hZHMgdGhlIHVzZXJzIGNhcmRzXG4gKiBAcGFyYW1cdFx0XHR7T2JqZWN0fSBzdG9yYWdlXG4gKi9cbmxldCB2YWxpZGF0ZUJyb3dDYXJkcyA9IGZ1bmN0aW9uICgpIHtcblx0aWYgKCFsb2NhbFN0b3JhZ2VbQlJPV19DQVJEU10gfHwgbG9jYWxTdG9yYWdlLmxlbmd0aCA8PSAxKSB7XG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oQlJPV19DQVJEUywgdHJ1ZSk7XG5cdFx0bGV0IGRlZmF1bHRDYXJkID0gbmV3IENhcmQoeyB0eXBlOiAndGV4dCcgfSk7XG5cdFx0Y29udGVudC5hcHBlbmRDaGlsZCggZGVmYXVsdENhcmQgKTtcblx0fSBlbHNlIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0cGFyc2VDYXJkc0Zyb21TdG9yYWdlKGkpO1xuXHRcdH1cblx0fVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdENoZWNrcyBjbGlja2VkIGNhcmQgdHlwZSBhbmQgYXBwZW5kcyBpdCB0byB0aGUgRE9NLlxuICogQHBhcmFtXHRcdFx0e09iamVjdH0gZXZlbnRcbiAqL1xubGV0IGFkZE5ld0NhcmQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRsZXQgc2VsZWN0ZWRDYXJkID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtY3JlYXRlLWNhcmQnKTtcblx0bGV0IGJyb3dDYXJkID0gbmV3IENhcmQoeyB0eXBlOiBgJHtzZWxlY3RlZENhcmR9YCB9KTtcblxuXHRjb250ZW50LmFwcGVuZENoaWxkKCBicm93Q2FyZCApO1xuXHRicm93R3JpZC5hZGQoIGJyb3dDYXJkICk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0QmluZCBldmVudHMgdG8gZWxlbWVudHMuXG4gKi9cbmxldCBhZGRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvbmxpbmUnLCB2YWxpZGF0ZU9uT2ZmbGluZVN0YXRlKTtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCB2YWxpZGF0ZU9uT2ZmbGluZVN0YXRlKTtcblx0W10uZm9yRWFjaC5jYWxsKG5ld0NhcmQsIChpdGVtKSA9PiB7XG5cdFx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZE5ld0NhcmQpO1xuXHR9KTtcbn07XG5cbi8qIEluaXRpYWxpc2UgYXBwICovXG53aW5kb3cuaXNFZGl0TW9kZSA9IGZhbHNlO1xudmFsaWRhdGVCcm93Q2FyZHMoKTtcbnZhbGlkYXRlVGltZXIoKTtcbmluaXRMYXlvdXRNYW5hZ2VyKCk7XG5pbml0RGlhbG9ncygpO1xudmFsaWRhdGVPbk9mZmxpbmVTdGF0ZSgpO1xuc2V0VGhlbWUoKTtcbmFkZEV2ZW50cygpOyIsIi8qKlxuICogQG5hbWVcdFx0XHRcdENhcmRcbiAqIEBkZXNjcmlwdGlvblx0L1xuICovXG5jbGFzcyBDYXJkIHtcblx0Y29uc3RydWN0b3IgKGNvbmZpZyA9IHt9KSB7XG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XG5cdFx0dGhpcy5lbGVtID0gdGhpcy5jcmVhdGVDYXJkKCk7XG5cdFx0dGhpcy5pbml0aWFsaXNlQ2FyZCgpO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWxlbTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdFJldHVybnMgYSBuZXcgY2FyZCBlbGVtZW50LlxuXHQgKiBAcmV0dXJuIFx0XHRcdHtIVE1MRWxlbWVudH1cblx0ICovXG5cdGNyZWF0ZUNhcmQgKCkge1xuXHRcdHN3aXRjaCAodGhpcy5jb25maWcudHlwZSkge1xuXHRcdFx0Y2FzZSAndGV4dCc6IHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0LWNhcmQnKTtcblx0XHRcdGNhc2UgJ3dlYXRoZXInOiByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnd2VhdGhlci1jYXJkJyk7XG5cdFx0XHRjYXNlICd0b2RvJzogcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RvZG8tY2FyZCcpO1xuXHRcdFx0ZGVmYXVsdDogcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHQtY2FyZCcpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdEFwcGxpZXMgY2xhc3MgZWxlbWVudCBhbmQgY2FsbHMgaW5pdGlhbGlzZSgpLlxuXHQgKi9cblx0aW5pdGlhbGlzZUNhcmQgKCkge1xuXHRcdHRoaXMuZWxlbS5pbml0aWFsaXNlKCB0aGlzLmNvbmZpZyApO1xuXHRcdHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdicm93LWNvbnRlbnRfX21vZHVsZScpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmQ7IiwiLyoqXG4gKiBAbmFtZVx0XHRcdFx0RGlhbG9nXG4gKiBAZGVzY3JpcHRpb25cdFNob3dzL2hpZGVzIHRoZSBkaWFsb2cuXG4gKi9cbmNsYXNzIERpYWxvZyB7XG5cdGNvbnN0cnVjdG9yIChjb25maWcpIHtcblx0XHR0aGlzLmVsZW0gPSBjb25maWcuZWxlbTtcblx0XHR0aGlzLmJ1dHRvblx0PSB0aGlzLmVsZW0uY2hpbGRyZW5bMF07XG5cdFx0dGhpcy5pbml0QnV0dG9uSWNvbiA9IHRoaXMuYnV0dG9uLmdldEF0dHJpYnV0ZSgnaWNvbicpO1xuXHRcdHRoaXMucGF0aCA9IGNvbmZpZy5jb250ZW50O1xuXHRcdHRoaXMuY2FsbGJhY2sgPSBjb25maWcuY2FsbGJhY2s7XG5cdFx0dGhpcy5jYWxsYmFja1BhcmFtcyA9IGNvbmZpZy5wYXJhbXM7XG5cdFx0dGhpcy5kaWFsb2dFbGVtID0gY29uZmlnLmRpYWxvZ0VsZW07XG5cdFx0dGhpcy5kaWFsb2dDb250YWluZXJcdD0gdGhpcy5kaWFsb2dFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2dfX2lubmVyJyk7XG5cdFx0dGhpcy5kaWFsb2dDb250ZW50ID0gbnVsbDtcblx0XHR0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG5cdH1cblxuXHRpbml0ICgpIHtcblx0XHR0aGlzLmFkZEV2ZW50cygpO1xuXHR9XG5cblx0LyoqXG5cdCAqXHRAZGVzY3JpcHRpb25cdExvYWRzIHRoZSBjb250ZW50XG5cdCAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IGV2ZW50XG5cdCAqL1xuXHRsb2FkQ29udGVudCAoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0ZmV0Y2godGhpcy5wYXRoKVxuXHRcdC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLnRleHQoKSlcblx0XHQudGhlbihib2R5ID0+IHtcblx0XHRcdHRoaXMuZGlhbG9nQ29udGFpbmVyLmlubmVySFRNTCA9IGJvZHk7XG5cdFx0XHR0aGlzLmRpYWxvZ0NvbnRlbnQgPSB0aGlzLmRpYWxvZ0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nX19jb250ZW50Jyk7XG5cdFx0XHR0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2ljb24nLCAnY2xvc2UnKTtcblx0XHRcdHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZSgnY29sb3InLCAnd2hpdGUnKTtcblx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnZGlhbG9nLWlzLXZpc2libGUnKTtcblx0XHRcdHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuXG5cdFx0XHRpZiAodGhpcy5jYWxsYmFjaykgeyB0aGlzLmNhbGxiYWNrKHRoaXMpOyB9XG5cdFx0fSk7XG5cdH1cblxuXG5cdC8qKlxuXHQgKlx0QGRlc2NyaXB0aW9uXHRDbG9zZXMgdGhlIGRpYWxvZ1xuXHQgKiBAcGFyYW1cdFx0XHR7T2JqZWN0fSBldmVudFxuXHQqL1xuXHRjbG9zZURpYWxvZyAoZXZlbnQpIHtcblx0XHRsZXQgYm9keUhhc0NsYXNzXHQ9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWFsb2ctaXMtdmlzaWJsZScpO1xuXHRcdGxldCBpc0Nsb3NlQnRuXHRcdD0gZXZlbnQudGFyZ2V0ID09PSB0aGlzLmVsZW07XG5cdFx0bGV0IGlzRVNDS2V5XHRcdD0gZXZlbnQua2V5Q29kZSA9PT0gMjc7XG5cblx0XHRpZiAodGhpcy5pc0FjdGl2ZSAmJiBib2R5SGFzQ2xhc3MgJiYgaXNDbG9zZUJ0biB8fCBpc0VTQ0tleSkge1xuXHRcdFx0Ly8gQ2xlYXIgRE9NXG5cdFx0XHR0aGlzLmRpYWxvZ0NvbnRhaW5lci5pbm5lckhUTUwgPSBudWxsO1xuXHRcdFx0Ly8gUmVzZXQgYnV0dG9uXG5cdFx0XHR0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2ljb24nLCB0aGlzLmluaXRCdXR0b25JY29uKTtcblx0XHRcdHRoaXMuYnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnY29sb3InKTtcblx0XHRcdC8vIFJlbW92ZSBjbGFzc1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdkaWFsb2ctaXMtdmlzaWJsZScpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKlx0QGRlc2NyaXB0aW9uXHRWYWxpZGF0ZXMgaWYgZGlhbG9nIGlzIHZpc2libGUgb3Igbm90LCBjbG9zZXMvbG9hZHMgaXQuXG5cdCAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IGV2ZW50XG5cdCAqL1xuXHRsb2FkT3JDbG9zZUNvbnRlbnQgKGV2ZW50KSB7XG5cdFx0bGV0IGRpYWxvZ0lzT3BlbiA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWFsb2ctaXMtdmlzaWJsZScpO1xuXG5cdFx0aWYgKGRpYWxvZ0lzT3Blbikge1xuXHRcdFx0dGhpcy5jbG9zZURpYWxvZyhldmVudCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5sb2FkQ29udGVudChldmVudCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqXHRAZGVzY3JpcHRpb25cdEFkZHMgZXZlbnRzXG5cdCAqL1xuXHRhZGRFdmVudHMgKCkge1xuXHRcdHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMubG9hZE9yQ2xvc2VDb250ZW50LmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5jbG9zZURpYWxvZy5iaW5kKHRoaXMpKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBEaWFsb2c7IiwiLypnbG9iYWxzIFBhY2tlcnksRHJhZ2dhYmlsbHkqL1xuXG5pbXBvcnQgeyBoYXNDdXN0b21DYXJkcyB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5cbi8qKlxuICogQG5hbWVcdFx0XHRcdExheW91dE1hbmFnZXJcbiAqIEBkZXNjcmlwdGlvblx0L1xuICovXG5jbGFzcyBMYXlvdXRNYW5hZ2VyIHtcblx0Y29uc3RydWN0b3IgKGNvbnRhaW5lciwgb3ZlcmxheSkge1xuXHRcdHRoaXMudHJhbnNpdGlvbiA9IDA7XG5cdFx0dGhpcy5kcmFnT3B0aW9ucyA9IHtcblx0XHRcdGhhbmRsZTogJy5icm93LWNvbnRlbnRfX21vZHVsZSAvZGVlcC8gLmRyYWdnLWFyZWEnXG5cdFx0fTtcblx0XHR0aGlzLnBrck9wdGlvbnMgPSB7XG5cdFx0XHRpdGVtU2VsZWN0b3I6ICcuYnJvdy1jb250ZW50X19tb2R1bGUnLFxuXHRcdFx0dHJhbnNpdGlvbkR1cmF0aW9uOiB0aGlzLnRyYW5zaXRpb24sXG5cdFx0XHRjb2x1bW5XaWR0aDogJy5icm93LWNvbnRlbnQtLXNpemVyJyxcblx0XHRcdGd1dHRlcjogJy5icm93LWNvbnRlbnQtLWd1dHRlcicsXG5cdFx0XHRzdGFtcDogJy5pcy1zdGFtcCcsXG5cdFx0XHRpc0luaXRMYXlvdXQ6IGZhbHNlXG5cdFx0fTtcblx0XHR0aGlzLnBhY2tlcnkgPSBuZXcgUGFja2VyeShjb250YWluZXIsIHRoaXMucGtyT3B0aW9ucyk7XG5cdFx0dGhpcy5jb250ZW50ID0gY29udGFpbmVyO1xuXHRcdHRoaXMub3ZlcmxheSA9IG92ZXJsYXk7XG5cdFx0dGhpcy5hZGRFdmVudHMoKTtcblx0XHR0aGlzLmFkZERyYWdnYWJpbGx5KCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRXaWxsIGluaXRpYWxpc2UgdGhlIFBhY2tlcnkgbGF5b3V0LlxuXHQgKi9cblx0bGF5b3V0ICgpIHtcblx0XHR0aGlzLnBhY2tlcnkubGF5b3V0KCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRBZGRzIGEgbmV3IGl0ZW0gdG8gdGhlIFBhY2tlcnkgbGF5b3V0LlxuXHQgKiBAcGFyYW0gXHRcdFx0e05vZGVMaXN0fEhUTUxFbGVtZW50fSBlbGVtXG5cdCAqL1xuXHRhZGQgKGVsZW0pIHtcblx0XHR0aGlzLnBhY2tlcnkuYXBwZW5kZWQoIGVsZW0gKTtcblx0XHR0aGlzLmFkZERyYWdnYWJpbGx5KCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRSZW1vdmVzIHBhc3NlZCBlbGVtZW50IGZyb20gdGhlIFBhY2tlcnkgbGF5b3V0LlxuXHQgKiBAcGFyYW0gXHRcdFx0e05vZGVMaXN0fEhUTUxFbGVtZW50fSBjb25maWdcblx0ICovXG5cdHJlbW92ZSAoZWxlbSkge1xuXHRcdHRoaXMucGFja2VyeS5yZW1vdmUoIGVsZW0gKTtcblx0XHR0aGlzLmxheW91dCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0TWFrZXMgYW4gZWxlbWVudCBzdGlja3kuXG5cdCAqIEBwYXJhbSBcdFx0XHR7Tm9kZUxpc3R8SFRNTEVsZW1lbnR9IGNvbmZpZ1xuXHQgKi9cblx0c3RhbXAgKGVsZW0pIHtcblx0XHR0aGlzLnBhY2tlcnkuc3RhbXAoIGVsZW0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdFVuc3RhbXBzIGFuIGVsZW1lbnQuXG5cdCAqIEBwYXJhbSBcdFx0XHR7Tm9kZUxpc3R8SFRNTEVsZW1lbnR9IGNvbmZpZ1xuXHQgKi9cblx0dW5zdGFtcCAoZWxlbSkge1xuXHRcdHRoaXMucGFja2VyeS51bnN0YW1wKCBlbGVtICk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRJbml0aWFsaXNlcyBEcmFnZ2FiaWxseS5cblx0ICovXG5cdGFkZERyYWdnYWJpbGx5ICgpIHtcblx0XHRsZXQgY2FyZHMgPSB0aGlzLnBhY2tlcnkuZ2V0SXRlbUVsZW1lbnRzKCk7XG5cdFx0Y2FyZHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHRcdFx0bGV0IGRyYWdnaWUgPSBuZXcgRHJhZ2dhYmlsbHkoaXRlbSwgdGhpcy5kcmFnT3B0aW9ucyk7XG5cdFx0XHR0aGlzLnBhY2tlcnkuYmluZERyYWdnYWJpbGx5RXZlbnRzKCBkcmFnZ2llICk7XG5cdFx0XHRkcmFnZ2llLm9uKCdwb2ludGVyRG93bicsIHRoaXMudmFsaWRhdGVFZGl0TW9kZS5iaW5kKGRyYWdnaWUpKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdEFkZHMgRXZlbnRMaXN0ZW5lci5cblx0ICovXG5cdGFkZEV2ZW50cyAoKSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NhcmQtZWRpdCcsIHRoaXMudmFsaWRhdGVMYXlvdXRTdGF0ZS5iaW5kKHRoaXMpKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2FyZC1zYXZlJywgdGhpcy52YWxpZGF0ZUxheW91dFN0YXRlLmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjYXJkLXJlbW92ZScsIHRoaXMudmFsaWRhdGVMYXlvdXRTdGF0ZS5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLm92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnZhbGlkYXRlTGF5b3V0U3RhdGUuYmluZCh0aGlzKSk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHREZWFjdGl2YXRlcyBlZGl0TW9kZSBhbmQgcmVtb3ZlcyBjbGFzc2VzIGZyb20gY29udGVudCBvdmVybGF5LlxuXHQgKi9cblx0ZGVhY3RpdmF0ZUVkaXRNb2RlICgpIHtcblx0XHR3aW5kb3cuaXNFZGl0TW9kZSA9IGZhbHNlO1xuXHRcdHRoaXMub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpcy1mYWRpbmcnKTtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHRoaXMub3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJywgJ2lzLWZhZGluZycpO1xuXHRcdH0sIDEwMCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRDaGVja3MgZXZlbnQgdHlwZSBhbmQgdmFsaWRhdGVzIHRoZSBsYXlvdXQncyBzdGF0ZS5cblx0ICogQHBhcmFtICBcdFx0XHR7T2JqZWN0fSBldmVudFxuXHQgKi9cblx0dmFsaWRhdGVMYXlvdXRTdGF0ZSAoZXZlbnQpIHtcblx0XHRsZXQgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWd1aWQ9XCIke2V2ZW50LmRldGFpbH1cIl1gKTtcblxuXHRcdC8vIGFjdGl2YXRlZCBlZGl0aW5nIG1vZGVcblx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NhcmQtZWRpdCcpIHtcblx0XHRcdHdpbmRvdy5pc0VkaXRNb2RlID0gdHJ1ZTtcblx0XHRcdHRoaXMub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpcy12aXNpYmxlJyk7XG5cdFx0fVxuXG5cdFx0Ly8gc2F2ZWQgY2FyZCBvciByZW1vdmUgY2FyZFxuXHRcdGlmIChldmVudC50eXBlID09PSAnY2FyZC1zYXZlJyB8fCBldmVudC50eXBlID09PSAnY2FyZC1yZW1vdmUnKSB7XG5cdFx0XHR0aGlzLmRlYWN0aXZhdGVFZGl0TW9kZSgpO1xuXG5cdFx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NhcmQtc2F2ZScpIHtcblx0XHRcdFx0dGhpcy5sYXlvdXQoKTtcblx0XHRcdFx0aGFzQ3VzdG9tQ2FyZHMoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdjYXJkLXJlbW92ZScpIHtcblx0XHRcdFx0dGhpcy5yZW1vdmUoZWxlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ2NsaWNrJyAmJiB3aW5kb3cuaXNFZGl0TW9kZSkge1xuXHRcdFx0ZWxlbSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcuaXMtZWRpdCcpO1xuXHRcdFx0ZWxlbS5zYXZlVG9TdG9yYWdlKCk7XG5cdFx0XHRlbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2Z4JywgJ2lzLWVkaXQnKTtcblx0XHRcdHRoaXMuZGVhY3RpdmF0ZUVkaXRNb2RlKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGlmIGVkaXRNb2RlIGlzIGFjdGl2ZSBhbmQgd2VpdGhlciBkaXNhYmxlcyBvciBlbmFibGVzIHRoZSBkcmFnZ2luZy5cblx0ICovXG5cdHZhbGlkYXRlRWRpdE1vZGUgKCkge1xuXHRcdGlmICh3aW5kb3cuaXNFZGl0TW9kZSkge1xuXHRcdFx0dGhpcy5kaXNhYmxlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZW5hYmxlKCk7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExheW91dE1hbmFnZXI7IiwiaW1wb3J0IHsgc25hY2tiYXIgfSBmcm9tICcuLi91dGlscy9lbGVtZW50cyc7XG5cbi8qKlxuICogQG5hbWVcdFx0XHRcdFNuYWNrYmFyXG4gKiBAZGVzY3JpcHRpb25cdC9cbiAqL1xuY2xhc3MgU25hY2tiYXIge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmR1cmF0aW9uID0gMTAwMDA7XG5cdFx0dGhpcy5lbGVtID0gc25hY2tiYXI7XG5cdFx0dGhpcy5kZWZhdWx0ID0gJ09vb3BzLCBzb21ldGhpbmcgd2VudCB3cm9uZyEgOignO1xuXHRcdHRoaXMubWVzc2FnZSA9IG51bGw7XG5cdH1cblxuXHRhbGVydChtc2cgPSB0aGlzLmRlZmF1bHQpIHtcblx0XHR0aGlzLm1lc3NhZ2UgPSBtc2cudHJpbSgpO1xuXHRcdHRoaXMuc2hvdygpO1xuXHRcdGNvbnNvbGUubG9nKCd0aGlzJyk7XG5cdH1cblxuXHRzZXQgc2V0RHVyYXRpb24gKGR1cmF0aW9uKSB7XG5cdFx0dGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuXHR9XG5cblx0c2hvdygpIHtcblx0XHR0aGlzLmVsZW0uaW5uZXJIVE1MID0gbnVsbDtcblx0XHR0aGlzLmVsZW0uYXBwZW5kQ2hpbGQoIHRoaXMuY3JlYXRlUGFyYWdyYXBoKCkgKTtcblx0XHR0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnaXMtdmlzaWJsZScpO1xuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcblx0XHRcdHRoaXMubWVzc2FnZSA9IG51bGw7XG5cdFx0fSwgdGhpcy5kdXJhdGlvbik7XG5cdH1cblxuXHRjcmVhdGVQYXJhZ3JhcGgoKSB7XG5cdFx0bGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cdFx0cC5pbm5lclRleHQgPSB0aGlzLm1lc3NhZ2U7XG5cdFx0cmV0dXJuIHA7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU25hY2tiYXI7IiwiLyoqXG4gKiBAbmFtZVx0XHRcdFx0VGltZXJcbiAqIEBkZXNjcmlwdGlvblx0Q2xhc3Mgd2hpY2ggYXBwZW5kcyBhIHRpbWUgc3RyaW5nIHRvIGFuIGVsZW1lbnRcbiAqICAgICAgICAgICAgICBcdGFuZCB1cGRhdGVzIGl0IGV2ZXJ5IHNlY29uZC5cbiAqL1xuY2xhc3MgVGltZXIge1xuXHRjb25zdHJ1Y3RvciAoZWxlbSkge1xuXHRcdGlmICghKGVsZW0gJiYgZWxlbS5ub2RlTmFtZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgWW91IGhhdmVuJ3QgcGFzc2VkIGEgdmFsaWQgSFRNTEVsZW1lbnQhYCk7XG5cdFx0fVxuXG5cdFx0dGhpcy51cGRhdGVcdD0gMTAwMDtcblx0XHR0aGlzLmVsZW1cdD0gZWxlbTtcblx0XHR0aGlzLmZvcm1hdCA9ICcyNGgnO1xuXHRcdHRoaXMuYWJicmV2aWF0aW9ucyA9IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0Q3JlYXRlcyBhIHN0cmluZyB3aXRoIGN1cnJlbnQgdGltZSBpbiBISDpNTTpTU1xuXHQgKiBAcmV0dXJuXHRcdFx0e1N0cmluZ31cblx0ICovXG5cdGdldFRpbWUgKCkge1xuXHRcdGxldCBkYXRlXHRcdFx0XHQ9IG5ldyBEYXRlKCk7XG5cdFx0bGV0IGRhdGVIb3Vyc1x0XHQ9IGRhdGUuZ2V0SG91cnMoKTtcblx0XHRsZXQgZGF0ZU1pbnV0ZXNcdD0gZGF0ZS5nZXRNaW51dGVzKCk7XG5cdFx0bGV0IGRhdGVTZWNvbmRzXHQ9IGRhdGUuZ2V0U2Vjb25kcygpO1xuXHRcdGxldCBkYXRlQWJiclx0XHQ9ICcnO1xuXG5cdFx0Ly8gSWYgdGltZSBmb3JtYXQgaXMgc2V0IHRvIDEyaCwgdXNlIDEyaC1zeXN0ZW0uXG5cdFx0aWYgKHRoaXMuZm9ybWF0ID09PSAnMTJoJykge1xuXHRcdFx0aWYgKHRoaXMuYWJicmV2aWF0aW9ucykge1xuXHRcdFx0XHRkYXRlQWJiciA9IHRoaXMuZ2V0QWJicmV2aWF0aW9uKGRhdGVIb3Vycyk7XG5cdFx0XHR9XG5cdFx0XHRkYXRlSG91cnMgPSAoZGF0ZUhvdXJzICUgMTIpID8gZGF0ZUhvdXJzICUgMTIgOiAxMjtcblx0XHR9XG5cblx0XHQvLyBBZGQgJzAnIGlmIGJlbG93IDEwXG5cdFx0aWYgKGRhdGVIb3VycyA8IDEwKSB7IGRhdGVIb3VycyA9IGAwJHtkYXRlSG91cnN9YDsgfVxuXHRcdGlmIChkYXRlTWludXRlcyA8IDEwKSB7IGRhdGVNaW51dGVzID0gYDAke2RhdGVNaW51dGVzfWA7IH1cblx0XHRpZiAoZGF0ZVNlY29uZHMgPCAxMCkgeyBkYXRlU2Vjb25kcyA9IGAwJHtkYXRlU2Vjb25kc31gOyB9XG5cblx0XHRyZXR1cm4gYCR7ZGF0ZUhvdXJzfToke2RhdGVNaW51dGVzfToke2RhdGVTZWNvbmRzfSAke2RhdGVBYmJyfWA7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRWYWxpZGF0ZXMgbnVtYmVyIGFuZCByZXR1cm5zIGVpdGhlciBBTSBvciBQTS5cblx0ICogQHBhcmFtIFx0XHRcdHtOdW1iZXJ9IHRpbWVcblx0ICogQHJldHVyblx0XHRcdHtTdHJpbmd9XG5cdCAqL1xuXHRnZXRBYmJyZXZpYXRpb24gKHRpbWUpIHtcblx0XHRpZiAodHlwZW9mIHRpbWUgIT09ICdudW1iZXInKSB7XG5cdFx0XHR0aW1lID0gcGFyc2VGbG9hdCh0aW1lKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gKHRpbWUgPj0gMTIpID8gJ1BNJyA6ICdBTSc7XG5cdH1cblxuXHQvKipcblx0ICpcdEBkZXNjcmlwdGlvblx0TmVlZHMgdG8gYmUgd3JpdHRlbi5cblx0ICogQHBhcmFtXHRcdFx0e09iamVjdH0gY29uZmlnXG5cdCAqL1xuXHRzZXREYXRlRm9ybWF0IChjb25maWcpIHtcblx0XHRpZiAoY29uZmlnKSB7XG5cdFx0XHR0aGlzLmZvcm1hdCA9IChjb25maWcuZm9ybWF0KSA/IGNvbmZpZy5mb3JtYXQgOiB0aGlzLmZvcm1hdDtcblx0XHRcdHRoaXMuYWJicmV2aWF0aW9ucyA9IGNvbmZpZy5hYmJyZXZpYXRpb25zO1xuXHRcdH1cblx0XHR0aGlzLnJ1bigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0U2V0cyB0aGUgZWxlbWVudCBpbiB3aGljaCB0aGUgdGltZSBzaG91bGQgYmUgZGlzcGxheWVkLlxuXHQgKiBAcGFyYW1cdFx0XHR7RWxlbWVudH0gZWxlbVxuXHQgKiBAcmV0dXJuIFx0XHRcdHtIVE1MRWxlbWVudH1cblx0ICovXG5cdHJ1biAoKSB7XG5cdFx0dGhpcy5lbGVtLnRleHRDb250ZW50ID0gdGhpcy5nZXRUaW1lKCk7XG5cblx0XHRzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHR0aGlzLmVsZW0udGV4dENvbnRlbnQgPSB0aGlzLmdldFRpbWUoKTtcblx0XHR9LCB0aGlzLnVwZGF0ZSk7XG5cblx0XHRyZXR1cm4gdGhpcy5lbGVtO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVyOyIsImV4cG9ydCBjb25zdCBCUk9XX1NFVFRJTkdTID0gJ0JST1dfU0VUVElOR1MnO1xuZXhwb3J0IGNvbnN0IEJST1dfS0VZXHRcdD0gJ0JST1dfVEhFTUUnO1xuZXhwb3J0IGNvbnN0IEJST1dfQ0FSRFNcdFx0PSAnQlJPV19DQVJEUyc7XG5leHBvcnQgY29uc3QgREVGQVVMVF9USEVNRVx0PSAnYmx1ZS1hNDAwJzsiLCJleHBvcnQgbGV0IHRpbWVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXRpbWVyJyk7XG5leHBvcnQgbGV0IGRpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1kaWFsb2cnKTtcbmV4cG9ydCBsZXQgY2FyZGxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY2FyZGxpc3QnKTtcbmV4cG9ydCBsZXQgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1jb250ZW50Jyk7XG5leHBvcnQgbGV0IGNvbnRlbnRPdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnRfX292ZXJsYXknKTtcbmV4cG9ydCBsZXQgb3BlbkRpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5vcGVuLWRpYWxvZycpO1xuZXhwb3J0IGxldCBuZXdDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLW5ld2NhcmQnKTtcbmV4cG9ydCBsZXQgc2VsZWN0aW9uTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1zZWxlY3Rpb24nKTtcbmV4cG9ydCBsZXQgc25hY2tiYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtc25hY2tiYXInKTsiLCJpbXBvcnQgeyBCUk9XX1NFVFRJTkdTLCBCUk9XX0NBUkRTLCBERUZBVUxUX1RIRU1FIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGlmIGN1c3RvbSB0aGVtZSBzZXR0aW5ncyBhcmUgYXZhaWxhYmxlLlxuICogQHJldHVyblx0XHRcdHtCb29sZWFufVxuICovXG5jb25zdCBpc0N1c3RvbVRoZW1lID0gZnVuY3Rpb24gKCkge1xuXHRsZXQgaXNDdXN0b20gPSBmYWxzZTtcblxuXHRpZiAobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKSB7XG5cdFx0bGV0IHNldHRpbmdzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pO1xuXHRcdGlzQ3VzdG9tID0gISFzZXR0aW5ncy50aGVtZTtcblx0fVxuXG5cdHJldHVybiBpc0N1c3RvbTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRDaGVja3MgaWYgY3VzdG9tIGtleSBpcyBzZXQsIGlmIG5vdDogZG8gaXQuXG4gKi9cbmNvbnN0IGhhc0N1c3RvbUNhcmRzID0gZnVuY3Rpb24gKCkge1xuXHRpZiAoIWxvY2FsU3RvcmFnZVtCUk9XX0NBUkRTXSkge1xuXHRcdGxvY2FsU3RvcmFnZVtCUk9XX0NBUkRTXSA9IHRydWU7XG5cdH1cbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRDaGVja3MgdmlhIHJlZ2V4IGlmIGNsYXNzTmFtZSBpcyBhIHRoZW1lLlxuICovXG5jb25zdCBjaGVja0ZvclRoZW1lQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG5cdGxldCB0aGVtZVJlZ0V4ID0gL3RoZW1lLS4qLztcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdGlmICh0aGVtZVJlZ0V4LnRlc3QoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3RbaV0pKSB7XG5cdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0W2ldICk7XG5cdFx0fVxuXHR9XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0UGFyc2VzIHRoZSBjdXN0b20gc2V0dGluZ3MgZnJvbSBsb2NhbFN0b3JhZ2UgYW5kIHNldHMgY2xhc3Nlcy5cbiAqL1xuY29uc3QgdXBkYXRlVGhlbWVGcm9tU3RvcmFnZSA9IGZ1bmN0aW9uICgpIHtcblx0bGV0IHNldHRpbmdzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pO1xuXHQvL2xldCBkaWFsb2dJc09wZW4gPSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZGlhbG9nLWlzLXZpc2libGUnKTtcblxuXHRjaGVja0ZvclRoZW1lQ2xhc3MoKTtcblx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKGB0aGVtZS0ke3NldHRpbmdzLnRoZW1lLmNvbG9yfWApO1xuXG5cdGlmIChpc0N1c3RvbVRoZW1lKCkgJiYgc2V0dGluZ3MudGhlbWUuaGVhZGVyYmFyKSB7XG5cdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd0aGVtZS1oZWFkZXJiYXInKTtcblx0fVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdEFkZHMgdGhlIHRoZW1lIGNsYXNzIHRvIDxib2R5PiBmcm9tIGluaXRpYWwgc2V0dGluZ3MuXG4gKiBAcGFyYW1cdFx0XHR7U3RyaW5nfSB0aGVtZVxuICovXG5jb25zdCB1cGRhdGVUaGVtZUZyb21Db25maWcgPSBmdW5jdGlvbiAodGhlbWUpIHtcblx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKGB0aGVtZS0ke3RoZW1lfWApO1xufTtcblxuLyoqXG4gKlx0QGRlc2NyaXB0aW9uXHRVcGRhdGVzIHRoZSBjdXJyZW50IHRoZW1lLlxuICogQHBhcmFtXHRcdFx0e09iamVjdH0gdGhlbWVcbiAqL1xuY29uc3Qgc2V0VGhlbWUgPSBmdW5jdGlvbiAodGhlbWUpIHtcblx0aWYgKCF0aGVtZSB8fCB0eXBlb2YgdGhlbWUgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhlbWUgPSBERUZBVUxUX1RIRU1FO1xuXHR9XG5cblx0aWYgKGlzQ3VzdG9tVGhlbWUoKSkge1xuXHRcdHVwZGF0ZVRoZW1lRnJvbVN0b3JhZ2UoKTtcblx0fSBlbHNlIHtcblx0XHR1cGRhdGVUaGVtZUZyb21Db25maWcoIHRoZW1lICk7XG5cdH1cbn07XG5cbmV4cG9ydCB7XG5cdGlzQ3VzdG9tVGhlbWUsXG5cdGhhc0N1c3RvbUNhcmRzLFxuXHRzZXRUaGVtZSxcblx0dXBkYXRlVGhlbWVGcm9tQ29uZmlnLFxuXHR1cGRhdGVUaGVtZUZyb21TdG9yYWdlXG59OyIsImltcG9ydCB7IEJST1dfU0VUVElOR1MsIERFRkFVTFRfVEhFTUUgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHsgaXNDdXN0b21UaGVtZSwgc2V0VGhlbWUgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0VmFsaWRhdGVzIGlucHV0IGZpZWxkcywgdXBkYXRlcyBicm93VGhlbWUgYW5kIHNhdmVzIHRvIGxvY2FsU3RvcmFnZS5cbiAqIEBwYXJhbSAgXHRcdFx0e09iamVjdH0gZXZlbnRcbiAqL1xudmFyIHVwZGF0ZVRoZW1lID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdGxldCBjb2xvckhlYWRDaGVja2JveFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLS1jb2xvcmVkaGVhZCcpO1xuXHQvL2xldCBpc1RoZW1lQnV0dG9uXHRcdFx0PSBldmVudC50YXJnZXQuaGFzQXR0cmlidXRlKCdkYXRhLXNldHRpbmdzLXRoZW1lJyk7XG5cdC8vbGV0IGlzVGhlbWVDaGVja2JveFx0XHQ9IGV2ZW50LnRhcmdldC5pZCA9PT0gJ3NldHRpbmdzLS1jb2xvcmVkaGVhZCc7XG5cdGxldCBzZXR0aW5nc1x0XHRcdFx0PSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtCUk9XX1NFVFRJTkdTXSk7XG5cblx0Ly8gSWYgbm8gdGhlbWUgc2V0dGluZ3MgYXJlIHN0b3JlZCB5ZXQuXG5cdGlmICghc2V0dGluZ3MudGhlbWUpIHtcblx0XHRzZXR0aW5ncy50aGVtZSA9IHsgY29sb3I6IERFRkFVTFRfVEhFTUUsIGhlYWRlcmJhcjogZmFsc2UgfTtcblx0fVxuXG5cdC8vIElzIHRoZW1lIG9wdGlvblxuXHRpZiAoZXZlbnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1zZXR0aW5ncy10aGVtZScpKSB7XG5cdFx0c2V0dGluZ3MudGhlbWUuY29sb3IgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXNldHRpbmdzLXRoZW1lJyk7XG5cdH1cblxuXHQvLyBJZiBjb2xvcmVkIGhlYWRlciBiYXIgaXMgY2xpY2tlZFxuXHRpZiAoZXZlbnQudGFyZ2V0LmlkID09PSAnc2V0dGluZ3MtLWNvbG9yZWRoZWFkJykge1xuXHRcdHNldHRpbmdzLnRoZW1lLmhlYWRlcmJhciA9IGNvbG9ySGVhZENoZWNrYm94LmNoZWNrZWQ7XG5cdH1cblxuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShCUk9XX1NFVFRJTkdTLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xuXHRzZXRUaGVtZSgpO1xufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdFZhbGlkYXRlcyBpbnB1dCBmaWVsZHMsIHVwZGF0ZXMgVGltZXIgYW5kIHNhdmVzIHRvIGxvY2FsU3RvcmFnZS5cbiAqIEBwYXJhbSAgXHRcdFx0e09iamVjdH0gZXZlbnRcbiAqL1xudmFyIHVwZGF0ZURhdGVGb3JtYXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblx0bGV0IGZvcm1hdENoZWNrYm94XHQ9IHRoaXMuZGlhbG9nQ29udGVudC5xdWVyeVNlbGVjdG9yKCcjc2V0dGluZ3MtLWRhdGVmb3JtYXQnKTtcblx0bGV0IGFiYnJDaGVja2JveFx0XHQ9IHRoaXMuZGlhbG9nQ29udGVudC5xdWVyeVNlbGVjdG9yKCcjc2V0dGluZ3MtLWFtcG0nKTtcblx0bGV0IHRpbWVGb3JtYXRcdFx0XHQ9ICcyNGgnO1xuXHRsZXQgZGF0ZVNldHRpbmdzXHRcdD0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pO1xuXG5cdC8vIElmIGRhdGUgZm9ybWF0IGNoZWNrYm94IGlzIGNsaWNrZWRcblx0aWYgKGV2ZW50LnRhcmdldC5pZCA9PT0gJ3NldHRpbmdzLS1kYXRlZm9ybWF0Jykge1xuXHRcdGlmICghZm9ybWF0Q2hlY2tib3guY2hlY2tlZCkge1xuXHRcdFx0dGltZUZvcm1hdCA9ICcxMmgnO1xuXHRcdFx0YWJickNoZWNrYm94LmRpc2FibGVkID0gZmFsc2U7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGZvcm1hdENoZWNrYm94LmNoZWNrZWQgJiYgIWFiYnJDaGVja2JveC5kaXNhYmxlZCkge1xuXHRcdFx0YWJickNoZWNrYm94LmRpc2FibGVkID0gdHJ1ZTtcblx0XHRcdGFiYnJDaGVja2JveC5jaGVja2VkID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy5jYWxsYmFja1BhcmFtcy5UaW1lci5zZXREYXRlRm9ybWF0KHsgJ2Zvcm1hdCc6IHRpbWVGb3JtYXQgfSk7XG5cdFx0ZGF0ZVNldHRpbmdzLmRhdGVGb3JtYXQgPSB0aW1lRm9ybWF0O1xuXHRcdGRhdGVTZXR0aW5ncy5hYmJyZXZpYXRpb25zID0gYWJickNoZWNrYm94LmNoZWNrZWQ7XG5cdH1cblxuXHQvLyBJZiBhYmJyZXZpYXRpb24gY2hlY2tib3ggaXMgY2xpY2tlZFxuXHRpZiAoIWV2ZW50LnRhcmdldC5kaXNhYmxlZCAmJiBldmVudC50YXJnZXQuaWQgPT09ICdzZXR0aW5ncy0tYW1wbScpIHtcblx0XHR0aGlzLmNhbGxiYWNrUGFyYW1zLlRpbWVyLnNldERhdGVGb3JtYXQoeyAnYWJicmV2aWF0aW9ucyc6IGFiYnJDaGVja2JveC5jaGVja2VkIH0pO1xuXHRcdGRhdGVTZXR0aW5ncy5hYmJyZXZpYXRpb25zID0gYWJickNoZWNrYm94LmNoZWNrZWQ7XG5cdH1cblxuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShCUk9XX1NFVFRJTkdTLCBKU09OLnN0cmluZ2lmeShkYXRlU2V0dGluZ3MpKTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRBZGRzIGNhbGxiYWNrIHRvIGNvbnRlbnQgaW4gZGlhbG9nIGFuZCB2YWxpZGF0ZXMgPGlucHV0PiBmaWVsZHMuXG4gKi9cbnZhciBkaWFsb2dTZXR0aW5nc0NhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuXHRsZXQgdGltZUNvbnRlbnRcdFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnRfX3RpbWUnKTtcblx0bGV0IHRoZW1lQ29udGVudFx0XHQ9IHRoaXMuZGlhbG9nQ29udGVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudF9fdGhlbWUnKTtcblx0bGV0IGZvcm1hdENoZWNrYm94XHQ9IHRoaXMuZGlhbG9nQ29udGVudC5xdWVyeVNlbGVjdG9yKCcjc2V0dGluZ3MtLWRhdGVmb3JtYXQnKTtcblx0bGV0IGFiYnJDaGVja2JveFx0XHQ9IHRoaXMuZGlhbG9nQ29udGVudC5xdWVyeVNlbGVjdG9yKCcjc2V0dGluZ3MtLWFtcG0nKTtcblx0bGV0IHRoZW1lQ2hlY2tib3hcdFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLS1jb2xvcmVkaGVhZCcpO1xuXHRsZXQgYnJvd1NldHRpbmdzXHRcdD0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pO1xuXG5cdC8vIFZhbGlkYXRlIGRhdGUgc2V0dGluZ3MgYW5kIHVwZGF0ZSBET01cblx0aWYgKGJyb3dTZXR0aW5ncy5kYXRlRm9ybWF0ID09PSAnMTJoJykge1xuXHRcdGZvcm1hdENoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcblx0fVxuXHRhYmJyQ2hlY2tib3guY2hlY2tlZCA9IGJyb3dTZXR0aW5ncy5hYmJyZXZpYXRpb25zO1xuXHRhYmJyQ2hlY2tib3guZGlzYWJsZWQgPSAhYnJvd1NldHRpbmdzLmFiYnJldmlhdGlvbnM7XG5cblx0Ly8gVmFsaWRhdGUgaGVhZGVyIGJhciBzZXR0aW5ncyBhbmQgdXBkYXRlIERPTVxuXHRpZiAoaXNDdXN0b21UaGVtZSgpKSB7XG5cdFx0dGhlbWVDaGVja2JveC5jaGVja2VkID0gYnJvd1NldHRpbmdzLnRoZW1lLmhlYWRlcmJhcjtcblx0fVxuXG5cdC8vIEFkZCBldmVudExpc3RlbmVyXG5cdHRpbWVDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdXBkYXRlRGF0ZUZvcm1hdC5iaW5kKHRoaXMpKTtcblx0dGhlbWVDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdXBkYXRlVGhlbWUuYmluZCh0aGlzKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkaWFsb2dTZXR0aW5nc0NhbGxiYWNrOyJdfQ==
