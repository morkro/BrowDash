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
 * @description	/
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
		'basic': 'Store all the things!',
		'todo': 'Task list',
		'weather': 'Weather'
	};

	const _cardDefaultContents = {
		'basic': {
			'default': 'What do you want to save?'
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
 * @name				BrowTimer
 * @description	Class which appends a time string to an element 
 *              	and updates it every second.
 */
BrowTimer = (function() {
	'use strict';

	function BrowTimer (elem) {
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
	BrowTimer.prototype.getTime = function () {
		let _date			= new Date();
		let _dateHours		= (_date.getHours() < 10) ? '0' + _date.getHours() : _date.getHours();
		let _dateMinutes	= (_date.getMinutes() < 10) ? '0' + _date.getMinutes() : _date.getMinutes();
		let _dateSeconds	= (_date.getSeconds() < 10) ? '0' + _date.getSeconds() : _date.getSeconds();

		return _dateHours +':'+ _dateMinutes +':'+ _dateSeconds;
	};

	/**
	 * @name				BrowTimer.run
	 * @description	Sets the element in which the time should be displayed.
	 * @param			{Element} elem
	 * @return 			{HTMLElement}
	 */
	BrowTimer.prototype.run = function () {
		let _this = this;
		
		this.elem.textContent = this.getTime();
		setInterval(function () {
			_this.elem.textContent = _this.getTime();
		}, this.update);

		return this.elem;
	};

	return BrowTimer;
})();

/* ACTIVATE WHEN CHROME 42 IS AVAILABLE */
// class BrowTimer {
// 	constructor (elem) {
// 		if (!(elem && elem.nodeName)) {
// 			throw new Error('You haven\'t passed a valid HTMLElement!');
// 		}

// 		this.elem = elem;
// 		this.update = 1000;
// 	}

// 	/**
// 	 * @name 			BrowTimer.getTime
// 	 * @description	Creates a string with current time in HH:MM:SS
// 	 * @public
// 	 * @return			{String}
// 	 */
// 	getTime() {
// 		const _date			= new Date();
// 		let _dateHours		= (_date.getHours() < 10) ? '0' + _date.getHours() : _date.getHours();
// 		let _dateMinutes	= (_date.getMinutes() < 10) ? '0' + _date.getMinutes() : _date.getMinutes();
// 		let _dateSeconds	= (_date.getSeconds() < 10) ? '0' + _date.getSeconds() : _date.getSeconds();

// 		return _dateHours +':'+ _dateMinutes +':'+ _dateSeconds;
// 	}

// 	/**
// 	 * @name				BrowTimer.run
// 	 * @description	Sets the element in which the time should be displayed.
// 	 * @public
// 	 * @param			{Element} elem
// 	 */
// 	run() {
// 		this.elem.textContent = this.getTime();
// 		setInterval(function () {
// 			this.elem.textContent = this.getTime();
// 		}, this.update);
// 	}
// }
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
		
		let dialogContent = this.getAttribute('data-dialog');
		let dialogContentPath = `/views/dialog-${dialogContent}.html`;

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
 * @name				BrowCard
 * @description	/
 */
BrowCard = (function () {
	'use strict';

	function BrowCard (config) {
		if (!config) config = {};

		this.isEditMode	= false;
		this.type			= (config.type) ? config.type : 'basic';
		this.title			= (config.title) ? config.title : Brow.Data.Header(config.type);
		this.guid			= (config.guid) ? config.guid : Brow.GUID();
		this.content		= (config.content) ? config.content : {};
		this.config			= { edit: null, save: null, remove: null, elem: null };
		this.storage		= { module: true, type: this.type, title: this.title, guid: this.guid, content: this.content };
		this.headline		= this.createHeadline( this.title );
		this.body			= this.createContent();
		this.saveState		= this.saveCardChanges;
		//console.log(this);

		return this.createCard();
	}

	/**
	 * @name				BrowCard.createCard
	 * @description	Creates a new card module
	 * @public
	 */
	BrowCard.prototype.createCard = function () {
		let baseElem = document.createElement('card-base');
		let self = this;

		baseElem.setAttribute('data-module-guid', this.guid);
		baseElem.setAttribute('data-module-type', this.type);
		baseElem.appendChild( this.headline );
		baseElem.appendChild( this.body.getContent() );
		this.addEvents(baseElem);

		return baseElem;
	};

	/**
	 * @description	Creates the heading
	 * @private
	 * @param			{String} title
	 */	
	BrowCard.prototype.createHeadline = function (title) {
		let headElem = document.createElement('h1');
		headElem.innerHTML = title;
		return headElem;
	};

	/**
	 * @description	Creates content and calls new classes based on the type.
	 * @private
	 * @param			{String} type
	 * @return 			{HTMLElement}
	 */	
	BrowCard.prototype.createContent = function () {
		var cardContent = null;
	
		switch (this.type) {
			case 'basic':
				cardContent = new BrowCardBasic( this );
				break;
			case 'weather':
				cardContent = new BrowCardWeather( this );
				break;
			case 'notification':
				cardContent = new BrowCardNotify( this );
				break;
			case 'todo':
				cardContent = new BrowCardToDo( this );
				break;
			default:
				cardContent = new BrowCardBasic( this );
				break;
		}

		return cardContent;
	};

	/**
	 * @description	Sets eventListener on current card element.
	 * @private
	 * @param			{Object} event
	 */
	BrowCard.prototype.addEvents = function (elem) {
		let self = this;

		elem.addEventListener('btn-settings', function (event) {
			if (self.config.elem === null) {
				self.config.elem = event.target;
				self.config.edit = event.target.edit;
				self.config.save = event.target.save;
				self.config.remove = event.target.remove;
			}
		});

		elem.addEventListener('btn-edit', function (event) {
			self.activateEditMode(event);
		});

		elem.addEventListener('btn-save', function (event) {
			self.saveCardChanges(event);
		});

		elem.addEventListener('btn-remove', function (event) {
			self.removeCard(event);
		});
	};

	/**
	 * @description	Shows the save button and makes editing possible.
	 * @private
	 * @param			{Object} event
	 */
	BrowCard.prototype.activateEditMode = function (event) {
		// config
		Brow.isEditMode = true;
		Brow.activeCard = this;
		this.isEditMode = true;
		this.body.edit();

		// visual
		this.config.elem.classList.add('editmode');
		this.config.edit.parentNode.classList.add('hidden');
		this.config.save.parentNode.classList.remove('hidden');
		Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.add('show');
	};

	/**
	 * @description	Shows the edit button and saves the content to localStorage.
	 * @private
	 * @param			{Object} event
	 */
	BrowCard.prototype.saveCardChanges = function (event) {
		// config
		Brow.isEditMode = false;
		Brow.activeCard = null;
		this.isEditMode = false;
		this.body.save();
		Brow.Settings.checkCustom();

		// visual
		this.config.elem.classList.remove('editmode');
		this.config.edit.parentNode.classList.remove('hidden');
		this.config.save.parentNode.classList.add('hidden');
		Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
	};

	/**
	 * @description	Removes a card from localStorage.
	 * @private
	 * @param			{Object} event
	 */
	BrowCard.prototype.removeCard = function (event) {
		let curCardGUI = this.config.elem.getAttribute('data-module-guid');

		Brow.isEditMode = false;
		this.isEditMode = false;

		localStorage.removeItem(curCardGUI);
		Brow.Settings.getElem()['CONTENT'].removeChild( this.config.elem );
		Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
	};

	return BrowCard;
})();
/**
 * @name				BrowCardBasic
 * @description	/
 */
BrowCardBasic = (function () {
	'use strict';

	function BrowCardBasic (card) {
		this.parent		= card;
		this.content	= document.createElement('p');
		this.wrapper	= document.createElement('div');

		this.wrapper.classList.add('content__basic');
		this.wrapper.appendChild( this.previewContent() );
	}

	/**
	 * @description	Sets the preview content
	 * @public
	 * @return 			{HTMLElement}
	 */	
	BrowCardBasic.prototype.previewContent = function () {
		let defaultContent	= Brow.Data.Content('basic')['default'];
		let storedContent		= this.parent.content.text;
		
		if (storedContent) this.content.innerHTML = storedContent;
		this.content.setAttribute('data-basic-preview', defaultContent);

		return this.content;
	};

	/**
	 * @description	Returns the entire module wrapper element.
	 * @public
	 * @return 			{HTMLElement}
	 */	
	BrowCardBasic.prototype.getContent = function () {
		return this.wrapper;
	};

	BrowCardBasic.prototype.updateStorage = function () {
		this.parent.storage['title'] = this.parent.headline.innerHTML;
		this.parent.storage['content'] = {
			text: this.content.innerHTML
		};
		localStorage[this.parent.guid] = JSON.stringify(this.parent.storage);
	};

	/**
	 * @description	Sets 'contenteditable="true"' to all elements.
	 * @public
	 * @return 			{HTMLElement}
	 */	
	BrowCardBasic.prototype.edit = function () {
		this.content.setAttribute('contenteditable', true);
		this.parent.headline.setAttribute('contenteditable', true);
	};

	/**
	 * @description	Removes attributes, updates Object and saves it to localStorage.
	 * @public
	 * @return 			{HTMLElement}
	 */	
	BrowCardBasic.prototype.save = function () {
		this.content.removeAttribute('contenteditable');
		this.parent.headline.removeAttribute('contenteditable');
		this.parent.title = this.parent.headline.textContent;
		this.updateStorage();
	};

	return BrowCardBasic;
})();
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
		CONTENT : null,
		CONTENT_OVERLAY : null,
		DIALOG : null,
		DIALOG_OVERLAY : null
	};

	/**
	 * @description	Adds event listener.
	 * @private
	 */
	const _addEvents = function () {
		browElements.onClickNewCard.addEventListener('click', _createNewCard);
		browElements.CONTENT_OVERLAY.addEventListener('click', _checkCardMode);
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
		if (!localStorage[BROW_CARDS]) {
			let defaultCard = new BrowCard({ type: 'basic' });
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
	 * @description	Creates a new card module.
	 * @private
	 * @param			{Object} event
	 */
	const _createNewCard = function (event) {
		event.preventDefault();
		if (!Brow.isEditMode) {
			let defaultCard = new BrowCard({ type: 'basic' });
			browElements['CONTENT'].appendChild( defaultCard );
		}
	};

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
(function (window) {
	'use strict';

	const TIMER		= new BrowTimer( document.querySelector('.trigger-timer') );
	const BROW		= Brow.Settings;
	const SETTINGS	= BROW.useElements({
		onClickDialog : document.querySelectorAll('.open-dialog'),
		onClickNewCard : document.querySelector('.trigger-newcard'),
		CONTENT : document.querySelector('.trigger-content'),
		CONTENT_OVERLAY : document.querySelector('.content__overlay'),
		DIALOG : document.querySelector('.trigger-dialog'),
		DIALOG_OVERLAY: document.querySelector('#brow__overlay')
	});

	TIMER.run();
	BROW.setTheme('blue-a400');
	BROW.start();

})(window);