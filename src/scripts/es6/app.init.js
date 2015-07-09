/* Import dependencies */
import { timer, openDialog, dialog, newCard, content, contentOverlay } from './utils/elements';
import { BROW_SETTINGS, BROW_CARDS } from './utils/constants';
import { setTheme } from './utils/helper';
import dialogSettingsCallback from './views/dialog.settings';
import BrowTimer from './modules/browtimer';
import BrowDialog from './modules/browdialog';
import BrowCard from './modules/browcard';
import BrowLayoutManager from './modules/browlayoutmanager';

/* Variables */
let browTimer = null;
let browGrid = null;

/**
 *	@description Validates the users timer settings.
 */
let validateBrowTimer = function () {
	browTimer = new BrowTimer(timer);
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

		let browDialog = new BrowDialog({
			elem: item,
			dialogElem: dialog,
			content: `${currentLocation}/markup/dialog-${dialogContent}.html`,
			callback: dialogCallback,
			params: { browTimer }
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
		let browCard = new BrowCard({
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
	browGrid = new BrowLayoutManager( content, contentOverlay );
	browGrid.layout();
};

/**
 * @description	Checks localStorage and loads the users cards
 * @param			{Object} storage
 */
let validateBrowCards = function () {
	if (!localStorage[BROW_CARDS] || localStorage.length <= 1) {
		localStorage.setItem(BROW_CARDS, true);
		let defaultCard = new BrowCard({ type: 'text' });
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
	let browCard = new BrowCard({ type: `${selectedCard}` });

	content.appendChild( browCard );
	browGrid.add( browCard );
};

/**
 * @description	Bind events to elements.
 */
let addEvents = function () {
	[].forEach.call(newCard, (item) => {
		item.addEventListener('click', addNewCard);
	});
};

/* Initialise app */
window.isEditMode = false;
validateBrowCards();
validateBrowTimer();
initLayoutManager();
initDialogs();
setTheme();
addEvents();