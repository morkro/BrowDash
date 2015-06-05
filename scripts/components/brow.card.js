/**
 * @name				BrowCard
 * @description	/
 */
BrowCard = (function (Brow) {
	'use strict';

	class BrowCard {
		constructor (config) {
			if (!config) config = {};
		
			// settings
			this.isEditMode	= false;
			this.config			= { elem: null };
			this.saveState		= this.saveCardChanges;
			this.wrapper		= null;

			// initialisation
			this.type			= (config.type) ? config.type : 'text';
			this.guid			= (config.guid) ? config.guid : Brow.GUID();
			this.content		= (config.content) ? config.content : {};
			this.storage		= { 
				module: true, 
				type: this.type, 
				guid: this.guid, 
				content: this.content,
				style: { width: 1, stamp: false }
			};

			// events
			this.eventOption	= { 'detail': this.guid };
			this.editEvent		= new CustomEvent('card-edit', this.eventOption);
			this.saveEvent		= new CustomEvent('card-save', this.eventOption);
			this.removeEvent	= new CustomEvent('card-remove', this.eventOption);

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
			elem.addEventListener('settings', this.setCardEvents.bind(this) );
			elem.addEventListener('edit', this.activateEditMode.bind(this) );
			elem.addEventListener('save', this.saveCardChanges.bind(this) );
			elem.addEventListener('remove', this.removeCard.bind(this) );
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
			Brow.activeCard = this;
			this.isEditMode = true;
			this.wrapper.getContent.edit();
			// fire custom event
			window.dispatchEvent( this.editEvent );
		}

		/**
		 * @description	Shows the edit button and saves the content to localStorage.
		 * @private
		 * @param			{Object} event
		 */
		saveCardChanges (event) {
			// config
			this.isEditMode = false;
			this.wrapper.save();
			// fire custom event
			window.dispatchEvent( this.saveEvent );
		}

		/**
		 * @description	Removes a card from localStorage.
		 * @private
		 * @param			{Object} event
		 */
		removeCard (event) {
			this.config.elem.addEventListener('transitionend', 
				function (event) {
					// Only listen to the last transition.
					if (event.propertyName === 'transform') {
						this.isEditMode = false;
						window.dispatchEvent( this.removeEvent );
					}
				}.bind(this)
			);
		}
	}

	return BrowCard;
})(Brow);