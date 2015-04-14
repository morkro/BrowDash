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
		this.content		= (config.content) ? config.content : {};
		this.config			= { edit: null, save: null, remove: null, elem: null };
		this.storage		= { module: true, type: this.type, title: this.title, guid: this.guid, content: this.content };
		this.headline		= this.createHeadline( this.title );
		this.body			= this.createContent();
		this.saveState		= this.saveCardChanges;
		//console.log(this);

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
		baseElem.appendChild( this.body.getContent() );
		this.addEvents(baseElem);

		return baseElem;
	};

	/**
	 * @description	Creates the heading
	 * @private
	 * @param			{String} title
	 */	
	BrowCard.prototype.createHeadline = function (title) {
		let headElem = document.createElement('h1');
		headElem.innerHTML = title;
		return headElem;
	};

	/**
	 * @description	Creates content and calls new classes based on the type.
	 * @private
	 * @param			{String} type
	 * @return 			{HTMLElement}
	 */	
	BrowCard.prototype.createContent = function () {
		var cardContent = null;
	
		switch (this.type) {
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
	BrowCard.prototype.addEvents = function (elem) {
		let self = this;

		elem.addEventListener('btn-settings', function (event) {
			if (self.config.elem === null) {
				self.config.elem = event.target;
				self.config.edit = event.target.edit;
				self.config.save = event.target.save;
				self.config.remove = event.target.remove;
			}
		});

		elem.addEventListener('btn-edit', function (event) {
			self.activateEditMode(event);
		});

		elem.addEventListener('btn-save', function (event) {
			self.saveCardChanges(event);
		});

		elem.addEventListener('btn-remove', function (event) {
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
		Brow.activeCard = this;
		this.isEditMode = true;
		this.body.edit();

		// visual
		this.config.elem.classList.add('editmode');
		this.config.edit.parentNode.classList.add('hidden');
		this.config.save.parentNode.classList.remove('hidden');
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
		Brow.activeCard = null;
		this.isEditMode = false;
		this.body.save();
		Brow.Settings.checkCustom();

		// visual
		this.config.elem.classList.remove('editmode');
		this.config.edit.parentNode.classList.remove('hidden');
		this.config.save.parentNode.classList.add('hidden');
		Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
	};

	/**
	 * @description	Removes a card from localStorage.
	 * @private
	 * @param			{Object} event
	 */
	BrowCard.prototype.removeCard = function (event) {
		let curCardGUI = this.config.elem.getAttribute('data-module-guid');
		let self = this;

		this.config.elem.classList.add('deletemode');
		this.config.elem.addEventListener('transitionend', function (event) {
			// Only listen to the transform transition.
			if (event.propertyName === 'transform') {
				Brow.isEditMode = false;
				this.isEditMode = false;
				localStorage.removeItem(curCardGUI);
				Brow.Settings.getElem()['CONTENT'].removeChild( self.config.elem );
				Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
			}
		});
	};

	return BrowCard;
})();