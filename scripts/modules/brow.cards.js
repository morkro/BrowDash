/**
 * @name				Brow.Cards
 * @description	Is responsible for general card management like creating new cards,
 *                applying events, deleting/editing and saving them, saving/parsing content.
 * @param			{Object} Brow
 * @return			{Function} Initialise
 * @return			{Function} Options
 * @return			{Function} Create
 */
Brow.Cards = (function (Brow) {
	'use strict';

	/* Constants */
	const MAIN		= document.querySelector('#brow__content');
	const OVERLAY	= MAIN.querySelector('.content__overlay');

	/* Variables */
	var browCustom			= false;
	var browCardCount		= 0;

	var browCardElem		= null;
	var browCardSettings	= null;
	var browCardEdit		= null;
	var browCardSave		= null;
	var browCardRemove	= null;
	var browCustomKey		= null;
	
	var appContent			= null; 
	var createButton		= null;
	var isEditMode			= false;

	/**
	 * @name				Brow.Cards.Options
	 * @description	Sets all elements to variables.
	 * @public
	 * @param			{Object} options
	 */
	const _setOptions = function (options) {
		appContent = options.appendCards;
		createButton = options.createCards;

		/* Add events */
		createButton.addEventListener('click', _addNewCard);
		//MAIN.addEventListener('keyup', _saveCardsToStorage);
		document.documentElement.addEventListener('click', _closeCardSettings);

		return this;
	};

	/**
	 * @name				Brow.Cards.Init
	 * @description	Checks localStorage and loads the users cards
	 * @public
	 * @param			{Object} storage
	 */
	const _initialiseCards = function (storage) {
		browCustomKey = storage;
		if (!localStorage[browCustomKey]) {
			_createCard({ type: 'basic' });
		} else {
			_parseCardsFromStorage();
		}
	};

	/**
	 * Removes style attribute on settings container
	 * @private
	 * @param  {Object} event
	 */
	const _closeCardSettings = function (event) {
		var settingsAreVisible	= null;
		var targetIsNotBtn		= null;

		if (browCardSettings) {
			settingsAreVisible	= browCardSettings.style.display === 'block';
			targetIsNotBtn			= event.target !== browCardElem;
			if (targetIsNotBtn && settingsAreVisible) {
				browCardSettings.style.display = null;
			}
		}
	};

	/**
	 * Removes all previous stored card settings
	 * @private
	 */
	const _removePrevCardSettings = function () {
		if (browCardElem !== null) {
			browCardElem		= null;
			browCardSettings.style.display = null;
			browCardSettings	= null;
			browCardEdit		= null;
			browCardSave		= null;
			browCardRemove		= null;
		}
	};

	/**
	 * Sets eventListener on current card element.
	 * @param {Object} event
	 */
	const _setCardEvents = function (event) {
		// If previous settings aren't closed yet.
		_removePrevCardSettings();

		browCardSettings	= event.target.settings;
		browCardEdit		= event.target.edit;
		browCardSave		= event.target.save;
		browCardRemove		= event.target.remove;
		browCardElem		= event.target;

		browCardEdit.addEventListener('click', _activateCardEditMode);
		browCardSave.addEventListener('click', _saveCardChanges);
		browCardRemove.addEventListener('click', _removeCard);
		browCardSettings.style.display = 'block';
	};

	/**
	 * Shows the save button and makes editing possible.
	 * @param  {Object} event
	 */
	const _activateCardEditMode = function (event) {
		var _curCardType = browCardElem.getAttribute('data-module-type');

		isEditMode = true;
		browCardElem.classList.add('editmode');
		OVERLAY.classList.add('show');
		browCardEdit.parentNode.classList.add('hidden');
		browCardSave.parentNode.classList.remove('hidden');
		browCardSettings.style.display = null;
		createButton.classList.add('editmode');

		Brow.Module.Edit( _curCardType );
	};

	/**
	 * Shows the edit button and saves the content to localStorage.
	 * @param  {Object} event
	 */
	const _saveCardChanges = function (event) {
		isEditMode = false;
		browCardElem.classList.remove('editmode');
		OVERLAY.classList.remove('show');
		browCardEdit.parentNode.classList.remove('hidden');
		browCardSave.parentNode.classList.add('hidden');
		browCardSettings.style.display = null;
		createButton.classList.remove('editmode');
	};

	/**
	 * Removes a card from localStorage.
	 * @param  {Object} event
	 */
	const _removeCard = function (event) {
		event.preventDefault();
		var _curCardGUI = browCardElem.getAttribute('data-module-guid');
		var _isCreateBtnInEditMode = createButton.classList.contains('editmode');
		// Remove item
		if (_isCreateBtnInEditMode || isEditMode) {
			createButton.classList.remove('editmode');
		}
		isEditMode = false;
		OVERLAY.classList.remove('show');
		localStorage.removeItem(_curCardGUI);
		MAIN.removeChild(browCardElem);
	};

	/**
	 * @description	Gets localStorage list, parses and creates cards.
	 * @private
	 */
	const _parseCardsFromStorage = function () {
		var storageItem = null, i;
		var loopStorage = function loopStorage (index) {
			storageItem = JSON.parse( localStorage.getItem( localStorage.key(index) ) );
			if (storageItem['module']) {
				_createCard({
					type: storageItem['type'],
					title: storageItem['title'],
					guid: storageItem['guid'],
					content: storageItem['content']
				});
			}	
		};

		for (i = localStorage.length; i--;) {
			loopStorage(i);
		}
	};

	/**
	 * @description	Creates a JSON objet of the card elements content
	 *						and saves in localStorage.
	 * @private
	 * @param			{Event} event
	 */
	const _saveCardsToStorage = function (event) {
		var _module = event.target.parentElement;
		var _moduleGUID = _module.getAttribute('data-module-guid');
		var _moduleType = _module.getAttribute('data-module-type');
		var _moduleSettings = {
			module: true,
			guid: _moduleGUID,
			type: _moduleType,
			title: event.target.textContent,
			content: null
		};

		// Set custom dependency to localStorage
		_setCustomBool();
		if (_module.nodeName === 'CARD-BASE') {
			localStorage[_moduleGUID] = JSON.stringify(_moduleSettings);
		}
	};

	/**
	 * @description	Gives variables a boolean :)
	 * @private
	 */
	const _setCustomBool = function () {
		if (!browCustom) {
			browCustom = true;
			localStorage[browCustomKey] = true;
		}
	};

	/**
	 * @name				Brow.Cards.Create
	 * @description	Creates a new card module
	 * @public
	 * @param			{Object} config
	 */
	const _createCard = function (config) {
		var _cardType	= (config.type) ? config.type : 'basic';
		var _cardTitle	= (config.title) ? config.title : Brow.Data.Header(config.type);
		var _cardCount	= (config.count) ? config.count : 1;
		var _cardGUID	= (config.guid) ? config.guid : Brow.GUID();
		var _cardWrapper, i;

		for (i = _cardCount; i--;) {
			// Create basic element
			_cardWrapper = document.createElement('card-base');
			_cardWrapper.setAttribute('data-module-guid', _cardGUID);
			_cardWrapper.setAttribute('data-module-type', _cardType);
			// Apply header
			_cardWrapper.appendChild( _createCardHeadline( _cardTitle ) );
			// Apply card content
			_cardWrapper.appendChild( _createCardContent( _cardType ) );
			// Apply to page
			appContent.appendChild(_cardWrapper);
			// Apply event listener
			_cardWrapper.addEventListener('btn-settings', _setCardEvents);
		}
	};

	/**
	 * @description	Creates the heading for new cards
	 * @private
	 * @param			{String} title
	 */	
	const _createCardHeadline = function (title) {
		var _cHeadElem = document.createElement('h1');
		if (typeof title !== 'string') title.toString();
		_cHeadElem.textContent = title;
		return _cHeadElem;
	};

	const _createCardContent = function (type) {
		var container = document.createElement('div');
		container.classList.add('content__' + type);

		switch (type) {
			case 'basic':
				container.appendChild( Brow.Module.Basic() );
				break;
			default:
				container.appendChild( Brow.Module.Basic() );
				break;
		}

		return container;
	};

	/**
	 * @description	On click button, adds a card element
	 * @private
	 */
	const _addNewCard = function (event) {
		event.preventDefault();	
		if (!isEditMode) {
			_createCard({
				type: 'basic'
			});
			createButton.removeEventListener('click', _addNewCard, true);
		}
	};

	/* Public API */
	return {
		Initialise: _initialiseCards,
		Options: _setOptions,
		Create: _createCard
	};
})(Brow);