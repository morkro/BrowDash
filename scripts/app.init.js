(function (window) {
	'use strict';

	const TIMER		= new BrowTimer( document.querySelector('.trigger-timer') );
	const BROW		= Brow.Settings;
	const SETTINGS	= BROW.useElements({
		onClickSettings : document.querySelector('.trigger-settings'),
		onClickNewCard : document.querySelector('.trigger-newcard'),
		CONTENT : document.querySelector('.trigger-content'),
		CONTENT_OVERLAY : document.querySelector('.content__overlay'),
		DIALOG : document.querySelector('.trigger-dialog'),
		DIALOG_OVERLAY: document.querySelector('#brow__overlay')
	});

	TIMER.run();
	BROW.setTheme('blue-a400');
	BROW.start();

})(window);