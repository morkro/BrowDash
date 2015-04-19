/* jshint asi:true */
(function() {
	'use strict';

	if (self.fetch) {
		return;
	}

	function normalizeName(name) {
		if (typeof name !== 'string') {
			name = name.toString();
		}
		if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
			throw new TypeError('Invalid character in header field name');
		}
		return name.toLowerCase();
	}

	function normalizeValue(value) {
		if (typeof value !== 'string') {
			value = value.toString();
		}
		return value;
	}

	function Headers(headers) {
		this.map = {};

		var self = this;
		if (headers instanceof Headers) {
			headers.forEach(function(name, values) {
				values.forEach(function(value) {
					self.append(name, value);
				});
			});

		} else if (headers) {
			Object.getOwnPropertyNames(headers).forEach(function(name) {
				self.append(name, headers[name]);
			});
		}
	}

	Headers.prototype.append = function(name, value) {
		name = normalizeName(name);
		value = normalizeValue(value);
		var list = this.map[name];
		if (!list) {
			list = [];
			this.map[name] = list;
		}
		list.push(value);
	};

	Headers.prototype['delete'] = function(name) {
		delete this.map[normalizeName(name)];
	};

	Headers.prototype.get = function(name) {
		var values = this.map[normalizeName(name)];
		return values ? values[0] : null;
	};

	Headers.prototype.getAll = function(name) {
		return this.map[normalizeName(name)] || [];
	};

	Headers.prototype.has = function(name) {
		return this.map.hasOwnProperty(normalizeName(name));
	};

	Headers.prototype.set = function(name, value) {
		this.map[normalizeName(name)] = [normalizeValue(value)];
	};

	// Instead of iterable for now.
	Headers.prototype.forEach = function(callback) {
		var self = this;
		Object.getOwnPropertyNames(this.map).forEach(function(name) {
			callback(name, self.map[name]);
		});
	};

	function consumed(body) {
		if (body.bodyUsed) {
			return Promise.reject(new TypeError('Already read'))
		}
		body.bodyUsed = true;
	}

	function fileReaderReady(reader) {
		return new Promise(function(resolve, reject) {
			reader.onload = function() {
				resolve(reader.result);
			}
			reader.onerror = function() {
				reject(reader.error);
			}
		});
	}

	function readBlobAsArrayBuffer(blob) {
		var reader = new FileReader();
		reader.readAsArrayBuffer(blob);
		return fileReaderReady(reader);
	}

	function readBlobAsText(blob) {
		var reader = new FileReader();
		reader.readAsText(blob);
		return fileReaderReady(reader);
	}

	var support = {
		blob: 'FileReader' in self && 'Blob' in self && (function() {
			try {
				new Blob();
				return true;
			} catch(e) {
				return false;
			}
		})(),
		formData: 'FormData' in self
	};

	function Body() {
		this.bodyUsed = false;

		if (support.blob) {
			this._initBody = function(body) {
			this._bodyInit = body;
		if (typeof body === 'string') {
			this._bodyText = body;
		} else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
			this._bodyBlob = body;
		} else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
			this._bodyFormData = body;
		} else if (!body) {
			this._bodyText = '';
		} else {
			throw new Error('unsupported BodyInit type');
		}
	}

	this.blob = function() {
		var rejected = consumed(this);
		if (rejected) {
			return rejected;
		}

		if (this._bodyBlob) {
			return Promise.resolve(this._bodyBlob);
		} else if (this._bodyFormData) {
			throw new Error('could not read FormData body as blob');
		} else {
			return Promise.resolve(new Blob([this._bodyText]));
		}
	};

	this.arrayBuffer = function() {
		return this.blob().then(readBlobAsArrayBuffer);
	};

	this.text = function() {
		var rejected = consumed(this);
		if (rejected) {
			return rejected;
		}

	if (this._bodyBlob) {
	return readBlobAsText(this._bodyBlob)
	} else if (this._bodyFormData) {
	throw new Error('could not read FormData body as text')
	} else {
	return Promise.resolve(this._bodyText)
	}
	}
	} else {
	this._initBody = function(body) {
	this._bodyInit = body
	if (typeof body === 'string') {
	this._bodyText = body
	} else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	this._bodyFormData = body
	} else if (!body) {
	this._bodyText = ''
	} else {
	throw new Error('unsupported BodyInit type')
	}
	}

	this.text = function() {
	var rejected = consumed(this)
	return rejected ? rejected : Promise.resolve(this._bodyText)
	}
	}

	if (support.formData) {
	this.formData = function() {
	return this.text().then(decode)
	}
	}

	this.json = function() {
	return this.text().then(JSON.parse)
	}

	return this
	}

	// HTTP methods whose capitalization should be normalized
	var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	function normalizeMethod(method) {
	var upcased = method.toUpperCase()
	return (methods.indexOf(upcased) > -1) ? upcased : method
	}

	function Request(url, options) {
	options = options || {}
	this.url = url

	this.credentials = options.credentials || 'omit'
	this.headers = new Headers(options.headers)
	this.method = normalizeMethod(options.method || 'GET')
	this.mode = options.mode || null
	this.referrer = null

	if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
	throw new TypeError('Body not allowed for GET or HEAD requests')
	}
	this._initBody(options.body)
	}

	function decode(body) {
	var form = new FormData()
	body.trim().split('&').forEach(function(bytes) {
	if (bytes) {
	var split = bytes.split('=')
	var name = split.shift().replace(/\+/g, ' ')
	var value = split.join('=').replace(/\+/g, ' ')
	form.append(decodeURIComponent(name), decodeURIComponent(value))
	}
	})
	return form
	}

	function headers(xhr) {
	var head = new Headers()
	var pairs = xhr.getAllResponseHeaders().trim().split('\n')
	pairs.forEach(function(header) {
	var split = header.trim().split(':')
	var key = split.shift().trim()
	var value = split.join(':').trim()
	head.append(key, value)
	})
	return head
	}

	Request.prototype.fetch = function() {
	var self = this

	return new Promise(function(resolve, reject) {
	var xhr = new XMLHttpRequest()
	if (self.credentials === 'cors') {
	xhr.withCredentials = true;
	}

	function responseURL() {
	if ('responseURL' in xhr) {
	return xhr.responseURL
	}

	// Avoid security warnings on getResponseHeader when not allowed by CORS
	if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	return xhr.getResponseHeader('X-Request-URL')
	}

	return;
	}

	xhr.onload = function() {
	var status = (xhr.status === 1223) ? 204 : xhr.status
	if (status < 100 || status > 599) {
	reject(new TypeError('Network request failed'))
	return
	}
	var options = {
	status: status,
	statusText: xhr.statusText,
	headers: headers(xhr),
	url: responseURL()
	}
	var body = 'response' in xhr ? xhr.response : xhr.responseText;
	resolve(new Response(body, options))
	}

	xhr.onerror = function() {
	reject(new TypeError('Network request failed'))
	}

	xhr.open(self.method, self.url, true)

	if ('responseType' in xhr && support.blob) {
	xhr.responseType = 'blob'
	}

	self.headers.forEach(function(name, values) {
	values.forEach(function(value) {
	xhr.setRequestHeader(name, value)
	})
	})

	xhr.send(typeof self._bodyInit === 'undefined' ? null : self._bodyInit)
	})
	}

	Body.call(Request.prototype)

	function Response(bodyInit, options) {
	if (!options) {
	options = {}
	}

	this._initBody(bodyInit)
	this.type = 'default'
	this.url = null
	this.status = options.status
	this.ok = this.status >= 200 && this.status < 300
	this.statusText = options.statusText
	this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	this.url = options.url || ''
	}

	Body.call(Response.prototype)

	self.Headers = Headers;
	self.Request = Request;
	self.Response = Response;

	self.fetch = function (url, options) {
	return new Request(url, options).fetch()
	}
	self.fetch.polyfill = true
})();
/**
 * @description	Initialise Brow object.
 * @type 			{Object}
 */
