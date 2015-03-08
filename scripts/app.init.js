(function (window, undefined) {
	'use strict';

	/* Constants */
	const TIMER					= document.querySelector('.trigger-timer');
	const CONTENT				= document.querySelector('.trigger-content');
	const ADD_BUTTON			= document.querySelector('.trigger-cards');
	const SETTINGS_BUTTON	= document.querySelector('.trigger-settings');

	/* Timer in header */
	Brow.DateTimer.Append(TIMER);

	/* Sets default theme and binds element to show the settings dialog */
	Brow.Settings.Initial({ theme: 'blue-a400' });
	Brow.Settings.Open(SETTINGS_BUTTON);

	/* 
	 * Gets several options to display the cards & sets the
	 * string as a condition to initialse the app.
	 */
	Brow.Cards.Options({
		appendCards: CONTENT,
		createCards: ADD_BUTTON
	}).Initialise('BROW_CUSTOM');

})(window, undefined);