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
	const BROW_SETTINGS	= 'BROW_SETTINGS';
	const DEFAULT_THEME	= 'blue-a400';

	/* Variables */
	var isSelectionState	= false;
	var browMasonry		= null;
	var browElements		= {
		onClickDialog : null,
		onClickNewCard : null,
		onClickSelectionList : null,
		SELECTION : null,
		CONTENT : null,
		CONTENT_OVERLAY : null,
		DIALOG : null,
		DIALOG_OVERLAY : null,
		TIMER : null
	};

	const _startMasonryLayout = function () {
		browMasonry = new BrowMasonry( browElements.CONTENT );
		console.log(browMasonry);
	};

	/**
	 * @description	Adds event listener.
	 * @private
	 */
	const _addEvents = function () {
		window.addEventListener('mouseup', _removeDragging);
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
	 * @private
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
	 * @private
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
			browCard.addEventListener('mousedown', _activateDragging);
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
		let selectionTopPosition	= browElements['SELECTION'].parentNode.getBoundingClientRect().top - 1;
		let selectionIsVisible		= browElements['SELECTION'].classList.contains('show');
		let movedOut					= event.clientY <= selectionTopPosition;

		if (movedOut && isSelectionState) {
			browElements.onClickSelectionList.removeEventListener(_showCardList);
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
		let selectedCard	= this.getAttribute('data-create-card');
		let browCard		= new BrowCard({ type: `${selectedCard}` });

		browElements['CONTENT'].appendChild( browCard );
		browCard.addEventListener('mousedown', _activateDragging);

		masonry.update();
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
	 *	@description	Validates the users timer settings.
	 * @private
	 */
	const _validateBrowTimer = function ()  {
		let timer = new BrowTimer(browElements['TIMER']);
		let dateSettings = { dateFormat : null, abbreviations : false };

		if (!localStorage[BROW_SETTINGS]) {
			dateSettings['dateFormat'] = '24h';
			timer.setDateFormat(dateSettings.dateFormat);
			localStorage.setItem(BROW_SETTINGS, JSON.stringify(dateSettings));
		}
		else {
			dateSettings = JSON.parse(localStorage[BROW_SETTINGS]);
			timer.setDateFormat(dateSettings.dateFormat, dateSettings.abbreviations);
		}

		timer.run();
	};

	/**
	 * @description	Calls this.dragCard when mouse is moving.
	 * @private
	 * @param			{Object} event
	 */
	const _activateDragging = function (event) {
		let isModule = event.target.classList.contains('brow__content__module');
		
		if (isModule) {
			event.preventDefault();
			window.addEventListener('mousemove', _dragCard);
		}
	};

	/**
	 * @description	Removes already called eventListener.
	 * @private
	 * @param			{Object} event
	 */
	const _removeDragging = function (event) {
		window.removeEventListener('mousemove', _dragCard);
	};

	/**
	 * @description	Moves the card element.
	 * @private
	 * @param			{Object} event
	 */
	const _dragCard = function (event) {
		console.log('jep');
		//let calcTopMovement	= event.pageY - (this.position.bottom / 2);
		//let calcLeftMovement	= event.pageX - (this.position.right / 2);
		//let translate = `translate(${calcLeftMovement}px, ${calcTopMovement}px)`;
			// visual
		//this.wrapper.getContent.classList.add('draggmode');
		//this.wrapper.getContent.style.transform = translate;
	};

	/**
	 * @description	Adds all dialog.
	 * @private
	 */
	const _initDialogs = function () {
		//Brow.Dialog.addEvents();
		let currentLocation = window.location.href.slice(0, -1);
		
		[].forEach.call(browElements['onClickDialog'], function (item) {
			let dialogContent = item.getAttribute('data-dialog');
			let browDialog = new BrowDialog({
				elem: item,
				content: `${currentLocation}/markup/dialog-${dialogContent}.html`
			});
		});
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
	 * @private
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
			DIALOG_OVERLAY : config.DIALOG_OVERLAY,
			TIMER : config.TIMER
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
		_initDialogs();
		_validateBrowTimer();
		_validateBrowCards();
		_startMasonryLayout();
		_addEvents();
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
 * @name				BrowDialog
 * @description	Shows/hides the dialog.
 * @param			{Object} Brow
 */
BrowDialog = (function (Brow) {
	'use strict';

	class BrowDialog {
		constructor (config) {
			this.elem				= config.elem;
			this.path				= config.content;
			this.dialogOverlay	= Brow.Settings.getElem()['DIALOG_OVERLAY'];
			this.dialogElem		= Brow.Settings.getElem()['DIALOG'];
			this.dialogContainer	= this.dialogElem.querySelector('.dialog__inner');
			this.dialogSidebar	= this.dialogElem.querySelector('.dialog__sidebar__list');
			this.dialogTheme		= this.dialogElem.querySelector('.settings__theme');
			
			this.addEvents();
		}

		/**
		 *	@description	Opens the settings dialog
		 * @private
		 * @param			{Object} event
		 */
		showSettings (event) {
			event.preventDefault();
			let _self = this;

			fetch(this.path)
				.then(function (response) {
					return response.text();
				})
				.then(function (body) {
					_self.dialogContainer.innerHTML = body;
				});

			this.dialogElem.classList.add('show');
			this.dialogOverlay.classList.add('show');
		}

		/**
		 *	@description	Closes the settings dialog
		 * @private
		 * @param			{Object} event
		 */
		closeSettings (event) {
			let _curTarget			= event.target;
			let _curKeyCode		= event.keyCode;
			let _dialogIsShown	= this.dialogElem.classList.contains('show');
			let _isCloseBtn		= _curTarget.classList.contains('dialog__close');
			let _isOutsideDialog	= _curTarget === this.dialogElem && _dialogIsShown;
			let _isESCKey			= _curKeyCode === 27;

			if (_isCloseBtn || _isOutsideDialog || _isESCKey && _dialogIsShown) {
				this.dialogContainer.innerHTML = null;
				this.dialogElem.classList.remove('show');
				this.dialogOverlay.classList.remove('show');
			}
		}

		/**
		 * @description	Gets the color attribute of the clicked element and updates the theme.
		 * @private
		 * @param			{Object} event
		 */
		chooseTheme (event) {
			event.preventDefault();

			if (event.target.hasAttribute('data-settings-theme')) {
				let _themeColor = { theme: event.target.getAttribute('data-settings-theme') };
				localStorage[Brow.Settings.BROW_KEY] = JSON.stringify(_themeColor);
				Brow.Settings.setTheme(_themeColor);
			}
		}

		/**
		 * @name				Brow.Dialog.start
		 *	@description	Adds events
		 * @private
		 */
		addEvents () {
			this.elem.addEventListener('click', this.showSettings.bind(this) );
			this.dialogElem.addEventListener('click', this.closeSettings.bind(this) );
			window.addEventListener('keydown', this.closeSettings.bind(this) );
		}
	}

	return BrowDialog;
})(Brow);
BrowMasonry = (function (window, Brow) {
	'use strict';

	class BrowMasonry {
		constructor (container) {
			this.container	= container;
			this.items		= null;
			this.grid		= [];
			this.rowCount	= 3;
			
			this.update();
		}

		update () {
			this.items = this.container.querySelectorAll('.brow__content__module');
			this.grid = [];

			for (let i = 0; i < this.items.length; i += this.rowCount) {
				let itemsRow = [];

				if (!!this.items[i]) itemsRow.push(this.items[i].getAttribute('data-module-guid'));
				if (!!this.items[i + 1]) itemsRow.push(this.items[i + 1].getAttribute('data-module-guid'));
				if (!!this.items[i + 2]) itemsRow.push(this.items[i + 2].getAttribute('data-module-guid'));

				this.grid.push( itemsRow );
			}

			this.organiseDashboard();
		}

		organiseDashboard () {
			//console.log(this);
			for (let col = 0; col < this.grid.length; col++) {
				for (let row = 0; row < this.grid[col].length; row++) {
					let item = document.querySelector(`[data-module-guid="${this.grid[col][row]}"]`);
					
					if (col !== 0)  {
						let itemAbove = document.querySelector(`[data-module-guid="${this.grid[col - 1][row]}"]`);
						if (!!itemAbove) {
							item.style.top = `${itemAbove.getBoundingClientRect().bottom - 35}px`;
						}
					}

					item.setAttribute('data-module-column', `${row + 1}`);
				}
			}
		}
	}

	return BrowMasonry;
})(window, Brow);
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
			this.format = '24h';
			this.abbreviations = false;
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
		 *	@description	Needs to be written.
		 * @param			{String} format
		 */
		setDateFormat (format) {
			if (typeof format !== 'string') {
				return;
			}

			this.format = format;
		}

		/**
		 * @name				BrowTimer.run
		 * @description	Sets the element in which the time should be displayed.
		 * @param			{Element} elem
		 * @return 			{HTMLElement}
		 */
		run () {
			let self = this;
			
			this.elem.textContent = this.getTime();
			setInterval(function () {
				self.elem.textContent = self.getTime();
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
BrowCard = (function (Brow) {
	'use strict';

	class BrowCard {
		constructor (config) {
			if (!config) config = {};
			
			this.isEditMode	= false;
			this.type			= (config.type) ? config.type : 'text';
			this.guid			= (config.guid) ? config.guid : Brow.GUID();
			this.content		= (config.content) ? config.content : {};
			this.config			= { elem: null };
			this.saveState		= this.saveCardChanges;
			this.wrapper		= null;
			this.storage		= { 
				module: true, 
				type: this.type, 
				guid: this.guid, 
				content: this.content,
				style: { width: 1, sticky: false }
			};

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

			this.applyCardData();
			this.addEvents( this.wrapper.getContent );

			return this.wrapper.getContent;
		}

		/**
		 * @description	Applies classes and data-attributes to DOM element.
		 * @private
		 */
		applyCardData () {
			this.wrapper.getContent.classList.add('brow__content__module');
			this.wrapper.getContent.setAttribute('data-module-width', this.storage.style.width);
			this.wrapper.getContent.setAttribute('data-module-guid', this.guid);
			this.wrapper.getContent.setAttribute('data-module-type', this.type);
		}

		/**
		 * @description	Sets eventListener on current card element.
		 * @private
		 * @param			{Object} event
		 */
		addEvents (elem) {
			elem.addEventListener('card-settings', this.setCardEvents.bind(this) );
			elem.addEventListener('card-edit', this.activateEditMode.bind(this) );
			elem.addEventListener('card-save', this.saveCardChanges.bind(this) );
			elem.addEventListener('card-remove', this.removeCard.bind(this) );
		}

		/**
		 * @description	Stores event target into class.
		 * @private
		 * @param			{Object} event
		 */
		setCardEvents (event) {
			if (this.config.elem === null) {
				this.config.elem = event.target;
			}
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
})(Brow);
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
			this.parent		= card;
			this.elem		= document.createElement('weather-card');
			this.coord		= { 'latitude': 0, 'longitude': 0, 'accuracy': 0 };
			this.city		= null;
			this.degrees	= null;
			this.weather	= 'cloudy';

			this.elem.setAttribute('loading', '');
			this.elem.setAttribute('weather', `${this.weather}`);
			this.elem.setAttribute('time', 'day');
			this.getGeolocation();
		}

		/**
		 * @description	Returns the entire module wrapper element.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		get getContent () {
			return this.elem;
		}

		/**
		 * @description	Returns an element containing current degrees.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		createTemperatur (degrees) {
			let degreeElem = document.createElement('span');
			degreeElem.classList.add('weather__degrees');
			degreeElem.innerText = `${degrees}°C`;

			return degreeElem;
		}

		createContent () {
			let city = document.createElement('h1');
			let location = document.createElement('h2');
			let temperatur = this.createTemperatur(this.degrees);
			// City
			city.classList.add('weather__city');
			city.innerText = this.city;
			// Location
			location.classList.add('weather__place');
			location.innerText = 'Current location';

			this.elem.appendChild( temperatur );
			this.elem.appendChild( city );
			this.elem.appendChild( location );
			this.elem.removeAttribute('loading');
		}

		/**
		 * @description	Gets current geolocation and saves the values.
		 * @private
		 * @todo 			Add error callback.
		 */	
		getGeolocation () {
			let self = this;
			navigator.geolocation.getCurrentPosition(
				// Success
				function (position) {
					self.coord['latitude']	= position.coords.latitude;
					self.coord['longitude']	= position.coords.longitude;
					self.coord['accuracy']	= position.coords.accuracy;
					self.getWeatherFromAPI();
				},
				// Error
				function (error) {
					console.log(error);
				}
			);
		}

		/**
		 * @description	Uses OpenWeatherMap.org to fetch the weather data.
		 * @private
		 */	
		getWeatherFromAPI () {
			let weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${this.coord.latitude}&lon=${this.coord.longitude}`;
			let self = this;

			fetch(weatherURL)
			.then(function (response) { return response.text(); })
			.then(function (response) {
				let weatherResponse = JSON.parse(response);
				console.log(weatherResponse);
				// Set values
				self.city = weatherResponse.name;
				self.kelvinCalculator( weatherResponse.main.temp );
				self.validateWeather( weatherResponse.weather[0].main );
				// Create content
				self.createContent();
			});
		}

		kelvinCalculator (temp) {
			let absZeroTempInC	= 273.15; // -273.15 °C
			let absZeroTempInF	= 459.67; // -459.67 °F
			let calcCelcius		= Math.floor(temp - absZeroTempInC);
			this.degrees = calcCelcius;
		}

		validateWeather (weather) {
			weather = weather.toString().toLowerCase();
			this.weather = weather;

			switch (weather) {
				case 'clear':
					this.elem.setAttribute('weather', `${this.weather}`);
					break;
			}
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

	const BROW		= Brow.Settings;
	const SETTINGS	= BROW.useElements({
		onClickDialog : document.querySelectorAll('.open-dialog'),
		onClickNewCard : document.querySelectorAll('.trigger-newcard'),
		onClickSelectionList : document.querySelector('.trigger-selection'),
		SELECTION : document.querySelector('.trigger-cardlist'),
		CONTENT : document.querySelector('.trigger-content'),
		CONTENT_OVERLAY : document.querySelector('.content__overlay'),
		DIALOG : document.querySelector('.trigger-dialog'),
		DIALOG_OVERLAY: document.querySelector('#brow__overlay'),
		TIMER: document.querySelector('.trigger-timer')
	});

	BROW.setTheme('blue-a400');
	BROW.start();

})(window);