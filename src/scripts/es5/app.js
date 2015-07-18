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
		console.log(this);
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
			case 'calculator':
				return document.createElement('calculator-card');
			case 'calendar':
				return document.createElement('calendar-card');
			default:
				console.warn('I couldn\'t find "' + this.config.type + '" module :( Take this <text-card> instead :)');
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
/**
 * @description	Returns current active list item
 * @return 			{HTMLElement}
 */
'use strict';

exports.__esModule = true;
var getCurrentActiveItem = function getCurrentActiveItem(content) {
	return content.querySelector('.dialog__sidebar li.is-active a');
};

/**
 * @description	Returns current active section
 * @return 			{HTMLElement}
 */
var getCurrentActiveSection = function getCurrentActiveSection(content) {
	return content.querySelector('section.is-visible');
};

/**
 * @description	Validates new and old content.
 * @param 			{HTMLElement} content
 */
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

/**
 * @description	Adds or removes active state on list and shows/hides content.
 * @param 			{Object} event
 */
var toggleContent = function toggleContent(event) {
	event.preventDefault();

	var item = event.target;
	var isLink = item.nodeName === 'A';
	var curActive = getCurrentActiveItem(this.categoryList).parentNode;

	if (isLink && !item.parentNode.classList.contains('is-active')) {
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvYXBwLmluaXQuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvbW9kdWxlcy9jYXJkLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvZGlhbG9nLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvbGF5b3V0bWFuYWdlci5qcyIsIi9Vc2Vycy9tb3Jrcm9nZS9EZXNrdG9wL1Byb2plY3RzL1BlcnNvbmFsL0Jyb3dEYXNoL3NyYy9zY3JpcHRzL2VzNi9tb2R1bGVzL3NuYWNrYmFyLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvdGltZXIuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvdXRpbHMvY29uc3RhbnRzLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L3V0aWxzL2VsZW1lbnRzLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L3V0aWxzL2hlbHBlci5qcyIsIi9Vc2Vycy9tb3Jrcm9nZS9EZXNrdG9wL1Byb2plY3RzL1BlcnNvbmFsL0Jyb3dEYXNoL3NyYy9zY3JpcHRzL2VzNi92aWV3cy9kaWFsb2cuaW5mb3JtYXRpb24uanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvdmlld3MvZGlhbG9nLnNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7NkJDQzRFLGtCQUFrQjs7OEJBQ3BELG1CQUFtQjs7MkJBQ3BDLGdCQUFnQjs7bUNBQ04seUJBQXlCOzs7O3NDQUN0Qiw0QkFBNEI7Ozs7NEJBQ2hELGlCQUFpQjs7Ozs2QkFDaEIsa0JBQWtCOzs7OzJCQUNwQixnQkFBZ0I7Ozs7b0NBQ1AseUJBQXlCOzs7OytCQUM5QixvQkFBb0I7Ozs7O0FBR3pDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDOzs7OztBQUt0QixJQUFJLHNCQUFzQixHQUFHLFNBQXpCLHNCQUFzQixHQUFlO0FBQ3hDLEtBQUksS0FBSyxHQUFHLGtDQUFjLENBQUM7O0FBRTNCLEtBQUksYUFBYSxFQUFFO0FBQ2xCLE1BQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQ3RCLFFBQUssQ0FBQyxLQUFLLDBIQUEwSCxDQUFDO0dBQ3RJLE1BQ0k7QUFDSixRQUFLLENBQUMsS0FBSyxzREFBc0QsQ0FBQztHQUNsRTtFQUNEOztBQUVELGNBQWEsRUFBRSxDQUFDO0NBQ2hCLENBQUM7Ozs7O0FBS0YsSUFBSSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxHQUFlO0FBQy9CLFVBQVMsR0FBRyw2Q0F0Q0osS0FBSyxDQXNDZSxDQUFDO0FBQzdCLEtBQUksWUFBWSxHQUFHLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUM7O0FBRTlELEtBQUksQ0FB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ZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIEltcG9ydCBkZXBlbmRlbmNpZXMgKi9cbmltcG9ydCB7IHRpbWVyLCBvcGVuRGlhbG9nLCBkaWFsb2csIG5ld0NhcmQsIGNvbnRlbnQsIGNvbnRlbnRPdmVybGF5IH0gZnJvbSAnLi91dGlscy9lbGVtZW50cyc7XG5pbXBvcnQgeyBCUk9XX1NFVFRJTkdTLCBCUk9XX0NBUkRTIH0gZnJvbSAnLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHsgc2V0VGhlbWUgfSBmcm9tICcuL3V0aWxzL2hlbHBlcic7XG5pbXBvcnQgZGlhbG9nU2V0dGluZ3NDYWxsYmFjayBmcm9tICcuL3ZpZXdzL2RpYWxvZy5zZXR0aW5ncyc7XG5pbXBvcnQgZGlhbG9nSW5mb3JtYXRpb25DYWxsYmFjayBmcm9tICcuL3ZpZXdzL2RpYWxvZy5pbmZvcm1hdGlvbic7XG5pbXBvcnQgVGltZXIgZnJvbSAnLi9tb2R1bGVzL3RpbWVyJztcbmltcG9ydCBEaWFsb2cgZnJvbSAnLi9tb2R1bGVzL2RpYWxvZyc7XG5pbXBvcnQgQ2FyZCBmcm9tICcuL21vZHVsZXMvY2FyZCc7XG5pbXBvcnQgTGF5b3V0TWFuYWdlciBmcm9tICcuL21vZHVsZXMvbGF5b3V0bWFuYWdlcic7XG5pbXBvcnQgU25hY2tiYXIgZnJvbSAnLi9tb2R1bGVzL3NuYWNrYmFyJztcblxuLyogVmFyaWFibGVzICovXG5sZXQgYnJvd1RpbWVyID0gbnVsbDtcbmxldCBicm93R3JpZCA9IG51bGw7XG5sZXQgb25saW5lQ291bnRlciA9IDA7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIFZhbGlkYXRlcyBpZiB1c2VyIGlzIG9ubGluZS9vZmZsaW5lIGFuZCBzZW5kcyBwcm9wZXIgbm90aWZpY2F0aW9uLlxuICovXG5sZXQgdmFsaWRhdGVPbk9mZmxpbmVTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0bGV0IHNuYWNrID0gbmV3IFNuYWNrYmFyKCk7XG5cblx0aWYgKG9ubGluZUNvdW50ZXIpIHtcblx0XHRpZiAoIW5hdmlnYXRvci5vbkxpbmUpIHtcblx0XHRcdHNuYWNrLmFsZXJ0KGBZb3VyIGludGVybmV0IGNvbm5lY3Rpb24gc3VkZGVubHkgd2VudCBvZmZsaW5lLiBCcm93RGFzaCB3aWxsIHN0aWxsIHdvcmsgbGlrZSBiZWZvcmUsIGJ1dCBzb21lIGNhcmRzIG1pZ2h0IG5vdCB1cGRhdGUuYCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0c25hY2suYWxlcnQoYFlvdXIgaW50ZXJuZXQgY29ubmVjdGlvbiBpcyBzdGFibGUgYWdhaW4sIGF3ZXNvbWUhYCk7XG5cdFx0fVxuXHR9XG5cblx0b25saW5lQ291bnRlcisrO1xufTtcblxuLyoqXG4gKlx0QGRlc2NyaXB0aW9uIFZhbGlkYXRlcyB0aGUgdXNlcnMgdGltZXIgc2V0dGluZ3MuXG4gKi9cbmxldCB2YWxpZGF0ZVRpbWVyID0gZnVuY3Rpb24gKCkge1xuXHRicm93VGltZXIgPSBuZXcgVGltZXIodGltZXIpO1xuXHRsZXQgZGF0ZVNldHRpbmdzID0geyBkYXRlRm9ybWF0OiBudWxsLCBhYmJyZXZpYXRpb25zOiBmYWxzZSB9O1xuXG5cdGlmICghbG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKSB7XG5cdFx0ZGF0ZVNldHRpbmdzLmRhdGVGb3JtYXQgPSAnMjRoJztcblx0XHRicm93VGltZXIuc2V0RGF0ZUZvcm1hdCh7XG5cdFx0XHQnZm9ybWF0JzogZGF0ZVNldHRpbmdzLmRhdGVGb3JtYXRcblx0XHR9KTtcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShCUk9XX1NFVFRJTkdTLCBKU09OLnN0cmluZ2lmeShkYXRlU2V0dGluZ3MpKTtcblx0fVxuXHRlbHNlIHtcblx0XHRkYXRlU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtCUk9XX1NFVFRJTkdTXSk7XG5cdFx0YnJvd1RpbWVyLnNldERhdGVGb3JtYXQoe1xuXHRcdFx0J2Zvcm1hdCc6IGRhdGVTZXR0aW5ncy5kYXRlRm9ybWF0LFxuXHRcdFx0J2FiYnJldmlhdGlvbnMnOiBkYXRlU2V0dGluZ3MuYWJicmV2aWF0aW9uc1xuXHRcdH0pO1xuXHR9XG5cblx0YnJvd1RpbWVyLnJ1bigpO1xufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdFJldHVybnMgY29ycmVjdCBjYWxsYmFjayBmdW5jdGlvbi5cbiAqL1xubGV0IGV2YWxDYWxsYmFjayA9IGZ1bmN0aW9uIChuYW1lKSB7XG5cdHN3aXRjaCAobmFtZSkge1xuXHRcdGNhc2UgJ3NldHRpbmdzJzogcmV0dXJuIGRpYWxvZ1NldHRpbmdzQ2FsbGJhY2s7XG5cdFx0Y2FzZSAnaW5mbyc6IHJldHVybiBkaWFsb2dJbmZvcm1hdGlvbkNhbGxiYWNrO1xuXHRcdGRlZmF1bHQ6IHJldHVybiBmYWxzZTtcblx0fVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdEFkZHMgYWxsIGRpYWxvZy5cbiAqL1xubGV0IGluaXREaWFsb2dzID0gZnVuY3Rpb24gKCkge1xuXHRsZXQgY3VycmVudExvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc2xpY2UoMCwgLTEpO1xuXG5cdFtdLmZvckVhY2guY2FsbChvcGVuRGlhbG9nLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdGxldCBkaWFsb2dDb250ZW50XHQ9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWRpYWxvZycpO1xuXG5cdFx0bGV0IGJyb3dEaWFsb2cgPSBuZXcgRGlhbG9nKHtcblx0XHRcdGVsZW06IGl0ZW0sXG5cdFx0XHRkaWFsb2dFbGVtOiBkaWFsb2csXG5cdFx0XHRjb250ZW50OiBgJHtjdXJyZW50TG9jYXRpb259L21hcmt1cC9kaWFsb2ctJHtkaWFsb2dDb250ZW50fS5odG1sYCxcblx0XHRcdGNhbGxiYWNrOiBldmFsQ2FsbGJhY2soZGlhbG9nQ29udGVudCksXG5cdFx0XHRwYXJhbXM6IHsgYnJvd1RpbWVyIH1cblx0XHR9KTtcblxuXHRcdGJyb3dEaWFsb2cuaW5pdCgpO1xuXHR9KTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRHZXRzIGxvY2FsU3RvcmFnZSwgcGFyc2VzIGF2YWlsYWJsZSBjYXJkcyBhbmQgY3JlYXRlcyB0aGVtLlxuICogQHBhcmFtXHRcdFx0e051bWJlcnxTdHJpbmd9IGluZGV4XG4gKi9cbmxldCBwYXJzZUNhcmRzRnJvbVN0b3JhZ2UgPSBmdW5jdGlvbiAoaW5kZXgpIHtcblx0bGV0IHN0b3JhZ2VJdGVtID0gSlNPTi5wYXJzZShcblx0XHRsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggbG9jYWxTdG9yYWdlLmtleShpbmRleCkgKVxuXHQpO1xuXG5cdGlmIChzdG9yYWdlSXRlbS5tb2R1bGUpIHtcblx0XHRsZXQgYnJvd0NhcmQgPSBuZXcgQ2FyZCh7XG5cdFx0XHR0eXBlOiBzdG9yYWdlSXRlbS50eXBlLFxuXHRcdFx0Z3VpZDogc3RvcmFnZUl0ZW0uZ3VpZCxcblx0XHRcdGNvbnRlbnQ6IHN0b3JhZ2VJdGVtLmNvbnRlbnQsXG5cdFx0XHRzdHlsZTogc3RvcmFnZUl0ZW0uc3R5bGVcblx0XHR9KTtcblx0XHRjb250ZW50LmFwcGVuZENoaWxkKCBicm93Q2FyZCApO1xuXHR9XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2FsbHMgdGhlIExheW91dE1hbmFnZXIgY2xhc3MuXG4gKi9cbmxldCBpbml0TGF5b3V0TWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcblx0YnJvd0dyaWQgPSBuZXcgTGF5b3V0TWFuYWdlciggY29udGVudCwgY29udGVudE92ZXJsYXkgKTtcblx0YnJvd0dyaWQubGF5b3V0KCk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGxvY2FsU3RvcmFnZSBhbmQgbG9hZHMgdGhlIHVzZXJzIGNhcmRzXG4gKiBAcGFyYW1cdFx0XHR7T2JqZWN0fSBzdG9yYWdlXG4gKi9cbmxldCB2YWxpZGF0ZUJyb3dDYXJkcyA9IGZ1bmN0aW9uICgpIHtcblx0aWYgKCFsb2NhbFN0b3JhZ2VbQlJPV19DQVJEU10gfHwgbG9jYWxTdG9yYWdlLmxlbmd0aCA8PSAxKSB7XG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oQlJPV19DQVJEUywgdHJ1ZSk7XG5cdFx0bGV0IGRlZmF1bHRDYXJkID0gbmV3IENhcmQoeyB0eXBlOiAndGV4dCcgfSk7XG5cdFx0Y29udGVudC5hcHBlbmRDaGlsZCggZGVmYXVsdENhcmQgKTtcblx0fSBlbHNlIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0cGFyc2VDYXJkc0Zyb21TdG9yYWdlKGkpO1xuXHRcdH1cblx0fVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdENoZWNrcyBjbGlja2VkIGNhcmQgdHlwZSBhbmQgYXBwZW5kcyBpdCB0byB0aGUgRE9NLlxuICogQHBhcmFtXHRcdFx0e09iamVjdH0gZXZlbnRcbiAqL1xubGV0IGFkZE5ld0NhcmQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRsZXQgc2VsZWN0ZWRDYXJkID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtY3JlYXRlLWNhcmQnKTtcblx0bGV0IGJyb3dDYXJkID0gbmV3IENhcmQoeyB0eXBlOiBgJHtzZWxlY3RlZENhcmR9YCB9KTtcblxuXHRjb250ZW50LmFwcGVuZENoaWxkKCBicm93Q2FyZCApO1xuXHRicm93R3JpZC5hZGQoIGJyb3dDYXJkICk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0QmluZCBldmVudHMgdG8gZWxlbWVudHMuXG4gKi9cbmxldCBhZGRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvbmxpbmUnLCB2YWxpZGF0ZU9uT2ZmbGluZVN0YXRlKTtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCB2YWxpZGF0ZU9uT2ZmbGluZVN0YXRlKTtcblx0W10uZm9yRWFjaC5jYWxsKG5ld0NhcmQsIChpdGVtKSA9PiB7XG5cdFx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZE5ld0NhcmQpO1xuXHR9KTtcbn07XG5cbi8qIEluaXRpYWxpc2UgYXBwICovXG53aW5kb3cuaXNFZGl0TW9kZSA9IGZhbHNlO1xudmFsaWRhdGVCcm93Q2FyZHMoKTtcbnZhbGlkYXRlVGltZXIoKTtcbmluaXRMYXlvdXRNYW5hZ2VyKCk7XG5pbml0RGlhbG9ncygpO1xudmFsaWRhdGVPbk9mZmxpbmVTdGF0ZSgpO1xuc2V0VGhlbWUoKTtcbmFkZEV2ZW50cygpOyIsIi8qKlxuICogQG5hbWVcdFx0XHRcdENhcmRcbiAqIEBkZXNjcmlwdGlvblx0L1xuICovXG5jbGFzcyBDYXJkIHtcblx0Y29uc3RydWN0b3IgKGNvbmZpZyA9IHt9KSB7XG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XG5cdFx0dGhpcy5lbGVtID0gdGhpcy5jcmVhdGVDYXJkKCk7XG5cdFx0dGhpcy5pbml0aWFsaXNlQ2FyZCgpO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMpO1xuXHRcdHJldHVybiB0aGlzLmVsZW07XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRSZXR1cm5zIGEgbmV3IGNhcmQgZWxlbWVudC5cblx0ICogQHJldHVybiBcdFx0XHR7SFRNTEVsZW1lbnR9XG5cdCAqL1xuXHRjcmVhdGVDYXJkICgpIHtcblx0XHRzd2l0Y2ggKHRoaXMuY29uZmlnLnR5cGUpIHtcblx0XHRcdGNhc2UgJ3RleHQnOiByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dC1jYXJkJyk7XG5cdFx0XHRjYXNlICd3ZWF0aGVyJzogcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3dlYXRoZXItY2FyZCcpO1xuXHRcdFx0Y2FzZSAndG9kbyc6IHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0b2RvLWNhcmQnKTtcblx0XHRcdGNhc2UgJ2NhbGN1bGF0b3InOiByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FsY3VsYXRvci1jYXJkJyk7XG5cdFx0XHRjYXNlICdjYWxlbmRhcic6IHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYWxlbmRhci1jYXJkJyk7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRjb25zb2xlLndhcm4oYEkgY291bGRuJ3QgZmluZCBcIiR7dGhpcy5jb25maWcudHlwZX1cIiBtb2R1bGUgOiggVGFrZSB0aGlzIDx0ZXh0LWNhcmQ+IGluc3RlYWQgOilgKTtcblx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHQtY2FyZCcpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdEFwcGxpZXMgY2xhc3MgZWxlbWVudCBhbmQgY2FsbHMgaW5pdGlhbGlzZSgpLlxuXHQgKi9cblx0aW5pdGlhbGlzZUNhcmQgKCkge1xuXHRcdHRoaXMuZWxlbS5pbml0aWFsaXNlKCB0aGlzLmNvbmZpZyApO1xuXHRcdHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdicm93LWNvbnRlbnRfX21vZHVsZScpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmQ7IiwiLyoqXG4gKiBAbmFtZVx0XHRcdFx0RGlhbG9nXG4gKiBAZGVzY3JpcHRpb25cdFNob3dzL2hpZGVzIHRoZSBkaWFsb2cuXG4gKi9cbmNsYXNzIERpYWxvZyB7XG5cdGNvbnN0cnVjdG9yIChjb25maWcpIHtcblx0XHR0aGlzLmVsZW0gPSBjb25maWcuZWxlbTtcblx0XHR0aGlzLmJ1dHRvblx0PSB0aGlzLmVsZW0uY2hpbGRyZW5bMF07XG5cdFx0dGhpcy5pbml0QnV0dG9uSWNvbiA9IHRoaXMuYnV0dG9uLmdldEF0dHJpYnV0ZSgnaWNvbicpO1xuXHRcdHRoaXMucGF0aCA9IGNvbmZpZy5jb250ZW50O1xuXHRcdHRoaXMuY2FsbGJhY2sgPSBjb25maWcuY2FsbGJhY2s7XG5cdFx0dGhpcy5jYWxsYmFja1BhcmFtcyA9IGNvbmZpZy5wYXJhbXM7XG5cdFx0dGhpcy5kaWFsb2dFbGVtID0gY29uZmlnLmRpYWxvZ0VsZW07XG5cdFx0dGhpcy5kaWFsb2dDb250YWluZXJcdD0gdGhpcy5kaWFsb2dFbGVtLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2dfX2lubmVyJyk7XG5cdFx0dGhpcy5kaWFsb2dDb250ZW50ID0gbnVsbDtcblx0XHR0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG5cdH1cblxuXHRpbml0ICgpIHtcblx0XHR0aGlzLmFkZEV2ZW50cygpO1xuXHR9XG5cblx0LyoqXG5cdCAqXHRAZGVzY3JpcHRpb25cdExvYWRzIHRoZSBjb250ZW50XG5cdCAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IGV2ZW50XG5cdCAqL1xuXHRsb2FkQ29udGVudCAoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0ZmV0Y2godGhpcy5wYXRoKVxuXHRcdC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLnRleHQoKSlcblx0XHQudGhlbihib2R5ID0+IHtcblx0XHRcdHRoaXMuZGlhbG9nQ29udGFpbmVyLmlubmVySFRNTCA9IGJvZHk7XG5cdFx0XHR0aGlzLmRpYWxvZ0NvbnRlbnQgPSB0aGlzLmRpYWxvZ0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nX19jb250ZW50Jyk7XG5cdFx0XHR0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2ljb24nLCAnY2xvc2UnKTtcblx0XHRcdHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZSgnY29sb3InLCAnd2hpdGUnKTtcblx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnZGlhbG9nLWlzLXZpc2libGUnKTtcblx0XHRcdHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuXG5cdFx0XHRpZiAodGhpcy5jYWxsYmFjaykgeyB0aGlzLmNhbGxiYWNrKHRoaXMpOyB9XG5cdFx0fSk7XG5cdH1cblxuXG5cdC8qKlxuXHQgKlx0QGRlc2NyaXB0aW9uXHRDbG9zZXMgdGhlIGRpYWxvZ1xuXHQgKiBAcGFyYW1cdFx0XHR7T2JqZWN0fSBldmVudFxuXHQqL1xuXHRjbG9zZURpYWxvZyAoZXZlbnQpIHtcblx0XHRsZXQgYm9keUhhc0NsYXNzXHQ9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWFsb2ctaXMtdmlzaWJsZScpO1xuXHRcdGxldCBpc0Nsb3NlQnRuXHRcdD0gZXZlbnQudGFyZ2V0ID09PSB0aGlzLmVsZW07XG5cdFx0bGV0IGlzRVNDS2V5XHRcdD0gZXZlbnQua2V5Q29kZSA9PT0gMjc7XG5cblx0XHRpZiAodGhpcy5pc0FjdGl2ZSAmJiBib2R5SGFzQ2xhc3MgJiYgaXNDbG9zZUJ0biB8fCBpc0VTQ0tleSkge1xuXHRcdFx0Ly8gQ2xlYXIgRE9NXG5cdFx0XHR0aGlzLmRpYWxvZ0NvbnRhaW5lci5pbm5lckhUTUwgPSBudWxsO1xuXHRcdFx0Ly8gUmVzZXQgYnV0dG9uXG5cdFx0XHR0aGlzLmJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2ljb24nLCB0aGlzLmluaXRCdXR0b25JY29uKTtcblx0XHRcdHRoaXMuYnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnY29sb3InKTtcblx0XHRcdC8vIFJlbW92ZSBjbGFzc1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdkaWFsb2ctaXMtdmlzaWJsZScpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKlx0QGRlc2NyaXB0aW9uXHRWYWxpZGF0ZXMgaWYgZGlhbG9nIGlzIHZpc2libGUgb3Igbm90LCBjbG9zZXMvbG9hZHMgaXQuXG5cdCAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IGV2ZW50XG5cdCAqL1xuXHRsb2FkT3JDbG9zZUNvbnRlbnQgKGV2ZW50KSB7XG5cdFx0bGV0IGRpYWxvZ0lzT3BlbiA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWFsb2ctaXMtdmlzaWJsZScpO1xuXHRcdHRoaXMuZWxlbS5ibHVyKCk7XG5cblx0XHRpZiAoZGlhbG9nSXNPcGVuKSB7XG5cdFx0XHR0aGlzLmNsb3NlRGlhbG9nKGV2ZW50KTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLmxvYWRDb250ZW50KGV2ZW50KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICpcdEBkZXNjcmlwdGlvblx0QWRkcyBldmVudHNcblx0ICovXG5cdGFkZEV2ZW50cyAoKSB7XG5cdFx0dGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5sb2FkT3JDbG9zZUNvbnRlbnQuYmluZCh0aGlzKSk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmNsb3NlRGlhbG9nLmJpbmQodGhpcykpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERpYWxvZzsiLCIvKmdsb2JhbHMgUGFja2VyeSxEcmFnZ2FiaWxseSovXG5cbmltcG9ydCB7IGhhc0N1c3RvbUNhcmRzIH0gZnJvbSAnLi4vdXRpbHMvaGVscGVyJztcblxuLyoqXG4gKiBAbmFtZVx0XHRcdFx0TGF5b3V0TWFuYWdlclxuICogQGRlc2NyaXB0aW9uXHQvXG4gKi9cbmNsYXNzIExheW91dE1hbmFnZXIge1xuXHRjb25zdHJ1Y3RvciAoY29udGFpbmVyLCBvdmVybGF5KSB7XG5cdFx0dGhpcy50cmFuc2l0aW9uID0gMDtcblx0XHR0aGlzLmRyYWdPcHRpb25zID0ge1xuXHRcdFx0aGFuZGxlOiAnLmJyb3ctY29udGVudF9fbW9kdWxlIC9kZWVwLyAuZHJhZ2ctYXJlYSdcblx0XHR9O1xuXHRcdHRoaXMucGtyT3B0aW9ucyA9IHtcblx0XHRcdGl0ZW1TZWxlY3RvcjogJy5icm93LWNvbnRlbnRfX21vZHVsZScsXG5cdFx0XHR0cmFuc2l0aW9uRHVyYXRpb246IHRoaXMudHJhbnNpdGlvbixcblx0XHRcdGNvbHVtbldpZHRoOiAnLmJyb3ctY29udGVudC0tc2l6ZXInLFxuXHRcdFx0Z3V0dGVyOiAnLmJyb3ctY29udGVudC0tZ3V0dGVyJyxcblx0XHRcdHN0YW1wOiAnLmlzLXN0YW1wJyxcblx0XHRcdGlzSW5pdExheW91dDogZmFsc2Vcblx0XHR9O1xuXHRcdHRoaXMucGFja2VyeSA9IG5ldyBQYWNrZXJ5KGNvbnRhaW5lciwgdGhpcy5wa3JPcHRpb25zKTtcblx0XHR0aGlzLmNvbnRlbnQgPSBjb250YWluZXI7XG5cdFx0dGhpcy5vdmVybGF5ID0gb3ZlcmxheTtcblx0XHR0aGlzLmFkZEV2ZW50cygpO1xuXHRcdHRoaXMuYWRkRHJhZ2dhYmlsbHkoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdFdpbGwgaW5pdGlhbGlzZSB0aGUgUGFja2VyeSBsYXlvdXQuXG5cdCAqL1xuXHRsYXlvdXQgKCkge1xuXHRcdHRoaXMucGFja2VyeS5sYXlvdXQoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdEFkZHMgYSBuZXcgaXRlbSB0byB0aGUgUGFja2VyeSBsYXlvdXQuXG5cdCAqIEBwYXJhbSBcdFx0XHR7Tm9kZUxpc3R8SFRNTEVsZW1lbnR9IGVsZW1cblx0ICovXG5cdGFkZCAoZWxlbSkge1xuXHRcdHRoaXMucGFja2VyeS5hcHBlbmRlZCggZWxlbSApO1xuXHRcdHRoaXMuYWRkRHJhZ2dhYmlsbHkoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdFJlbW92ZXMgcGFzc2VkIGVsZW1lbnQgZnJvbSB0aGUgUGFja2VyeSBsYXlvdXQuXG5cdCAqIEBwYXJhbSBcdFx0XHR7Tm9kZUxpc3R8SFRNTEVsZW1lbnR9IGNvbmZpZ1xuXHQgKi9cblx0cmVtb3ZlIChlbGVtKSB7XG5cdFx0dGhpcy5wYWNrZXJ5LnJlbW92ZSggZWxlbSApO1xuXHRcdHRoaXMubGF5b3V0KCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRNYWtlcyBhbiBlbGVtZW50IHN0aWNreS5cblx0ICogQHBhcmFtIFx0XHRcdHtOb2RlTGlzdHxIVE1MRWxlbWVudH0gY29uZmlnXG5cdCAqL1xuXHRzdGFtcCAoZWxlbSkge1xuXHRcdHRoaXMucGFja2VyeS5zdGFtcCggZWxlbSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0VW5zdGFtcHMgYW4gZWxlbWVudC5cblx0ICogQHBhcmFtIFx0XHRcdHtOb2RlTGlzdHxIVE1MRWxlbWVudH0gY29uZmlnXG5cdCAqL1xuXHR1bnN0YW1wIChlbGVtKSB7XG5cdFx0dGhpcy5wYWNrZXJ5LnVuc3RhbXAoIGVsZW0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdEluaXRpYWxpc2VzIERyYWdnYWJpbGx5LlxuXHQgKi9cblx0YWRkRHJhZ2dhYmlsbHkgKCkge1xuXHRcdGxldCBjYXJkcyA9IHRoaXMucGFja2VyeS5nZXRJdGVtRWxlbWVudHMoKTtcblx0XHRjYXJkcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRsZXQgZHJhZ2dpZSA9IG5ldyBEcmFnZ2FiaWxseShpdGVtLCB0aGlzLmRyYWdPcHRpb25zKTtcblx0XHRcdHRoaXMucGFja2VyeS5iaW5kRHJhZ2dhYmlsbHlFdmVudHMoIGRyYWdnaWUgKTtcblx0XHRcdGRyYWdnaWUub24oJ3BvaW50ZXJEb3duJywgdGhpcy52YWxpZGF0ZUVkaXRNb2RlLmJpbmQoZHJhZ2dpZSkpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0QWRkcyBFdmVudExpc3RlbmVyLlxuXHQgKi9cblx0YWRkRXZlbnRzICgpIHtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2FyZC1lZGl0JywgdGhpcy52YWxpZGF0ZUxheW91dFN0YXRlLmJpbmQodGhpcykpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjYXJkLXNhdmUnLCB0aGlzLnZhbGlkYXRlTGF5b3V0U3RhdGUuYmluZCh0aGlzKSk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NhcmQtcmVtb3ZlJywgdGhpcy52YWxpZGF0ZUxheW91dFN0YXRlLmJpbmQodGhpcykpO1xuXHRcdHRoaXMub3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMudmFsaWRhdGVMYXlvdXRTdGF0ZS5iaW5kKHRoaXMpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdERlYWN0aXZhdGVzIGVkaXRNb2RlIGFuZCByZW1vdmVzIGNsYXNzZXMgZnJvbSBjb250ZW50IG92ZXJsYXkuXG5cdCAqL1xuXHRkZWFjdGl2YXRlRWRpdE1vZGUgKCkge1xuXHRcdHdpbmRvdy5pc0VkaXRNb2RlID0gZmFsc2U7XG5cdFx0dGhpcy5vdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2lzLWZhZGluZycpO1xuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0dGhpcy5vdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnLCAnaXMtZmFkaW5nJyk7XG5cdFx0fSwgMTAwKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdENoZWNrcyBldmVudCB0eXBlIGFuZCB2YWxpZGF0ZXMgdGhlIGxheW91dCdzIHN0YXRlLlxuXHQgKiBAcGFyYW0gIFx0XHRcdHtPYmplY3R9IGV2ZW50XG5cdCAqL1xuXHR2YWxpZGF0ZUxheW91dFN0YXRlIChldmVudCkge1xuXHRcdGxldCBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtZ3VpZD1cIiR7ZXZlbnQuZGV0YWlsfVwiXWApO1xuXG5cdFx0Ly8gYWN0aXZhdGVkIGVkaXRpbmcgbW9kZVxuXHRcdGlmIChldmVudC50eXBlID09PSAnY2FyZC1lZGl0Jykge1xuXHRcdFx0d2luZG93LmlzRWRpdE1vZGUgPSB0cnVlO1xuXHRcdFx0dGhpcy5vdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXZpc2libGUnKTtcblx0XHR9XG5cblx0XHQvLyBzYXZlZCBjYXJkIG9yIHJlbW92ZSBjYXJkXG5cdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdjYXJkLXNhdmUnIHx8IGV2ZW50LnR5cGUgPT09ICdjYXJkLXJlbW92ZScpIHtcblx0XHRcdHRoaXMuZGVhY3RpdmF0ZUVkaXRNb2RlKCk7XG5cblx0XHRcdGlmIChldmVudC50eXBlID09PSAnY2FyZC1zYXZlJykge1xuXHRcdFx0XHR0aGlzLmxheW91dCgpO1xuXHRcdFx0XHRoYXNDdXN0b21DYXJkcygpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NhcmQtcmVtb3ZlJykge1xuXHRcdFx0XHR0aGlzLnJlbW92ZShlbGVtKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRlbHNlIGlmIChldmVudC50eXBlID09PSAnY2xpY2snICYmIHdpbmRvdy5pc0VkaXRNb2RlKSB7XG5cdFx0XHRlbGVtID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5pcy1lZGl0Jyk7XG5cdFx0XHRlbGVtLnNhdmVUb1N0b3JhZ2UoKTtcblx0XHRcdGVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnZngnLCAnaXMtZWRpdCcpO1xuXHRcdFx0dGhpcy5kZWFjdGl2YXRlRWRpdE1vZGUoKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRDaGVja3MgaWYgZWRpdE1vZGUgaXMgYWN0aXZlIGFuZCB3ZWl0aGVyIGRpc2FibGVzIG9yIGVuYWJsZXMgdGhlIGRyYWdnaW5nLlxuXHQgKi9cblx0dmFsaWRhdGVFZGl0TW9kZSAoKSB7XG5cdFx0aWYgKHdpbmRvdy5pc0VkaXRNb2RlKSB7XG5cdFx0XHR0aGlzLmRpc2FibGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5lbmFibGUoKTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGF5b3V0TWFuYWdlcjsiLCJpbXBvcnQgeyBzbmFja2JhciB9IGZyb20gJy4uL3V0aWxzL2VsZW1lbnRzJztcblxuLyoqXG4gKiBAbmFtZVx0XHRcdFx0U25hY2tiYXJcbiAqIEBkZXNjcmlwdGlvblx0L1xuICovXG5jbGFzcyBTbmFja2JhciB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuZHVyYXRpb24gPSAxMDAwMDtcblx0XHR0aGlzLmVsZW0gPSBzbmFja2Jhcjtcblx0XHR0aGlzLmRlZmF1bHQgPSAnT29vcHMsIHNvbWV0aGluZyB3ZW50IHdyb25nISA6KCc7XG5cdFx0dGhpcy5tZXNzYWdlID0gbnVsbDtcblx0fVxuXG5cdGFsZXJ0KG1zZyA9IHRoaXMuZGVmYXVsdCkge1xuXHRcdHRoaXMubWVzc2FnZSA9IG1zZy50cmltKCk7XG5cdFx0dGhpcy5zaG93KCk7XG5cdH1cblxuXHRzZXQgc2V0RHVyYXRpb24gKGR1cmF0aW9uKSB7XG5cdFx0dGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuXHR9XG5cblx0c2hvdygpIHtcblx0XHR0aGlzLmVsZW0uaW5uZXJIVE1MID0gbnVsbDtcblx0XHR0aGlzLmVsZW0uYXBwZW5kQ2hpbGQoIHRoaXMuY3JlYXRlUGFyYWdyYXBoKCkgKTtcblx0XHR0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnaXMtdmlzaWJsZScpO1xuXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHR0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScpO1xuXHRcdFx0dGhpcy5tZXNzYWdlID0gbnVsbDtcblx0XHR9LCB0aGlzLmR1cmF0aW9uKTtcblx0fVxuXG5cdGNyZWF0ZVBhcmFncmFwaCgpIHtcblx0XHRsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblx0XHRwLmlubmVyVGV4dCA9IHRoaXMubWVzc2FnZTtcblx0XHRyZXR1cm4gcDtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBTbmFja2JhcjsiLCIvKipcbiAqIEBuYW1lXHRcdFx0XHRUaW1lclxuICogQGRlc2NyaXB0aW9uXHRDbGFzcyB3aGljaCBhcHBlbmRzIGEgdGltZSBzdHJpbmcgdG8gYW4gZWxlbWVudFxuICogICAgICAgICAgICAgIFx0YW5kIHVwZGF0ZXMgaXQgZXZlcnkgc2Vjb25kLlxuICovXG5jbGFzcyBUaW1lciB7XG5cdGNvbnN0cnVjdG9yIChlbGVtKSB7XG5cdFx0aWYgKCEoZWxlbSAmJiBlbGVtLm5vZGVOYW1lKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBZb3UgaGF2ZW4ndCBwYXNzZWQgYSB2YWxpZCBIVE1MRWxlbWVudCFgKTtcblx0XHR9XG5cblx0XHR0aGlzLnVwZGF0ZVx0PSAxMDAwO1xuXHRcdHRoaXMuZWxlbVx0PSBlbGVtO1xuXHRcdHRoaXMuZm9ybWF0ID0gJzI0aCc7XG5cdFx0dGhpcy5hYmJyZXZpYXRpb25zID0gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRDcmVhdGVzIGEgc3RyaW5nIHdpdGggY3VycmVudCB0aW1lIGluIEhIOk1NOlNTXG5cdCAqIEByZXR1cm5cdFx0XHR7U3RyaW5nfVxuXHQgKi9cblx0Z2V0VGltZSAoKSB7XG5cdFx0bGV0IGRhdGVcdFx0XHRcdD0gbmV3IERhdGUoKTtcblx0XHRsZXQgZGF0ZUhvdXJzXHRcdD0gZGF0ZS5nZXRIb3VycygpO1xuXHRcdGxldCBkYXRlTWludXRlc1x0PSBkYXRlLmdldE1pbnV0ZXMoKTtcblx0XHRsZXQgZGF0ZVNlY29uZHNcdD0gZGF0ZS5nZXRTZWNvbmRzKCk7XG5cdFx0bGV0IGRhdGVBYmJyXHRcdD0gJyc7XG5cblx0XHQvLyBJZiB0aW1lIGZvcm1hdCBpcyBzZXQgdG8gMTJoLCB1c2UgMTJoLXN5c3RlbS5cblx0XHRpZiAodGhpcy5mb3JtYXQgPT09ICcxMmgnKSB7XG5cdFx0XHRpZiAodGhpcy5hYmJyZXZpYXRpb25zKSB7XG5cdFx0XHRcdGRhdGVBYmJyID0gdGhpcy5nZXRBYmJyZXZpYXRpb24oZGF0ZUhvdXJzKTtcblx0XHRcdH1cblx0XHRcdGRhdGVIb3VycyA9IChkYXRlSG91cnMgJSAxMikgPyBkYXRlSG91cnMgJSAxMiA6IDEyO1xuXHRcdH1cblxuXHRcdC8vIEFkZCAnMCcgaWYgYmVsb3cgMTBcblx0XHRpZiAoZGF0ZUhvdXJzIDwgMTApIHsgZGF0ZUhvdXJzID0gYDAke2RhdGVIb3Vyc31gOyB9XG5cdFx0aWYgKGRhdGVNaW51dGVzIDwgMTApIHsgZGF0ZU1pbnV0ZXMgPSBgMCR7ZGF0ZU1pbnV0ZXN9YDsgfVxuXHRcdGlmIChkYXRlU2Vjb25kcyA8IDEwKSB7IGRhdGVTZWNvbmRzID0gYDAke2RhdGVTZWNvbmRzfWA7IH1cblxuXHRcdHJldHVybiBgJHtkYXRlSG91cnN9OiR7ZGF0ZU1pbnV0ZXN9OiR7ZGF0ZVNlY29uZHN9ICR7ZGF0ZUFiYnJ9YDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdFZhbGlkYXRlcyBudW1iZXIgYW5kIHJldHVybnMgZWl0aGVyIEFNIG9yIFBNLlxuXHQgKiBAcGFyYW0gXHRcdFx0e051bWJlcn0gdGltZVxuXHQgKiBAcmV0dXJuXHRcdFx0e1N0cmluZ31cblx0ICovXG5cdGdldEFiYnJldmlhdGlvbiAodGltZSkge1xuXHRcdGlmICh0eXBlb2YgdGltZSAhPT0gJ251bWJlcicpIHtcblx0XHRcdHRpbWUgPSBwYXJzZUZsb2F0KHRpbWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiAodGltZSA+PSAxMikgPyAnUE0nIDogJ0FNJztcblx0fVxuXG5cdC8qKlxuXHQgKlx0QGRlc2NyaXB0aW9uXHROZWVkcyB0byBiZSB3cml0dGVuLlxuXHQgKiBAcGFyYW1cdFx0XHR7T2JqZWN0fSBjb25maWdcblx0ICovXG5cdHNldERhdGVGb3JtYXQgKGNvbmZpZykge1xuXHRcdGlmIChjb25maWcpIHtcblx0XHRcdHRoaXMuZm9ybWF0ID0gKGNvbmZpZy5mb3JtYXQpID8gY29uZmlnLmZvcm1hdCA6IHRoaXMuZm9ybWF0O1xuXHRcdFx0dGhpcy5hYmJyZXZpYXRpb25zID0gY29uZmlnLmFiYnJldmlhdGlvbnM7XG5cdFx0fVxuXHRcdHRoaXMucnVuKCk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRTZXRzIHRoZSBlbGVtZW50IGluIHdoaWNoIHRoZSB0aW1lIHNob3VsZCBiZSBkaXNwbGF5ZWQuXG5cdCAqIEBwYXJhbVx0XHRcdHtFbGVtZW50fSBlbGVtXG5cdCAqIEByZXR1cm4gXHRcdFx0e0hUTUxFbGVtZW50fVxuXHQgKi9cblx0cnVuICgpIHtcblx0XHR0aGlzLmVsZW0udGV4dENvbnRlbnQgPSB0aGlzLmdldFRpbWUoKTtcblxuXHRcdHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdHRoaXMuZWxlbS50ZXh0Q29udGVudCA9IHRoaXMuZ2V0VGltZSgpO1xuXHRcdH0sIHRoaXMudXBkYXRlKTtcblxuXHRcdHJldHVybiB0aGlzLmVsZW07XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZXI7IiwiZXhwb3J0IGNvbnN0IEJST1dfU0VUVElOR1MgPSAnQlJPV19TRVRUSU5HUyc7XG5leHBvcnQgY29uc3QgQlJPV19LRVlcdFx0PSAnQlJPV19USEVNRSc7XG5leHBvcnQgY29uc3QgQlJPV19DQVJEU1x0XHQ9ICdCUk9XX0NBUkRTJztcbmV4cG9ydCBjb25zdCBERUZBVUxUX1RIRU1FXHQ9ICdibHVlLWE0MDAnOyIsImV4cG9ydCBsZXQgdGltZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtdGltZXInKTtcbmV4cG9ydCBsZXQgZGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWRpYWxvZycpO1xuZXhwb3J0IGxldCBjYXJkbGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1jYXJkbGlzdCcpO1xuZXhwb3J0IGxldCBjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWNvbnRlbnQnKTtcbmV4cG9ydCBsZXQgY29udGVudE92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudF9fb3ZlcmxheScpO1xuZXhwb3J0IGxldCBvcGVuRGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm9wZW4tZGlhbG9nJyk7XG5leHBvcnQgbGV0IG5ld0NhcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtbmV3Y2FyZCcpO1xuZXhwb3J0IGxldCBzZWxlY3Rpb25MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXNlbGVjdGlvbicpO1xuZXhwb3J0IGxldCBzbmFja2JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1zbmFja2JhcicpOyIsImltcG9ydCB7IEJST1dfU0VUVElOR1MsIEJST1dfQ0FSRFMsIERFRkFVTFRfVEhFTUUgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRDaGVja3MgaWYgY3VzdG9tIHRoZW1lIHNldHRpbmdzIGFyZSBhdmFpbGFibGUuXG4gKiBAcmV0dXJuXHRcdFx0e0Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzQ3VzdG9tVGhlbWUgPSBmdW5jdGlvbiAoKSB7XG5cdGxldCBpc0N1c3RvbSA9IGZhbHNlO1xuXG5cdGlmIChsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pIHtcblx0XHRsZXQgc2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtCUk9XX1NFVFRJTkdTXSk7XG5cdFx0aXNDdXN0b20gPSAhIXNldHRpbmdzLnRoZW1lO1xuXHR9XG5cblx0cmV0dXJuIGlzQ3VzdG9tO1xufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdENoZWNrcyBpZiBjdXN0b20ga2V5IGlzIHNldCwgaWYgbm90OiBkbyBpdC5cbiAqL1xuY29uc3QgaGFzQ3VzdG9tQ2FyZHMgPSBmdW5jdGlvbiAoKSB7XG5cdGlmICghbG9jYWxTdG9yYWdlW0JST1dfQ0FSRFNdKSB7XG5cdFx0bG9jYWxTdG9yYWdlW0JST1dfQ0FSRFNdID0gdHJ1ZTtcblx0fVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdENoZWNrcyB2aWEgcmVnZXggaWYgY2xhc3NOYW1lIGlzIGEgdGhlbWUuXG4gKi9cbmNvbnN0IGNoZWNrRm9yVGhlbWVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcblx0bGV0IHRoZW1lUmVnRXggPSAvdGhlbWUtLiovO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKHRoZW1lUmVnRXgudGVzdChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdFtpXSkpIHtcblx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSggZG9jdW1lbnQuYm9keS5jbGFzc0xpc3RbaV0gKTtcblx0XHR9XG5cdH1cbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRQYXJzZXMgdGhlIGN1c3RvbSBzZXR0aW5ncyBmcm9tIGxvY2FsU3RvcmFnZSBhbmQgc2V0cyBjbGFzc2VzLlxuICovXG5jb25zdCB1cGRhdGVUaGVtZUZyb21TdG9yYWdlID0gZnVuY3Rpb24gKCkge1xuXHRsZXQgc2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtCUk9XX1NFVFRJTkdTXSk7XG5cdC8vbGV0IGRpYWxvZ0lzT3BlbiA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaWFsb2ctaXMtdmlzaWJsZScpO1xuXG5cdGNoZWNrRm9yVGhlbWVDbGFzcygpO1xuXHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoYHRoZW1lLSR7c2V0dGluZ3MudGhlbWUuY29sb3J9YCk7XG5cblx0aWYgKGlzQ3VzdG9tVGhlbWUoKSAmJiBzZXR0aW5ncy50aGVtZS5oZWFkZXJiYXIpIHtcblx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3RoZW1lLWhlYWRlcmJhcicpO1xuXHR9XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0QWRkcyB0aGUgdGhlbWUgY2xhc3MgdG8gPGJvZHk+IGZyb20gaW5pdGlhbCBzZXR0aW5ncy5cbiAqIEBwYXJhbVx0XHRcdHtTdHJpbmd9IHRoZW1lXG4gKi9cbmNvbnN0IHVwZGF0ZVRoZW1lRnJvbUNvbmZpZyA9IGZ1bmN0aW9uICh0aGVtZSkge1xuXHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoYHRoZW1lLSR7dGhlbWV9YCk7XG59O1xuXG4vKipcbiAqXHRAZGVzY3JpcHRpb25cdFVwZGF0ZXMgdGhlIGN1cnJlbnQgdGhlbWUuXG4gKiBAcGFyYW1cdFx0XHR7T2JqZWN0fSB0aGVtZVxuICovXG5jb25zdCBzZXRUaGVtZSA9IGZ1bmN0aW9uICh0aGVtZSkge1xuXHRpZiAoIXRoZW1lIHx8IHR5cGVvZiB0aGVtZSAhPT0gJ3N0cmluZycpIHtcblx0XHR0aGVtZSA9IERFRkFVTFRfVEhFTUU7XG5cdH1cblxuXHRpZiAoaXNDdXN0b21UaGVtZSgpKSB7XG5cdFx0dXBkYXRlVGhlbWVGcm9tU3RvcmFnZSgpO1xuXHR9IGVsc2Uge1xuXHRcdHVwZGF0ZVRoZW1lRnJvbUNvbmZpZyggdGhlbWUgKTtcblx0fVxufTtcblxuZXhwb3J0IHtcblx0aXNDdXN0b21UaGVtZSxcblx0aGFzQ3VzdG9tQ2FyZHMsXG5cdHNldFRoZW1lLFxuXHR1cGRhdGVUaGVtZUZyb21Db25maWcsXG5cdHVwZGF0ZVRoZW1lRnJvbVN0b3JhZ2Vcbn07IiwiLyoqXG4gKiBAZGVzY3JpcHRpb25cdFJldHVybnMgY3VycmVudCBhY3RpdmUgbGlzdCBpdGVtXG4gKiBAcmV0dXJuIFx0XHRcdHtIVE1MRWxlbWVudH1cbiAqL1xudmFyIGdldEN1cnJlbnRBY3RpdmVJdGVtID0gKGNvbnRlbnQpID0+IGNvbnRlbnQucXVlcnlTZWxlY3RvcignLmRpYWxvZ19fc2lkZWJhciBsaS5pcy1hY3RpdmUgYScpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0UmV0dXJucyBjdXJyZW50IGFjdGl2ZSBzZWN0aW9uXG4gKiBAcmV0dXJuIFx0XHRcdHtIVE1MRWxlbWVudH1cbiAqL1xudmFyIGdldEN1cnJlbnRBY3RpdmVTZWN0aW9uID0gKGNvbnRlbnQpID0+IGNvbnRlbnQucXVlcnlTZWxlY3Rvcignc2VjdGlvbi5pcy12aXNpYmxlJyk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRWYWxpZGF0ZXMgbmV3IGFuZCBvbGQgY29udGVudC5cbiAqIEBwYXJhbSBcdFx0XHR7SFRNTEVsZW1lbnR9IGNvbnRlbnRcbiAqL1xudmFyIHZhbGlkYXRlU2VjdGlvbiA9IGZ1bmN0aW9uIChjb250ZW50KSB7XG5cdGxldCBjdXJJdGVtID0gZ2V0Q3VycmVudEFjdGl2ZUl0ZW0oY29udGVudCk7XG5cdGxldCBjdXJTZWN0aW9uID0gZ2V0Q3VycmVudEFjdGl2ZVNlY3Rpb24oY29udGVudCk7XG5cdGxldCB0YXJnZXRTZWN0aW9uID0gY3VySXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2VjdGlvbicpO1xuXHRsZXQgc2VjdGlvbiA9IGNvbnRlbnQucXVlcnlTZWxlY3Rvcihgc2VjdGlvbltkYXRhLXNlY3Rpb249XCIke3RhcmdldFNlY3Rpb259XCJdYCk7XG5cblx0aWYgKGN1clNlY3Rpb24pIHsgY3VyU2VjdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7IH1cblx0c2VjdGlvbi5jbGFzc0xpc3QuYWRkKCdpcy12aXNpYmxlJyk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0QWRkcyBvciByZW1vdmVzIGFjdGl2ZSBzdGF0ZSBvbiBsaXN0IGFuZCBzaG93cy9oaWRlcyBjb250ZW50LlxuICogQHBhcmFtIFx0XHRcdHtPYmplY3R9IGV2ZW50XG4gKi9cbnZhciB0b2dnbGVDb250ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0bGV0IGl0ZW0gPSBldmVudC50YXJnZXQ7XG5cdGxldCBpc0xpbmsgPSBpdGVtLm5vZGVOYW1lID09PSAnQSc7XG5cdGxldCBjdXJBY3RpdmUgPSBnZXRDdXJyZW50QWN0aXZlSXRlbSh0aGlzLmNhdGVnb3J5TGlzdCkucGFyZW50Tm9kZTtcblxuXHRpZiAoaXNMaW5rICYmICFpdGVtLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1hY3RpdmUnKSkge1xuXHRcdGN1ckFjdGl2ZS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKTtcblx0XHRpdGVtLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJyk7XG5cdFx0dmFsaWRhdGVTZWN0aW9uKHRoaXMuZGlhbG9nQ29udGVudCk7XG5cdH1cblxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdEFkZHMgY2FsbGJhY2sgdG8gY29udGVudCBpbiBkaWFsb2cgYW5kIHZhbGlkYXRlcyA8aW5wdXQ+IGZpZWxkcy5cbiAqL1xudmFyIGRpYWxvZ0luZm9ybWF0aW9uQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMuY2F0ZWdvcnlMaXN0ID0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2dfX3NpZGViYXIgdWwnKTtcblxuXHR2YWxpZGF0ZVNlY3Rpb24odGhpcy5kaWFsb2dDb250ZW50KTtcblx0dGhpcy5jYXRlZ29yeUxpc3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVDb250ZW50LmJpbmQodGhpcykpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZGlhbG9nSW5mb3JtYXRpb25DYWxsYmFjazsiLCJpbXBvcnQgeyBCUk9XX1NFVFRJTkdTLCBERUZBVUxUX1RIRU1FIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcbmltcG9ydCB7IGlzQ3VzdG9tVGhlbWUsIHNldFRoZW1lIH0gZnJvbSAnLi4vdXRpbHMvaGVscGVyJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdFZhbGlkYXRlcyBpbnB1dCBmaWVsZHMsIHVwZGF0ZXMgYnJvd1RoZW1lIGFuZCBzYXZlcyB0byBsb2NhbFN0b3JhZ2UuXG4gKiBAcGFyYW0gIFx0XHRcdHtPYmplY3R9IGV2ZW50XG4gKi9cbnZhciB1cGRhdGVUaGVtZSA9IGZ1bmN0aW9uIChldmVudCkge1xuXHRsZXQgY29sb3JIZWFkQ2hlY2tib3hcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR0aW5ncy0tY29sb3JlZGhlYWQnKTtcblx0Ly9sZXQgaXNUaGVtZUJ1dHRvblx0XHRcdD0gZXZlbnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1zZXR0aW5ncy10aGVtZScpO1xuXHQvL2xldCBpc1RoZW1lQ2hlY2tib3hcdFx0PSBldmVudC50YXJnZXQuaWQgPT09ICdzZXR0aW5ncy0tY29sb3JlZGhlYWQnO1xuXHRsZXQgc2V0dGluZ3NcdFx0XHRcdD0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pO1xuXG5cdC8vIElmIG5vIHRoZW1lIHNldHRpbmdzIGFyZSBzdG9yZWQgeWV0LlxuXHRpZiAoIXNldHRpbmdzLnRoZW1lKSB7XG5cdFx0c2V0dGluZ3MudGhlbWUgPSB7IGNvbG9yOiBERUZBVUxUX1RIRU1FLCBoZWFkZXJiYXI6IGZhbHNlIH07XG5cdH1cblxuXHQvLyBJcyB0aGVtZSBvcHRpb25cblx0aWYgKGV2ZW50LnRhcmdldC5oYXNBdHRyaWJ1dGUoJ2RhdGEtc2V0dGluZ3MtdGhlbWUnKSkge1xuXHRcdHNldHRpbmdzLnRoZW1lLmNvbG9yID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1zZXR0aW5ncy10aGVtZScpO1xuXHR9XG5cblx0Ly8gSWYgY29sb3JlZCBoZWFkZXIgYmFyIGlzIGNsaWNrZWRcblx0aWYgKGV2ZW50LnRhcmdldC5pZCA9PT0gJ3NldHRpbmdzLS1jb2xvcmVkaGVhZCcpIHtcblx0XHRzZXR0aW5ncy50aGVtZS5oZWFkZXJiYXIgPSBjb2xvckhlYWRDaGVja2JveC5jaGVja2VkO1xuXHR9XG5cblx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oQlJPV19TRVRUSU5HUywgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MpKTtcblx0c2V0VGhlbWUoKTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRWYWxpZGF0ZXMgaW5wdXQgZmllbGRzLCB1cGRhdGVzIFRpbWVyIGFuZCBzYXZlcyB0byBsb2NhbFN0b3JhZ2UuXG4gKiBAcGFyYW0gIFx0XHRcdHtPYmplY3R9IGV2ZW50XG4gKi9cbnZhciB1cGRhdGVEYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdGxldCBmb3JtYXRDaGVja2JveFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLS1kYXRlZm9ybWF0Jyk7XG5cdGxldCBhYmJyQ2hlY2tib3hcdFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLS1hbXBtJyk7XG5cdGxldCB0aW1lRm9ybWF0XHRcdFx0PSAnMjRoJztcblx0bGV0IGRhdGVTZXR0aW5nc1x0XHQ9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKTtcblxuXHQvLyBJZiBkYXRlIGZvcm1hdCBjaGVja2JveCBpcyBjbGlja2VkXG5cdGlmIChldmVudC50YXJnZXQuaWQgPT09ICdzZXR0aW5ncy0tZGF0ZWZvcm1hdCcpIHtcblx0XHRpZiAoIWZvcm1hdENoZWNrYm94LmNoZWNrZWQpIHtcblx0XHRcdHRpbWVGb3JtYXQgPSAnMTJoJztcblx0XHRcdGFiYnJDaGVja2JveC5kaXNhYmxlZCA9IGZhbHNlO1xuXHRcdH1cblx0XHRlbHNlIGlmIChmb3JtYXRDaGVja2JveC5jaGVja2VkICYmICFhYmJyQ2hlY2tib3guZGlzYWJsZWQpIHtcblx0XHRcdGFiYnJDaGVja2JveC5kaXNhYmxlZCA9IHRydWU7XG5cdFx0XHRhYmJyQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdHRoaXMuY2FsbGJhY2tQYXJhbXMuYnJvd1RpbWVyLnNldERhdGVGb3JtYXQoeyAnZm9ybWF0JzogdGltZUZvcm1hdCB9KTtcblx0XHRkYXRlU2V0dGluZ3MuZGF0ZUZvcm1hdCA9IHRpbWVGb3JtYXQ7XG5cdFx0ZGF0ZVNldHRpbmdzLmFiYnJldmlhdGlvbnMgPSBhYmJyQ2hlY2tib3guY2hlY2tlZDtcblx0fVxuXG5cdC8vIElmIGFiYnJldmlhdGlvbiBjaGVja2JveCBpcyBjbGlja2VkXG5cdGlmICghZXZlbnQudGFyZ2V0LmRpc2FibGVkICYmIGV2ZW50LnRhcmdldC5pZCA9PT0gJ3NldHRpbmdzLS1hbXBtJykge1xuXHRcdHRoaXMuY2FsbGJhY2tQYXJhbXMuYnJvd1RpbWVyLnNldERhdGVGb3JtYXQoeyAnYWJicmV2aWF0aW9ucyc6IGFiYnJDaGVja2JveC5jaGVja2VkIH0pO1xuXHRcdGRhdGVTZXR0aW5ncy5hYmJyZXZpYXRpb25zID0gYWJickNoZWNrYm94LmNoZWNrZWQ7XG5cdH1cblxuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShCUk9XX1NFVFRJTkdTLCBKU09OLnN0cmluZ2lmeShkYXRlU2V0dGluZ3MpKTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRBZGRzIGNhbGxiYWNrIHRvIGNvbnRlbnQgaW4gZGlhbG9nIGFuZCB2YWxpZGF0ZXMgPGlucHV0PiBmaWVsZHMuXG4gKi9cbnZhciBkaWFsb2dTZXR0aW5nc0NhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuXHRsZXQgdGltZUNvbnRlbnRcdFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnRfX3RpbWUnKTtcblx0bGV0IHRoZW1lQ29udGVudFx0XHQ9IHRoaXMuZGlhbG9nQ29udGVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudF9fdGhlbWUnKTtcblx0bGV0IGZvcm1hdENoZWNrYm94XHQ9IHRoaXMuZGlhbG9nQ29udGVudC5xdWVyeVNlbGVjdG9yKCcjc2V0dGluZ3MtLWRhdGVmb3JtYXQnKTtcblx0bGV0IGFiYnJDaGVja2JveFx0XHQ9IHRoaXMuZGlhbG9nQ29udGVudC5xdWVyeVNlbGVjdG9yKCcjc2V0dGluZ3MtLWFtcG0nKTtcblx0bGV0IHRoZW1lQ2hlY2tib3hcdFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLS1jb2xvcmVkaGVhZCcpO1xuXHRsZXQgYnJvd1NldHRpbmdzXHRcdD0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbQlJPV19TRVRUSU5HU10pO1xuXG5cdC8vIFZhbGlkYXRlIGRhdGUgc2V0dGluZ3MgYW5kIHVwZGF0ZSBET01cblx0aWYgKGJyb3dTZXR0aW5ncy5kYXRlRm9ybWF0ID09PSAnMTJoJykge1xuXHRcdGZvcm1hdENoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcblx0fVxuXHRhYmJyQ2hlY2tib3guY2hlY2tlZCA9IGJyb3dTZXR0aW5ncy5hYmJyZXZpYXRpb25zO1xuXHRhYmJyQ2hlY2tib3guZGlzYWJsZWQgPSAhYnJvd1NldHRpbmdzLmFiYnJldmlhdGlvbnM7XG5cblx0Ly8gVmFsaWRhdGUgaGVhZGVyIGJhciBzZXR0aW5ncyBhbmQgdXBkYXRlIERPTVxuXHRpZiAoaXNDdXN0b21UaGVtZSgpKSB7XG5cdFx0dGhlbWVDaGVja2JveC5jaGVja2VkID0gYnJvd1NldHRpbmdzLnRoZW1lLmhlYWRlcmJhcjtcblx0fVxuXG5cdC8vIEFkZCBldmVudExpc3RlbmVyXG5cdHRpbWVDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdXBkYXRlRGF0ZUZvcm1hdC5iaW5kKHRoaXMpKTtcblx0dGhlbWVDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdXBkYXRlVGhlbWUuYmluZCh0aGlzKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkaWFsb2dTZXR0aW5nc0NhbGxiYWNrOyJdfQ==
