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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvYXBwLmluaXQuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvbW9kdWxlcy9jYXJkLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvZGlhbG9nLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvbGF5b3V0bWFuYWdlci5qcyIsIi9Vc2Vycy9tb3Jrcm9nZS9EZXNrdG9wL1Byb2plY3RzL1BlcnNvbmFsL0Jyb3dEYXNoL3NyYy9zY3JpcHRzL2VzNi9tb2R1bGVzL3NuYWNrYmFyLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L21vZHVsZXMvdGltZXIuanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvdXRpbHMvY29uc3RhbnRzLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L3V0aWxzL2VsZW1lbnRzLmpzIiwiL1VzZXJzL21vcmtyb2dlL0Rlc2t0b3AvUHJvamVjdHMvUGVyc29uYWwvQnJvd0Rhc2gvc3JjL3NjcmlwdHMvZXM2L3V0aWxzL2hlbHBlci5qcyIsIi9Vc2Vycy9tb3Jrcm9nZS9EZXNrdG9wL1Byb2plY3RzL1BlcnNvbmFsL0Jyb3dEYXNoL3NyYy9zY3JpcHRzL2VzNi92aWV3cy9kaWFsb2cuaW5mb3JtYXRpb24uanMiLCIvVXNlcnMvbW9ya3JvZ2UvRGVza3RvcC9Qcm9qZWN0cy9QZXJzb25hbC9Ccm93RGFzaC9zcmMvc2NyaXB0cy9lczYvdmlld3MvZGlhbG9nLnNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7NkJDQzRFLGtCQUFrQjs7OEJBQ3BELG1CQUFtQjs7MkJBQ3BDLGdCQUFnQjs7bUNBQ04seUJBQXlCOzs7O3NDQUN0Qiw0QkFBNEI7Ozs7NEJBQ2hELGlCQUFpQjs7Ozs2QkFDaEIsa0JBQWtCOzs7OzJCQUNwQixnQkFBZ0I7Ozs7b0NBQ1AseUJBQXlCOzs7OytCQUM5QixvQkFBb0I7Ozs7O0FBR3pDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDOzs7OztBQUt0QixJQUFJLHNCQUFzQixHQUFHLFNBQXpCLHNCQUFzQixHQUFlO0FBQ3hDLEtBQUksS0FBSyxHQUFHLGtDQUFjLENBQUM7O0FBRTNCLEtBQUksYUFBYSxFQUFFO0FBQ2xCLE1BQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQ3RCLFFBQUssQ0FBQyxLQUFLLDBIQUEwSCxDQUFDO0dBQ3RJLE1BQ0k7QUFDSixRQUFLLENBQUMsS0FBSyxzREFBc0QsQ0FBQztHQUNsRTtFQUNEOztBQUVELGNBQWEsRUFBRSxDQUFDO0NBQ2hCLENBQUM7Ozs7O0FBS0YsSUFBSSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxHQUFlO0FBQy9CLFVBQVMsR0FBRyw2Q0F0Q0osS0FBSyxDQXNDZSxDQUFDO0FBQzdCLEtBQUksWUFBWSxHQUFHLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUM7O0FBRTlELEtBQUksQ0FB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QUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQy9FLEtBQUksWUFBWSxHQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDeEUsS0FBSSxhQUFhLEdBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNoRixLQUFJLFlBQVksR0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksaUJBNUVuQyxhQUFhLENBNEVxQyxDQUFDLENBQUM7OztBQUc1RCxLQUFJLFlBQVksQ0FBQyxVQUFVLEtBQUssS0FBSyxFQUFFO0FBQ3RDLGdCQUFjLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztFQUMvQjtBQUNELGFBQVksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQztBQUNsRCxhQUFZLENBQUMsUUFBUSxHQUFHLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQzs7O0FBR3BELEtBQUksYUFyRkksYUFBYSxFQXFGRixFQUFFO0FBQ3BCLGVBQWEsQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7RUFDckQ7OztBQUdELFlBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbkUsYUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Q0FDL0QsQ0FBQzs7cUJBRWEsc0JBQXNCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIEltcG9ydCBkZXBlbmRlbmNpZXMgKi9cbmltcG9ydCB7IHRpbWVyLCBvcGVuRGlhbG9nLCBkaWFsb2csIG5ld0NhcmQsIGNvbnRlbnQsIGNvbnRlbnRPdmVybGF5IH0gZnJvbSAnLi91dGlscy9lbGVtZW50cyc7XG5pbXBvcnQgeyBCUk9XX1NFVFRJTkdTLCBCUk9XX0NBUkRTIH0gZnJvbSAnLi91dGlscy9jb25zdGFudHMnO1xuaW1wb3J0IHsgc2V0VGhlbWUgfSBmcm9tICcuL3V0aWxzL2hlbHBlcic7XG5pbXBvcnQgZGlhbG9nU2V0dGluZ3NDYWxsYmFjayBmcm9tICcuL3ZpZXdzL2RpYWxvZy5zZXR0aW5ncyc7XG5pbXBvcnQgZGlhbG9nSW5mb3JtYXRpb25DYWxsYmFjayBmcm9tICcuL3ZpZXdzL2RpYWxvZy5pbmZvcm1hdGlvbic7XG5pbXBvcnQgVGltZXIgZnJvbSAnLi9tb2R1bGVzL3RpbWVyJztcbmltcG9ydCBEaWFsb2cgZnJvbSAnLi9tb2R1bGVzL2RpYWxvZyc7XG5pbXBvcnQgQ2FyZCBmcm9tICcuL21vZHVsZXMvY2FyZCc7XG5pbXBvcnQgTGF5b3V0TWFuYWdlciBmcm9tICcuL21vZHVsZXMvbGF5b3V0bWFuYWdlcic7XG5pbXBvcnQgU25hY2tiYXIgZnJvbSAnLi9tb2R1bGVzL3NuYWNrYmFyJztcblxuLyogVmFyaWFibGVzICovXG5sZXQgYnJvd1RpbWVyID0gbnVsbDtcbmxldCBicm93R3JpZCA9IG51bGw7XG5sZXQgb25saW5lQ291bnRlciA9IDA7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIFZhbGlkYXRlcyBpZiB1c2VyIGlzIG9ubGluZS9vZmZsaW5lIGFuZCBzZW5kcyBwcm9wZXIgbm90aWZpY2F0aW9uLlxuICovXG5sZXQgdmFsaWRhdGVPbk9mZmxpbmVTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0bGV0IHNuYWNrID0gbmV3IFNuYWNrYmFyKCk7XG5cblx0aWYgKG9ubGluZUNvdW50ZXIpIHtcblx0XHRpZiAoIW5hdmlnYXRvci5vbkxpbmUpIHtcblx0XHRcdHNuYWNrLmFsZXJ0KGBZb3VyIGludGVybmV0IGNvbm5lY3Rpb24gc3VkZGVubHkgd2VudCBvZmZsaW5lLiBCcm93RGFzaCB3aWxsIHN0aWxsIHdvcmsgbGlrZSBiZWZvcmUsIGJ1dCBzb21lIGNhcmRzIG1pZ2h0IG5vdCB1cGRhdGUuYCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0c25hY2suYWxlcnQoYFlvdXIgaW50ZXJuZXQgY29ubmVjdGlvbiBpcyBzdGFibGUgYWdhaW4sIGF3ZXNvbWUhYCk7XG5cdFx0fVxuXHR9XG5cblx0b25saW5lQ291bnRlcisrO1xufTtcblxuLyoqXG4gKlx0QGRlc2NyaXB0aW9uIFZhbGlkYXRlcyB0aGUgdXNlcnMgdGltZXIgc2V0dGluZ3MuXG4gKi9cbmxldCB2YWxpZGF0ZVRpbWVyID0gZnVuY3Rpb24gKCkge1xuXHRicm93VGltZXIgPSBuZXcgVGltZXIodGltZXIpO1xuXHRsZXQgZGF0ZVNldHRpbmdzID0geyBkYXRlRm9ybWF0OiBudWxsLCBhYmJyZXZpYXRpb25zOiBmYWxzZSB9O1xuXG5cdGlmICghbG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKSB7XG5cdFx0ZGF0ZVNldHRpbmdzLmRhdGVGb3JtYXQgPSAnMjRoJztcblx0XHRicm93VGltZXIuc2V0RGF0ZUZvcm1hdCh7XG5cdFx0XHQnZm9ybWF0JzogZGF0ZVNldHRpbmdzLmRhdGVGb3JtYXRcblx0XHR9KTtcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShCUk9XX1NFVFRJTkdTLCBKU09OLnN0cmluZ2lmeShkYXRlU2V0dGluZ3MpKTtcblx0fVxuXHRlbHNlIHtcblx0XHRkYXRlU2V0dGluZ3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtCUk9XX1NFVFRJTkdTXSk7XG5cdFx0YnJvd1RpbWVyLnNldERhdGVGb3JtYXQoe1xuXHRcdFx0J2Zvcm1hdCc6IGRhdGVTZXR0aW5ncy5kYXRlRm9ybWF0LFxuXHRcdFx0J2FiYnJldmlhdGlvbnMnOiBkYXRlU2V0dGluZ3MuYWJicmV2aWF0aW9uc1xuXHRcdH0pO1xuXHR9XG5cblx0YnJvd1RpbWVyLnJ1bigpO1xufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdFJldHVybnMgY29ycmVjdCBjYWxsYmFjayBmdW5jdGlvbi5cbiAqL1xubGV0IGV2YWxDYWxsYmFjayA9IGZ1bmN0aW9uIChuYW1lKSB7XG5cdHN3aXRjaCAobmFtZSkge1xuXHRcdGNhc2UgJ3NldHRpbmdzJzogcmV0dXJuIGRpYWxvZ1NldHRpbmdzQ2FsbGJhY2s7XG5cdFx0Y2FzZSAnaW5mbyc6IHJldHVybiBkaWFsb2dJbmZvcm1hdGlvbkNhbGxiYWNrO1xuXHRcdGRlZmF1bHQ6IHJldHVybiBmYWxzZTtcblx0fVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdEFkZHMgYWxsIGRpYWxvZy5cbiAqL1xubGV0IGluaXREaWFsb2dzID0gZnVuY3Rpb24gKCkge1xuXHRsZXQgY3VycmVudExvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc2xpY2UoMCwgLTEpO1xuXG5cdFtdLmZvckVhY2guY2FsbChvcGVuRGlhbG9nLCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdGxldCBkaWFsb2dDb250ZW50XHQ9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWRpYWxvZycpO1xuXG5cdFx0bGV0IGJyb3dEaWFsb2cgPSBuZXcgRGlhbG9nKHtcblx0XHRcdGVsZW06IGl0ZW0sXG5cdFx0XHRkaWFsb2dFbGVtOiBkaWFsb2csXG5cdFx0XHRjb250ZW50OiBgJHtjdXJyZW50TG9jYXRpb259L21hcmt1cC9kaWFsb2ctJHtkaWFsb2dDb250ZW50fS5odG1sYCxcblx0XHRcdGNhbGxiYWNrOiBldmFsQ2FsbGJhY2soZGlhbG9nQ29udGVudCksXG5cdFx0XHRwYXJhbXM6IHsgYnJvd1RpbWVyIH1cblx0XHR9KTtcblxuXHRcdGJyb3dEaWFsb2cuaW5pdCgpO1xuXHR9KTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRHZXRzIGxvY2FsU3RvcmFnZSwgcGFyc2VzIGF2YWlsYWJsZSBjYXJkcyBhbmQgY3JlYXRlcyB0aGVtLlxuICogQHBhcmFtXHRcdFx0e051bWJlcnxTdHJpbmd9IGluZGV4XG4gKi9cbmxldCBwYXJzZUNhcmRzRnJvbVN0b3JhZ2UgPSBmdW5jdGlvbiAoaW5kZXgpIHtcblx0bGV0IHN0b3JhZ2VJdGVtID0gSlNPTi5wYXJzZShcblx0XHRsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggbG9jYWxTdG9yYWdlLmtleShpbmRleCkgKVxuXHQpO1xuXG5cdGlmIChzdG9yYWdlSXRlbS5tb2R1bGUpIHtcblx0XHRsZXQgYnJvd0NhcmQgPSBuZXcgQ2FyZCh7XG5cdFx0XHR0eXBlOiBzdG9yYWdlSXRlbS50eXBlLFxuXHRcdFx0Z3VpZDogc3RvcmFnZUl0ZW0uZ3VpZCxcblx0XHRcdGNvbnRlbnQ6IHN0b3JhZ2VJdGVtLmNvbnRlbnQsXG5cdFx0XHRzdHlsZTogc3RvcmFnZUl0ZW0uc3R5bGVcblx0XHR9KTtcblx0XHRjb250ZW50LmFwcGVuZENoaWxkKCBicm93Q2FyZCApO1xuXHR9XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2FsbHMgdGhlIExheW91dE1hbmFnZXIgY2xhc3MuXG4gKi9cbmxldCBpbml0TGF5b3V0TWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcblx0YnJvd0dyaWQgPSBuZXcgTGF5b3V0TWFuYWdlciggY29udGVudCwgY29udGVudE92ZXJsYXkgKTtcblx0YnJvd0dyaWQubGF5b3V0KCk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGxvY2FsU3RvcmFnZSBhbmQgbG9hZHMgdGhlIHVzZXJzIGNhcmRzXG4gKiBAcGFyYW1cdFx0XHR7T2JqZWN0fSBzdG9yYWdlXG4gKi9cbmxldCB2YWxpZGF0ZUJyb3dDYXJkcyA9IGZ1bmN0aW9uICgpIHtcblx0aWYgKCFsb2NhbFN0b3JhZ2VbQlJPV19DQVJEU10gfHwgbG9jYWxTdG9yYWdlLmxlbmd0aCA8PSAxKSB7XG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oQlJPV19DQVJEUywgdHJ1ZSk7XG5cdFx0bGV0IGRlZmF1bHRDYXJkID0gbmV3IENhcmQoeyB0eXBlOiAndGV4dCcgfSk7XG5cdFx0Y29udGVudC5hcHBlbmRDaGlsZCggZGVmYXVsdENhcmQgKTtcblx0fSBlbHNlIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0cGFyc2VDYXJkc0Zyb21TdG9yYWdlKGkpO1xuXHRcdH1cblx0fVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdENoZWNrcyBjbGlja2VkIGNhcmQgdHlwZSBhbmQgYXBwZW5kcyBpdCB0byB0aGUgRE9NLlxuICogQHBhcmFtXHRcdFx0e09iamVjdH0gZXZlbnRcbiAqL1xubGV0IGFkZE5ld0NhcmQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRsZXQgc2VsZWN0ZWRDYXJkID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtY3JlYXRlLWNhcmQnKTtcblx0bGV0IGJyb3dDYXJkID0gbmV3IENhcmQoeyB0eXBlOiBgJHtzZWxlY3RlZENhcmR9YCB9KTtcblxuXHRjb250ZW50LmFwcGVuZENoaWxkKCBicm93Q2FyZCApO1xuXHRicm93R3JpZC5hZGQoIGJyb3dDYXJkICk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0QmluZCBldmVudHMgdG8gZWxlbWVudHMuXG4gKi9cbmxldCBhZGRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvbmxpbmUnLCB2YWxpZGF0ZU9uT2ZmbGluZVN0YXRlKTtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCB2YWxpZGF0ZU9uT2ZmbGluZVN0YXRlKTtcblx0W10uZm9yRWFjaC5jYWxsKG5ld0NhcmQsIChpdGVtKSA9PiB7XG5cdFx0aXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZE5ld0NhcmQpO1xuXHR9KTtcbn07XG5cbi8qIEluaXRpYWxpc2UgYXBwICovXG53aW5kb3cuaXNFZGl0TW9kZSA9IGZhbHNlO1xudmFsaWRhdGVCcm93Q2FyZHMoKTtcbnZhbGlkYXRlVGltZXIoKTtcbmluaXRMYXlvdXRNYW5hZ2VyKCk7XG5pbml0RGlhbG9ncygpO1xudmFsaWRhdGVPbk9mZmxpbmVTdGF0ZSgpO1xuc2V0VGhlbWUoKTtcbmFkZEV2ZW50cygpOyIsIi8qKlxuICogQG5hbWVcdFx0XHRcdENhcmRcbiAqIEBkZXNjcmlwdGlvblx0L1xuICovXG5jbGFzcyBDYXJkIHtcblx0Y29uc3RydWN0b3IgKGNvbmZpZyA9IHt9KSB7XG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XG5cdFx0dGhpcy5lbGVtID0gdGhpcy5jcmVhdGVDYXJkKCk7XG5cdFx0dGhpcy5pbml0aWFsaXNlQ2FyZCgpO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMpO1xuXHRcdHJldHVybiB0aGlzLmVsZW07XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRSZXR1cm5zIGEgbmV3IGNhcmQgZWxlbWVudC5cblx0ICogQHJldHVybiBcdFx0XHR7SFRNTEVsZW1lbnR9XG5cdCAqL1xuXHRjcmVhdGVDYXJkICgpIHtcblx0XHRzd2l0Y2ggKHRoaXMuY29uZmlnLnR5cGUpIHtcblx0XHRcdGNhc2UgJ3RleHQnOiByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dC1jYXJkJyk7XG5cdFx0XHRjYXNlICd3ZWF0aGVyJzogcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3dlYXRoZXItY2FyZCcpO1xuXHRcdFx0Y2FzZSAndG9kbyc6IHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0b2RvLWNhcmQnKTtcblx0XHRcdGNhc2UgJ2NhbGN1bGF0b3InOiByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FsY3VsYXRvci1jYXJkJyk7XG5cdFx0XHRkZWZhdWx0OiByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dC1jYXJkJyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0QXBwbGllcyBjbGFzcyBlbGVtZW50IGFuZCBjYWxscyBpbml0aWFsaXNlKCkuXG5cdCAqL1xuXHRpbml0aWFsaXNlQ2FyZCAoKSB7XG5cdFx0dGhpcy5lbGVtLmluaXRpYWxpc2UoIHRoaXMuY29uZmlnICk7XG5cdFx0dGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ2Jyb3ctY29udGVudF9fbW9kdWxlJyk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZDsiLCIvKipcbiAqIEBuYW1lXHRcdFx0XHREaWFsb2dcbiAqIEBkZXNjcmlwdGlvblx0U2hvd3MvaGlkZXMgdGhlIGRpYWxvZy5cbiAqL1xuY2xhc3MgRGlhbG9nIHtcblx0Y29uc3RydWN0b3IgKGNvbmZpZykge1xuXHRcdHRoaXMuZWxlbSA9IGNvbmZpZy5lbGVtO1xuXHRcdHRoaXMuYnV0dG9uXHQ9IHRoaXMuZWxlbS5jaGlsZHJlblswXTtcblx0XHR0aGlzLmluaXRCdXR0b25JY29uID0gdGhpcy5idXR0b24uZ2V0QXR0cmlidXRlKCdpY29uJyk7XG5cdFx0dGhpcy5wYXRoID0gY29uZmlnLmNvbnRlbnQ7XG5cdFx0dGhpcy5jYWxsYmFjayA9IGNvbmZpZy5jYWxsYmFjaztcblx0XHR0aGlzLmNhbGxiYWNrUGFyYW1zID0gY29uZmlnLnBhcmFtcztcblx0XHR0aGlzLmRpYWxvZ0VsZW0gPSBjb25maWcuZGlhbG9nRWxlbTtcblx0XHR0aGlzLmRpYWxvZ0NvbnRhaW5lclx0PSB0aGlzLmRpYWxvZ0VsZW0ucXVlcnlTZWxlY3RvcignLmRpYWxvZ19faW5uZXInKTtcblx0XHR0aGlzLmRpYWxvZ0NvbnRlbnQgPSBudWxsO1xuXHRcdHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcblx0fVxuXG5cdGluaXQgKCkge1xuXHRcdHRoaXMuYWRkRXZlbnRzKCk7XG5cdH1cblxuXHQvKipcblx0ICpcdEBkZXNjcmlwdGlvblx0TG9hZHMgdGhlIGNvbnRlbnRcblx0ICogQHBhcmFtXHRcdFx0e09iamVjdH0gZXZlbnRcblx0ICovXG5cdGxvYWRDb250ZW50IChldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRmZXRjaCh0aGlzLnBhdGgpXG5cdFx0LnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UudGV4dCgpKVxuXHRcdC50aGVuKGJvZHkgPT4ge1xuXHRcdFx0dGhpcy5kaWFsb2dDb250YWluZXIuaW5uZXJIVE1MID0gYm9keTtcblx0XHRcdHRoaXMuZGlhbG9nQ29udGVudCA9IHRoaXMuZGlhbG9nQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2dfX2NvbnRlbnQnKTtcblx0XHRcdHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZSgnaWNvbicsICdjbG9zZScpO1xuXHRcdFx0dGhpcy5idXR0b24uc2V0QXR0cmlidXRlKCdjb2xvcicsICd3aGl0ZScpO1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdkaWFsb2ctaXMtdmlzaWJsZScpO1xuXHRcdFx0dGhpcy5pc0FjdGl2ZSA9IHRydWU7XG5cblx0XHRcdGlmICh0aGlzLmNhbGxiYWNrKSB7IHRoaXMuY2FsbGJhY2sodGhpcyk7IH1cblx0XHR9KTtcblx0fVxuXG5cblx0LyoqXG5cdCAqXHRAZGVzY3JpcHRpb25cdENsb3NlcyB0aGUgZGlhbG9nXG5cdCAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IGV2ZW50XG5cdCovXG5cdGNsb3NlRGlhbG9nIChldmVudCkge1xuXHRcdGxldCBib2R5SGFzQ2xhc3NcdD0gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2RpYWxvZy1pcy12aXNpYmxlJyk7XG5cdFx0bGV0IGlzQ2xvc2VCdG5cdFx0PSBldmVudC50YXJnZXQgPT09IHRoaXMuZWxlbTtcblx0XHRsZXQgaXNFU0NLZXlcdFx0PSBldmVudC5rZXlDb2RlID09PSAyNztcblxuXHRcdGlmICh0aGlzLmlzQWN0aXZlICYmIGJvZHlIYXNDbGFzcyAmJiBpc0Nsb3NlQnRuIHx8IGlzRVNDS2V5KSB7XG5cdFx0XHQvLyBDbGVhciBET01cblx0XHRcdHRoaXMuZGlhbG9nQ29udGFpbmVyLmlubmVySFRNTCA9IG51bGw7XG5cdFx0XHQvLyBSZXNldCBidXR0b25cblx0XHRcdHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZSgnaWNvbicsIHRoaXMuaW5pdEJ1dHRvbkljb24pO1xuXHRcdFx0dGhpcy5idXR0b24ucmVtb3ZlQXR0cmlidXRlKCdjb2xvcicpO1xuXHRcdFx0Ly8gUmVtb3ZlIGNsYXNzXG5cdFx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2RpYWxvZy1pcy12aXNpYmxlJyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqXHRAZGVzY3JpcHRpb25cdFZhbGlkYXRlcyBpZiBkaWFsb2cgaXMgdmlzaWJsZSBvciBub3QsIGNsb3Nlcy9sb2FkcyBpdC5cblx0ICogQHBhcmFtXHRcdFx0e09iamVjdH0gZXZlbnRcblx0ICovXG5cdGxvYWRPckNsb3NlQ29udGVudCAoZXZlbnQpIHtcblx0XHRsZXQgZGlhbG9nSXNPcGVuID0gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2RpYWxvZy1pcy12aXNpYmxlJyk7XG5cdFx0dGhpcy5lbGVtLmJsdXIoKTtcblxuXHRcdGlmIChkaWFsb2dJc09wZW4pIHtcblx0XHRcdHRoaXMuY2xvc2VEaWFsb2coZXZlbnQpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMubG9hZENvbnRlbnQoZXZlbnQpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKlx0QGRlc2NyaXB0aW9uXHRBZGRzIGV2ZW50c1xuXHQgKi9cblx0YWRkRXZlbnRzICgpIHtcblx0XHR0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmxvYWRPckNsb3NlQ29udGVudC5iaW5kKHRoaXMpKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuY2xvc2VEaWFsb2cuYmluZCh0aGlzKSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGlhbG9nOyIsIi8qZ2xvYmFscyBQYWNrZXJ5LERyYWdnYWJpbGx5Ki9cblxuaW1wb3J0IHsgaGFzQ3VzdG9tQ2FyZHMgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuXG4vKipcbiAqIEBuYW1lXHRcdFx0XHRMYXlvdXRNYW5hZ2VyXG4gKiBAZGVzY3JpcHRpb25cdC9cbiAqL1xuY2xhc3MgTGF5b3V0TWFuYWdlciB7XG5cdGNvbnN0cnVjdG9yIChjb250YWluZXIsIG92ZXJsYXkpIHtcblx0XHR0aGlzLnRyYW5zaXRpb24gPSAwO1xuXHRcdHRoaXMuZHJhZ09wdGlvbnMgPSB7XG5cdFx0XHRoYW5kbGU6ICcuYnJvdy1jb250ZW50X19tb2R1bGUgL2RlZXAvIC5kcmFnZy1hcmVhJ1xuXHRcdH07XG5cdFx0dGhpcy5wa3JPcHRpb25zID0ge1xuXHRcdFx0aXRlbVNlbGVjdG9yOiAnLmJyb3ctY29udGVudF9fbW9kdWxlJyxcblx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbjogdGhpcy50cmFuc2l0aW9uLFxuXHRcdFx0Y29sdW1uV2lkdGg6ICcuYnJvdy1jb250ZW50LS1zaXplcicsXG5cdFx0XHRndXR0ZXI6ICcuYnJvdy1jb250ZW50LS1ndXR0ZXInLFxuXHRcdFx0c3RhbXA6ICcuaXMtc3RhbXAnLFxuXHRcdFx0aXNJbml0TGF5b3V0OiBmYWxzZVxuXHRcdH07XG5cdFx0dGhpcy5wYWNrZXJ5ID0gbmV3IFBhY2tlcnkoY29udGFpbmVyLCB0aGlzLnBrck9wdGlvbnMpO1xuXHRcdHRoaXMuY29udGVudCA9IGNvbnRhaW5lcjtcblx0XHR0aGlzLm92ZXJsYXkgPSBvdmVybGF5O1xuXHRcdHRoaXMuYWRkRXZlbnRzKCk7XG5cdFx0dGhpcy5hZGREcmFnZ2FiaWxseSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0V2lsbCBpbml0aWFsaXNlIHRoZSBQYWNrZXJ5IGxheW91dC5cblx0ICovXG5cdGxheW91dCAoKSB7XG5cdFx0dGhpcy5wYWNrZXJ5LmxheW91dCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0QWRkcyBhIG5ldyBpdGVtIHRvIHRoZSBQYWNrZXJ5IGxheW91dC5cblx0ICogQHBhcmFtIFx0XHRcdHtOb2RlTGlzdHxIVE1MRWxlbWVudH0gZWxlbVxuXHQgKi9cblx0YWRkIChlbGVtKSB7XG5cdFx0dGhpcy5wYWNrZXJ5LmFwcGVuZGVkKCBlbGVtICk7XG5cdFx0dGhpcy5hZGREcmFnZ2FiaWxseSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0UmVtb3ZlcyBwYXNzZWQgZWxlbWVudCBmcm9tIHRoZSBQYWNrZXJ5IGxheW91dC5cblx0ICogQHBhcmFtIFx0XHRcdHtOb2RlTGlzdHxIVE1MRWxlbWVudH0gY29uZmlnXG5cdCAqL1xuXHRyZW1vdmUgKGVsZW0pIHtcblx0XHR0aGlzLnBhY2tlcnkucmVtb3ZlKCBlbGVtICk7XG5cdFx0dGhpcy5sYXlvdXQoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdE1ha2VzIGFuIGVsZW1lbnQgc3RpY2t5LlxuXHQgKiBAcGFyYW0gXHRcdFx0e05vZGVMaXN0fEhUTUxFbGVtZW50fSBjb25maWdcblx0ICovXG5cdHN0YW1wIChlbGVtKSB7XG5cdFx0dGhpcy5wYWNrZXJ5LnN0YW1wKCBlbGVtICk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRVbnN0YW1wcyBhbiBlbGVtZW50LlxuXHQgKiBAcGFyYW0gXHRcdFx0e05vZGVMaXN0fEhUTUxFbGVtZW50fSBjb25maWdcblx0ICovXG5cdHVuc3RhbXAgKGVsZW0pIHtcblx0XHR0aGlzLnBhY2tlcnkudW5zdGFtcCggZWxlbSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0SW5pdGlhbGlzZXMgRHJhZ2dhYmlsbHkuXG5cdCAqL1xuXHRhZGREcmFnZ2FiaWxseSAoKSB7XG5cdFx0bGV0IGNhcmRzID0gdGhpcy5wYWNrZXJ5LmdldEl0ZW1FbGVtZW50cygpO1xuXHRcdGNhcmRzLmZvckVhY2goKGl0ZW0pID0+IHtcblx0XHRcdGxldCBkcmFnZ2llID0gbmV3IERyYWdnYWJpbGx5KGl0ZW0sIHRoaXMuZHJhZ09wdGlvbnMpO1xuXHRcdFx0dGhpcy5wYWNrZXJ5LmJpbmREcmFnZ2FiaWxseUV2ZW50cyggZHJhZ2dpZSApO1xuXHRcdFx0ZHJhZ2dpZS5vbigncG9pbnRlckRvd24nLCB0aGlzLnZhbGlkYXRlRWRpdE1vZGUuYmluZChkcmFnZ2llKSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQGRlc2NyaXB0aW9uXHRBZGRzIEV2ZW50TGlzdGVuZXIuXG5cdCAqL1xuXHRhZGRFdmVudHMgKCkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjYXJkLWVkaXQnLCB0aGlzLnZhbGlkYXRlTGF5b3V0U3RhdGUuYmluZCh0aGlzKSk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NhcmQtc2F2ZScsIHRoaXMudmFsaWRhdGVMYXlvdXRTdGF0ZS5iaW5kKHRoaXMpKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2FyZC1yZW1vdmUnLCB0aGlzLnZhbGlkYXRlTGF5b3V0U3RhdGUuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5vdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy52YWxpZGF0ZUxheW91dFN0YXRlLmJpbmQodGhpcykpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0RGVhY3RpdmF0ZXMgZWRpdE1vZGUgYW5kIHJlbW92ZXMgY2xhc3NlcyBmcm9tIGNvbnRlbnQgb3ZlcmxheS5cblx0ICovXG5cdGRlYWN0aXZhdGVFZGl0TW9kZSAoKSB7XG5cdFx0d2luZG93LmlzRWRpdE1vZGUgPSBmYWxzZTtcblx0XHR0aGlzLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnaXMtZmFkaW5nJyk7XG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHR0aGlzLm92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlzaWJsZScsICdpcy1mYWRpbmcnKTtcblx0XHR9LCAxMDApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGV2ZW50IHR5cGUgYW5kIHZhbGlkYXRlcyB0aGUgbGF5b3V0J3Mgc3RhdGUuXG5cdCAqIEBwYXJhbSAgXHRcdFx0e09iamVjdH0gZXZlbnRcblx0ICovXG5cdHZhbGlkYXRlTGF5b3V0U3RhdGUgKGV2ZW50KSB7XG5cdFx0bGV0IGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1ndWlkPVwiJHtldmVudC5kZXRhaWx9XCJdYCk7XG5cblx0XHQvLyBhY3RpdmF0ZWQgZWRpdGluZyBtb2RlXG5cdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdjYXJkLWVkaXQnKSB7XG5cdFx0XHR3aW5kb3cuaXNFZGl0TW9kZSA9IHRydWU7XG5cdFx0XHR0aGlzLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnaXMtdmlzaWJsZScpO1xuXHRcdH1cblxuXHRcdC8vIHNhdmVkIGNhcmQgb3IgcmVtb3ZlIGNhcmRcblx0XHRpZiAoZXZlbnQudHlwZSA9PT0gJ2NhcmQtc2F2ZScgfHwgZXZlbnQudHlwZSA9PT0gJ2NhcmQtcmVtb3ZlJykge1xuXHRcdFx0dGhpcy5kZWFjdGl2YXRlRWRpdE1vZGUoKTtcblxuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09ICdjYXJkLXNhdmUnKSB7XG5cdFx0XHRcdHRoaXMubGF5b3V0KCk7XG5cdFx0XHRcdGhhc0N1c3RvbUNhcmRzKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChldmVudC50eXBlID09PSAnY2FyZC1yZW1vdmUnKSB7XG5cdFx0XHRcdHRoaXMucmVtb3ZlKGVsZW0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICdjbGljaycgJiYgd2luZG93LmlzRWRpdE1vZGUpIHtcblx0XHRcdGVsZW0gPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcignLmlzLWVkaXQnKTtcblx0XHRcdGVsZW0uc2F2ZVRvU3RvcmFnZSgpO1xuXHRcdFx0ZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdmeCcsICdpcy1lZGl0Jyk7XG5cdFx0XHR0aGlzLmRlYWN0aXZhdGVFZGl0TW9kZSgpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdENoZWNrcyBpZiBlZGl0TW9kZSBpcyBhY3RpdmUgYW5kIHdlaXRoZXIgZGlzYWJsZXMgb3IgZW5hYmxlcyB0aGUgZHJhZ2dpbmcuXG5cdCAqL1xuXHR2YWxpZGF0ZUVkaXRNb2RlICgpIHtcblx0XHRpZiAod2luZG93LmlzRWRpdE1vZGUpIHtcblx0XHRcdHRoaXMuZGlzYWJsZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmVuYWJsZSgpO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBMYXlvdXRNYW5hZ2VyOyIsImltcG9ydCB7IHNuYWNrYmFyIH0gZnJvbSAnLi4vdXRpbHMvZWxlbWVudHMnO1xuXG4vKipcbiAqIEBuYW1lXHRcdFx0XHRTbmFja2JhclxuICogQGRlc2NyaXB0aW9uXHQvXG4gKi9cbmNsYXNzIFNuYWNrYmFyIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5kdXJhdGlvbiA9IDEwMDAwO1xuXHRcdHRoaXMuZWxlbSA9IHNuYWNrYmFyO1xuXHRcdHRoaXMuZGVmYXVsdCA9ICdPb29wcywgc29tZXRoaW5nIHdlbnQgd3JvbmchIDooJztcblx0XHR0aGlzLm1lc3NhZ2UgPSBudWxsO1xuXHR9XG5cblx0YWxlcnQobXNnID0gdGhpcy5kZWZhdWx0KSB7XG5cdFx0dGhpcy5tZXNzYWdlID0gbXNnLnRyaW0oKTtcblx0XHR0aGlzLnNob3coKTtcblx0fVxuXG5cdHNldCBzZXREdXJhdGlvbiAoZHVyYXRpb24pIHtcblx0XHR0aGlzLmR1cmF0aW9uID0gZHVyYXRpb247XG5cdH1cblxuXHRzaG93KCkge1xuXHRcdHRoaXMuZWxlbS5pbm5lckhUTUwgPSBudWxsO1xuXHRcdHRoaXMuZWxlbS5hcHBlbmRDaGlsZCggdGhpcy5jcmVhdGVQYXJhZ3JhcGgoKSApO1xuXHRcdHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdpcy12aXNpYmxlJyk7XG5cblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XG5cdFx0XHR0aGlzLm1lc3NhZ2UgPSBudWxsO1xuXHRcdH0sIHRoaXMuZHVyYXRpb24pO1xuXHR9XG5cblx0Y3JlYXRlUGFyYWdyYXBoKCkge1xuXHRcdGxldCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXHRcdHAuaW5uZXJUZXh0ID0gdGhpcy5tZXNzYWdlO1xuXHRcdHJldHVybiBwO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNuYWNrYmFyOyIsIi8qKlxuICogQG5hbWVcdFx0XHRcdFRpbWVyXG4gKiBAZGVzY3JpcHRpb25cdENsYXNzIHdoaWNoIGFwcGVuZHMgYSB0aW1lIHN0cmluZyB0byBhbiBlbGVtZW50XG4gKiAgICAgICAgICAgICAgXHRhbmQgdXBkYXRlcyBpdCBldmVyeSBzZWNvbmQuXG4gKi9cbmNsYXNzIFRpbWVyIHtcblx0Y29uc3RydWN0b3IgKGVsZW0pIHtcblx0XHRpZiAoIShlbGVtICYmIGVsZW0ubm9kZU5hbWUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFlvdSBoYXZlbid0IHBhc3NlZCBhIHZhbGlkIEhUTUxFbGVtZW50IWApO1xuXHRcdH1cblxuXHRcdHRoaXMudXBkYXRlXHQ9IDEwMDA7XG5cdFx0dGhpcy5lbGVtXHQ9IGVsZW07XG5cdFx0dGhpcy5mb3JtYXQgPSAnMjRoJztcblx0XHR0aGlzLmFiYnJldmlhdGlvbnMgPSBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdENyZWF0ZXMgYSBzdHJpbmcgd2l0aCBjdXJyZW50IHRpbWUgaW4gSEg6TU06U1Ncblx0ICogQHJldHVyblx0XHRcdHtTdHJpbmd9XG5cdCAqL1xuXHRnZXRUaW1lICgpIHtcblx0XHRsZXQgZGF0ZVx0XHRcdFx0PSBuZXcgRGF0ZSgpO1xuXHRcdGxldCBkYXRlSG91cnNcdFx0PSBkYXRlLmdldEhvdXJzKCk7XG5cdFx0bGV0IGRhdGVNaW51dGVzXHQ9IGRhdGUuZ2V0TWludXRlcygpO1xuXHRcdGxldCBkYXRlU2Vjb25kc1x0PSBkYXRlLmdldFNlY29uZHMoKTtcblx0XHRsZXQgZGF0ZUFiYnJcdFx0PSAnJztcblxuXHRcdC8vIElmIHRpbWUgZm9ybWF0IGlzIHNldCB0byAxMmgsIHVzZSAxMmgtc3lzdGVtLlxuXHRcdGlmICh0aGlzLmZvcm1hdCA9PT0gJzEyaCcpIHtcblx0XHRcdGlmICh0aGlzLmFiYnJldmlhdGlvbnMpIHtcblx0XHRcdFx0ZGF0ZUFiYnIgPSB0aGlzLmdldEFiYnJldmlhdGlvbihkYXRlSG91cnMpO1xuXHRcdFx0fVxuXHRcdFx0ZGF0ZUhvdXJzID0gKGRhdGVIb3VycyAlIDEyKSA/IGRhdGVIb3VycyAlIDEyIDogMTI7XG5cdFx0fVxuXG5cdFx0Ly8gQWRkICcwJyBpZiBiZWxvdyAxMFxuXHRcdGlmIChkYXRlSG91cnMgPCAxMCkgeyBkYXRlSG91cnMgPSBgMCR7ZGF0ZUhvdXJzfWA7IH1cblx0XHRpZiAoZGF0ZU1pbnV0ZXMgPCAxMCkgeyBkYXRlTWludXRlcyA9IGAwJHtkYXRlTWludXRlc31gOyB9XG5cdFx0aWYgKGRhdGVTZWNvbmRzIDwgMTApIHsgZGF0ZVNlY29uZHMgPSBgMCR7ZGF0ZVNlY29uZHN9YDsgfVxuXG5cdFx0cmV0dXJuIGAke2RhdGVIb3Vyc306JHtkYXRlTWludXRlc306JHtkYXRlU2Vjb25kc30gJHtkYXRlQWJicn1gO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBkZXNjcmlwdGlvblx0VmFsaWRhdGVzIG51bWJlciBhbmQgcmV0dXJucyBlaXRoZXIgQU0gb3IgUE0uXG5cdCAqIEBwYXJhbSBcdFx0XHR7TnVtYmVyfSB0aW1lXG5cdCAqIEByZXR1cm5cdFx0XHR7U3RyaW5nfVxuXHQgKi9cblx0Z2V0QWJicmV2aWF0aW9uICh0aW1lKSB7XG5cdFx0aWYgKHR5cGVvZiB0aW1lICE9PSAnbnVtYmVyJykge1xuXHRcdFx0dGltZSA9IHBhcnNlRmxvYXQodGltZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICh0aW1lID49IDEyKSA/ICdQTScgOiAnQU0nO1xuXHR9XG5cblx0LyoqXG5cdCAqXHRAZGVzY3JpcHRpb25cdE5lZWRzIHRvIGJlIHdyaXR0ZW4uXG5cdCAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IGNvbmZpZ1xuXHQgKi9cblx0c2V0RGF0ZUZvcm1hdCAoY29uZmlnKSB7XG5cdFx0aWYgKGNvbmZpZykge1xuXHRcdFx0dGhpcy5mb3JtYXQgPSAoY29uZmlnLmZvcm1hdCkgPyBjb25maWcuZm9ybWF0IDogdGhpcy5mb3JtYXQ7XG5cdFx0XHR0aGlzLmFiYnJldmlhdGlvbnMgPSBjb25maWcuYWJicmV2aWF0aW9ucztcblx0XHR9XG5cdFx0dGhpcy5ydW4oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAZGVzY3JpcHRpb25cdFNldHMgdGhlIGVsZW1lbnQgaW4gd2hpY2ggdGhlIHRpbWUgc2hvdWxkIGJlIGRpc3BsYXllZC5cblx0ICogQHBhcmFtXHRcdFx0e0VsZW1lbnR9IGVsZW1cblx0ICogQHJldHVybiBcdFx0XHR7SFRNTEVsZW1lbnR9XG5cdCAqL1xuXHRydW4gKCkge1xuXHRcdHRoaXMuZWxlbS50ZXh0Q29udGVudCA9IHRoaXMuZ2V0VGltZSgpO1xuXG5cdFx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0dGhpcy5lbGVtLnRleHRDb250ZW50ID0gdGhpcy5nZXRUaW1lKCk7XG5cdFx0fSwgdGhpcy51cGRhdGUpO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWxlbTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaW1lcjsiLCJleHBvcnQgY29uc3QgQlJPV19TRVRUSU5HUyA9ICdCUk9XX1NFVFRJTkdTJztcbmV4cG9ydCBjb25zdCBCUk9XX0tFWVx0XHQ9ICdCUk9XX1RIRU1FJztcbmV4cG9ydCBjb25zdCBCUk9XX0NBUkRTXHRcdD0gJ0JST1dfQ0FSRFMnO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfVEhFTUVcdD0gJ2JsdWUtYTQwMCc7IiwiZXhwb3J0IGxldCB0aW1lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy10aW1lcicpO1xuZXhwb3J0IGxldCBkaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtZGlhbG9nJyk7XG5leHBvcnQgbGV0IGNhcmRsaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWNhcmRsaXN0Jyk7XG5leHBvcnQgbGV0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY29udGVudCcpO1xuZXhwb3J0IGxldCBjb250ZW50T3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50X19vdmVybGF5Jyk7XG5leHBvcnQgbGV0IG9wZW5EaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcub3Blbi1kaWFsb2cnKTtcbmV4cG9ydCBsZXQgbmV3Q2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1uZXdjYXJkJyk7XG5leHBvcnQgbGV0IHNlbGVjdGlvbkxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtc2VsZWN0aW9uJyk7XG5leHBvcnQgbGV0IHNuYWNrYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXNuYWNrYmFyJyk7IiwiaW1wb3J0IHsgQlJPV19TRVRUSU5HUywgQlJPV19DQVJEUywgREVGQVVMVF9USEVNRSB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdENoZWNrcyBpZiBjdXN0b20gdGhlbWUgc2V0dGluZ3MgYXJlIGF2YWlsYWJsZS5cbiAqIEByZXR1cm5cdFx0XHR7Qm9vbGVhbn1cbiAqL1xuY29uc3QgaXNDdXN0b21UaGVtZSA9IGZ1bmN0aW9uICgpIHtcblx0bGV0IGlzQ3VzdG9tID0gZmFsc2U7XG5cblx0aWYgKGxvY2FsU3RvcmFnZVtCUk9XX1NFVFRJTkdTXSkge1xuXHRcdGxldCBzZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKTtcblx0XHRpc0N1c3RvbSA9ICEhc2V0dGluZ3MudGhlbWU7XG5cdH1cblxuXHRyZXR1cm4gaXNDdXN0b207XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIGlmIGN1c3RvbSBrZXkgaXMgc2V0LCBpZiBub3Q6IGRvIGl0LlxuICovXG5jb25zdCBoYXNDdXN0b21DYXJkcyA9IGZ1bmN0aW9uICgpIHtcblx0aWYgKCFsb2NhbFN0b3JhZ2VbQlJPV19DQVJEU10pIHtcblx0XHRsb2NhbFN0b3JhZ2VbQlJPV19DQVJEU10gPSB0cnVlO1xuXHR9XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0Q2hlY2tzIHZpYSByZWdleCBpZiBjbGFzc05hbWUgaXMgYSB0aGVtZS5cbiAqL1xuY29uc3QgY2hlY2tGb3JUaGVtZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuXHRsZXQgdGhlbWVSZWdFeCA9IC90aGVtZS0uKi87XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAodGhlbWVSZWdFeC50ZXN0KGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0W2ldKSkge1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdFtpXSApO1xuXHRcdH1cblx0fVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdFBhcnNlcyB0aGUgY3VzdG9tIHNldHRpbmdzIGZyb20gbG9jYWxTdG9yYWdlIGFuZCBzZXRzIGNsYXNzZXMuXG4gKi9cbmNvbnN0IHVwZGF0ZVRoZW1lRnJvbVN0b3JhZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdGxldCBzZXR0aW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKTtcblx0Ly9sZXQgZGlhbG9nSXNPcGVuID0gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2RpYWxvZy1pcy12aXNpYmxlJyk7XG5cblx0Y2hlY2tGb3JUaGVtZUNsYXNzKCk7XG5cdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChgdGhlbWUtJHtzZXR0aW5ncy50aGVtZS5jb2xvcn1gKTtcblxuXHRpZiAoaXNDdXN0b21UaGVtZSgpICYmIHNldHRpbmdzLnRoZW1lLmhlYWRlcmJhcikge1xuXHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgndGhlbWUtaGVhZGVyYmFyJyk7XG5cdH1cbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRBZGRzIHRoZSB0aGVtZSBjbGFzcyB0byA8Ym9keT4gZnJvbSBpbml0aWFsIHNldHRpbmdzLlxuICogQHBhcmFtXHRcdFx0e1N0cmluZ30gdGhlbWVcbiAqL1xuY29uc3QgdXBkYXRlVGhlbWVGcm9tQ29uZmlnID0gZnVuY3Rpb24gKHRoZW1lKSB7XG5cdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChgdGhlbWUtJHt0aGVtZX1gKTtcbn07XG5cbi8qKlxuICpcdEBkZXNjcmlwdGlvblx0VXBkYXRlcyB0aGUgY3VycmVudCB0aGVtZS5cbiAqIEBwYXJhbVx0XHRcdHtPYmplY3R9IHRoZW1lXG4gKi9cbmNvbnN0IHNldFRoZW1lID0gZnVuY3Rpb24gKHRoZW1lKSB7XG5cdGlmICghdGhlbWUgfHwgdHlwZW9mIHRoZW1lICE9PSAnc3RyaW5nJykge1xuXHRcdHRoZW1lID0gREVGQVVMVF9USEVNRTtcblx0fVxuXG5cdGlmIChpc0N1c3RvbVRoZW1lKCkpIHtcblx0XHR1cGRhdGVUaGVtZUZyb21TdG9yYWdlKCk7XG5cdH0gZWxzZSB7XG5cdFx0dXBkYXRlVGhlbWVGcm9tQ29uZmlnKCB0aGVtZSApO1xuXHR9XG59O1xuXG5leHBvcnQge1xuXHRpc0N1c3RvbVRoZW1lLFxuXHRoYXNDdXN0b21DYXJkcyxcblx0c2V0VGhlbWUsXG5cdHVwZGF0ZVRoZW1lRnJvbUNvbmZpZyxcblx0dXBkYXRlVGhlbWVGcm9tU3RvcmFnZVxufTsiLCIvKipcbiAqIEBkZXNjcmlwdGlvblx0UmV0dXJucyBjdXJyZW50IGFjdGl2ZSBsaXN0IGl0ZW1cbiAqIEByZXR1cm4gXHRcdFx0e0hUTUxFbGVtZW50fVxuICovXG52YXIgZ2V0Q3VycmVudEFjdGl2ZUl0ZW0gPSAoY29udGVudCkgPT4gY29udGVudC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nX19zaWRlYmFyIGxpLmlzLWFjdGl2ZSBhJyk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRSZXR1cm5zIGN1cnJlbnQgYWN0aXZlIHNlY3Rpb25cbiAqIEByZXR1cm4gXHRcdFx0e0hUTUxFbGVtZW50fVxuICovXG52YXIgZ2V0Q3VycmVudEFjdGl2ZVNlY3Rpb24gPSAoY29udGVudCkgPT4gY29udGVudC5xdWVyeVNlbGVjdG9yKCdzZWN0aW9uLmlzLXZpc2libGUnKTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cdFZhbGlkYXRlcyBuZXcgYW5kIG9sZCBjb250ZW50LlxuICogQHBhcmFtIFx0XHRcdHtIVE1MRWxlbWVudH0gY29udGVudFxuICovXG52YXIgdmFsaWRhdGVTZWN0aW9uID0gZnVuY3Rpb24gKGNvbnRlbnQpIHtcblx0bGV0IGN1ckl0ZW0gPSBnZXRDdXJyZW50QWN0aXZlSXRlbShjb250ZW50KTtcblx0bGV0IGN1clNlY3Rpb24gPSBnZXRDdXJyZW50QWN0aXZlU2VjdGlvbihjb250ZW50KTtcblx0bGV0IHRhcmdldFNlY3Rpb24gPSBjdXJJdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1zZWN0aW9uJyk7XG5cdGxldCBzZWN0aW9uID0gY29udGVudC5xdWVyeVNlbGVjdG9yKGBzZWN0aW9uW2RhdGEtc2VjdGlvbj1cIiR7dGFyZ2V0U2VjdGlvbn1cIl1gKTtcblxuXHRpZiAoY3VyU2VjdGlvbikgeyBjdXJTZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTsgfVxuXHRzZWN0aW9uLmNsYXNzTGlzdC5hZGQoJ2lzLXZpc2libGUnKTtcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRBZGRzIG9yIHJlbW92ZXMgYWN0aXZlIHN0YXRlIG9uIGxpc3QgYW5kIHNob3dzL2hpZGVzIGNvbnRlbnQuXG4gKiBAcGFyYW0gXHRcdFx0e09iamVjdH0gZXZlbnRcbiAqL1xudmFyIHRvZ2dsZUNvbnRlbnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRsZXQgaXRlbSA9IGV2ZW50LnRhcmdldDtcblx0bGV0IGN1ckFjdGl2ZSA9IGdldEN1cnJlbnRBY3RpdmVJdGVtKHRoaXMuY2F0ZWdvcnlMaXN0KS5wYXJlbnROb2RlO1xuXG5cdGlmICghaXRlbS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnaXMtYWN0aXZlJykpIHtcblx0XHRjdXJBY3RpdmUuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XG5cdFx0aXRlbS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ2lzLWFjdGl2ZScpO1xuXHRcdHZhbGlkYXRlU2VjdGlvbih0aGlzLmRpYWxvZ0NvbnRlbnQpO1xuXHR9XG5cbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRBZGRzIGNhbGxiYWNrIHRvIGNvbnRlbnQgaW4gZGlhbG9nIGFuZCB2YWxpZGF0ZXMgPGlucHV0PiBmaWVsZHMuXG4gKi9cbnZhciBkaWFsb2dJbmZvcm1hdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuXHR0aGlzLmNhdGVnb3J5TGlzdCA9IHRoaXMuZGlhbG9nQ29udGVudC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nX19zaWRlYmFyIHVsJyk7XG5cblx0dmFsaWRhdGVTZWN0aW9uKHRoaXMuZGlhbG9nQ29udGVudCk7XG5cdHRoaXMuY2F0ZWdvcnlMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlQ29udGVudC5iaW5kKHRoaXMpKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRpYWxvZ0luZm9ybWF0aW9uQ2FsbGJhY2s7IiwiaW1wb3J0IHsgQlJPV19TRVRUSU5HUywgREVGQVVMVF9USEVNRSB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBpc0N1c3RvbVRoZW1lLCBzZXRUaGVtZSB9IGZyb20gJy4uL3V0aWxzL2hlbHBlcic7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXHRWYWxpZGF0ZXMgaW5wdXQgZmllbGRzLCB1cGRhdGVzIGJyb3dUaGVtZSBhbmQgc2F2ZXMgdG8gbG9jYWxTdG9yYWdlLlxuICogQHBhcmFtICBcdFx0XHR7T2JqZWN0fSBldmVudFxuICovXG52YXIgdXBkYXRlVGhlbWUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblx0bGV0IGNvbG9ySGVhZENoZWNrYm94XHQ9IHRoaXMuZGlhbG9nQ29udGVudC5xdWVyeVNlbGVjdG9yKCcjc2V0dGluZ3MtLWNvbG9yZWRoZWFkJyk7XG5cdC8vbGV0IGlzVGhlbWVCdXR0b25cdFx0XHQ9IGV2ZW50LnRhcmdldC5oYXNBdHRyaWJ1dGUoJ2RhdGEtc2V0dGluZ3MtdGhlbWUnKTtcblx0Ly9sZXQgaXNUaGVtZUNoZWNrYm94XHRcdD0gZXZlbnQudGFyZ2V0LmlkID09PSAnc2V0dGluZ3MtLWNvbG9yZWRoZWFkJztcblx0bGV0IHNldHRpbmdzXHRcdFx0XHQ9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKTtcblxuXHQvLyBJZiBubyB0aGVtZSBzZXR0aW5ncyBhcmUgc3RvcmVkIHlldC5cblx0aWYgKCFzZXR0aW5ncy50aGVtZSkge1xuXHRcdHNldHRpbmdzLnRoZW1lID0geyBjb2xvcjogREVGQVVMVF9USEVNRSwgaGVhZGVyYmFyOiBmYWxzZSB9O1xuXHR9XG5cblx0Ly8gSXMgdGhlbWUgb3B0aW9uXG5cdGlmIChldmVudC50YXJnZXQuaGFzQXR0cmlidXRlKCdkYXRhLXNldHRpbmdzLXRoZW1lJykpIHtcblx0XHRzZXR0aW5ncy50aGVtZS5jb2xvciA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2V0dGluZ3MtdGhlbWUnKTtcblx0fVxuXG5cdC8vIElmIGNvbG9yZWQgaGVhZGVyIGJhciBpcyBjbGlja2VkXG5cdGlmIChldmVudC50YXJnZXQuaWQgPT09ICdzZXR0aW5ncy0tY29sb3JlZGhlYWQnKSB7XG5cdFx0c2V0dGluZ3MudGhlbWUuaGVhZGVyYmFyID0gY29sb3JIZWFkQ2hlY2tib3guY2hlY2tlZDtcblx0fVxuXG5cdGxvY2FsU3RvcmFnZS5zZXRJdGVtKEJST1dfU0VUVElOR1MsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzKSk7XG5cdHNldFRoZW1lKCk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0VmFsaWRhdGVzIGlucHV0IGZpZWxkcywgdXBkYXRlcyBUaW1lciBhbmQgc2F2ZXMgdG8gbG9jYWxTdG9yYWdlLlxuICogQHBhcmFtICBcdFx0XHR7T2JqZWN0fSBldmVudFxuICovXG52YXIgdXBkYXRlRGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChldmVudCkge1xuXHRsZXQgZm9ybWF0Q2hlY2tib3hcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR0aW5ncy0tZGF0ZWZvcm1hdCcpO1xuXHRsZXQgYWJickNoZWNrYm94XHRcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR0aW5ncy0tYW1wbScpO1xuXHRsZXQgdGltZUZvcm1hdFx0XHRcdD0gJzI0aCc7XG5cdGxldCBkYXRlU2V0dGluZ3NcdFx0PSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtCUk9XX1NFVFRJTkdTXSk7XG5cblx0Ly8gSWYgZGF0ZSBmb3JtYXQgY2hlY2tib3ggaXMgY2xpY2tlZFxuXHRpZiAoZXZlbnQudGFyZ2V0LmlkID09PSAnc2V0dGluZ3MtLWRhdGVmb3JtYXQnKSB7XG5cdFx0aWYgKCFmb3JtYXRDaGVja2JveC5jaGVja2VkKSB7XG5cdFx0XHR0aW1lRm9ybWF0ID0gJzEyaCc7XG5cdFx0XHRhYmJyQ2hlY2tib3guZGlzYWJsZWQgPSBmYWxzZTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoZm9ybWF0Q2hlY2tib3guY2hlY2tlZCAmJiAhYWJickNoZWNrYm94LmRpc2FibGVkKSB7XG5cdFx0XHRhYmJyQ2hlY2tib3guZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0YWJickNoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcblx0XHR9XG5cblx0XHR0aGlzLmNhbGxiYWNrUGFyYW1zLmJyb3dUaW1lci5zZXREYXRlRm9ybWF0KHsgJ2Zvcm1hdCc6IHRpbWVGb3JtYXQgfSk7XG5cdFx0ZGF0ZVNldHRpbmdzLmRhdGVGb3JtYXQgPSB0aW1lRm9ybWF0O1xuXHRcdGRhdGVTZXR0aW5ncy5hYmJyZXZpYXRpb25zID0gYWJickNoZWNrYm94LmNoZWNrZWQ7XG5cdH1cblxuXHQvLyBJZiBhYmJyZXZpYXRpb24gY2hlY2tib3ggaXMgY2xpY2tlZFxuXHRpZiAoIWV2ZW50LnRhcmdldC5kaXNhYmxlZCAmJiBldmVudC50YXJnZXQuaWQgPT09ICdzZXR0aW5ncy0tYW1wbScpIHtcblx0XHR0aGlzLmNhbGxiYWNrUGFyYW1zLmJyb3dUaW1lci5zZXREYXRlRm9ybWF0KHsgJ2FiYnJldmlhdGlvbnMnOiBhYmJyQ2hlY2tib3guY2hlY2tlZCB9KTtcblx0XHRkYXRlU2V0dGluZ3MuYWJicmV2aWF0aW9ucyA9IGFiYnJDaGVja2JveC5jaGVja2VkO1xuXHR9XG5cblx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oQlJPV19TRVRUSU5HUywgSlNPTi5zdHJpbmdpZnkoZGF0ZVNldHRpbmdzKSk7XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblx0QWRkcyBjYWxsYmFjayB0byBjb250ZW50IGluIGRpYWxvZyBhbmQgdmFsaWRhdGVzIDxpbnB1dD4gZmllbGRzLlxuICovXG52YXIgZGlhbG9nU2V0dGluZ3NDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcblx0bGV0IHRpbWVDb250ZW50XHRcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50X190aW1lJyk7XG5cdGxldCB0aGVtZUNvbnRlbnRcdFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnRfX3RoZW1lJyk7XG5cdGxldCBmb3JtYXRDaGVja2JveFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLS1kYXRlZm9ybWF0Jyk7XG5cdGxldCBhYmJyQ2hlY2tib3hcdFx0PSB0aGlzLmRpYWxvZ0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLS1hbXBtJyk7XG5cdGxldCB0aGVtZUNoZWNrYm94XHRcdD0gdGhpcy5kaWFsb2dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZXR0aW5ncy0tY29sb3JlZGhlYWQnKTtcblx0bGV0IGJyb3dTZXR0aW5nc1x0XHQ9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW0JST1dfU0VUVElOR1NdKTtcblxuXHQvLyBWYWxpZGF0ZSBkYXRlIHNldHRpbmdzIGFuZCB1cGRhdGUgRE9NXG5cdGlmIChicm93U2V0dGluZ3MuZGF0ZUZvcm1hdCA9PT0gJzEyaCcpIHtcblx0XHRmb3JtYXRDaGVja2JveC5jaGVja2VkID0gZmFsc2U7XG5cdH1cblx0YWJickNoZWNrYm94LmNoZWNrZWQgPSBicm93U2V0dGluZ3MuYWJicmV2aWF0aW9ucztcblx0YWJickNoZWNrYm94LmRpc2FibGVkID0gIWJyb3dTZXR0aW5ncy5hYmJyZXZpYXRpb25zO1xuXG5cdC8vIFZhbGlkYXRlIGhlYWRlciBiYXIgc2V0dGluZ3MgYW5kIHVwZGF0ZSBET01cblx0aWYgKGlzQ3VzdG9tVGhlbWUoKSkge1xuXHRcdHRoZW1lQ2hlY2tib3guY2hlY2tlZCA9IGJyb3dTZXR0aW5ncy50aGVtZS5oZWFkZXJiYXI7XG5cdH1cblxuXHQvLyBBZGQgZXZlbnRMaXN0ZW5lclxuXHR0aW1lQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHVwZGF0ZURhdGVGb3JtYXQuYmluZCh0aGlzKSk7XG5cdHRoZW1lQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHVwZGF0ZVRoZW1lLmJpbmQodGhpcykpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZGlhbG9nU2V0dGluZ3NDYWxsYmFjazsiXX0=