var Brow = window.Brow = {};

/**
 * @name				Brow.isEditMode
 * @description	Saves the current application state.
 * @public
 */
Brow.isEditMode = false;

/**
 * @name				Brow.activeCard
 * @description	Holds current state of an active card.
 * @public
 */
Brow.activeCard = null;

/**
 * @name				Brow.GUID
 * @description	Returns a Globally Unique Identifer as string
 * @public
 * @return			{String}
 */
Brow.GUID = (function () {
	'use strict';
	
	const s4 = function s4 () {
		return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16).substring(1);
	};

	return function() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
	};
})();
/**
 * @name				Brow.Data
 * @description	Stores all module related data like default content.
 * @param			{Object} Brow
 * @return			{Function} Header
 * @return			{Function} Content
 */
Brow.Data = (function (Brow) {
	'use strict';

	/* Constants */
	const _cardDefaultTitles = {
		'text': 'Save any content you want.',
		'todo': 'Task list'
	};

	const _cardDefaultContents = {
		'text': {
			'default': `Just click the edit button and enter any content you want.
							It's possible to remove all styles of your copied text using the "unstyle"-button.`
		}
	};

	/**
	 * @name				BrowDash.Data.Header
	 * @description	Returns the default title of each module
	 * @public
	 * @param			{String} type
	 */
	const _getDefaultHeader = function (type) {
		if (typeof type !== 'string') return;
		return _cardDefaultTitles[type];
	};

	/**
	 * @name				BrowDash.Data.Content
	 * @description	Returns the default content of each module
	 * @public
	 * @param			{String} type
	 */
	const _getDefaultContent = function (type) {
		if (typeof type !== 'string') return;
		return _cardDefaultContents[type];
	};	

	/* Public API */
	return {
		Header: _getDefaultHeader,
		Content: _getDefaultContent
	};
})(Brow);
/**
 * @name				Brow.Dialog
 * @description	Shows/hides the dialog. Sets new theme.
 * @todo  			Needs to be more modular. Should be able to load dynamic content.
 * @param			{Object} Brow
 * @return			{Function} addEvents
 */
