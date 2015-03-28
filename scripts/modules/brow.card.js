BrowCard = (function () {
	'use strict';

	function BrowCard (config) {
		if (!config) config = {};

		this.type	= (config.type) ? config.type : 'basic';
		this.title	= (config.title) ? config.title : Brow.Data.Header(config.type);
		this.guid	= (config.guid) ? config.guid : Brow.GUID();
		this.config = { settings: null, edit: null, save: null, remove: null, elem: null };
		this.isEditMode = false;

		return this.createCard();
	}

	BrowCard.prototype.createCard = function () {
		let baseElem = document.createElement('card-base');
		let self = this;

		baseElem.setAttribute('data-module-guid', this.guid);
		baseElem.setAttribute('data-module-type', this.type);
		baseElem.appendChild( this.createHeadline( this.title ) );
		baseElem.addEventListener('btn-settings', function (event) {
			self.addEvents(event);
		});

		return baseElem;
	};

	/**
	 * @description	Creates the heading for new cards
	 * @private
	 * @param			{String} title
	 */	
	BrowCard.prototype.createHeadline = function (title) {
		let headElem = document.createElement('h1');
		headElem.textContent = title;
		return headElem;
	};

	/**
	 * @description	Sets eventListener on current card element.
	 * @private
	 * @param			{Object} event
	 */
	BrowCard.prototype.addEvents = function (event) {
		let self = this;

		this.config.elem		= event.target;
		this.config.settings	= event.target.settings;
		this.config.edit		= event.target.edit;
		this.config.save		= event.target.save;
		this.config.remove	= event.target.remove;

		this.config.settings.style.display = 'block';
		this.config.edit.addEventListener('click', function (event) {
			event.preventDefault();
			self.activateCardEditMode(event);
		});
		this.config.save.addEventListener('click', function (event) {
			event.preventDefault();
			self.saveCardChanges(event);
		});
		this.config.remove.addEventListener('click', function (event) {
			event.preventDefault();
			self.removeCard(event);
		});
	};

	/**
	 * @description	Shows the save button and makes editing possible.
	 * @private
	 * @param			{Object} event
	 */
	BrowCard.prototype.activateCardEditMode = function (event) {
		Brow.isEditMode = true;
		this.isEditMode = true;

		this.config.elem.classList.add('editmode');
		this.config.edit.parentNode.classList.add('hidden');
		this.config.save.parentNode.classList.remove('hidden');
		this.config.settings.style.display = null;

		Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.add('show');
	};

	/**
	 * @description	Shows the edit button and saves the content to localStorage.
	 * @private
	 * @param			{Object} event
	 */
	BrowCard.prototype.saveCardChanges = function (event) {
		Brow.isEditMode = false;
		this.isEditMode = false;

		this.config.elem.classList.remove('editmode');
		this.config.edit.parentNode.classList.remove('hidden');
		this.config.save.parentNode.classList.add('hidden');
		this.config.settings.style.display = null;

		Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
	};

	/**
	 * @description	Removes a card from localStorage.
	 * @private
	 * @param			{Object} event
	 */
	BrowCard.prototype.removeCard = function (event) {
		let curCardGUI = this.config.elem.getAttribute('data-module-guid');

		Brow.isEditMode = false;
		this.isEditMode = false;

		localStorage.removeItem(curCardGUI);
		Brow.Settings.getElem()['CONTENT'].removeChild( this.config.elem );
		Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
	};

	return BrowCard;
})();