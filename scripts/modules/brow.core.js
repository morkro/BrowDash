(function (window) {
	'use strict';

	function BrowDash (options) {
		if (!options || typeof options !== 'object') {
			throw new Error('No valid options passed!');
		}
		if (!options.theme || typeof options.theme !== 'string') {
			options.theme = 'blue-a400';
		}

		// this.settings = new BrowSettings( options.theme );
		
		this.theme		= BrowDash.Settings.Theme( options.theme );
		this.settings	= BrowDash.Settings.Open( options.openSettings );
		this.timer		= new BrowTimer( options.appendTimer ).run();
		this.init		= BrowDash.Cards.Initialise('BROW_CUSTOM');
		this.cards		= BrowDash.Cards.Options({
			appendCards: options.appendContent,
			createCards: options.createCards
		});
	}

	window.BrowDash = BrowDash;

})(window);