Brow.Dialog = (function (Brow) {
	'use strict';

	/* Variables */
	var settingsBtn		= null;
	
	var dialogOverlay		= null;
	var dialogElem			= null;
	var dialogContainer	= null;
	var dialogTheme		= null;
	var dialogThemeList	= null;
	var dialogSidebar		= null;

	/**
	 *	@description	Opens the settings dialog
	 * @private
	 * @param			{Object} event
	 */
	const _showSettings = function (event) {
		event.preventDefault();
		
		let currentLocation = window.location.href.slice(0, -1);
		let dialogContent = this.getAttribute('data-dialog');
		let dialogContentPath = `${currentLocation}/markup/dialog-${dialogContent}.html`;

		_loadDialogContent(dialogContentPath);
		dialogElem.classList.add('show');
		dialogOverlay.classList.add('show');
	};

	/**
	 *	@description	Closes the settings dialog
	 * @private
	 * @param			{Object} event
	 */
	const _closeSettings = function (event) {
		let _curTarget			= event.target;
		let _curKeyCode		= event.keyCode;
		let _dialogIsShown	= dialogElem.classList.contains('show');
		let _isCloseBtn		= _curTarget.classList.contains('dialog__close');
		let _isOutsideDialog	= _curTarget === dialogElem && _dialogIsShown;
		let _isESCKey			= _curKeyCode === 27;

		if (_isCloseBtn || _isOutsideDialog || _isESCKey && _dialogIsShown) {
			dialogContainer.innerHTML = null;
			dialogElem.classList.remove('show');
			dialogOverlay.classList.remove('show');
		}
	};

	/**
	 *	@description	Loads the dialog content and appends it.
	 * @private
	 * @param			{String} path
	 */
	const _loadDialogContent = function (path) {
		fetch(path)
			.then(function (response) {
				return response.text();
			})
			.then(function (body) {
				dialogContainer.innerHTML = body;
			});
	};

	/**
	 * @description	Gets the color attribute of the clicked element and updates the theme.
	 * @private
	 * @param			{Object} event
	 */
	const _chooseTheme = function (event) {
		event.preventDefault();

		if (event.target.hasAttribute('data-settings-theme')) {
			let _themeColor = { theme: event.target.getAttribute('data-settings-theme') };
			localStorage[Brow.Settings.BROW_KEY] = JSON.stringify(_themeColor);
			Brow.Settings.setTheme(_themeColor);
		}
	};

	/**
	 * @name				Brow.Dialog.start
	 *	@description	Adds events
	 * @public
	 * @param			{HTMLElement} elem
	 */
	const addEvents = function () {
		settingsBtn			= Brow.Settings.getElem()['onClickDialog'];
		dialogElem			= Brow.Settings.getElem()['DIALOG'];
		dialogOverlay		= Brow.Settings.getElem()['DIALOG_OVERLAY'];
		dialogContainer	= dialogElem.querySelector('.dialog__inner');
		dialogSidebar		= dialogElem.querySelector('.dialog__sidebar__list');
		dialogTheme			= dialogElem.querySelector('.settings__theme');
		
		[].forEach.call(settingsBtn, function (btn) {
			btn.addEventListener('click', _showSettings);
		});
		dialogElem.addEventListener('click', _closeSettings);
		//dialogTheme.addEventListener('click', _chooseTheme);
		window.addEventListener('keydown', _closeSettings);
	};
	
	/* Public API */
	return {
		addEvents: addEvents
	};
})(Brow);
/**
 * @name				Brow.Settings
 * @description	Stores all necessary HTMLElements, sets the theme and 
 *              	runs all other modules.	
 * @param			{Object} Brow
 * @return			{Function} setTheme
 * @return			{Function} useElements
 * @return			{Function} getElem
 * @return			{Function} start
 * @return			{String} BROW_KEY
 */
