/**
 * @name				BrowLayoutManager
 * @description	/
 * @param			{Object} Brow
 */
BrowLayoutManager = (function (window, Brow) {
	'use strict';

	class BrowLayoutManager {
		constructor (container) {
			this.dragSelector = '.brow-content__module /deep/ .dragg-area';
			this.transition	= 0;
			this.pkrOptions	= {
				itemSelector: '.brow-content__module',
				transitionDuration: this.transition,
				columnWidth: '.brow-content--sizer',
				gutter: '.brow-content--gutter',
				stamp: '.is-stamp',
				isInitLayout: false
			};
			this.dragOptions	= { handle: this.dragSelector };
			this.packery		= new Packery(container, this.pkrOptions);
			this.addDraggabilly();
			this.addEvents();
		}

		/**
		 * @description	Will initialise the Packery layout.
		 */
		layout () {
			this.packery.layout();
		}

		/**
		 * @description	Adds a new item to the Packery layout.
		 * @param 			{NodeList|HTMLElement} elem
		 */
		add (elem) {
			this.packery.appended( elem );
			this.addDraggabilly();
		}

		/**
		 * @description	Removes passed element from the Packery layout.
		 * @param 			{NodeList|HTMLElement} config
		 */
		remove (elem) {
			this.packery.remove( elem );
			this.layout();
		}

		/**
		 * @description	Makes an element sticky.
		 * @param 			{NodeList|HTMLElement} config
		 */
		stamp (elem) {
			this.packery.stamp( elem );
		}

		/**
		 * @description	Unstamps an element.
		 * @param 			{NodeList|HTMLElement} config
		 */
		unstamp (elem) {
			this.packery.unstamp( elem );
		}

		/**
		 * @description	Initialises Draggabilly.
		 */
		addDraggabilly () {
			const _self = this;
			let cards = this.packery.getItemElements();
			cards.forEach(function (item) {
				let draggie = new Draggabilly(item, _self.dragOptions);
				_self.packery.bindDraggabillyEvents( draggie );
				draggie.on('pointerDown', _self.validateEditMode.bind(draggie));
			});
		}

		/**
		 * @description	Adds EventListener.
		 */
		addEvents () {
			window.addEventListener('card-edit', this.validateLayoutState.bind(this));
			window.addEventListener('card-save', this.validateLayoutState.bind(this));
			window.addEventListener('card-remove', this.validateLayoutState.bind(this));
			Brow.Settings.getElem()['CONTENT_OVERLAY']
				.addEventListener('click', this.validateLayoutState.bind(this));
		}

		/**
		 * @description	Deactivates editMode and removes classes from content overlay.
		 */
		deactivateEditMode () {
			Brow.isEditMode = false;
			Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.add('is-fading');
			setTimeout(function () {
				Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('is-visible', 'is-fading');
			}, 100);
		}

		/**
		 * @description	Checks event type and validates the layout's state.
		 * @param  			{Object} event
		 */
		validateLayoutState (event) {
			let elem = document.querySelector(`[data-guid="${event.detail}"]`);

			// activated editing mode
			if (event.type === 'card-edit') {
				Brow.isEditMode = true;
				Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.add('is-visible');
			} 

			// saved card or remove card
			if (event.type === 'card-save' || event.type === 'card-remove') {
				this.deactivateEditMode();
				
				if (event.type === 'card-save') {
					this.layout();
					Brow.Settings.checkCustom();
				}

				if (event.type === 'card-remove') {
					this.remove(elem);
					Brow.activeCard = null;
				}
			}

			else if (event.type === 'click' && Brow.isEditMode) {
				elem = Brow.Settings.getElem()['CONTENT'].querySelector('.is-edit');
				elem.saveToStorage();
				elem.classList.remove('fx', 'is-edit');
				this.deactivateEditMode();
			}
		}

		/**
		 * @description	Checks if editMode is active and weither disables or enables the dragging.
		 * @param  			{Object} event
		 */
		validateEditMode (event) {
			if (Brow.isEditMode) {
				this.disable();
			} else {
				this.enable();
			}
		}
	}

	return BrowLayoutManager;
})(window, Brow);