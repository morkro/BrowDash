(function (window) {
	'use strict';

	function BrowDash (options) {
		if (!options) {
			throw new Error('No options passed!');
		}
		
		this.theme		= BrowDash.Settings.Initial( options.theme );
		this.settings	= BrowDash.Settings.Open( options.settings );
		this.timer		= BrowDash.DateTimer.Append( options.timer );
		this.cards		= BrowDash.Cards.Options({
			appendCards: options.content,
			createCards: options.create
		});
		this.init = BrowDash.Cards.Initialise('BROW_CUSTOM');
	}

	window.BrowDash = BrowDash;

})(window);