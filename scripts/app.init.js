(function (window) {
	'use strict';

	const APP = new BrowDash({
		theme: 'blue-a400',
		timer: document.querySelector('.trigger-timer'),
		settings: document.querySelector('.trigger-settings'),
		create: document.querySelector('.trigger-newcard'),
		content: document.querySelector('.trigger-content')
	});

})(window);