/**
 * @name				TextCard
 * @description	/
 */
TextCard = (function () {
	'use strict';

	class TextCard {
		constructor (card) {
			this.parent		= card;
			this.elem		= document.createElement('text-card');
			this.headline	= this.createHeadline();
			this.content	= this.createContent();
			this.theme		= this.parent.theme;

			this.elem.appendChild( this.headline );
			this.elem.appendChild( this.content );
			this.addTheme(this.parent.theme);

			window.addEventListener('theme-change', function (event) {
				this.theme = event.detail;
				this.addTheme(this.theme);
			}.bind(this));
		}

		/**
		 * @description	Sets the preview content
		 * @public
		 * @return 			{HTMLElement}
		 */
		createContent () {
			let textElem			= document.createElement('div');
			let defaultContent	= Brow.Data.Content('text')['default'];
			let storedContent		= this.parent.content.text;
			
			if (storedContent) {
				textElem.innerHTML = storedContent;
			}

			textElem.setAttribute('data-text-preview', defaultContent);
			return textElem;
		}

		/**
		 * @description	Creates the heading
		 * @private
		 * @return 			{HTMLElement}
		 */	
		createHeadline () {
			let headElem		= document.createElement('h1');
			let cardHasTitle	= this.parent.content.headline;
			headElem.innerHTML = (cardHasTitle) ? cardHasTitle : Brow.Data.Header('text');
			return headElem;
		}

		addTheme (theme) {
			if (theme) {
				this.elem.setAttribute('theme', theme);
			}
		}

		/**
		 * @description	Returns the entire module <text-card> element.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		get getContent () {
			return this.elem;
		}

		/**
		 * @description	Removes attributes, updates Object and saves it to localStorage.
		 * @public
		 */	
		save () {
			this.elem.save();
			this.parent.storage['content'] = this.elem.storage;
			this.parent.content.headline = this.headline.innerHTML;
			this.parent.storage['style']['theme'] = this.theme;
			localStorage[this.parent.guid] = JSON.stringify(this.parent.storage);
		}
	}

	return TextCard;
})();