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
	const BROW_KEY				= 'BROW_THEME';
	const BROW_CARDS			= 'BROW_CARDS';
	const BROW_SETTINGS		= 'BROW_SETTINGS';

	/* Variables */
	var isSelectionState	= false;
	var browGrid			= null;
	var browTimer			= null;
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

	/**
	 * @description	Adds event listener.
	 * @private
	 */
	const _addEvents = function () {
		// Elements
		browElements.onClickSelectionList.addEventListener('mouseover', _showCardList);
		browElements.CONTENT_OVERLAY.addEventListener('click', _checkCardMode);
		browElements.SELECTION.addEventListener('mouseout', _closeCardList);
		[].forEach.call(browElements.onClickNewCard, function (item) {
			item.addEventListener('click', _addNewCard);
		});
	};

	/**
	 * @description	Calls the LayoutManager class.
	 * @private
	 */
	const _initLayoutManager = function () {
		browGrid = new BrowLayoutManager( browElements['CONTENT'] );
		browGrid.layout();
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
	 * @description	Checks if custom key is set, if not: do it.
	 * @private
	 */
	const _checkIfCustomBrowCards = function () {
		if (!localStorage[BROW_CARDS]) {
			localStorage[BROW_CARDS] = true;
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
		browGrid.add( browCard );
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
		browTimer = new BrowTimer( browElements['TIMER'] );
		let dateSettings = { dateFormat : null, abbreviations : false };

		if (!localStorage[BROW_SETTINGS]) {
			dateSettings['dateFormat'] = '24h';
			browTimer.setDateFormat({
				'format': dateSettings.dateFormat
			});
			localStorage.setItem(BROW_SETTINGS, JSON.stringify(dateSettings));
		}
		else {
			dateSettings = JSON.parse(localStorage[BROW_SETTINGS]);
			browTimer.setDateFormat({
				'format': dateSettings.dateFormat, 
				'abbreviations': dateSettings.abbreviations
			});
		}

		browTimer.run();
	};

	const _dialogSettingsCallback = function () {		
		let formatCheckbox	= this.dialogContent.querySelector('#settings--dateformat');
		let abbrCheckbox		= this.dialogContent.querySelector('#settings--ampm');
		let dateSettings		= JSON.parse(localStorage[BROW_SETTINGS]);

		// Validate date settings and update DOM
		if (dateSettings['dateFormat'] === '12h') {
			formatCheckbox.checked = false;
		}
		abbrCheckbox.checked = dateSettings['abbreviations'];
		abbrCheckbox.disabled = !dateSettings['abbreviations'];

		this.dialogContent.addEventListener('click', _updateDateFormat.bind(this));
	};

	const _updateDateFormat = function (event) {
		let formatCheckbox	= this.dialogContent.querySelector('#settings--dateformat');
		let abbrCheckbox		= this.dialogContent.querySelector('#settings--ampm');
		let timeFormat			= '24h';
		let dateSettings		= JSON.parse(localStorage[BROW_SETTINGS]);

		// If date format checkbox is clicked
		if (event.target.id === 'settings--dateformat') {
			if (!formatCheckbox.checked) {
				timeFormat = '12h';
				abbrCheckbox.disabled = false;	
			}
			else if (formatCheckbox.checked && !abbrCheckbox.disabled) {
				abbrCheckbox.disabled = true;
				abbrCheckbox.checked = false;
			}

			browTimer.setDateFormat({ 'format': timeFormat });
			dateSettings['dateFormat'] = timeFormat;
			dateSettings['abbreviations'] = abbrCheckbox.checked;
		}

		// If abbreviation checkbox is clicked
		if (!event.target.disabled && event.target.id === 'settings--ampm') {
			browTimer.setDateFormat({ 'abbreviations': abbrCheckbox.checked });
			dateSettings['abbreviations'] = abbrCheckbox.checked;
		}

		localStorage.setItem(BROW_SETTINGS, JSON.stringify(dateSettings));
	};

	/**
	 * @description	Adds all dialog.
	 * @private
	 */
	const _initDialogs = function () {
		let currentLocation = window.location.href.slice(0, -1);
		
		[].forEach.call(browElements['onClickDialog'], function (item) {
			let dialogContent		= item.getAttribute('data-dialog');
			let dialogCallback	= false;

			if (dialogContent === 'settings') {
				dialogCallback = _dialogSettingsCallback;
			}

			let browDialog = new BrowDialog({
				elem: item,
				content: `${currentLocation}/markup/dialog-${dialogContent}.html`,
				callback: dialogCallback
			});
		});
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
		_initLayoutManager();
		_addEvents();
	};
	
	/* Public API */
	return {
		//setTheme : setTheme,
		useElements : useElements,
		getElem : getElem,
		start : initialiseAndStartApp,
		checkCustom : _checkIfCustomBrowCards,
		BROW_KEY : BROW_KEY,
	};
})(Brow);