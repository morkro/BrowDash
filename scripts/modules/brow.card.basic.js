/**
 * @name				BrowCardBasic
 * @description	/
 */
BrowCardBasic = (function () {
	'use strict';

	function BrowCardBasic (card) {
		this.parent		= card;
		this.content	= document.createElement('p');
		this.wrapper	= document.createElement('div');

		this.wrapper.classList.add('content__basic');
		this.wrapper.appendChild( this.previewContent() );
	}

	/**
	 * @description	Sets the preview content
	 * @public
	 * @return 			{HTMLElement}
	 */	
	BrowCardBasic.prototype.previewContent = function () {
		let defaultContent	= Brow.Data.Content('basic')['default'];
		let storedContent		= this.parent.content.text;
		
		if (storedContent) {
			this.content.innerHTML = storedContent;
		}
		this.content.setAttribute('data-basic-preview', defaultContent);

		return this.content;
	};

	/**
	 * @description	Returns the entire module wrapper element.
	 * @public
	 * @return 			{HTMLElement}
	 */	
	BrowCardBasic.prototype.getContent = function () {
		return this.wrapper;
	};

	BrowCardBasic.prototype.updateStorage = function () {
		this.parent.storage['title'] = this.parent.headline.textContent;
		this.parent.storage['content'] = {
			text: this.content.innerHTML
		};
		localStorage[this.parent.guid] = JSON.stringify(this.parent.storage);
	};

	/**
	 * @description	Sets 'contenteditable="true"' to all elements.
	 * @public
	 * @return 			{HTMLElement}
	 */	
	BrowCardBasic.prototype.edit = function () {
		this.content.setAttribute('contenteditable', true);
		this.parent.headline.setAttribute('contenteditable', true);
	};

	/**
	 * @description	Removes attributes, updates Object and saves it to localStorage.
	 * @public
	 * @return 			{HTMLElement}
	 */	
	BrowCardBasic.prototype.save = function () {
		this.content.removeAttribute('contenteditable');
		this.parent.headline.removeAttribute('contenteditable');
		this.parent.title = this.parent.headline.textContent;
		this.updateStorage();
	};

	return BrowCardBasic;
})();