Brow.Settings = (function (Brow) {
	'use strict';

	/* Constants */
	const BROW_KEY			= 'BROW_THEME';
	const BROW_CARDS		= 'BROW_CARDS';
	const DEFAULT_THEME	= 'blue-a400';

	/* Variables */
	var browElements = {
		onClickDialog : null,
		onClickNewCard : null,
		onClickSelectionList : null,
		SELECTION : null,
		CONTENT : null,
		CONTENT_OVERLAY : null,
		DIALOG : null,
		DIALOG_OVERLAY : null
	};
	var isSelectionState = false;

	/**
	 * @description	Adds event listener.
	 * @private
	 */
	const _addEvents = function () {
		browElements.onClickSelectionList.addEventListener('mouseover', _showCardList);
		browElements.CONTENT_OVERLAY.addEventListener('click', _checkCardMode);
		browElements.SELECTION.addEventListener('mouseout', _closeCardList);
		[].forEach.call(browElements.onClickNewCard, function (item) {
			item.addEventListener('click', _addNewCard);
		});
	};

	/**
	 * @description	Checks if custom theme settings are available.
	 * @private
	 * @return			{Object}
	 */
	const _isCustomTheme = function () {
		let CUSTOM = localStorage[BROW_KEY];
		return CUSTOM;
	};

	/**
	 * @description	Parses the custom settings from localStorage and sets classes.
	 * @private
	 * @param			{String} storage
	 */
	const _updateThemeFromStorage = function (storage) {
		storage = JSON.parse(localStorage[BROW_KEY]);
		document.body.className = '';
		document.body.classList.add('theme-'+ storage.theme);
	};

	/**
	 * @description	Adds the theme class to <body> from initial settings.
	 * @private
	 * @param			{String} theme
	 */
	const _updateThemeFromConfig = function (theme) {
		document.body.classList.add('theme-'+ theme);
	};

	/**
	 * @description	Checks localStorage and loads the users cards
	 * @public
	 * @param			{Object} storage
	 */
	const _validateBrowCards = function (storage) {
		if (!localStorage[BROW_CARDS] || localStorage.length <= 1) {
			let defaultCard = new BrowCard({ type: 'text' });
			browElements['CONTENT'].appendChild( defaultCard );
		} else {
			for (let i = localStorage.length; i--;) {
				_parseCardsFromStorage(i);
			}
		}
	};

	/**
	 * @description	Checks if custom key is set, if not: do it.
	 * @public
	 */
	const _checkIfCustomBrowCards = function () {
		if (!localStorage[BROW_CARDS]) {
			localStorage[BROW_CARDS] = true;
		}
	};

	/**
	 * @description	Gets localStorage, parses available cards and creates them.
	 * @private
	 * @param			{Number|String} index
	 */	
	const _parseCardsFromStorage = function (index) {
		let storageItem = JSON.parse( localStorage.getItem( localStorage.key(index) ) );
		if (storageItem['module']) {
			let browCard = new BrowCard({
				type: storageItem['type'],
				guid: storageItem['guid'],
				title: storageItem['title'],
				content: storageItem['content']
			});
			browElements['CONTENT'].appendChild( browCard );
		}
	};

	/**
	 * @description	Displays list of cards.
	 * @private
	 * @param			{Object} event
	 */
	const _showCardList = function (event) {
		event.preventDefault();
		browElements.SELECTION.removeEventListener(_closeCardList);

		if (!Brow.isEditMode) {
			isSelectionState = true;
			browElements['SELECTION'].classList.add('show');
		}
	};

	/**
	 * @description	Hides list of cards on mouseout.
	 * @private
	 * @param			{Object} event
	 */
	const _closeCardList = function (event) {
		let movedOut = event.toElement === document.documentElement;
		let selectionIsVisible = browElements['SELECTION'].classList.contains('show');

		browElements.onClickSelectionList.removeEventListener(_showCardList);

		if (movedOut && isSelectionState) {
			browElements['SELECTION'].classList.add('hide');
			setTimeout(function () {
				browElements['SELECTION'].classList.remove('show', 'hide');
			}, 300);
		}
	};

	/**
	 * @description	Checks clicked card type and appends it to the DOM.
	 * @private
	 * @param			{Object} event
	 */
	const _addNewCard = function (event) {
		event.preventDefault();
		let selectedCard = this.getAttribute('data-create-card');
		browElements['CONTENT'].appendChild( new BrowCard({ type: `${selectedCard}` }) );
	};

	/**
	 * @description	Saves state of active card.
	 * @private
	 * @param			{Object} event
	 */
	const _checkCardMode = function (event) {
		if (Brow.isEditMode && Brow.activeCard.isEditMode) {
			Brow.activeCard.saveState();
		}
	};

	/**
	 * @name				Brow.Settings.setTheme
	 *	@description	Updates the current theme.
	 * @public
	 * @param			{Object} theme
	 */
	const setTheme = function (theme) {
		if (!theme || typeof theme !== 'string') {
			theme = DEFAULT_THEME;
		}

		if (_isCustomTheme()) {
			_updateThemeFromStorage( _isCustomTheme() );
		} else {
			_updateThemeFromConfig( theme );
		}
	};

	/**
	 * @name				Brow.Settings.useElements
	 *	@description	Assigns app specific elements for further usage.
	 * @public
	 * @param			{Object} config
	 */
	const useElements = function (config) {
		if (!config || typeof config !== 'object') {
			throw new Error('No valid options passed!');
		}

		browElements = {
			onClickDialog : config.onClickDialog,
			onClickNewCard : config.onClickNewCard,
			onClickSelectionList : config.onClickSelectionList,
			SELECTION : config.SELECTION,
			CONTENT : config.CONTENT,
			CONTENT_OVERLAY : config.CONTENT_OVERLAY,
			DIALOG : config.DIALOG,
			DIALOG_OVERLAY : config.DIALOG_OVERLAY
		};
	};

	/**
	 * @name				Brow.Settings.getElem
	 *	@description	Returns the elements object
	 * @public
	 * @return			{Object}
	 */
	const getElem = function () {
		return browElements;
	};

	/**
	 * @name				Brow.Settings.start
	 *	@description	Calls all necessary modules which are required to run the app.
	 * @public
	 */
	const initialiseAndStartApp = function () {
		Brow.Dialog.addEvents();
		_addEvents();
		_validateBrowCards();
	};
	
	/* Public API */
	return {
		setTheme : setTheme,
		useElements : useElements,
		getElem : getElem,
		start : initialiseAndStartApp,
		checkCustom : _checkIfCustomBrowCards,
		BROW_KEY : BROW_KEY,
	};
})(Brow);
/**
 * @name				BrowTimer
 * @description	Class which appends a time string to an element 
 *              	and updates it every second.
 */
