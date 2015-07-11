(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Import dependencies */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsElements = require('./utils/elements');

var _utilsConstants = require('./utils/constants');

var _utilsHelper = require('./utils/helper');

var _viewsDialogSettings = require('./views/dialog.settings');

var _viewsDialogSettings2 = _interopRequireDefault(_viewsDialogSettings);

var _viewsDialogInformation = require('./views/dialog.information');

var _viewsDialogInformation2 = _interopRequireDefault(_viewsDialogInformation);

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
 * @description	Returns correct callback function.
 */
var evalCallback = function evalCallback(name) {
	switch (name) {
		case 'settings':
			return _viewsDialogSettings2['default'];
		case 'info':
			return _viewsDialogInformation2['default'];
		default:
			return false;
	}
};

/**
 * @description	Adds all dialog.
 */
var initDialogs = function initDialogs() {
	var currentLocation = window.location.href.slice(0, -1);

	[].forEach.call(_utilsElements.openDialog, function (item) {
		var dialogContent = item.getAttribute('data-dialog');

		var browDialog = new _modulesDialog2['default']({
			elem: item,
			dialogElem: _utilsElements.dialog,
			content: currentLocation + '/markup/dialog-' + dialogContent + '.html',
			callback: evalCallback(dialogContent),
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

},{"./modules/card":2,"./modules/dialog":3,"./modules/layoutmanager":4,"./modules/snackbar":5,"./modules/timer":6,"./utils/constants":7,"./utils/elements":8,"./utils/helper":9,"./views/dialog.information":10,"./views/dialog.settings":11}],2:[function(require,module,exports){
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
		this.elem.blur();

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
var getCurrentActiveItem = function getCurrentActiveItem(content) {
	return content.querySelector('.dialog__sidebar li.is-active a');
};
var getCurrentActiveSection = function getCurrentActiveSection(content) {
	return content.querySelector('section.is-visible');
};

var validateSection = function validateSection(content) {
	var curItem = getCurrentActiveItem(content);
	var curSection = getCurrentActiveSection(content);
	var targetSection = curItem.getAttribute('data-section');
	var section = content.querySelector('section[data-section="' + targetSection + '"]');

	if (curSection) {
		curSection.classList.remove('is-visible');
	}
	section.classList.add('is-visible');
};

var toggleContent = function toggleContent(event) {
	event.preventDefault();

	var item = event.target;
	var curActive = getCurrentActiveItem(this.categoryList).parentNode;

	if (!item.parentNode.classList.contains('is-active')) {
		curActive.classList.remove('is-active');
		item.parentNode.classList.add('is-active');
		validateSection(this.dialogContent);
	}
};

/**
 * @description	Adds callback to content in dialog and validates <input> fields.
 */
var dialogInformationCallback = function dialogInformationCallback() {
	this.categoryList = this.dialogContent.querySelector('.dialog__sidebar ul');

	validateSection(this.dialogContent);
	this.categoryList.addEventListener('click', toggleContent.bind(this));
};

exports['default'] = dialogInformationCallback;
module.exports = exports['default'];

},{}],11:[function(require,module,exports){
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

},{"../utils/constants":7,"../utils/helper":9}]},{},[1,2,3,4,5,6,7,8,9,10,11])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvYXBwLmluaXQuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvbW9kdWxlcy9jYXJkLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvZGlhbG9nLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvbGF5b3V0bWFuYWdlci5qcyIsIi9Vc2Vycy9tb3Jrcm9nZS9EZXNrdG9wL1Byb2plY3RzL1BlcnNvbmFsL0Jyb3dEYXNoL3NyYy9zY3JpcHRzL2VzNi9tb2R1bGVzL3NuYWNrYmFyLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvdGltZXIuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvdXRpbHMvY29uc3RhbnRzLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L3V0aWxzL2VsZW1lbnRzLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L3V0aWxzL2hlbHBlci5qcyIsIi9Vc2Vycy9tb3Jrcm9nZS9EZXNrdG9wL1Byb2plY3RzL1BlcnNvbmFsL0Jyb3dEYXNoL3NyYy9zY3JpcHRzL2VzNi92aWV3cy9kaWFsb2cuaW5mb3JtYXRpb24uanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvdmlld3MvZGlhbG9nLnNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7NkJDQzRFLGtCQUFrQjs7OEJBQ3BELG1CQUFtQjs7MkJBQ3BDLGdCQUFnQjs7bUNBQ04seUJBQXlCOzs7O3NDQUN0Qiw0QkFBNEI7Ozs7NEJBQ2hELGlCQUFpQjs7Ozs2QkFDaEIsa0JBQWtCOzs7OzJCQUNwQixnQkFBZ0I7Ozs7b0NBQ1AseUJBQXlCOzs7OytCQUM5QixvQkFBb0I7Ozs7O0FBR3pDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDOzs7OztBQUt0QixJQUFJLHNCQUFzQixHQUFHLFNBQXpCLHNCQUFzQixHQUFlO0FBQ3hDLEtBQUksS0FBSyxHQUFHLGtDQUFjLENBQUM7O0FBRTNCLEtBQUksYUFBYSxFQUFFO0FBQ2xCLE1BQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQ3RCLFFBQUssQ0FBQyxLQUFLLDBIQUEwSCxDQUFDO0dBQ3RJLE1BQ0k7QUFDSixRQUFLLENBQUMsS0FBSyxzREFBc0QsQ0FBQztHQUNsRTtFQUNEOztBQUVELGNBQWEsRUFBRSxDQUFDO0NBQ2hCLENBQUM7Ozs7O0FBS0YsSUFBSSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxHQUFlO0FBQy9CLFVBQVMsR0FBRyw2Q0F0Q0osS0FBSyxDQXNDZSxDQUFDO0FBQzdCLEtBQUksWUFBWSxHQUFHLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUM7O0FBRTlELEtBQUksQ0FBQyxZQUFZLGlCQXhDVCxhQUFhLENBd0NXLEVBQUU7QUFDakMsY0FBWSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDaEMsV0FBUyxDQUFDLGFBQWEsQ0FBQztBQUN2QixXQUFRLEVBQUUsWUFBWSxDQUFDLFVBQVU7R0FDakMsQ0FBQyxDQUFDO0FBQ0gsY0FBWSxDQUFDLE9BQU8saUJBN0NiLGFBQWEsRUE2Q2dCLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztFQUNsRSxNQUNJO0FBQ0osY0FBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxpQkFoRC9CLGFBQWEsQ0FnRGlDLENBQUMsQ0FBQztBQUN2RCxXQUFTLENBQUMsYUFBYSxDQUFDO0FBQ3ZCLFdBQVEsRUFBRSxZQUFZLENBQUMsVUFBVTtBQUNqQyxrQkFBZSxFQUFFLFlBQVksQ0FBQyxhQUFhO0dBQzNDLENBQUMsQ0FBQztFQUNIOztBQUVELFVBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztDQUNoQixDQUFDOzs7OztBQUtGLElBQUksWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFhLElBQUksRUFBRTtBQUNsQyxTQUFRLElBQUk7QUFDWCxPQUFLLFVBQVU7QUFBRSwyQ0FBOEI7QUFBQSxBQUMvQyxPQUFLLE1BQU07QUFBRSw4Q0FBaUM7QUFBQSxBQUM5QztBQUFTLFVBQU8sS0FBSyxDQUFDO0FBQUEsRUFDdEI7Q0FDRCxDQUFDOzs7OztBQUtGLElBQUksV0FBVyxHQUFHLFNBQWQsV0FBVyxHQUFlO0FBQzdCLEtBQUksZUFBZSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFeEQsR0FBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGdCQTVFQSxVQUFVLEVBNEVHLFVBQVUsSUFBSSxFQUFFO0FBQzNDLE1BQUksYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRXJELE1BQUksVUFBVSxHQUFHLCtCQUFXO0FBQzNCLE9BQUksRUFBRSxJQUFJO0FBQ1YsYUFBVSxpQkFqRmUsTUFBTSxBQWlGYjtBQUNsQixVQUFPLEVBQUssZUFBZSx1QkFBa0IsYUFBYSxVQUFPO0FBQ2pFLFdBQVEsRUFBRSxZQUFZLENBQUMsYUFBYSxDQUFDO0FBQ3JDLFNBQU0sRUFBRSxFQUFFLFNBQVMsRUFBVCxTQUFTLEVBQUU7R0FDckIsQ0FBQyxDQUFDOztBQUVILFlBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztFQUNsQixDQUFDLENBQUM7Q0FDSCxDQUFDOzs7Ozs7QUFNRixJQUFJLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixDQUFhLEtBQUssRUFBRTtBQUM1QyxLQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUMzQixZQUFZLENBQUMsT0FBTyxDQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUUsQ0FDL0MsQ0FBQzs7QUFFRixLQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUU7QUFDdkIsTUFBSSxRQUFRLEdBQUcsNkJBQVM7QUFDdkIsT0FBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJO0FBQ3RCLE9BQUksRUFBRSxXQUFXLENBQUMsSUFBSTtBQUN0QixVQUFPLEVBQUUsV0FBVyxDQUFDLE9BQU87QUFDNUIsUUFBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLO0dBQ3hCLENBQUMsQ0FBQztBQUNILGlCQTNHMkMsT0FBTyxDQTJHMUMsV0FBVyxDQUFFLFFBQVEsQ0FBRSxDQUFDO0VBQ2hDO0NBQ0QsQ0FBQzs7Ozs7QUFLRixJQUFJLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixHQUFlO0FBQ25DLFNBQVEsR0FBRyxxREFuSGlDLE9BQU8saUJBQUUsY0FBYyxDQW1IWixDQUFDO0FBQ3hELFNBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztDQUNsQixDQUFDOzs7Ozs7QUFNRixJQUFJLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixHQUFlO0FBQ25DLEtBQUksQ0FBQyxZQUFZLGlCQTNITSxVQUFVLENBMkhKLElBQUksWUFBWSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7QUFDMUQsY0FBWSxDQUFDLE9BQU8saUJBNUhFLFVBQVUsRUE0SEMsSUFBSSxDQUFDLENBQUM7QUFDdkMsTUFBSSxXQUFXLEdBQUcsNkJBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUM3QyxpQkEvSDJDLE9BQU8sQ0ErSDFDLFdBQVcsQ0FBRSxXQUFXLENBQUUsQ0FBQztFQUNuQyxNQUFNO0FBQ04sT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDN0Msd0JBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDekI7RUFDRDtDQUNELENBQUM7Ozs7OztBQU1GLElBQUksVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFhLEtBQUssRUFBRTtBQUNqQyxNQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRXZCLEtBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN6RCxLQUFJLFFBQVEsR0FBRyw2QkFBUyxFQUFFLElBQUksT0FBSyxZQUFZLEFBQUUsRUFBRSxDQUFDLENBQUM7O0FBRXJELGdCQWpKNEMsT0FBTyxDQWlKM0MsV0FBVyxDQUFFLFFBQVEsQ0FBRSxDQUFDO0FBQ2hDLFNBQVEsQ0FBQyxHQUFHLENBQUUsUUFBUSxDQUFFLENBQUM7Q0FDekIsQ0FBQzs7Ozs7QUFLRixJQUFJLFNBQVMsR0FBRyxTQUFaLFNBQVMsR0FBZTtBQUMzQixPQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLHNCQUFzQixDQUFDLENBQUM7QUFDMUQsT0FBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBQzNELEdBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxnQkEzSm9CLE9BQU8sRUEySmpCLFVBQUMsSUFBSSxFQUFLO0FBQ2xDLE1BQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7RUFDM0MsQ0FBQyxDQUFDO0NBQ0gsQ0FBQzs7O0FBR0YsTUFBTSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDMUIsaUJBQWlCLEVBQUUsQ0FBQztBQUNwQixhQUFhLEVBQUUsQ0FBQztBQUNoQixpQkFBaUIsRUFBRSxDQUFDO0FBQ3BCLFdBQVcsRUFBRSxDQUFDO0FBQ2Qsc0JBQXNCLEVBQUUsQ0FBQztBQUN6QixhQXJLUyxRQUFRLEVBcUtQLENBQUM7QUFDWCxTQUFTLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7OztJQ3JLTixJQUFJO0FBQ0csVUFEUCxJQUFJLEdBQ2lCO01BQWIsTUFBTSxnQ0FBRyxFQUFFOzt3QkFEbkIsSUFBSTs7QUFFUixNQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixNQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUM5QixNQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRXRCLFNBQU8sSUFBSSxDQUFDLElBQUksQ0FBQztFQUNqQjs7Ozs7OztBQVBJLEtBQUksV0FhVCxVQUFVLEdBQUMsc0JBQUc7QUFDYixVQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSTtBQUN2QixRQUFLLE1BQU07QUFBRSxXQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7QUFBQSxBQUN4RCxRQUFLLFNBQVM7QUFBRSxXQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFBQSxBQUM5RCxRQUFLLE1BQU07QUFBRSxXQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7QUFBQSxBQUN4RDtBQUFTLFdBQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUFBLEdBQ3BEO0VBQ0Q7Ozs7OztBQXBCSSxLQUFJLFdBeUJULGNBQWMsR0FBQywwQkFBRztBQUNqQixNQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBRSxJQUFJLENBQUMsTUFBTSxDQUFFLENBQUM7QUFDcEMsTUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7RUFDaEQ7O1FBNUJJLElBQUk7OztxQkErQkssSUFBSTs7Ozs7Ozs7Ozs7Ozs7SUMvQmIsTUFBTTtBQUNDLFVBRFAsTUFBTSxDQUNFLE1BQU0sRUFBRTt3QkFEaEIsTUFBTTs7QUFFVixNQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDeEIsTUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxNQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELE1BQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUMzQixNQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDaEMsTUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ3BDLE1BQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNwQyxNQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDdkUsTUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsTUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7RUFDdEI7O0FBWkksT0FBTSxXQWNYLElBQUksR0FBQyxnQkFBRztBQUNQLE1BQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztFQUNqQjs7Ozs7OztBQWhCSSxPQUFNLFdBc0JYLFdBQVcsR0FBQyxxQkFBQyxLQUFLLEVBQUU7OztBQUNuQixPQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRXZCLE9BQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ2YsSUFBSSxDQUFDLFVBQUEsUUFBUTtVQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUU7R0FBQSxDQUFDLENBQ2pDLElBQUksQ0FBQyxVQUFBLElBQUksRUFBSTtBQUNiLFNBQUssZUFBZSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDdEMsU0FBSyxhQUFhLEdBQUcsTUFBSyxlQUFlLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDNUUsU0FBSyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxQyxTQUFLLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLFdBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2pELFNBQUssUUFBUSxHQUFHLElBQUksQ0FBQzs7QUFFckIsT0FBSSxNQUFLLFFBQVEsRUFBRTtBQUFFLFVBQUssUUFBUSxPQUFNLENBQUM7SUFBRTtHQUMzQyxDQUFDLENBQUM7RUFDSDs7Ozs7OztBQXJDSSxPQUFNLFdBNENYLFdBQVcsR0FBQyxxQkFBQyxLQUFLLEVBQUU7QUFDbkIsTUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDekUsTUFBSSxVQUFVLEdBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQzdDLE1BQUksUUFBUSxHQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssRUFBRSxDQUFDOztBQUVyQyxNQUFJLElBQUksQ0FBQyxRQUFRLElBQUksWUFBWSxJQUFJLFVBQVUsSUFBSSxRQUFRLEVBQUU7O0FBRTVELE9BQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7QUFFdEMsT0FBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN0RCxPQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFckMsV0FBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7R0FDcEQ7RUFDRDs7Ozs7OztBQTFESSxPQUFNLFdBZ0VYLGtCQUFrQixHQUFDLDRCQUFDLEtBQUssRUFBRTtBQUMxQixNQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN6RSxNQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVqQixNQUFJLFlBQVksRUFBRTtBQUNqQixPQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3hCLE1BQ0k7QUFDSixPQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3hCO0VBQ0Q7Ozs7OztBQTFFSSxPQUFNLFdBK0VYLFNBQVMsR0FBQyxxQkFBRztBQUNaLE1BQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN4RSxRQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDaEU7O1FBbEZJLE1BQU07OztxQkFxRkcsTUFBTTs7Ozs7Ozs7Ozs7OzJCQ3ZGVSxpQkFBaUI7Ozs7Ozs7SUFNMUMsYUFBYTtBQUNOLFVBRFAsYUFBYSxDQUNMLFNBQVMsRUFBRSxPQUFPLEVBQUU7d0JBRDVCLGFBQWE7O0FBRWpCLE1BQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLE1BQUksQ0FBQyxXQUFXLEdBQUc7QUFDbEIsU0FBTSxFQUFFLDBDQUEwQztHQUNsRCxDQUFDO0FBQ0YsTUFBSSxDQUFDLFVBQVUsR0FBRztBQUNqQixlQUFZLEVBQUUsdUJBQXVCO0FBQ3JDLHFCQUFrQixFQUFFLElBQUksQ0FBQyxVQUFVO0FBQ25DLGNBQVcsRUFBRSxzQkFBc0I7QUFDbkMsU0FBTSxFQUFFLHVCQUF1QjtBQUMvQixRQUFLLEVBQUUsV0FBVztBQUNsQixlQUFZLEVBQUUsS0FBSztHQUNuQixDQUFDO0FBQ0YsTUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZELE1BQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQ3pCLE1BQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLE1BQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNqQixNQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7RUFDdEI7Ozs7OztBQW5CSSxjQUFhLFdBd0JsQixNQUFNLEdBQUMsa0JBQUc7QUFDVCxNQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQ3RCOzs7Ozs7O0FBMUJJLGNBQWEsV0FnQ2xCLEdBQUcsR0FBQyxhQUFDLElBQUksRUFBRTtBQUNWLE1BQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFFLElBQUksQ0FBRSxDQUFDO0FBQzlCLE1BQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztFQUN0Qjs7Ozs7OztBQW5DSSxjQUFhLFdBeUNsQixNQUFNLEdBQUMsZ0JBQUMsSUFBSSxFQUFFO0FBQ2IsTUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUUsSUFBSSxDQUFFLENBQUM7QUFDNUIsTUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQ2Q7Ozs7Ozs7QUE1Q0ksY0FBYSxXQWtEbEIsS0FBSyxHQUFDLGVBQUMsSUFBSSxFQUFFO0FBQ1osTUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUUsSUFBSSxDQUFFLENBQUM7RUFDM0I7Ozs7Ozs7QUFwREksY0FBYSxXQTBEbEIsT0FBTyxHQUFDLGlCQUFDLElBQUksRUFBRTtBQUNkLE1BQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFFLElBQUksQ0FBRSxDQUFDO0VBQzdCOzs7Ozs7QUE1REksY0FBYSxXQWlFbEIsY0FBYyxHQUFDLDBCQUFHOzs7QUFDakIsTUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUMzQyxPQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3ZCLE9BQUksT0FBTyxHQUFHLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxNQUFLLFdBQVcsQ0FBQyxDQUFDO0FBQ3RELFNBQUssT0FBTyxDQUFDLHFCQUFxQixDQUFFLE9BQU8sQ0FBRSxDQUFDO0FBQzlDLFVBQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLE1BQUssZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FDL0QsQ0FBQyxDQUFDO0VBQ0g7Ozs7OztBQXhFSSxjQUFhLFdBNkVsQixTQUFTLEdBQUMscUJBQUc7QUFDWixRQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxRSxRQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxRSxRQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM1RSxNQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDNUU7Ozs7OztBQWxGSSxjQUFhLFdBdUZsQixrQkFBa0IsR0FBQyw4QkFBRzs7O0FBQ3JCLFFBQU0sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQzFCLE1BQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN4QyxZQUFVLENBQUMsWUFBTTtBQUNoQixVQUFLLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztHQUN6RCxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQ1I7Ozs7Ozs7QUE3RkksY0FBYSxXQW1HbEIsbUJBQW1CLEdBQUMsNkJBQUMsS0FBSyxFQUFFO0FBQzNCLE1BQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLGtCQUFnQixLQUFLLENBQUMsTUFBTSxRQUFLLENBQUM7OztBQUduRSxNQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO0FBQy9CLFNBQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLE9BQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUN6Qzs7O0FBR0QsTUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLGFBQWEsRUFBRTtBQUMvRCxPQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzs7QUFFMUIsT0FBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtBQUMvQixRQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZCxpQkF4SEssY0FBYyxFQXdISCxDQUFDO0lBQ2pCOztBQUVELE9BQUksS0FBSyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUU7QUFDakMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQjtHQUNELE1BRUksSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFO0FBQ3JELE9BQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM5QyxPQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckIsT0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZDLE9BQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0dBQzFCO0VBQ0Q7Ozs7OztBQWhJSSxjQUFhLFdBcUlsQixnQkFBZ0IsR0FBQyw0QkFBRztBQUNuQixNQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUU7QUFDdEIsT0FBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ2YsTUFBTTtBQUNOLE9BQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztHQUNkO0VBQ0Q7O1FBM0lJLGFBQWE7OztxQkE4SUosYUFBYTs7Ozs7Ozs7Ozs7OzZCQ3RKSCxtQkFBbUI7Ozs7Ozs7SUFNdEMsUUFBUTtBQUNGLFVBRE4sUUFBUSxHQUNDO3dCQURULFFBQVE7O0FBRVosTUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDdEIsTUFBSSxDQUFDLElBQUksa0JBVEYsUUFBUSxBQVNLLENBQUM7QUFDckIsTUFBSSxXQUFRLEdBQUcsaUNBQWlDLENBQUM7QUFDakQsTUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7RUFDcEI7O0FBTkksU0FBUSxXQVFiLEtBQUssR0FBQSxpQkFBcUI7TUFBcEIsR0FBRyxnQ0FBRyxJQUFJLFdBQVE7O0FBQ3ZCLE1BQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzFCLE1BQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztFQUNaOztBQVhJLFNBQVEsV0FpQmIsSUFBSSxHQUFBLGdCQUFHOzs7QUFDTixNQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDM0IsTUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFFLENBQUM7QUFDaEQsTUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUV0QyxZQUFVLENBQUMsWUFBTTtBQUNoQixTQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3pDLFNBQUssT0FBTyxHQUFHLElBQUksQ0FBQztHQUNwQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztFQUNsQjs7QUExQkksU0FBUSxXQTRCYixlQUFlLEdBQUEsMkJBQUc7QUFDakIsTUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQyxHQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDM0IsU0FBTyxDQUFDLENBQUM7RUFDVDs7Y0FoQ0ksUUFBUTs7T0FhRyxhQUFDLFFBQVEsRUFBRTtBQUMxQixPQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztHQUN6Qjs7O1FBZkksUUFBUTs7O3FCQW1DQyxRQUFROzs7Ozs7Ozs7Ozs7Ozs7SUNwQ2pCLEtBQUs7QUFDRSxVQURQLEtBQUssQ0FDRyxJQUFJLEVBQUU7d0JBRGQsS0FBSzs7QUFFVCxNQUFJLEVBQUUsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUEsQUFBQyxFQUFFO0FBQzdCLFNBQU0sSUFBSSxLQUFLLDRDQUEyQyxDQUFDO0dBQzNEOztBQUVELE1BQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLE1BQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLE1BQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLE1BQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0VBQzNCOzs7Ozs7O0FBVkksTUFBSyxXQWdCVixPQUFPLEdBQUMsbUJBQUc7QUFDVixNQUFJLElBQUksR0FBTSxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ3pCLE1BQUksU0FBUyxHQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNqQyxNQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDcEMsTUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3BDLE1BQUksUUFBUSxHQUFJLEVBQUUsQ0FBQzs7O0FBR25CLE1BQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxLQUFLLEVBQUU7QUFDMUIsT0FBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3ZCLFlBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDO0FBQ0QsWUFBUyxHQUFHLEFBQUMsU0FBUyxHQUFHLEVBQUUsR0FBSSxTQUFTLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztHQUNuRDs7O0FBR0QsTUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFO0FBQUUsWUFBUyxTQUFPLFNBQVMsQUFBRSxDQUFDO0dBQUU7QUFDcEQsTUFBSSxXQUFXLEdBQUcsRUFBRSxFQUFFO0FBQUUsY0FBVyxTQUFPLFdBQVcsQUFBRSxDQUFDO0dBQUU7QUFDMUQsTUFBSSxXQUFXLEdBQUcsRUFBRSxFQUFFO0FBQUUsY0FBVyxTQUFPLFdBQVcsQUFBRSxDQUFDO0dBQUU7O0FBRTFELFNBQVUsU0FBUyxTQUFJLFdBQVcsU0FBSSxXQUFXLFNBQUksUUFBUSxDQUFHO0VBQ2hFOzs7Ozs7OztBQXJDSSxNQUFLLFdBNENWLGVBQWUsR0FBQyx5QkFBQyxJQUFJLEVBQUU7QUFDdEIsTUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDN0IsT0FBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUN4Qjs7QUFFRCxTQUFPLEFBQUMsSUFBSSxJQUFJLEVBQUUsR0FBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0VBQ2xDOzs7Ozs7O0FBbERJLE1BQUssV0F3RFYsYUFBYSxHQUFDLHVCQUFDLE1BQU0sRUFBRTtBQUN0QixNQUFJLE1BQU0sRUFBRTtBQUNYLE9BQUksQ0FBQyxNQUFNLEdBQUcsQUFBQyxNQUFNLENBQUMsTUFBTSxHQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUM1RCxPQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUM7R0FDMUM7QUFDRCxNQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7RUFDWDs7Ozs7Ozs7QUE5REksTUFBSyxXQXFFVixHQUFHLEdBQUMsZUFBRzs7O0FBQ04sTUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUV2QyxhQUFXLENBQUMsWUFBTTtBQUNqQixTQUFLLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBSyxPQUFPLEVBQUUsQ0FBQztHQUN2QyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFaEIsU0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0VBQ2pCOztRQTdFSSxLQUFLOzs7cUJBZ0ZJLEtBQUs7Ozs7Ozs7QUNyRmIsSUFBTSxhQUFhLEdBQUcsZUFBZSxDQUFDO1FBQWhDLGFBQWEsR0FBYixhQUFhO0FBQ25CLElBQU0sUUFBUSxHQUFJLFlBQVksQ0FBQztRQUF6QixRQUFRLEdBQVIsUUFBUTtBQUNkLElBQU0sVUFBVSxHQUFJLFlBQVksQ0FBQztRQUEzQixVQUFVLEdBQVYsVUFBVTtBQUNoQixJQUFNLGFBQWEsR0FBRyxXQUFXLENBQUM7UUFBNUIsYUFBYSxHQUFiLGFBQWE7Ozs7OztBQ0huQixJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQTVDLEtBQUssR0FBTCxLQUFLO0FBQ1QsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUE5QyxNQUFNLEdBQU4sTUFBTTtBQUNWLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7UUFBbEQsUUFBUSxHQUFSLFFBQVE7QUFDWixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQWhELE9BQU8sR0FBUCxPQUFPO0FBQ1gsSUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQTdELGNBQWMsR0FBZCxjQUFjO0FBQ2xCLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUF2RCxVQUFVLEdBQVYsVUFBVTtBQUNkLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUFuRCxPQUFPLEdBQVAsT0FBTztBQUNYLElBQUksYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7UUFBeEQsYUFBYSxHQUFiLGFBQWE7QUFDakIsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUFsRCxRQUFRLEdBQVIsUUFBUTs7Ozs7Ozt5QkNSc0MsYUFBYTs7Ozs7O0FBTXRFLElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsR0FBZTtBQUNqQyxLQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7O0FBRXJCLEtBQUksWUFBWSxZQVRSLGFBQWEsQ0FTVSxFQUFFO0FBQ2hDLE1BQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxZQVYvQixhQUFhLENBVWlDLENBQUMsQ0FBQztBQUN2RCxVQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7RUFDNUI7O0FBRUQsUUFBTyxRQUFRLENBQUM7Q0FDaEIsQ0FBQzs7Ozs7QUFLRixJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFjLEdBQWU7QUFDbEMsS0FBSSxDQUFDLFlBQVksWUFyQk0sVUFBVSxDQXFCSixFQUFFO0FBQzlCLGNBQVksWUF0QlUsVUFBVSxDQXNCUixHQUFHLElBQUksQ0FBQztFQUNoQztDQUNELENBQUM7Ozs7O0FBS0YsSUFBTSxrQkFBa0IsR0FBRyxTQUFyQixrQkFBa0IsR0FBZTtBQUN0QyxLQUFJLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDNUIsTUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4RCxNQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNoRCxXQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztHQUM3RDtFQUNEO0NBQ0QsQ0FBQzs7Ozs7QUFLRixJQUFNLHNCQUFzQixHQUFHLFNBQXpCLHNCQUFzQixHQUFlO0FBQzFDLEtBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxZQTFDOUIsYUFBYSxDQTBDZ0MsQ0FBQyxDQUFDOzs7QUFHdkQsbUJBQWtCLEVBQUUsQ0FBQztBQUNyQixTQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFlBQVUsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUcsQ0FBQzs7QUFFN0QsS0FBSSxhQUFhLEVBQUUsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtBQUNoRCxVQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztFQUMvQztDQUNELENBQUM7Ozs7OztBQU1GLElBQU0scUJBQXFCLEdBQUcsU0FBeEIscUJBQXFCLENBQWEsS0FBSyxFQUFFO0FBQzlDLFNBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsWUFBVSxLQUFLLENBQUcsQ0FBQztDQUM5QyxDQUFDOzs7Ozs7QUFNRixJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBYSxLQUFLLEVBQUU7QUFDakMsS0FBSSxDQUFDLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7QUFDeEMsT0FBSyxjQW5FNkIsYUFBYSxBQW1FMUIsQ0FBQztFQUN0Qjs7QUFFRCxLQUFJLGFBQWEsRUFBRSxFQUFFO0FBQ3BCLHdCQUFzQixFQUFFLENBQUM7RUFDekIsTUFBTTtBQUNOLHVCQUFxQixDQUFFLEtBQUssQ0FBRSxDQUFDO0VBQy9CO0NBQ0QsQ0FBQzs7UUFHRCxhQUFhLEdBQWIsYUFBYTtRQUNiLGNBQWMsR0FBZCxjQUFjO1FBQ2QsUUFBUSxHQUFSLFFBQVE7UUFDUixxQkFBcUIsR0FBckIscUJBQXFCO1FBQ3JCLHNCQUFzQixHQUF0QixzQkFBc0I7Ozs7OztBQ2xGdkIsSUFBSSxvQkFBb0IsR0FBRyxTQUF2QixvQkFBb0IsQ0FBSSxPQUFPO1FBQUssT0FBTyxDQUFDLGFBQWEsQ0FBQyxpQ0FBaUMsQ0FBQztDQUFBLENBQUM7QUFDakcsSUFBSSx1QkFBdUIsR0FBRyxTQUExQix1QkFBdUIsQ0FBSSxPQUFPO1FBQUssT0FBTyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQztDQUFBLENBQUM7O0FBRXZGLElBQUksZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBYSxPQUFPLEVBQUU7QUFDeEMsS0FBSSxPQUFPLEdBQUcsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDNUMsS0FBSSxVQUFVLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbEQsS0FBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN6RCxLQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsYUFBYSw0QkFBMEIsYUFBYSxRQUFLLENBQUM7O0FBRWhGLEtBQUksVUFBVSxFQUFFO0FBQUUsWUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7RUFBRTtBQUM5RCxRQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztDQUNwQyxDQUFDOztBQUVGLElBQUksYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBYSxLQUFLLEVBQUU7QUFDcEMsTUFBSyxDQUFDLGNBQWMsRUFBRSxDQUFDOztBQUV2QixLQUFJLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3hCLEtBQUksU0FBUyxHQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxVQUFVLENBQUM7O0FBRW5FLEtBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDckQsV0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDeEMsTUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzNDLGlCQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0VBQ3BDO0NBRUQsQ0FBQzs7Ozs7QUFLRixJQUFJLHlCQUF5QixHQUFHLFNBQTVCLHlCQUF5QixHQUFlO0FBQzNDLEtBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7QUFFNUUsZ0JBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDcEMsS0FBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0NBQ3RFLENBQUM7O3FCQUVhLHlCQUF5Qjs7Ozs7Ozs7OEJDckNLLG9CQUFvQjs7MkJBQ3pCLGlCQUFpQjs7Ozs7O0FBTXpELElBQUksV0FBVyxHQUFHLFNBQWQsV0FBVyxDQUFhLEtBQUssRUFBRTtBQUNsQyxLQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUM7OztBQUduRixLQUFJLFFBQVEsR0FBTSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksaUJBWGpDLGFBQWEsQ0FXbUMsQ0FBQyxDQUFDOzs7QUFHMUQsS0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDcEIsVUFBUSxDQUFDLEtBQUssR0FBRyxFQUFFLEtBQUssa0JBZkYsYUFBYSxBQWVJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDO0VBQzVEOzs7QUFHRCxLQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLEVBQUU7QUFDckQsVUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsQ0FBQztFQUN4RTs7O0FBR0QsS0FBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyx1QkFBdUIsRUFBRTtBQUNoRCxVQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUM7RUFDckQ7O0FBRUQsYUFBWSxDQUFDLE9BQU8saUJBNUJaLGFBQWEsRUE0QmUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQzlELGNBNUJ1QixRQUFRLEVBNEJyQixDQUFDO0NBQ1gsQ0FBQzs7Ozs7O0FBTUYsSUFBSSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBYSxLQUFLLEVBQUU7QUFDdkMsS0FBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUMvRSxLQUFJLFlBQVksR0FBSSxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3hFLEtBQUksVUFBVSxHQUFLLEtBQUssQ0FBQztBQUN6QixLQUFJLFlBQVksR0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksaUJBeENuQyxhQUFhLENBd0NxQyxDQUFDLENBQUM7OztBQUc1RCxLQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLHNCQUFzQixFQUFFO0FBQy9DLE1BQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFO0FBQzVCLGFBQVUsR0FBRyxLQUFLLENBQUM7QUFDbkIsZUFBWSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7R0FDOUIsTUFDSSxJQUFJLGNBQWMsQ0FBQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFO0FBQzFELGVBQVksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQzdCLGVBQVksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0dBQzdCOztBQUVELE1BQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0FBQ3RFLGNBQVksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQ3JDLGNBQVksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQztFQUNsRDs7O0FBR0QsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLGdCQUFnQixFQUFFO0FBQ25FLE1BQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFLGVBQWUsRUFBRSxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUN2RixjQUFZLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUM7RUFDbEQ7O0FBRUQsYUFBWSxDQUFDLE9BQU8saUJBaEVaLGFBQWEsRUFnRWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0NBQ2xFLENBQUM7Ozs7O0FBS0YsSUFBSSxzQkFBc0IsR0FBRyxTQUF6QixzQkFBc0IsR0FBZTtBQUN4QyxLQUFJLFdBQVcsR0FBSSxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3RFLEtBQUksWUFBWSxHQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDeEUsS0FBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUMvRSxLQUFJLFlBQVksR0FBSSxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3hFLEtBQUksYUFBYSxHQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDaEYsS0FBSSxZQUFZLEdBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLGlCQTVFbkMsYUFBYSxDQTRFcUMsQ0FBQyxDQUFDOzs7QUFHNUQsS0FBSSxZQUFZLENBQUMsVUFBVSxLQUFLLEtBQUssRUFBRTtBQUN0QyxnQkFBYyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7RUFDL0I7QUFDRCxhQUFZLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUM7QUFDbEQsYUFBWSxDQUFDLFFBQVEsR0FBRyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUM7OztBQUdwRCxLQUFJLGFBckZJLGFBQWEsRUFxRkYsRUFBRTtBQUNwQixlQUFhLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0VBQ3JEOzs7QUFHRCxZQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ25FLGFBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0NBQy9ELENBQUM7O3FCQUVhLHNCQUFzQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBJbXBvcnQgZGVwZW5kZW5jaWVzICovXG5pbXBvcnQgeyB0aW1lciwgb3BlbkRpYWxvZywgZGlhbG9nLCBuZXdDYXJkLCBjb250ZW50LCBjb250ZW50T3ZlcmxheSB9IGZyb20gJy4vdXRpbHMvZWxlbWVudHMnO1xuaW1wb3J0IHsgQlJPV19TRVRUSU5HUywgQlJPV19DQVJEUyB9IGZyb20gJy4vdXRpbHMvY29uc3RhbnRzJztcbmltcG9ydCB7IHNldFRoZW1lIH0gZnJvbSAnLi91dGlscy9oZWxwZXInO1xuaW1wb3J0IGRpYWxvZ1NldHRpbmdzQ2FsbGJhY2sgZnJvbSAnLi92aWV3cy9kaWFsb2cuc2V0dGluZ3MnO1xuaW1wb3J0IGRpYWxvZ0luZm9ybWF0aW9uQ2FsbGJhY2sgZnJvbSAnLi92aWV3cy9kaWFsb2cuaW5mb3JtYXRpb24nO1xuaW1wb3J0IFRpbWVyIGZyb20gJy4vbW9kdWxlcy90aW1lcic7XG5pbXBvcnQgRGlhbG9nIGZyb20gJy4vbW9kdWxlcy9kaWFsb2cnO1xuaW1wb3J0IENhcmQgZnJvbSAnLi9tb2R1bGVzL2NhcmQnO1xuaW1wb3J0IExheW91dE1hbmFnZXIgZnJvbSAnLi9tb2R1bGVzL2xheW91dG1hbmFnZXInO1xuaW1wb3J0IFNuYWNrYmFyIGZyb20gJy4vbW9kdWxlcy9zbmFja2Jhcic7XG5cbi8qIFZhcmlhYmxlcyAqL1xubGV0IGJyb3dUaW1lciA9IG51bGw7XG5sZXQgYnJvd0dyaWQgPSBudWxsO1xubGV0IG9ubGluZUNvdW50ZXIgPSAwO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBWYWxpZGF0ZXMgaWYgdXNlciBpcyBvbmxpbmUvb2ZmbGluZSBhbmQgc2VuZHMgcHJvcGVyIG5vdGlmaWNhdGlvbi5cbiAqL1xubGV0IHZhbGlkYXRlT25PZmZsaW5lU3RhdGUgPSBmdW5jdGlvbiAoKSB7XG5cdGxldCBzbmFjayA9IG5ldyBTbmFja2JhcigpO1xuXG5cdGlmIChvbmxpbmVDb3VudGVyKSB7XG5cdFx0aWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XG5cdFx0XHRzbmFjay5hbGVydChgWW91ciBpbnRlcm5ldCBjb25uZWN0aW9uIHN1ZGRlbmx5IHdlbnQgb2ZmbGluZS4gQnJvd0Rhc2ggd2lsbCBzdGlsbCB3b3JrIGxpa2UgYmVmb3JlLCBidXQgc29tZSBjYXJkcyBtaWdodCBub3QgdXBkYXRlLmApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHNuYWNrLmFsZXJ0KGBZb3VyIGludGVybmV0IGNvbm5lY3Rpb24gaXMgc3RhYmxlIGFnYWluLCBhd2Vzb21lIWApO1xuXHRcdH1cblx0fVxuXG5cdG9ubGluZUNvdW50ZXIrKztcbn07XG5cbi8qKlxuICpcdEBkZXNjcmlwdGlvbiBWYWxpZGF0ZXMgdGhlIHVzZXJzIHRpbWVyIHNldHRpbmdzLlxuICovXG5sZXQgdmFsaWRhdGVUaW1lciA9IGZ1bmN0aW9uICgpIHtcblx0YnJvd1RpbWVyID0gbmV3IFRpbWVyKHRpbWVyKTtcblx0bGV0IGRhdGVTZXR0aW5ncyA9IHsgZGF0ZUZvcm1hdDogbnVsbCwgYWJicmV2aWF0aW9uczogZmFsc2UgfTtcblxuXHRpZiAoIWxvY2FsU3RvcmFnZVtCUk9XX1NFVFRJTkdTXSkge1xuXHRcdGRhdGVTZXR0aW5ncy5kYXRlRm9ybWF0ID0gJzI0aCc7XG5cdFx0YnJvd1RpbWVyLnNldERhdGVGb3JtYXQoe1xuXHRcdFx0J2Zvcm1hdCc6IGRhdGVTZXR0aW5ncy5kYXRlRm9ybWF0XG5cdFx0fSk7XG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oQlJPV19TRVRUSU5HUywgSlNPTi5zdHJpbmdpZnkoZGF0ZVNldHRpbmdzKSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0ZGF0ZVNldHRpbmdzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pO1xuXHRcdGJyb3dUaW1lci5zZXREYXRlRm9ybWF0KHtcblx0XHRcdCdmb3JtYXQnOiBkYXRlU2V0dGluZ3MuZGF0ZUZvcm1hdCxcblx0XHRcdCdhYmJyZXZpYXRpb25zJzogZGF0ZVNldHRpbmdzLmFiYnJldmlhdGlvbnNcblx0XHR9KTtcblx0fVxuXG5cdGJyb3dUaW1lci5ydW4oKTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRSZXR1cm5zIGNvcnJlY3QgY2FsbGJhY2sgZnVuY3Rpb24uXG4gKi9cbmxldCBldmFsQ2FsbGJhY2sgPSBmdW5jdGlvbiAobmFtZSkge1xuXHRzd2l0Y2ggKG5hbWUpIHtcblx0XHRjYXNlICdzZXR0aW5ncyc6IHJldHVybiBkaWFsb2dTZXR0aW5nc0NhbGxiYWNrO1xuXHRcdGNhc2UgJ2luZm8nOiByZXR1cm4gZGlhbG9nSW5mb3JtYXRpb25DYWxsYmFjaztcblx0XHRkZWZhdWx0OiByZXR1cm4gZmFsc2U7XG5cdH1cbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRBZGRzIGFsbCBkaWFsb2cuXG4gKi9cbmxldCBpbml0RGlhbG9ncyA9IGZ1bmN0aW9uICgpIHtcblx0bGV0IGN1cnJlbnRMb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNsaWNlKDAsIC0xKTtcblxuXHRbXS5mb3JFYWNoLmNhbGwob3BlbkRpYWxvZywgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRsZXQgZGlhbG9nQ29udGVudFx0PSBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1kaWFsb2cnKTtcblxuXHRcdGxldCBicm93RGlhbG9nID0gbmV3IERpYWxvZyh7XG5cdFx0XHRlbGVtOiBpdGVtLFxuXHRcdFx0ZGlhbG9nRWxlbTogZGlhbG9nLFxuXHRcdFx0Y29udGVudDogYCR7Y3VycmVudExvY2F0aW9ufS9tYXJrdXAvZGlhbG9nLSR7ZGlhbG9nQ29udGVudH0uaHRtbGAsXG5cdFx0XHRjYWxsYmFjazogZXZhbENhbGxiYWNrKGRpYWxvZ0NvbnRlbnQpLFxuXHRcdFx0cGFyYW1zOiB7IGJyb3dUaW1lciB9XG5cdFx0fSk7XG5cblx0XHRicm93RGlhbG9nLmluaXQoKTtcblx0fSk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0R2V0cyBsb2NhbFN0b3JhZ2UsIHBhcnNlcyBhdmFpbGFibGUgY2FyZHMgYW5kIGNyZWF0ZXMgdGhlbS5cbiAqIEBwYXJhbVx0XHRcdHtOdW1iZXJ8U3RyaW5nfSBpbmRleFxuICovXG5sZXQgcGFyc2VDYXJkc0Zyb21TdG9yYWdlID0gZnVuY3Rpb24gKGluZGV4KSB7XG5cdGxldCBzdG9yYWdlSXRlbSA9IEpTT04ucGFyc2UoXG5cdFx0bG9jYWxTdG9yYWdlLmdldEl0ZW0oIGxvY2FsU3RvcmFnZS5rZXkoaW5kZXgpIClcblx0KTtcblxuXHRpZiAoc3RvcmFnZUl0ZW0ubW9kdWxlKSB7XG5cdFx0bGV0IGJyb3dDYXJkID0gbmV3IENhcmQoe1xuXHRcdFx0dHlwZTogc3RvcmFnZUl0ZW0udHlwZSxcblx0XHRcdGd1aWQ6IHN0b3JhZ2VJdGVtLmd1aWQsXG5cdFx0XHRjb250ZW50OiBzdG9yYWdlSXRlbS5jb250ZW50LFxuXHRcdFx0c3R5bGU6IHN0b3JhZ2VJdGVtLnN0eWxlXG5cdFx0fSk7XG5cdFx0Y29udGVudC5hcHBlbmRDaGlsZCggYnJvd0NhcmQgKTtcblx0fVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdENhbGxzIHRoZSBMYXlvdXRNYW5hZ2VyIGNsYXNzLlxuICovXG5sZXQgaW5pdExheW91dE1hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XG5cdGJyb3dHcmlkID0gbmV3IExheW91dE1hbmFnZXIoIGNvbnRlbnQsIGNvbnRlbnRPdmVybGF5ICk7XG5cdGJyb3dHcmlkLmxheW91dCgpO1xufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdENoZWNrcyBsb2NhbFN0b3JhZ2UgYW5kIGxvYWRzIHRoZSB1c2VycyBjYXJkc1xuICogQHBhcmFtXHRcdFx0e09iamVjdH0gc3RvcmFnZVxuICovXG5sZXQgdmFsaWRhdGVCcm93Q2FyZHMgPSBmdW5jdGlvbiAoKSB7XG5cdGlmICghbG9jYWxTdG9yYWdlW0JST1dfQ0FSRFNdIHx8IGxvY2FsU3RvcmFnZS5sZW5ndGggPD0gMSkge1xuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKEJST1dfQ0FSRFMsIHRydWUpO1xuXHRcdGxldCBkZWZhdWx0Q2FyZCA9IG5ldyBDYXJkKHsgdHlwZTogJ3RleHQnIH0pO1xuXHRcdGNvbnRlbnQuYXBwZW5kQ2hpbGQoIGRlZmF1bHRDYXJkICk7XG5cdH0gZWxzZSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyBpKyspIHtcblx0XHRcdHBhcnNlQ2FyZHNGcm9tU3RvcmFnZShpKTtcblx0XHR9XG5cdH1cbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRDaGVja3MgY2xpY2tlZCBjYXJkIHR5cGUgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIERPTS5cbiAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IGV2ZW50XG4gKi9cbmxldCBhZGROZXdDYXJkID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0bGV0IHNlbGVjdGVkQ2FyZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWNyZWF0ZS1jYXJkJyk7XG5cdGxldCBicm93Q2FyZCA9IG5ldyBDYXJkKHsgdHlwZTogYCR7c2VsZWN0ZWRDYXJkfWAgfSk7XG5cblx0Y29udGVudC5hcHBlbmRDaGlsZCggYnJvd0NhcmQgKTtcblx0YnJvd0dyaWQuYWRkKCBicm93Q2FyZCApO1xufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdEJpbmQgZXZlbnRzIHRvIGVsZW1lbnRzLlxuICovXG5sZXQgYWRkRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgdmFsaWRhdGVPbk9mZmxpbmVTdGF0ZSk7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgdmFsaWRhdGVPbk9mZmxpbmVTdGF0ZSk7XG5cdFtdLmZvckVhY2guY2FsbChuZXdDYXJkLCAoaXRlbSkgPT4ge1xuXHRcdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhZGROZXdDYXJkKTtcblx0fSk7XG59O1xuXG4vKiBJbml0aWFsaXNlIGFwcCAqL1xud2luZG93LmlzRWRpdE1vZGUgPSBmYWxzZTtcbnZhbGlkYXRlQnJvd0NhcmRzKCk7XG52YWxpZGF0ZVRpbWVyKCk7XG5pbml0TGF5b3V0TWFuYWdlcigpO1xuaW5pdERpYWxvZ3MoKTtcbnZhbGlkYXRlT25PZmZsaW5lU3RhdGUoKTtcbnNldFRoZW1lKCk7XG5hZGRFdmVudHMoKTsiLCIvKipcbiAqIEBuYW1lXHRcdFx0XHRDYXJkXG4gKiBAZGVzY3JpcHRpb25cdC9cbiAqL1xuY2xhc3MgQ2FyZCB7XG5cdGNvbnN0cnVjdG9yIChjb25maWcgPSB7fSkge1xuXHRcdHRoaXMuY29uZmlnID0gY29uZmlnO1xuXHRcdHRoaXMuZWxlbSA9IHRoaXMuY3JlYXRlQ2FyZCgpO1xuXHRcdHRoaXMuaW5pdGlhbGlzZUNhcmQoKTtcblxuXHRcdHJldHVybiB0aGlzLmVsZW07XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRSZXR1cm5zIGEgbmV3IGNhcmQgZWxlbWVudC5cblx0ICogQHJldHVybiBcdFx0XHR7SFRNTEVsZW1lbnR9XG5cdCAqL1xuXHRjcmVhdGVDYXJkICgpIHtcblx0XHRzd2l0Y2ggKHRoaXMuY29uZmlnLnR5cGUpIHtcblx0XHRcdGNhc2UgJ3RleHQnOiByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dC1jYXJkJyk7XG5cdFx0XHRjYXNlICd3ZWF0aGVyJzogcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3dlYXRoZXItY2FyZCcpO1xuXHRcdFx0Y2FzZSAndG9kbyc6IHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0b2RvLWNhcmQnKTtcblx0XHRcdGRlZmF1bHQ6IHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0LWNhcmQnKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRBcHBsaWVzIGNsYXNzIGVsZW1lbnQgYW5kIGNhbGxzIGluaXRpYWxpc2UoKS5cblx0ICovXG5cdGluaXRpYWxpc2VDYXJkICgpIHtcblx0XHR0aGlzLmVsZW0uaW5pdGlhbGlzZSggdGhpcy5jb25maWcgKTtcblx0XHR0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnYnJvdy1jb250ZW50X19tb2R1bGUnKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYXJkOyIsIi8qKlxuICogQG5hbWVcdFx0XHRcdERpYWxvZ1xuICogQGRlc2NyaXB0aW9uXHRTaG93cy9oaWRlcyB0aGUgZGlhbG9nLlxuICovXG5jbGFzcyBEaWFsb2cge1xuXHRjb25zdHJ1Y3RvciAoY29uZmlnKSB7XG5cdFx0dGhpcy5lbGVtID0gY29uZmlnLmVsZW07XG5cdFx0dGhpcy5idXR0b25cdD0gdGhpcy5lbGVtLmNoaWxkcmVuWzBdO1xuXHRcdHRoaXMuaW5pdEJ1dHRvbkljb24gPSB0aGlzLmJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2ljb24nKTtcblx0XHR0aGlzLnBhdGggPSBjb25maWcuY29udGVudDtcblx0XHR0aGlzLmNhbGxiYWNrID0gY29uZmlnLmNhbGxiYWNrO1xuXHRcdHRoaXMuY2FsbGJhY2tQYXJhbXMgPSBjb25maWcucGFyYW1zO1xuXHRcdHRoaXMuZGlhbG9nRWxlbSA9IGNvbmZpZy5kaWFsb2dFbGVtO1xuXHRcdHRoaXMuZGlhbG9nQ29udGFpbmVyXHQ9IHRoaXMuZGlhbG9nRWxlbS5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nX19pbm5lcicpO1xuXHRcdHRoaXMuZGlhbG9nQ29udGVudCA9IG51bGw7XG5cdFx0dGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xuXHR9XG5cblx0aW5pdCAoKSB7XG5cdFx0dGhpcy5hZGRFdmVudHMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKlx0QGRlc2NyaXB0aW9uXHRMb2FkcyB0aGUgY29udGVudFxuXHQgKiBAcGFyYW1cdFx0XHR7T2JqZWN0fSBldmVudFxuXHQgKi9cblx0bG9hZENvbnRlbnQgKGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGZldGNoKHRoaXMucGF0aClcblx0XHQudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpXG5cdFx0LnRoZW4oYm9keSA9PiB7XG5cdFx0XHR0aGlzLmRpYWxvZ0NvbnRhaW5lci5pbm5lckhUTUwgPSBib2R5O1xuXHRcdFx0dGhpcy5kaWFsb2dDb250ZW50ID0gdGhpcy5kaWFsb2dDb250YWluZXIucXVlcnlTZWxlY3RvcignLmRpYWxvZ19fY29udGVudCcpO1xuXHRcdFx0dGhpcy5idXR0b24uc2V0QXR0cmlidXRlKCdpY29uJywgJ2Nsb3NlJyk7XG5cdFx0XHR0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2NvbG9yJywgJ3doaXRlJyk7XG5cdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2RpYWxvZy1pcy12aXNpYmxlJyk7XG5cdFx0XHR0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcblxuXHRcdFx0aWYgKHRoaXMuY2FsbGJhY2spIHsgdGhpcy5jYWxsYmFjayh0aGlzKTsgfVxuXHRcdH0pO1xuXHR9XG5cblxuXHQvKipcblx0ICpcdEBkZXNjcmlwdGlvblx0Q2xvc2VzIHRoZSBkaWFsb2dcblx0ICogQHBhcmFtXHRcdFx0e09iamVjdH0gZXZlbnRcblx0Ki9cblx0Y2xvc2VEaWFsb2cgKGV2ZW50KSB7XG5cdFx0bGV0IGJvZHlIYXNDbGFzc1x0PSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZGlhbG9nLWlzLXZpc2libGUnKTtcblx0XHRsZXQgaXNDbG9zZUJ0blx0XHQ9IGV2ZW50LnRhcmdldCA9PT0gdGhpcy5lbGVtO1xuXHRcdGxldCBpc0VTQ0tleVx0XHQ9IGV2ZW50LmtleUNvZGUgPT09IDI3O1xuXG5cdFx0aWYgKHRoaXMuaXNBY3RpdmUgJiYgYm9keUhhc0NsYXNzICYmIGlzQ2xvc2VCdG4gfHwgaXNFU0NLZXkpIHtcblx0XHRcdC8vIENsZWFyIERPTVxuXHRcdFx0dGhpcy5kaWFsb2dDb250YWluZXIuaW5uZXJIVE1MID0gbnVsbDtcblx0XHRcdC8vIFJlc2V0IGJ1dHRvblxuXHRcdFx0dGhpcy5idXR0b24uc2V0QXR0cmlidXRlKCdpY29uJywgdGhpcy5pbml0QnV0dG9uSWNvbik7XG5cdFx0XHR0aGlzLmJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2NvbG9yJyk7XG5cdFx0XHQvLyBSZW1vdmUgY2xhc3Ncblx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnZGlhbG9nLWlzLXZpc2libGUnKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICpcdEBkZXNjcmlwdGlvblx0VmFsaWRhdGVzIGlmIGRpYWxvZyBpcyB2aXNpYmxlIG9yIG5vdCwgY2xvc2VzL2xvYWRzIGl0LlxuXHQgKiBAcGFyYW1cdFx0XHR7T2JqZWN0fSBldmVudFxuXHQgKi9cblx0bG9hZE9yQ2xvc2VDb250ZW50IChldmVudCkge1xuXHRcdGxldCBkaWFsb2dJc09wZW4gPSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZGlhbG9nLWlzLXZpc2libGUnKTtcblx0XHR0aGlzLmVsZW0uYmx1cigpO1xuXG5cdFx0aWYgKGRpYWxvZ0lzT3Blbikge1xuXHRcdFx0dGhpcy5jbG9zZURpYWxvZyhldmVudCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5sb2FkQ29udGVudChldmVudCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqXHRAZGVzY3JpcHRpb25cdEFkZHMgZXZlbnRzXG5cdCAqL1xuXHRhZGRFdmVudHMgKCkge1xuXHRcdHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMubG9hZE9yQ2xvc2VDb250ZW50LmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5jbG9zZURpYWxvZy5iaW5kKHRoaXMpKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBEaWFsb2c7IiwiLypnbG9iYWxzIFBhY2tlcnksRHJhZ2dhYmlsbHkqL1xuXG5pbXBvcnQgeyBoYXNDdXN0b21DYXJkcyB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5cbi8qKlxuICogQG5hbWVcdFx0XHRcdExheW91dE1hbmFnZXJcbiAqIEBkZXNjcmlwdGlvblx0L1xuICovXG5jbGFzcyBMYXlvdXRNYW5hZ2VyIHtcblx0Y29uc3RydWN0b3IgKGNvbnRhaW5lciwgb3ZlcmxheSkge1xuXHRcdHRoaXMudHJhbnNpdGlvbiA9IDA7XG5cdFx0dGhpcy5kcmFnT3B0aW9ucyA9IHtcblx0XHRcdGhhbmRsZTogJy5icm93LWNvbnRlbnRfX21vZHVsZSAvZGVlcC8gLmRyYWdnLWFyZWEnXG5cdFx0fTtcblx0XHR0aGlzLnBrck9wdGlvbnMgPSB7XG5cdFx0XHRpdGVtU2VsZWN0b3I6ICcuYnJvdy1jb250ZW50X19tb2R1bGUnLFxuXHRcdFx0dHJhbnNpdGlvbkR1cmF0aW9uOiB0aGlzLnRyYW5zaXRpb24sXG5cdFx0XHRjb2x1bW5XaWR0aDogJy5icm93LWNvbnRlbnQtLXNpemVyJyxcblx0XHRcdGd1dHRlcjogJy5icm93LWNvbnRlbnQtLWd1dHRlcicsXG5cdFx0XHRzdGFtcDogJy5pcy1zdGFtcCcsXG5cdFx0XHRpc0luaXRMYXlvdXQ6IGZhbHNlXG5cdFx0fTtcblx0XHR0aGlzLnBhY2tlcnkgPSBuZXcgUGFja2VyeShjb250YWluZXIsIHRoaXMucGtyT3B0aW9ucyk7XG5cdFx0dGhpcy5jb250ZW50ID0gY29udGFpbmVyO1xuXHRcdHRoaXMub3ZlcmxheSA9IG92ZXJsYXk7XG5cdFx0dGhpcy5hZGRFdmVudHMoKTtcblx0XHR0aGlzLmFkZERyYWdnYWJpbGx5KCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRXaWxsIGluaXRpYWxpc2UgdGhlIFBhY2tlcnkgbGF5b3V0LlxuXHQgKi9cblx0bGF5b3V0ICgpIHtcblx0XHR0aGlzLnBhY2tlcnkubGF5b3V0KCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRBZGRzIGEgbmV3IGl0ZW0gdG8gdGhlIFBhY2tlcnkgbGF5b3V0LlxuXHQgKiBAcGFyYW0gXHRcdFx0e05vZGVMaXN0fEhUTUxFbGVtZW50fSBlbGVtXG5cdCAqL1xuXHRhZGQgKGVsZW0pIHtcblx0XHR0aGlzLnBhY2tlcnkuYXBwZW5kZWQoIGVsZW0gKTtcblx0XHR0aGlzLmFkZERyYWdnYWJpbGx5KCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRSZW1vdmVzIHBhc3NlZCBlbGVtZW50IGZyb20gdGhlIFBhY2tlcnkgbGF5b3V0LlxuXHQgKiBAcGFyYW0gXHRcdFx0e05vZGVMaXN0fEhUTUxFbGVtZW50fSBjb25maWdcblx0ICovXG5cdHJlbW92ZSAoZWxlbSkge1xuXHRcdHRoaXMucGFja2VyeS5yZW1vdmUoIGVsZW0gKTtcblx0XHR0aGlzLmxheW91dCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0TWFrZXMgYW4gZWxlbWVudCBzdGlja3kuXG5cdCAqIEBwYXJhbSBcdFx0XHR7Tm9kZUxpc3R8SFRNTEVsZW1lbnR9IGNvbmZpZ1xuXHQgKi9cblx0c3RhbXAgKGVsZW0pIHtcblx0XHR0aGlzLnBhY2tlcnkuc3RhbXAoIGVsZW0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdFVuc3RhbXBzIGFuIGVsZW1lbnQuXG5cdCAqIEBwYXJhbSBcdFx0XHR7Tm9kZUxpc3R8SFRNTEVsZW1lbnR9IGNvbmZpZ1xuXHQgKi9cblx0dW5zdGFtcCAoZWxlbSkge1xuXHRcdHRoaXMucGFja2VyeS51bnN0YW1wKCBlbGVtICk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRJbml0aWFsaXNlcyBEcmFnZ2FiaWxseS5cblx0ICovXG5cdGFkZERyYWdnYWJpbGx5ICgpIHtcblx0XHRsZXQgY2FyZHMgPSB0aGlzLnBhY2tlcnkuZ2V0SXRlbUVsZW1lbnRzKCk7XG5cdFx0Y2FyZHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHRcdFx0bGV0IGRyYWdnaWUgPSBuZXcgRHJhZ2dhYmlsbHkoaXRlbSwgdGhpcy5kcmFnT3B0aW9ucyk7XG5cdFx0XHR0aGlzLnBhY2tlcnkuYmluZERyYWdnYWJpbGx5RXZlbnRzKCBkcmFnZ2llICk7XG5cdFx0XHRkcmFnZ2llLm9uKCdwb2ludGVyRG93bicsIHRoaXMudmFsaWRhdGVFZGl0TW9kZS5iaW5kKGRyYWdnaWUpKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdEFkZHMgRXZlbnRMaXN0ZW5lci5cblx0ICovXG5cdGFkZEV2ZW50cyAoKSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NhcmQtZWRpdCcsIHRoaXMudmFsaWRhdGVMYXlvdXRTdGF0ZS5iaW5kKHRoaXMpKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2FyZC1zYXZlJywgdGhpcy52YWxpZGF0ZUxheW91dFN0YXRlLmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjYXJkLXJlbW92ZScsIHRoaXMudmFsaWRhdGVMYXlvdXRTdGF0ZS5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLm92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnZhbGlkYXRlTGF5b3V0U3RhdGUuYmluZCh0aGlzKSk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHREZWFjdGl2YXRlcyBlZGl0TW9kZSBhbmQgcmVtb3ZlcyBjbGFzc2VzIGZyb20gY29udGVudCBvdmVybGF5LlxuXHQgKi9cblx0ZGVhY3RpdmF0ZUVkaXRNb2RlICgpIHtcblx0XHR3aW5kb3cuaXNFZGl0TW9kZSA9IGZhbHNlO1xuXHRcdHRoaXMub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpcy1mYWRpbmcnKTtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHRoaXMub3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJywgJ2lzLWZhZGluZycpO1xuXHRcdH0sIDEwMCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRDaGVja3MgZXZlbnQgdHlwZSBhbmQgdmFsaWRhdGVzIHRoZSBsYXlvdXQncyBzdGF0ZS5cblx0ICogQHBhcmFtICBcdFx0XHR7T2JqZWN0fSBldmVudFxuXHQgKi9cblx0dmFsaWRhdGVMYXlvdXRTdGF0ZSAoZXZlbnQpIHtcblx0XHRsZXQgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWd1aWQ9XCIke2V2ZW50LmRldGFpbH1cIl1gKTtcblxuXHRcdC8vIGFjdGl2YXRlZCBlZGl0aW5nIG1vZGVcblx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NhcmQtZWRpdCcpIHtcblx0XHRcdHdpbmRvdy5pc0VkaXRNb2RlID0gdHJ1ZTtcblx0XHRcdHRoaXMub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpcy12aXNpYmxlJyk7XG5cdFx0fVxuXG5cdFx0Ly8gc2F2ZWQgY2FyZCBvciByZW1vdmUgY2FyZFxuXHRcdGlmIChldmVudC50eXBlID09PSAnY2FyZC1zYXZlJyB8fCBldmVudC50eXBlID09PSAnY2FyZC1yZW1vdmUnKSB7XG5cdFx0XHR0aGlzLmRlYWN0aXZhdGVFZGl0TW9kZSgpO1xuXG5cdFx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NhcmQtc2F2ZScpIHtcblx0XHRcdFx0dGhpcy5sYXlvdXQoKTtcblx0XHRcdFx0aGFzQ3VzdG9tQ2FyZHMoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdjYXJkLXJlbW92ZScpIHtcblx0XHRcdFx0dGhpcy5yZW1vdmUoZWxlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ2NsaWNrJyAmJiB3aW5kb3cuaXNFZGl0TW9kZSkge1xuXHRcdFx0ZWxlbSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcuaXMtZWRpdCcpO1xuXHRcdFx0ZWxlbS5zYXZlVG9TdG9yYWdlKCk7XG5cdFx0XHRlbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2Z4JywgJ2lzLWVkaXQnKTtcblx0XHRcdHRoaXMuZGVhY3RpdmF0ZUVkaXRNb2RlKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGlmIGVkaXRNb2RlIGlzIGFjdGl2ZSBhbmQgd2VpdGhlciBkaXNhYmxlcyBvciBlbmFibGVzIHRoZSBkcmFnZ2luZy5cblx0ICovXG5cdHZhbGlkYXRlRWRpdE1vZGUgKCkge1xuXHRcdGlmICh3aW5kb3cuaXNFZGl0TW9kZSkge1xuXHRcdFx0dGhpcy5kaXNhYmxlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZW5hYmxlKCk7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExheW91dE1hbmFnZXI7IiwiaW1wb3J0IHsgc25hY2tiYXIgfSBmcm9tICcuLi91dGlscy9lbGVtZW50cyc7XG5cbi8qKlxuICogQG5hbWVcdFx0XHRcdFNuYWNrYmFyXG4gKiBAZGVzY3JpcHRpb25cdC9cbiAqL1xuY2xhc3MgU25hY2tiYXIge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmR1cmF0aW9uID0gMTAwMDA7XG5cdFx0dGhpcy5lbGVtID0gc25hY2tiYXI7XG5cdFx0dGhpcy5kZWZhdWx0ID0gJ09vb3BzLCBzb21ldGhpbmcgd2VudCB3cm9uZyEgOignO1xuXHRcdHRoaXMubWVzc2FnZSA9IG51bGw7XG5cdH1cblxuXHRhbGVydChtc2cgPSB0aGlzLmRlZmF1bHQpIHtcblx0XHR0aGlzLm1lc3NhZ2UgPSBtc2cudHJpbSgpO1xuXHRcdHRoaXMuc2hvdygpO1xuXHR9XG5cblx0c2V0IHNldER1cmF0aW9uIChkdXJhdGlvbikge1xuXHRcdHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcblx0fVxuXG5cdHNob3coKSB7XG5cdFx0dGhpcy5lbGVtLmlubmVySFRNTCA9IG51bGw7XG5cdFx0dGhpcy5lbGVtLmFwcGVuZENoaWxkKCB0aGlzLmNyZWF0ZVBhcmFncmFwaCgpICk7XG5cdFx0dGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2lzLXZpc2libGUnKTtcblxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcblx0XHRcdHRoaXMubWVzc2FnZSA9IG51bGw7XG5cdFx0fSwgdGhpcy5kdXJhdGlvbik7XG5cdH1cblxuXHRjcmVhdGVQYXJhZ3JhcGgoKSB7XG5cdFx0bGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cdFx0cC5pbm5lclRleHQgPSB0aGlzLm1lc3NhZ2U7XG5cdFx0cmV0dXJuIHA7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU25hY2tiYXI7IiwiLyoqXG4gKiBAbmFtZVx0XHRcdFx0VGltZXJcbiAqIEBkZXNjcmlwdGlvblx0Q2xhc3Mgd2hpY2ggYXBwZW5kcyBhIHRpbWUgc3RyaW5nIHRvIGFuIGVsZW1lbnRcbiAqICAgICAgICAgICAgICBcdGFuZCB1cGRhdGVzIGl0IGV2ZXJ5IHNlY29uZC5cbiAqL1xuY2xhc3MgVGltZXIge1xuXHRjb25zdHJ1Y3RvciAoZWxlbSkge1xuXHRcdGlmICghKGVsZW0gJiYgZWxlbS5ub2RlTmFtZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgWW91IGhhdmVuJ3QgcGFzc2VkIGEgdmFsaWQgSFRNTEVsZW1lbnQhYCk7XG5cdFx0fVxuXG5cdFx0dGhpcy51cGRhdGVcdD0gMTAwMDtcblx0XHR0aGlzLmVsZW1cdD0gZWxlbTtcblx0XHR0aGlzLmZvcm1hdCA9ICcyNGgnO1xuXHRcdHRoaXMuYWJicmV2aWF0aW9ucyA9IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0Q3JlYXRlcyBhIHN0cmluZyB3aXRoIGN1cnJlbnQgdGltZSBpbiBISDpNTTpTU1xuXHQgKiBAcmV0dXJuXHRcdFx0e1N0cmluZ31cblx0ICovXG5cdGdldFRpbWUgKCkge1xuXHRcdGxldCBkYXRlXHRcdFx0XHQ9IG5ldyBEYXRlKCk7XG5cdFx0bGV0IGRhdGVIb3Vyc1x0XHQ9IGRhdGUuZ2V0SG91cnMoKTtcblx0XHRsZXQgZGF0ZU1pbnV0ZXNcdD0gZGF0ZS5nZXRNaW51dGVzKCk7XG5cdFx0bGV0IGRhdGVTZWNvbmRzXHQ9IGRhdGUuZ2V0U2Vjb25kcygpO1xuXHRcdGxldCBkYXRlQWJiclx0XHQ9ICcnO1xuXG5cdFx0Ly8gSWYgdGltZSBmb3JtYXQgaXMgc2V0IHRvIDEyaCwgdXNlIDEyaC1zeXN0ZW0uXG5cdFx0aWYgKHRoaXMuZm9ybWF0ID09PSAnMTJoJykge1xuXHRcdFx0aWYgKHRoaXMuYWJicmV2aWF0aW9ucykge1xuXHRcdFx0XHRkYXRlQWJiciA9IHRoaXMuZ2V0QWJicmV2aWF0aW9uKGRhdGVIb3Vycyk7XG5cdFx0XHR9XG5cdFx0XHRkYXRlSG91cnMgPSAoZGF0ZUhvdXJzICUgMTIpID8gZGF0ZUhvdXJzICUgMTIgOiAxMjtcblx0XHR9XG5cblx0XHQvLyBBZGQgJzAnIGlmIGJlbG93IDEwXG5cdFx0aWYgKGRhdGVIb3VycyA8IDEwKSB7IGRhdGVIb3VycyA9IGAwJHtkYXRlSG91cnN9YDsgfVxuXHRcdGlmIChkYXRlTWludXRlcyA8IDEwKSB7IGRhdGVNaW51dGVzID0gYDAke2RhdGVNaW51dGVzfWA7IH1cblx0XHRpZiAoZGF0ZVNlY29uZHMgPCAxMCkgeyBkYXRlU2Vjb25kcyA9IGAwJHtkYXRlU2Vjb25kc31gOyB9XG5cblx0XHRyZXR1cm4gYCR7ZGF0ZUhvdXJzfToke2RhdGVNaW51dGVzfToke2RhdGVTZWNvbmRzfSAke2RhdGVBYmJyfWA7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRWYWxpZGF0ZXMgbnVtYmVyIGFuZCByZXR1cm5zIGVpdGhlciBBTSBvciBQTS5cblx0ICogQHBhcmFtIFx0XHRcdHtOdW1iZXJ9IHRpbWVcblx0ICogQHJldHVyblx0XHRcdHtTdHJpbmd9XG5cdCAqL1xuXHRnZXRBYmJyZXZpYXRpb24gKHRpbWUpIHtcblx0XHRpZiAodHlwZW9mIHRpbWUgIT09ICdudW1iZXInKSB7XG5cdFx0XHR0aW1lID0gcGFyc2VGbG9hdCh0aW1lKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gKHRpbWUgPj0gMTIpID8gJ1BNJyA6ICdBTSc7XG5cdH1cblxuXHQvKipcblx0ICpcdEBkZXNjcmlwdGlvblx0TmVlZHMgdG8gYmUgd3JpdHRlbi5cblx0ICogQHBhcmFtXHRcdFx0e09iamVjdH0gY29uZmlnXG5cdCAqL1xuXHRzZXREYXRlRm9ybWF0IChjb25maWcpIHtcblx0XHRpZiAoY29uZmlnKSB7XG5cdFx0XHR0aGlzLmZvcm1hdCA9IChjb25maWcuZm9ybWF0KSA/IGNvbmZpZy5mb3JtYXQgOiB0aGlzLmZvcm1hdDtcblx0XHRcdHRoaXMuYWJicmV2aWF0aW9ucyA9IGNvbmZpZy5hYmJyZXZpYXRpb25zO1xuXHRcdH1cblx0XHR0aGlzLnJ1bigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0U2V0cyB0aGUgZWxlbWVudCBpbiB3aGljaCB0aGUgdGltZSBzaG91bGQgYmUgZGlzcGxheWVkLlxuXHQgKiBAcGFyYW1cdFx0XHR7RWxlbWVudH0gZWxlbVxuXHQgKiBAcmV0dXJuIFx0XHRcdHtIVE1MRWxlbWVudH1cblx0ICovXG5cdHJ1biAoKSB7XG5cdFx0dGhpcy5lbGVtLnRleHRDb250ZW50ID0gdGhpcy5nZXRUaW1lKCk7XG5cblx0XHRzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHR0aGlzLmVsZW0udGV4dENvbnRlbnQgPSB0aGlzLmdldFRpbWUoKTtcblx0XHR9LCB0aGlzLnVwZGF0ZSk7XG5cblx0XHRyZXR1cm4gdGhpcy5lbGVtO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVyOyIsImV4cG9ydCBjb25zdCBCUk9XX1NFVFRJTkdTID0gJ0JST1dfU0VUVElOR1MnO1xuZXhwb3J0IGNvbnN0IEJST1dfS0VZXHRcdD0gJ0JST1dfVEhFTUUnO1xuZXhwb3J0IGNvbnN0IEJST1dfQ0FSRFNcdFx0PSAnQlJPV19DQVJEUyc7XG5leHBvcnQgY29uc3QgREVGQVVMVF9USEVNRVx0PSAnYmx1ZS1hNDAwJzsiLCJleHBvcnQgbGV0IHRpbWVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXRpbWVyJyk7XG5leHBvcnQgbGV0IGRpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1kaWFsb2cnKTtcbmV4cG9ydCBsZXQgY2FyZGxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY2FyZGxpc3QnKTtcbmV4cG9ydCBsZXQgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1jb250ZW50Jyk7XG5leHBvcnQgbGV0IGNvbnRlbnRPdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnRfX292ZXJsYXknKTtcbmV4cG9ydCBsZXQgb3BlbkRpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5vcGVuLWRpYWxvZycpO1xuZXhwb3J0IGxldCBuZXdDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLW5ld2NhcmQnKTtcbmV4cG9ydCBsZXQgc2VsZWN0aW9uTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1zZWxlY3Rpb24nKTtcbmV4cG9ydCBsZXQgc25hY2tiYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtc25hY2tiYXInKTsiLCJpbXBvcnQgeyBCUk9XX1NFVFRJTkdTLCBCUk9XX0NBUkRTLCBERUZBVUxUX1RIRU1FIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGlmIGN1c3RvbSB0aGVtZSBzZXR0aW5ncyBhcmUgYXZhaWxhYmxlLlxuICogQHJldHVyblx0XHRcdHtCb29sZWFufVxuICovXG5jb25zdCBpc0N1c3RvbVRoZW1lID0gZnVuY3Rpb24gKCkge1xuXHRsZXQgaXNDdXN0b20gPSBmYWxzZTtcblxuXHRpZiAobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKSB7XG5cdFx0bGV0IHNldHRpbmdzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pO1xuXHRcdGlzQ3VzdG9tID0gISFzZXR0aW5ncy50aGVtZTtcblx0fVxuXG5cdHJldHVybiBpc0N1c3RvbTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRDaGVja3MgaWYgY3VzdG9tIGtleSBpcyBzZXQsIGlmIG5vdDogZG8gaXQuXG4gKi9cbmNvbnN0IGhhc0N1c3RvbUNhcmRzID0gZnVuY3Rpb24gKCkge1xuXHRpZiAoIWxvY2FsU3RvcmFnZVtCUk9XX0NBUkRTXSkge1xuXHRcdGxvY2FsU3RvcmFnZVtCUk9XX0NBUkRTXSA9IHRydWU7XG5cdH1cbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRDaGVja3MgdmlhIHJlZ2V4IGlmIGNsYXNzTmFtZSBpcyBhIHRoZW1lLlxuICovXG5jb25zdCBjaGVja0ZvclRoZW1lQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG5cdGxldCB0aGVtZVJlZ0V4ID0gL3RoZW1lLS4qLztcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdGlmICh0aGVtZVJlZ0V4LnRlc3QoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3RbaV0pKSB7XG5cdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0W2ldICk7XG5cdFx0fVxuXHR9XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0UGFyc2VzIHRoZSBjdXN0b20gc2V0dGluZ3MgZnJvbSBsb2NhbFN0b3JhZ2UgYW5kIHNldHMgY2xhc3Nlcy5cbiAqL1xuY29uc3QgdXBkYXRlVGhlbWVGcm9tU3RvcmFnZSA9IGZ1bmN0aW9uICgpIHtcblx0bGV0IHNldHRpbmdzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pO1xuXHQvL2xldCBkaWFsb2dJc09wZW4gPSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnZGlhbG9nLWlzLXZpc2libGUnKTtcblxuXHRjaGVja0ZvclRoZW1lQ2xhc3MoKTtcblx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKGB0aGVtZS0ke3NldHRpbmdzLnRoZW1lLmNvbG9yfWApO1xuXG5cdGlmIChpc0N1c3RvbVRoZW1lKCkgJiYgc2V0dGluZ3MudGhlbWUuaGVhZGVyYmFyKSB7XG5cdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd0aGVtZS1oZWFkZXJiYXInKTtcblx0fVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdEFkZHMgdGhlIHRoZW1lIGNsYXNzIHRvIDxib2R5PiBmcm9tIGluaXRpYWwgc2V0dGluZ3MuXG4gKiBAcGFyYW1cdFx0XHR7U3RyaW5nfSB0aGVtZVxuICovXG5jb25zdCB1cGRhdGVUaGVtZUZyb21Db25maWcgPSBmdW5jdGlvbiAodGhlbWUpIHtcblx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKGB0aGVtZS0ke3RoZW1lfWApO1xufTtcblxuLyoqXG4gKlx0QGRlc2NyaXB0aW9uXHRVcGRhdGVzIHRoZSBjdXJyZW50IHRoZW1lLlxuICogQHBhcmFtXHRcdFx0e09iamVjdH0gdGhlbWVcbiAqL1xuY29uc3Qgc2V0VGhlbWUgPSBmdW5jdGlvbiAodGhlbWUpIHtcblx0aWYgKCF0aGVtZSB8fCB0eXBlb2YgdGhlbWUgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhlbWUgPSBERUZBVUxUX1RIRU1FO1xuXHR9XG5cblx0aWYgKGlzQ3VzdG9tVGhlbWUoKSkge1xuXHRcdHVwZGF0ZVRoZW1lRnJvbVN0b3JhZ2UoKTtcblx0fSBlbHNlIHtcblx0XHR1cGRhdGVUaGVtZUZyb21Db25maWcoIHRoZW1lICk7XG5cdH1cbn07XG5cbmV4cG9ydCB7XG5cdGlzQ3VzdG9tVGhlbWUsXG5cdGhhc0N1c3RvbUNhcmRzLFxuXHRzZXRUaGVtZSxcblx0dXBkYXRlVGhlbWVGcm9tQ29uZmlnLFxuXHR1cGRhdGVUaGVtZUZyb21TdG9yYWdlXG59OyIsInZhciBnZXRDdXJyZW50QWN0aXZlSXRlbSA9IChjb250ZW50KSA9PiBjb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2dfX3NpZGViYXIgbGkuaXMtYWN0aXZlIGEnKTtcbnZhciBnZXRDdXJyZW50QWN0aXZlU2VjdGlvbiA9IChjb250ZW50KSA9PiBjb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3NlY3Rpb24uaXMtdmlzaWJsZScpO1xuXG52YXIgdmFsaWRhdGVTZWN0aW9uID0gZnVuY3Rpb24gKGNvbnRlbnQpIHtcblx0bGV0IGN1ckl0ZW0gPSBnZXRDdXJyZW50QWN0aXZlSXRlbShjb250ZW50KTtcblx0bGV0IGN1clNlY3Rpb24gPSBnZXRDdXJyZW50QWN0aXZlU2VjdGlvbihjb250ZW50KTtcblx0bGV0IHRhcmdldFNlY3Rpb24gPSBjdXJJdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1zZWN0aW9uJyk7XG5cdGxldCBzZWN0aW9uID0gY29udGVudC5xdWVyeVNlbGVjdG9yKGBzZWN0aW9uW2RhdGEtc2VjdGlvbj1cIiR7dGFyZ2V0U2VjdGlvbn1cIl1gKTtcblxuXHRpZiAoY3VyU2VjdGlvbikgeyBjdXJTZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTsgfVxuXHRzZWN0aW9uLmNsYXNzTGlzdC5hZGQoJ2lzLXZpc2libGUnKTtcbn07XG5cbnZhciB0b2dnbGVDb250ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0bGV0IGl0ZW0gPSBldmVudC50YXJnZXQ7XG5cdGxldCBjdXJBY3RpdmUgPSBnZXRDdXJyZW50QWN0aXZlSXRlbSh0aGlzLmNhdGVnb3J5TGlzdCkucGFyZW50Tm9kZTtcblxuXHRpZiAoIWl0ZW0ucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWFjdGl2ZScpKSB7XG5cdFx0Y3VyQWN0aXZlLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpO1xuXHRcdGl0ZW0ucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKTtcblx0XHR2YWxpZGF0ZVNlY3Rpb24odGhpcy5kaWFsb2dDb250ZW50KTtcblx0fVxuXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0QWRkcyBjYWxsYmFjayB0byBjb250ZW50IGluIGRpYWxvZyBhbmQgdmFsaWRhdGVzIDxpbnB1dD4gZmllbGRzLlxuICovXG52YXIgZGlhbG9nSW5mb3JtYXRpb25DYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcblx0dGhpcy5jYXRlZ29yeUxpc3QgPSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignLmRpYWxvZ19fc2lkZWJhciB1bCcpO1xuXG5cdHZhbGlkYXRlU2VjdGlvbih0aGlzLmRpYWxvZ0NvbnRlbnQpO1xuXHR0aGlzLmNhdGVnb3J5TGlzdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZUNvbnRlbnQuYmluZCh0aGlzKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkaWFsb2dJbmZvcm1hdGlvbkNhbGxiYWNrOyIsImltcG9ydCB7IEJST1dfU0VUVElOR1MsIERFRkFVTFRfVEhFTUUgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHsgaXNDdXN0b21UaGVtZSwgc2V0VGhlbWUgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0VmFsaWRhdGVzIGlucHV0IGZpZWxkcywgdXBkYXRlcyBicm93VGhlbWUgYW5kIHNhdmVzIHRvIGxvY2FsU3RvcmFnZS5cbiAqIEBwYXJhbSAgXHRcdFx0e09iamVjdH0gZXZlbnRcbiAqL1xudmFyIHVwZGF0ZVRoZW1lID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdGxldCBjb2xvckhlYWRDaGVja2JveFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLS1jb2xvcmVkaGVhZCcpO1xuXHQvL2xldCBpc1RoZW1lQnV0dG9uXHRcdFx0PSBldmVudC50YXJnZXQuaGFzQXR0cmlidXRlKCdkYXRhLXNldHRpbmdzLXRoZW1lJyk7XG5cdC8vbGV0IGlzVGhlbWVDaGVja2JveFx0XHQ9IGV2ZW50LnRhcmdldC5pZCA9PT0gJ3NldHRpbmdzLS1jb2xvcmVkaGVhZCc7XG5cdGxldCBzZXR0aW5nc1x0XHRcdFx0PSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtCUk9XX1NFVFRJTkdTXSk7XG5cblx0Ly8gSWYgbm8gdGhlbWUgc2V0dGluZ3MgYXJlIHN0b3JlZCB5ZXQuXG5cdGlmICghc2V0dGluZ3MudGhlbWUpIHtcblx0XHRzZXR0aW5ncy50aGVtZSA9IHsgY29sb3I6IERFRkFVTFRfVEhFTUUsIGhlYWRlcmJhcjogZmFsc2UgfTtcblx0fVxuXG5cdC8vIElzIHRoZW1lIG9wdGlvblxuXHRpZiAoZXZlbnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1zZXR0aW5ncy10aGVtZScpKSB7XG5cdFx0c2V0dGluZ3MudGhlbWUuY29sb3IgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXNldHRpbmdzLXRoZW1lJyk7XG5cdH1cblxuXHQvLyBJZiBjb2xvcmVkIGhlYWRlciBiYXIgaXMgY2xpY2tlZFxuXHRpZiAoZXZlbnQudGFyZ2V0LmlkID09PSAnc2V0dGluZ3MtLWNvbG9yZWRoZWFkJykge1xuXHRcdHNldHRpbmdzLnRoZW1lLmhlYWRlcmJhciA9IGNvbG9ySGVhZENoZWNrYm94LmNoZWNrZWQ7XG5cdH1cblxuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShCUk9XX1NFVFRJTkdTLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xuXHRzZXRUaGVtZSgpO1xufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdFZhbGlkYXRlcyBpbnB1dCBmaWVsZHMsIHVwZGF0ZXMgVGltZXIgYW5kIHNhdmVzIHRvIGxvY2FsU3RvcmFnZS5cbiAqIEBwYXJhbSAgXHRcdFx0e09iamVjdH0gZXZlbnRcbiAqL1xudmFyIHVwZGF0ZURhdGVGb3JtYXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblx0bGV0IGZvcm1hdENoZWNrYm94XHQ9IHRoaXMuZGlhbG9nQ29udGVudC5xdWVyeVNlbGVjdG9yKCcjc2V0dGluZ3MtLWRhdGVmb3JtYXQnKTtcblx0bGV0IGFiYnJDaGVja2JveFx0XHQ9IHRoaXMuZGlhbG9nQ29udGVudC5xdWVyeVNlbGVjdG9yKCcjc2V0dGluZ3MtLWFtcG0nKTtcblx0bGV0IHRpbWVGb3JtYXRcdFx0XHQ9ICcyNGgnO1xuXHRsZXQgZGF0ZVNldHRpbmdzXHRcdD0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pO1xuXG5cdC8vIElmIGRhdGUgZm9ybWF0IGNoZWNrYm94IGlzIGNsaWNrZWRcblx0aWYgKGV2ZW50LnRhcmdldC5pZCA9PT0gJ3NldHRpbmdzLS1kYXRlZm9ybWF0Jykge1xuXHRcdGlmICghZm9ybWF0Q2hlY2tib3guY2hlY2tlZCkge1xuXHRcdFx0dGltZUZvcm1hdCA9ICcxMmgnO1xuXHRcdFx0YWJickNoZWNrYm94LmRpc2FibGVkID0gZmFsc2U7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGZvcm1hdENoZWNrYm94LmNoZWNrZWQgJiYgIWFiYnJDaGVja2JveC5kaXNhYmxlZCkge1xuXHRcdFx0YWJickNoZWNrYm94LmRpc2FibGVkID0gdHJ1ZTtcblx0XHRcdGFiYnJDaGVja2JveC5jaGVja2VkID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy5jYWxsYmFja1BhcmFtcy5icm93VGltZXIuc2V0RGF0ZUZvcm1hdCh7ICdmb3JtYXQnOiB0aW1lRm9ybWF0IH0pO1xuXHRcdGRhdGVTZXR0aW5ncy5kYXRlRm9ybWF0ID0gdGltZUZvcm1hdDtcblx0XHRkYXRlU2V0dGluZ3MuYWJicmV2aWF0aW9ucyA9IGFiYnJDaGVja2JveC5jaGVja2VkO1xuXHR9XG5cblx0Ly8gSWYgYWJicmV2aWF0aW9uIGNoZWNrYm94IGlzIGNsaWNrZWRcblx0aWYgKCFldmVudC50YXJnZXQuZGlzYWJsZWQgJiYgZXZlbnQudGFyZ2V0LmlkID09PSAnc2V0dGluZ3MtLWFtcG0nKSB7XG5cdFx0dGhpcy5jYWxsYmFja1BhcmFtcy5icm93VGltZXIuc2V0RGF0ZUZvcm1hdCh7ICdhYmJyZXZpYXRpb25zJzogYWJickNoZWNrYm94LmNoZWNrZWQgfSk7XG5cdFx0ZGF0ZVNldHRpbmdzLmFiYnJldmlhdGlvbnMgPSBhYmJyQ2hlY2tib3guY2hlY2tlZDtcblx0fVxuXG5cdGxvY2FsU3RvcmFnZS5zZXRJdGVtKEJST1dfU0VUVElOR1MsIEpTT04uc3RyaW5naWZ5KGRhdGVTZXR0aW5ncykpO1xufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdEFkZHMgY2FsbGJhY2sgdG8gY29udGVudCBpbiBkaWFsb2cgYW5kIHZhbGlkYXRlcyA8aW5wdXQ+IGZpZWxkcy5cbiAqL1xudmFyIGRpYWxvZ1NldHRpbmdzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG5cdGxldCB0aW1lQ29udGVudFx0XHQ9IHRoaXMuZGlhbG9nQ29udGVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudF9fdGltZScpO1xuXHRsZXQgdGhlbWVDb250ZW50XHRcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50X190aGVtZScpO1xuXHRsZXQgZm9ybWF0Q2hlY2tib3hcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR0aW5ncy0tZGF0ZWZvcm1hdCcpO1xuXHRsZXQgYWJickNoZWNrYm94XHRcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR0aW5ncy0tYW1wbScpO1xuXHRsZXQgdGhlbWVDaGVja2JveFx0XHQ9IHRoaXMuZGlhbG9nQ29udGVudC5xdWVyeVNlbGVjdG9yKCcjc2V0dGluZ3MtLWNvbG9yZWRoZWFkJyk7XG5cdGxldCBicm93U2V0dGluZ3NcdFx0PSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtCUk9XX1NFVFRJTkdTXSk7XG5cblx0Ly8gVmFsaWRhdGUgZGF0ZSBzZXR0aW5ncyBhbmQgdXBkYXRlIERPTVxuXHRpZiAoYnJvd1NldHRpbmdzLmRhdGVGb3JtYXQgPT09ICcxMmgnKSB7XG5cdFx0Zm9ybWF0Q2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xuXHR9XG5cdGFiYnJDaGVja2JveC5jaGVja2VkID0gYnJvd1NldHRpbmdzLmFiYnJldmlhdGlvbnM7XG5cdGFiYnJDaGVja2JveC5kaXNhYmxlZCA9ICFicm93U2V0dGluZ3MuYWJicmV2aWF0aW9ucztcblxuXHQvLyBWYWxpZGF0ZSBoZWFkZXIgYmFyIHNldHRpbmdzIGFuZCB1cGRhdGUgRE9NXG5cdGlmIChpc0N1c3RvbVRoZW1lKCkpIHtcblx0XHR0aGVtZUNoZWNrYm94LmNoZWNrZWQgPSBicm93U2V0dGluZ3MudGhlbWUuaGVhZGVyYmFyO1xuXHR9XG5cblx0Ly8gQWRkIGV2ZW50TGlzdGVuZXJcblx0dGltZUNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB1cGRhdGVEYXRlRm9ybWF0LmJpbmQodGhpcykpO1xuXHR0aGVtZUNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB1cGRhdGVUaGVtZS5iaW5kKHRoaXMpKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRpYWxvZ1NldHRpbmdzQ2FsbGJhY2s7Il19
