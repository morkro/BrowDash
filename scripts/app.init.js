(function (window) {
	'use strict';

	const APP = new BrowDash({
		theme: 'blue-a400',
		openSettings: document.querySelector('.trigger-settings'),
		appendTimer: document.querySelector('.trigger-timer'),
		createCard: document.querySelector('.trigger-newcard'),
		appendContent: document.querySelector('.trigger-content')
	});

})(window);