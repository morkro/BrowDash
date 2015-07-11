/* Import dependencies */
import { timer, openDialog, dialog, newCard, content, contentOverlay } from './utils/elements';
import { BROW_SETTINGS, BROW_CARDS } from './utils/constants';
import { setTheme } from './utils/helper';
import dialogSettingsCallback from './views/dialog.settings';
import Timer from './modules/timer';
import Dialog from './modules/dialog';
import Card from './modules/card';
import LayoutManager from './modules/layoutmanager';
import Snackbar from './modules/snackbar';

/* Variables */
let browTimer = null;
let browGrid = null;
let onlineCounter = 0;

/**
 * @description Validates if user is online/offline and sends proper notification.
 */
let validateOnOfflineState = function () {
	let snack = new Snackbar();

	if (onlineCounter) {
		if (!navigator.onLine) {
			snack.alert(`Your internet connection suddenly went offline. BrowDash will still work like before, but some cards might not update.`);
		}
		else {
			snack.alert(`Your internet connection is stable again, awesome!`);
		}
	}

	onlineCounter++;
};

/**
 *	@description Validates the users timer settings.
 */
let validateTimer = function () {
	browTimer = new Timer(timer);
	let dateSettings = { dateFormat: null, abbreviations: false };

	if (!localStorage[BROW_SETTINGS]) {
		dateSettings.dateFormat = '24h';
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

/**
 * @description	Adds all dialog.
 */
let initDialogs = function () {
	let currentLocation = window.location.href.slice(0, -1);

	[].forEach.call(openDialog, function (item) {
		let dialogContent	= item.getAttribute('data-dialog');
		let dialogCallback = false;

		if (dialogContent === 'settings') {
			dialogCallback = dialogSettingsCallback;
		}

		let browDialog = new Dialog({
			elem: item,
			dialogElem: dialog,
			content: `${currentLocation}/markup/dialog-${dialogContent}.html`,
			callback: dialogCallback,
			params: { Timer }
		});

		browDialog.init();
	});
};

/**
 * @description	Gets localStorage, parses available cards and creates them.
 * @param			{Number|String} index
 */
let parseCardsFromStorage = function (index) {
	let storageItem = JSON.parse(
		localStorage.getItem( localStorage.key(index) )
	);

	if (storageItem.module) {
		let browCard = new Card({
			type: storageItem.type,
			guid: storageItem.guid,
			content: storageItem.content,
			style: storageItem.style
		});
		content.appendChild( browCard );
	}
};

/**
 * @description	Calls the LayoutManager class.
 */
let initLayoutManager = function () {
	browGrid = new LayoutManager( content, contentOverlay );
	browGrid.layout();
};

/**
 * @description	Checks localStorage and loads the users cards
 * @param			{Object} storage
 */
let validateBrowCards = function () {
	if (!localStorage[BROW_CARDS] || localStorage.length <= 1) {
		localStorage.setItem(BROW_CARDS, true);
		let defaultCard = new Card({ type: 'text' });
		content.appendChild( defaultCard );
	} else {
		for (let i = 0; i < localStorage.length; i++) {
			parseCardsFromStorage(i);
		}
	}
};

/**
 * @description	Checks clicked card type and appends it to the DOM.
 * @param			{Object} event
 */
let addNewCard = function (event) {
	event.preventDefault();

	let selectedCard = this.getAttribute('data-create-card');
	let browCard = new Card({ type: `${selectedCard}` });

	content.appendChild( browCard );
	browGrid.add( browCard );
};

/**
 * @description	Bind events to elements.
 */
let addEvents = function () {
	window.addEventListener('online', validateOnOfflineState);
	window.addEventListener('offline', validateOnOfflineState);
	[].forEach.call(newCard, (item) => {
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
setTheme();
addEvents();