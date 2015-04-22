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