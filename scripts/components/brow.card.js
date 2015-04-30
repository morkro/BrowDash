/**
 * @name				BrowCard
 * @description	/
 */
BrowCard = (function (Brow) {
	'use strict';

	class BrowCard {
		constructor (config) {
			if (!config) config = {};
			
			this.isEditMode	= false;
			this.type			= (config.type) ? config.type : 'text';
			this.guid			= (config.guid) ? config.guid : Brow.GUID();
			this.content		= (config.content) ? config.content : {};
			this.config			= { elem: null };
			this.saveState		= this.saveCardChanges;
			this.wrapper		= null;
			this.storage		= { 
				module: true, 
				type: this.type, 
				guid: this.guid, 
				content: this.content,
				style: { width: 1, sticky: false }
			};

			return this.createCard();
		}

		/**
		 * @name				BrowCard.createCard
		 * @description	Creates a new card module
		 * @public
		 */
		createCard () {
			switch (this.type) {
				case 'text':
					this.wrapper = new TextCard( this );
					break;
				case 'weather':
					this.wrapper = new WeatherCard( this );
					break;
				default:
					this.wrapper = new TextCard( this );
					break;
			}

			this.applyCardData();
			this.addEvents( this.wrapper.getContent );

			return this.wrapper.getContent;
		}

		/**
		 * @description	Applies classes and data-attributes to DOM element.
		 * @private
		 */
		applyCardData () {
			this.wrapper.getContent.classList.add('brow__content__module');
			this.wrapper.getContent.setAttribute('data-module-width', this.storage.style.width);
			this.wrapper.getContent.setAttribute('data-module-guid', this.guid);
			this.wrapper.getContent.setAttribute('data-module-type', this.type);
		}

		/**
		 * @description	Sets eventListener on current card element.
		 * @private
		 * @param			{Object} event
		 */
		addEvents (elem) {
			elem.addEventListener('card-settings', this.setCardEvents.bind(this) );
			elem.addEventListener('card-edit', this.activateEditMode.bind(this) );
			elem.addEventListener('card-save', this.saveCardChanges.bind(this) );
			elem.addEventListener('card-remove', this.removeCard.bind(this) );
		}

		/**
		 * @description	Stores event target into class.
		 * @private
		 * @param			{Object} event
		 */
		setCardEvents (event) {
			if (this.config.elem === null) {
				this.config.elem = event.target;
			}
		}

		/**
		 * @description	Shows the save button and makes editing possible.
		 * @private
		 * @param			{Object} event
		 */
		activateEditMode (event) {
			// config
			Brow.isEditMode = true;
			Brow.activeCard = this;
			this.isEditMode = true;
			this.wrapper.edit();

			// visual
			this.config.elem.classList.add('editmode');
			Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.add('show');
		}

		/**
		 * @description	Shows the edit button and saves the content to localStorage.
		 * @private
		 * @param			{Object} event
		 */
		saveCardChanges (event) {
			// config
			Brow.isEditMode = false;
			Brow.activeCard = null;
			this.isEditMode = false;
			this.wrapper.save();
			Brow.Settings.checkCustom();

			// visual
			this.config.elem.classList.remove('editmode');
			Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
		}

		/**
		 * @description	Removes a card from localStorage.
		 * @private
		 * @param			{Object} event
		 */
		removeCard (event) {
			let curCardGUI = this.config.elem.getAttribute('data-module-guid');
			let self = this;

			this.config.elem.classList.add('deletemode');
			this.config.elem.addEventListener('transitionend', function (event) {
				// Only listen to the last transition.
				if (event.propertyName === 'transform') {
					Brow.isEditMode = false;
					this.isEditMode = false;
					localStorage.removeItem(curCardGUI);
					Brow.Settings.getElem()['CONTENT'].removeChild( self.config.elem );
					Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
				}
			});
		}
	}

	return BrowCard;
})(Brow);