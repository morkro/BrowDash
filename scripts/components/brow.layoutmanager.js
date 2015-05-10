BrowLayoutManager = (function (window, Brow) {
	'use strict';

	class BrowLayoutManager {
		constructor (container) {
			this.gutter			= 20;
			this.transition	= 0;
			this.pkrOptions	= {
				itemSelector: '.brow__content__module',
				columnWidth: 30,
				percentPosition: true,
				transitionDuration: this.transition,
				gutter: this.gutter,
				isInitLayout: false
			};
			this.dragOptions	= {}; // { handle: '.dragg-area' };
			this.packery		= new Packery(container, this.pkrOptions);
			this.addDraggabilly();
			this.addEvents();
		}

		/**
		 * Will initialise the Packery layout.
		 */
		layout () {
			this.packery.layout();
		}

		/**
		 * Adds a new item to the Packery layout.
		 * @param {HTMLElement} elem
		 */
		add (elem) {
			this.packery.appended( elem );
			this.addDraggabilly();
		}

		/**
		 * Removes passed element from the Packery layout.
		 * @param {Object|HTMLElement} config
		 */
		remove (elem) {
			this.packery.remove( elem );
			this.layout();
		}

		/**
		 * Initialises Draggabilly.
		 */
		addDraggabilly () {
			const _self = this;
			let cards = this.packery.getItemElements();
			cards.forEach(function (item) {
				let draggie = new Draggabilly(item, _self.dragOptions);
				_self.packery.bindDraggabillyEvents( draggie );
				draggie.on('pointerDown', _self.validateBrowMode.bind(draggie));
			});
		}

		/**
		 * Adds EventListener.
		 */
		addEvents () {
			window.addEventListener('card-edit', this.validateLayoutState.bind(this));
			window.addEventListener('card-save', this.validateLayoutState.bind(this));
			window.addEventListener('card-remove', this.validateLayoutState.bind(this));
		}

		/**
		 * Checks event type and validates the layout's state.
		 * @param  {Object} event
		 */
		validateLayoutState (event) {
			// activated editing mode
			if (event.type === 'card-edit') {
				Brow.isEditMode = true;
				Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.add('show');
			} 

			// saved card
			if (event.type === 'card-save') {
				Brow.isEditMode = false;
				Brow.activeCard = null;
				Brow.Settings.checkCustom();
				Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
			}
			
			// card is removed
			if (event.type === 'card-remove') {
				let elem = document.querySelector(`[data-module-guid="${event.detail}"]`);
				Brow.isEditMode = false;
				localStorage.removeItem( event.detail );
				this.remove(elem);
				Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
			}
		}

		/**
		 * Checks if editMode is active and weither disables or enables the dragging.
		 * @param  {Object} event
		 */
		validateBrowMode (event) {
			if (Brow.isEditMode && Brow.activeCard.isEditMode) {
				this.disable();
			} else {
				this.enable();
			}
		}
	}

	return BrowLayoutManager;
})(window, Brow);