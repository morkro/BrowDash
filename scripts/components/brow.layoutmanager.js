/**
 * @name				BrowLayoutManager
 * @description	/
 * @param			{Object} Brow
 */
BrowLayoutManager = (function (window, Brow) {
	'use strict';

	class BrowLayoutManager {
		constructor (container) {
			this.dragSelector = '.brow__content__module /deep/ .dragg-area';
			this.transition	= 0;
			this.pkrOptions	= {
				itemSelector: '.brow__content__module',
				transitionDuration: this.transition,
				columnWidth: '.brow__content--sizer',
				gutter: '.brow__content--gutter',
				stamp: '.is-stamp',
				isInitLayout: false
			};
			this.dragOptions	= { handle: this.dragSelector };
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
		 * @param {NodeList|HTMLElement} elem
		 */
		add (elem) {
			this.packery.appended( elem );
			this.addDraggabilly();
		}

		/**
		 * Removes passed element from the Packery layout.
		 * @param {NodeList|HTMLElement} config
		 */
		remove (elem) {
			this.packery.remove( elem );
			this.layout();
		}

		/**
		 * Makes an element sticky
		 * @param {NodeList|HTMLElement} config
		 */
		stamp (elem) {
			this.packery.stamp( elem );
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
			Brow.Settings.getElem()['CONTENT_OVERLAY']
				.addEventListener('click', this.validateLayoutState.bind(this));
		}

		/**
		 * Checks event type and validates the layout's state.
		 * @param  {Object} event
		 */
		validateLayoutState (event) {
			let elem = document.querySelector(`[data-module-guid="${event.detail}"]`);

			// activated editing mode
			if (event.type === 'card-edit') {
				Brow.isEditMode = true;
				Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.add('is-visible');
			} 

			// saved card or remove card
			if (event.type === 'card-save' || event.type === 'card-remove') {
				Brow.isEditMode = false;
				Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.add('is-fading');
				setTimeout(function () {
					Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('is-visible', 'is-fading');
				}, 100);
				
				if (event.type === 'card-save') {
					this.layout();
					Brow.Settings.checkCustom();
				}

				if (event.type === 'card-remove') {
					this.remove(elem);
					Brow.activeCard = null;
					localStorage.removeItem( event.detail );
				}
			}

			else if (event.type === 'click' && Brow.isEditMode && Brow.activeCard.isEditMode) {
				Brow.activeCard.saveState();
				Brow.activeCard.wrapper.elem.classList.remove('fx', 'is-edit');
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