/**
 * @name				BrowCard
 * @description	/
 */
BrowCard = (function () {
	'use strict';

	function BrowCard (config) {
		if (!config) config = {};

		this.isEditMode	= false;
		this.type			= (config.type) ? config.type : 'basic';
		this.title			= (config.title) ? config.title : Brow.Data.Header(config.type);
		this.guid			= (config.guid) ? config.guid : Brow.GUID();
		this.config			= { settings: null, edit: null, save: null, remove: null, elem: null };
		this.storage		= { module: true, type: this.type, title: this.title, guid: this.guid, content: null };
		this.headline		= this.createHeadline( this.title );
		this.content		= this.createContent( this.type );
		
		console.log(this);

		return this.createCard();
	}

	/**
	 * @name				BrowCard.createCard
	 * @description	Creates a new card module
	 * @public
	 */
	BrowCard.prototype.createCard = function () {
		let baseElem = document.createElement('card-base');
		let self = this;

		baseElem.setAttribute('data-module-guid', this.guid);
		baseElem.setAttribute('data-module-type', this.type);
		baseElem.appendChild( this.headline );
		baseElem.appendChild( this.content.getContent() );

		baseElem.addEventListener('btn-settings', function (event) {
			self.addEvents(event);
		});

		return baseElem;
	};

	/**
	 * @description	Creates the heading
	 * @private
	 * @param			{String} title
	 */	
	BrowCard.prototype.createHeadline = function (title) {
		let headElem = document.createElement('h1');
		headElem.textContent = title;
		return headElem;
	};

	/**
	 * @description	Creates content and calls new classes based on the type.
	 * @private
	 * @param			{String} type
	 * @return 			{HTMLElement}
	 */	
	BrowCard.prototype.createContent = function (type) {
		var cardContent = null;
	
		switch (type) {
			case 'basic':
				cardContent = new BrowCardBasic( this );
				break;
			case 'weather':
				cardContent = new BrowCardWeather( this );
				break;
			case 'notification':
				cardContent = new BrowCardNotify( this );
				break;
			case 'todo':
				cardContent = new BrowCardToDo( this );
				break;
			default:
				cardContent = new BrowCardBasic( this );
				break;
		}

		return cardContent;
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
			self.activateEditMode(event);
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
	BrowCard.prototype.activateEditMode = function (event) {
		// config
		Brow.isEditMode = true;
		this.isEditMode = true;
		this.content.edit();

		// visual
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
		// config
		Brow.isEditMode = false;
		this.isEditMode = false;
		this.content.save();

		// visual
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