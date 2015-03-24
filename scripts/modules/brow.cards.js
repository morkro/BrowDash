/**
 * @name				BrowDash.Cards
 * @description	Is responsible for general card management like creating new cards,
 *                applying events, deleting/editing and saving them, saving/parsing content.
 * @param			{Object} BrowDash
 * @return			{Function} Initialise
 * @return			{Function} Options
 * @return			{Function} Create
 */
BrowDash.Cards = (function (BrowDash) {
	'use strict';

	/* Constants */
	const MAIN		= document.querySelector('#brow__content');
	const OVERLAY	= MAIN.querySelector('.content__overlay');

	/* Variables */
	var BrowDashCustom			= false;
	var BrowDashCardCount		= 0;
	
	var BrowDashCardElem			= null;
	var BrowDashCardSettings	= null;
	var BrowDashCardEdit			= null;
	var BrowDashCardSave			= null;
	var BrowDashCardRemove		= null;
	var BrowDashCustomKey		= null;
	
	var appContent					= null; 
	var createButton				= null;
	var isEditMode					= false;

	/**
	 * @name				BrowDash.Cards.Options
	 * @description	Sets all elements to variables.
	 * @public
	 * @param			{Object} options
	 */
	const _setOptions = function (options) {
		appContent		= options.appendCards;
		createButton	= options.createCards;

		/* Add events */
		createButton.addEventListener('click', _addNewCard);
		//MAIN.addEventListener('keyup', _saveCardsToStorage);
		document.documentElement.addEventListener('click', _closeCardSettings);
	};

	/**
	 * @name				BrowDash.Cards.Initialise
	 * @description	Checks localStorage and loads the users cards
	 * @public
	 * @param			{Object} storage
	 */
	const _initialiseCards = function (storage) {
		BrowDashCustomKey = storage;
		if (!localStorage[BrowDashCustomKey]) {
			_createCard({ type: 'basic' });
		} else {
			_parseCardsFromStorage();
		}
	};

	/**
	 * @description	Removes style attribute on settings container
	 * @private
	 * @param  {Object} event
	 */
	const _closeCardSettings = function (event) {
		let settingsAreVisible	= null;
		let targetIsNotBtn		= null;

		if (BrowDashCardSettings) {
			settingsAreVisible	= BrowDashCardSettings.style.display === 'block';
			targetIsNotBtn			= event.target !== BrowDashCardElem;
			if (targetIsNotBtn && settingsAreVisible) {
				BrowDashCardSettings.style.display = null;
			}
		}
	};

	/**
	 * @description	Removes all previous stored card settings
	 * @private
	 */
	const _removePrevCardSettings = function () {
		if (BrowDashCardElem !== null) {
			BrowDashCardElem		= null;
			BrowDashCardSettings.style.display = null;
			BrowDashCardSettings	= null;
			BrowDashCardEdit		= null;
			BrowDashCardSave		= null;
			BrowDashCardRemove	= null;
		}
	};

	/**
	 * @description	Sets eventListener on current card element.
	 * @private
	 * @param {Object} event
	 */
	const _setCardEvents = function (event) {
		// If previous settings aren't closed yet.
		_removePrevCardSettings();

		BrowDashCardSettings	= event.target.settings;
		BrowDashCardEdit		= event.target.edit;
		BrowDashCardSave		= event.target.save;
		BrowDashCardRemove	= event.target.remove;
		BrowDashCardElem		= event.target;

		BrowDashCardEdit.addEventListener('click', _activateCardEditMode);
		BrowDashCardSave.addEventListener('click', _saveCardChanges);
		BrowDashCardRemove.addEventListener('click', _removeCard);
		BrowDashCardSettings.style.display = 'block';
	};

	/**
	 * @description	Shows the save button and makes editing possible.
	 * @private
	 * @param  {Object} event
	 */
	const _activateCardEditMode = function (event) {
		let _curCardType = BrowDashCardElem.getAttribute('data-module-type');

		isEditMode = true;
		BrowDashCardElem.classList.add('editmode');
		OVERLAY.classList.add('show');
		BrowDashCardEdit.parentNode.classList.add('hidden');
		BrowDashCardSave.parentNode.classList.remove('hidden');
		BrowDashCardSettings.style.display = null;
		createButton.classList.add('editmode');

		BrowDash.Module.Edit({
			type: _curCardType,
			elem: BrowDashCardElem
		});
	};

	/**
	 * @description	Shows the edit button and saves the content to localStorage.
	 * @private
	 * @param  {Object} event
	 */
	const _saveCardChanges = function (event) {
		isEditMode = false;
		BrowDashCardElem.classList.remove('editmode');
		OVERLAY.classList.remove('show');
		BrowDashCardEdit.parentNode.classList.remove('hidden');
		BrowDashCardSave.parentNode.classList.add('hidden');
		BrowDashCardSettings.style.display = null;
		createButton.classList.remove('editmode');
		BrowDash.Module.Save();
	};

	/**
	 * @description	Removes a card from localStorage.
	 * @private
	 * @param  {Object} event
	 */
	const _removeCard = function (event) {
		event.preventDefault();
		let _curCardGUI = BrowDashCardElem.getAttribute('data-module-guid');
		let _isCreateBtnInEditMode = createButton.classList.contains('editmode');
		// Remove item
		if (_isCreateBtnInEditMode || isEditMode) {
			createButton.classList.remove('editmode');
		}
		isEditMode = false;
		OVERLAY.classList.remove('show');
		localStorage.removeItem(_curCardGUI);
		MAIN.removeChild(BrowDashCardElem);
	};

	/**
	 * @description	Gets localStorage list, parses and creates cards.
	 * @private
	 */
	const _parseCardsFromStorage = function () {
		let storageItem = null;
		let loopStorage = function loopStorage (index) {
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

		for (let i = localStorage.length; i--;) {
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
		let _module = event.target.parentElement;
		let _moduleGUID = _module.getAttribute('data-module-guid');
		let _moduleType = _module.getAttribute('data-module-type');
		let _moduleSettings = {
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
		if (!BrowDashCustom) {
			BrowDashCustom = true;
			localStorage[BrowDashCustomKey] = true;
		}
	};

	/**
	 * @name				BrowDash.Cards.Create
	 * @description	Creates a new card module
	 * @public
	 * @param			{Object} config
	 */
	const _createCard = function (config) {
		let _cardType	= (config.type) ? config.type : 'basic';
		let _cardTitle	= (config.title) ? config.title : BrowDash.Data.Header(config.type);
		let _cardCount	= (config.count) ? config.count : 1;
		let _cardGUID	= (config.guid) ? config.guid : new BrowGUID();
		let _cardWrapper = null;

		for (let i = _cardCount; i--;) {
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
		let _cHeadElem = document.createElement('h1');
		//if (typeof title !== 'string' && typeof title !== undefined) title.toString();
		_cHeadElem.textContent = title;
		return _cHeadElem;
	};

	const _createCardContent = function (type) {
		let container = document.createElement('div');
		container.classList.add('content__' + type);

		switch (type) {
			case 'basic':
				container.appendChild( BrowDash.Module.Basic() );
				break;
			default:
				container.appendChild( BrowDash.Module.Basic() );
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
})(BrowDash);