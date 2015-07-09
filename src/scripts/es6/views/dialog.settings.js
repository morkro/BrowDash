import { BROW_SETTINGS, DEFAULT_THEME } from '../utils/constants';
import { isCustomTheme, setTheme } from '../utils/helper';

/**
 * @description	Validates input fields, updates browTheme and saves to localStorage.
 * @param  			{Object} event
 */
var updateTheme = function (event) {
	let colorHeadCheckbox	= this.dialogContent.querySelector('#settings--coloredhead');
	//let isThemeButton			= event.target.hasAttribute('data-settings-theme');
	//let isThemeCheckbox		= event.target.id === 'settings--coloredhead';
	let settings				= JSON.parse(localStorage[BROW_SETTINGS]);

	// If no theme settings are stored yet.
	if (!settings.theme) {
		settings.theme = { color: DEFAULT_THEME, headerbar: false };
	}

	// Is theme option
	if (event.target.hasAttribute('data-settings-theme')) {
		settings.theme.color = event.target.getAttribute('data-settings-theme');
	}

	// If colored header bar is clicked
	if (event.target.id === 'settings--coloredhead') {
		settings.theme.headerbar = colorHeadCheckbox.checked;
	}

	localStorage.setItem(BROW_SETTINGS, JSON.stringify(settings));
	setTheme();
};

/**
 * @description	Validates input fields, updates browTimer and saves to localStorage.
 * @param  			{Object} event
 */
var updateDateFormat = function (event) {
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

		this.callbackParams.browTimer.setDateFormat({ 'format': timeFormat });
		dateSettings.dateFormat = timeFormat;
		dateSettings.abbreviations = abbrCheckbox.checked;
	}

	// If abbreviation checkbox is clicked
	if (!event.target.disabled && event.target.id === 'settings--ampm') {
		this.callbackParams.browTimer.setDateFormat({ 'abbreviations': abbrCheckbox.checked });
		dateSettings.abbreviations = abbrCheckbox.checked;
	}

	localStorage.setItem(BROW_SETTINGS, JSON.stringify(dateSettings));
};

/**
 * @description	Adds callback to content in dialog and validates <input> fields.
 */
var dialogSettingsCallback = function () {
	let timeContent		= this.dialogContent.querySelector('.content__time');
	let themeContent		= this.dialogContent.querySelector('.content__theme');
	let formatCheckbox	= this.dialogContent.querySelector('#settings--dateformat');
	let abbrCheckbox		= this.dialogContent.querySelector('#settings--ampm');
	let themeCheckbox		= this.dialogContent.querySelector('#settings--coloredhead');
	let browSettings		= JSON.parse(localStorage[BROW_SETTINGS]);

	// Validate date settings and update DOM
	if (browSettings.dateFormat === '12h') {
		formatCheckbox.checked = false;
	}
	abbrCheckbox.checked = browSettings.abbreviations;
	abbrCheckbox.disabled = !browSettings.abbreviations;

	// Validate header bar settings and update DOM
	if (isCustomTheme()) {
		themeCheckbox.checked = browSettings.theme.headerbar;
	}

	// Add eventListener
	timeContent.addEventListener('click', updateDateFormat.bind(this));
	themeContent.addEventListener('click', updateTheme.bind(this));
};

export default dialogSettingsCallback;