BrowTimer = (function() {
	'use strict';

	class BrowTimer {
		constructor (elem) {
			if (!(elem && elem.nodeName)) {
				throw new Error('You haven\'t passed a valid HTMLElement!');
			}

			this.update	= 1000;
			this.elem	= elem;
		}

		/**
		 * @name 			BrowTimer.getTime
		 * @description	Creates a string with current time in HH:MM:SS
		 * @return			{String}
		 */
		getTime () {
			let _date			= new Date();
			let _dateHours		= (_date.getHours() < 10) ? '0' + _date.getHours() : _date.getHours();
			let _dateMinutes	= (_date.getMinutes() < 10) ? '0' + _date.getMinutes() : _date.getMinutes();
			let _dateSeconds	= (_date.getSeconds() < 10) ? '0' + _date.getSeconds() : _date.getSeconds();

			return _dateHours +':'+ _dateMinutes +':'+ _dateSeconds;
		}

		/**
		 * @name				BrowTimer.run
		 * @description	Sets the element in which the time should be displayed.
		 * @param			{Element} elem
		 * @return 			{HTMLElement}
		 */
		run () {
			let _this = this;
			
			this.elem.textContent = this.getTime();
			setInterval(function () {
				_this.elem.textContent = _this.getTime();
			}, this.update);

			return this.elem;
		}
	}

	return BrowTimer;
})();
/**
 * @name				BrowCard
 * @description	/
 */
