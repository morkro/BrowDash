BrowCardBasic = (function () {
	'use strict';

	function BrowCardBasic () {
		this.container = document.createElement('div');

		this.container.classList.add('content__basic');
		this.container.appendChild( this.textElem() );

		return this.container;
	}

	BrowCardBasic.prototype.textElem = function () {
		let textElem			= document.createElement('p');
		let defaultContent	= Brow.Data.Content('basic')['default'];
		
		textElem.setAttribute('data-basic-preview', defaultContent);
		return textElem;
	};

	return BrowCardBasic;
})();