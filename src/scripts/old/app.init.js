(function (window) {
	'use strict';

	const BROW		= Brow.Settings;
	const SETTINGS	= BROW.useElements({
		onClickDialog : document.querySelectorAll('.open-dialog'),
		onClickNewCard : document.querySelectorAll('.js-newcard'),
		onClickSelectionList : document.querySelector('.js-selection'),
		SELECTION : document.querySelector('.js-cardlist'),
		CONTENT : document.querySelector('.js-content'),
		CONTENT_OVERLAY : document.querySelector('.content__overlay'),
		DIALOG : document.querySelector('.js-dialog'),
		TIMER: document.querySelector('.js-timer')
	});

	BROW.setTheme('blue-a400');
	BROW.start();

})(window);