BrowCard = (function () {
	'use strict';

	class BrowCard {
		constructor (config) {
			if (!config) config = {};

			this.isEditMode	= false;
			this.type			= (config.type) ? config.type : 'text';
			this.guid			= (config.guid) ? config.guid : Brow.GUID();
			this.content		= (config.content) ? config.content : {};
			this.config			= { elem: null };
			this.storage		= { module: true, type: this.type, guid: this.guid, content: this.content };
			this.saveState		= this.saveCardChanges;
			this.wrapper		= null;

			return this.createCard();
		}

		/**
		 * @name				BrowCard.createCard
		 * @description	Creates a new card module
		 * @public
		 */
		createCard () {
			switch (this.type) {
				case 'text':
					this.wrapper = new TextCard( this );
					break;
				case 'weather':
					this.wrapper = new WeatherCard( this );
					break;
				default:
					this.wrapper = new TextCard( this );
					break;
			}

			this.wrapper.getContent.setAttribute('data-module-guid', this.guid);
			this.wrapper.getContent.setAttribute('data-module-type', this.type);
			this.addEvents( this.wrapper.getContent );

			return this.wrapper.getContent;
		}

		/**
		 * @description	Sets eventListener on current card element.
		 * @private
		 * @param			{Object} event
		 */
		addEvents (elem) {
			let self = this;

			elem.addEventListener('card-settings', function (event) {
				if (self.config.elem === null) {
					self.config.elem = event.target;
				}
			});
			elem.addEventListener('card-edit', function (event) {
				self.activateEditMode(event);
			});
			elem.addEventListener('card-save', function (event) {
				self.saveCardChanges(event);
			});
			elem.addEventListener('card-remove', function (event) {
				self.removeCard(event);
			});
		}

		/**
		 * @description	Shows the save button and makes editing possible.
		 * @private
		 * @param			{Object} event
		 */
		activateEditMode (event) {
			// config
			Brow.isEditMode = true;
			Brow.activeCard = this;
			this.isEditMode = true;
			this.wrapper.edit();

			// visual
			this.config.elem.classList.add('editmode');
			Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.add('show');
		}

		/**
		 * @description	Shows the edit button and saves the content to localStorage.
		 * @private
		 * @param			{Object} event
		 */
		saveCardChanges (event) {
			// config
			Brow.isEditMode = false;
			Brow.activeCard = null;
			this.isEditMode = false;
			this.wrapper.save();
			Brow.Settings.checkCustom();

			// visual
			this.config.elem.classList.remove('editmode');
			Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
		}

		/**
		 * @description	Removes a card from localStorage.
		 * @private
		 * @param			{Object} event
		 */
		removeCard (event) {
			let curCardGUI = this.config.elem.getAttribute('data-module-guid');
			let self = this;

			this.config.elem.classList.add('deletemode');
			this.config.elem.addEventListener('transitionend', function (event) {
				// Only listen to the last transition.
				if (event.propertyName === 'transform') {
					Brow.isEditMode = false;
					this.isEditMode = false;
					localStorage.removeItem(curCardGUI);
					Brow.Settings.getElem()['CONTENT'].removeChild( self.config.elem );
					Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
				}
			});
		}
	}

	return BrowCard;
})();
/**
 * @name				TextCard
 * @description	/
 */
