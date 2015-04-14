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
		this.wrapper.appendChild( this.createEditor() );
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
		
		if (storedContent) this.content.innerHTML = storedContent;
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

	/**
	 * @description	Saves current content to localStorage.
	 * @public
	 */	
	BrowCardBasic.prototype.updateStorage = function () {
		this.parent.storage['title'] = this.parent.headline.innerHTML;
		this.parent.storage['content'] = {
			text: this.content.innerHTML
		};
		localStorage[this.parent.guid] = JSON.stringify(this.parent.storage);
	};

	/**
	 * @description	Creates a simple editor to style text.
	 * @public
	 * @todo 			Create everything: bold, italic, unstyle, links.
	 */	
	BrowCardBasic.prototype.createEditor = function () {
		let editWrap = document.createElement('div');
		let editList = document.createElement('ul');

		editWrap.classList.add('content__basic__editor');
		editWrap.appendChild( editList );

		return editWrap;
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