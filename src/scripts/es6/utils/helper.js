import { BROW_SETTINGS, BROW_CARDS, DEFAULT_THEME } from './constants';

/**
 * @description	Checks if custom theme settings are available.
 * @return			{Boolean}
 */
const isCustomTheme = function () {
	let isCustom = false;

	if (localStorage[BROW_SETTINGS]) {
		let settings = JSON.parse(localStorage[BROW_SETTINGS]);
		isCustom = !!settings.theme;
	}

	return isCustom;
};

/**
 * @description	Checks if custom key is set, if not: do it.
 */
const hasCustomCards = function () {
	if (!localStorage[BROW_CARDS]) {
		localStorage[BROW_CARDS] = true;
	}
};

/**
 * @description	Checks via regex if className is a theme.
 */
const checkForThemeClass = function () {
	let themeRegEx = /theme-.*/;
	for (let i = 0; i < document.body.classList.length; i++) {
		if (themeRegEx.test(document.body.classList[i])) {
			document.body.classList.remove( document.body.classList[i] );
		}
	}
};

/**
 * @description	Parses the custom settings from localStorage and sets classes.
 */
const updateThemeFromStorage = function () {
	let settings = JSON.parse(localStorage[BROW_SETTINGS]);
	//let dialogIsOpen = document.body.classList.contains('dialog-is-visible');

	checkForThemeClass();
	document.body.classList.add(`theme-${settings.theme.color}`);

	if (isCustomTheme() && settings.theme.headerbar) {
		document.body.classList.add('theme-headerbar');
	}
};

/**
 * @description	Adds the theme class to <body> from initial settings.
 * @param			{String} theme
 */
const updateThemeFromConfig = function (theme) {
	document.body.classList.add(`theme-${theme}`);
};

/**
 *	@description	Updates the current theme.
 * @param			{Object} theme
 */
const setTheme = function (theme) {
	if (!theme || typeof theme !== 'string') {
		theme = DEFAULT_THEME;
	}

	if (isCustomTheme()) {
		updateThemeFromStorage();
	} else {
		updateThemeFromConfig( theme );
	}
};

export {
	isCustomTheme,
	hasCustomCards,
	setTheme,
	updateThemeFromConfig,
	updateThemeFromStorage
};