TextCard = (function () {
	'use strict';

	class TextCard {
		constructor (card) {
			this.parent		= card;
			this.elem		= document.createElement('text-card');
			this.headline	= this.createHeadline();
			this.content	= this.previewContent();

			this.elem.appendChild( this.headline );
			this.elem.appendChild( this.content );
		}

		/**
		 * @description	Sets the preview content
		 * @public
		 * @return 			{HTMLElement}
		 */
		previewContent () {
			let textElem			= document.createElement('p');
			let defaultContent	= Brow.Data.Content('text')['default'];
			let storedContent		= this.parent.content.text;
			
			if (storedContent) {
				textElem.innerHTML = storedContent;
			}

			textElem.setAttribute('data-text-preview', defaultContent);
			return textElem;
		}

		/**
		 * @description	Creates the heading
		 * @private
		 * @return 			{HTMLElement}
		 */	
		createHeadline () {
			let headElem = document.createElement('h1');
			let cardHasTitle = this.parent.content.headline;
			headElem.innerHTML = (cardHasTitle) ? cardHasTitle : Brow.Data.Header('text');
			return headElem;
		}

		/**
		 * @description	Returns the entire module <text-card> element.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		get getContent () {
			return this.elem;
		}

		/**
		 * @description	Saves current content to localStorage.
		 * @public
		 */	
		updateStorage () {
			this.parent.storage['content'] = {
				text: this.content.innerHTML,
				headline: this.headline.innerHTML
			};
			localStorage[this.parent.guid] = JSON.stringify(this.parent.storage);
		}

		/**
		 * @description	Sets 'contenteditable="true"' to all elements.
		 * @public
		 */	
		edit () {
			this.content.setAttribute('contenteditable', true);
			this.headline.setAttribute('contenteditable', true);
		}

		/**
		 * @description	Removes attributes, updates Object and saves it to localStorage.
		 * @public
		 */	
		save () {
			this.content.removeAttribute('contenteditable');
			this.headline.removeAttribute('contenteditable');
			this.parent.content.headline = this.headline.innerHTML;
			this.updateStorage();
		}
	}

	return TextCard;
})();
/**
 * @name				WeatherCard
 * @description	/
 */
WeatherCard = (function () {
	'use strict';

	class WeatherCard {
		constructor (card) {
			this.parent			= card;
			this.elem			= document.createElement('weather-card');
			this.temperatur	= this.createTemperatur();
			this.content		= this.createContent();
			this.degrees		= { 'celsius' : '°C', 'fahrenheit' : '°F' };
			
			//this.coord		= { 'latitude': 0, 'longitude': 0, 'accuracy': 0 };
			// navigator.geolocation.getCurrentPosition(
			// 	this.geolocationSuccess,
			// 	this.geolocationError
			// );
			
			let self = this;
			
			this.elem.setAttribute('weather', 'cloudy');
			this.elem.appendChild( this.temperatur );
			this.content.forEach(function (elem) {
				self.elem.appendChild( elem );
			});
		}

		/**
		 * @description	Returns the entire module wrapper element.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		get getContent () {
			return this.elem;
		}

		createTemperatur () {
			let degrees = document.createElement('span');

			degrees.classList.add('weather__degrees');
			degrees.innerText = '11°C';

			return degrees;
		}

		geolocationSuccess (position) {
			this.coord['latitude'] = position.coords.latitude;
			this.coord['longitude'] = position.coords.longitude;
			this.coord['accuracy'] = position.coords.accuracy;

			console.log(this);
			console.log('Your current position is:');
			console.log('Latitude : ' + position.coords.latitude);
			console.log('Longitude: ' + position.coords.longitude);
			console.log('More or less ' + position.coords.accuracy + ' meters.');
		}

		createContent () {
			let city = document.createElement('h1');
			let location = document.createElement('h2');
			city.classList.add('weather__city');
			city.innerText = 'Berlin';
			location.classList.add('weather__place');
			location.innerText = 'Current location';

			return [city, location];
		}

		/**
		 * @description	Saves current content to localStorage.
		 * @public
		 */	
		updateStorage () {}

		edit () {}

		save () {}
	}

	return WeatherCard;
})();
(function (window) {
	'use strict';

	const TIMER		= new BrowTimer( document.querySelector('.trigger-timer') );
	const BROW		= Brow.Settings;
	const SETTINGS	= BROW.useElements({
		onClickDialog : document.querySelectorAll('.open-dialog'),
		onClickNewCard : document.querySelectorAll('.trigger-newcard'),
		onClickSelectionList : document.querySelector('.trigger-selection'),
		SELECTION : document.querySelector('.trigger-cardlist'),
		CONTENT : document.querySelector('.trigger-content'),
		CONTENT_OVERLAY : document.querySelector('.content__overlay'),
		DIALOG : document.querySelector('.trigger-dialog'),
		DIALOG_OVERLAY: document.querySelector('#brow__overlay')
	});

	TIMER.run();
	BROW.setTheme('blue-a400');
	BROW.start();

})(window);