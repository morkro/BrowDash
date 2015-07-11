/*globals Packery,Draggabilly*/

import { hasCustomCards } from '../utils/helper';

/**
 * @name				LayoutManager
 * @description	/
 */
class LayoutManager {
	constructor (container, overlay) {
		this.transition = 0;
		this.dragOptions = {
			handle: '.brow-content__module /deep/ .dragg-area'
		};
		this.pkrOptions = {
			itemSelector: '.brow-content__module',
			transitionDuration: this.transition,
			columnWidth: '.brow-content--sizer',
			gutter: '.brow-content--gutter',
			stamp: '.is-stamp',
			isInitLayout: false
		};
		this.packery = new Packery(container, this.pkrOptions);
		this.content = container;
		this.overlay = overlay;
		this.addEvents();
		this.addDraggabilly();
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
		let cards = this.packery.getItemElements();
		cards.forEach((item) => {
			let draggie = new Draggabilly(item, this.dragOptions);
			this.packery.bindDraggabillyEvents( draggie );
			draggie.on('pointerDown', this.validateEditMode.bind(draggie));
		});
	}

	/**
	 * @description	Adds EventListener.
	 */
	addEvents () {
		window.addEventListener('card-edit', this.validateLayoutState.bind(this));
		window.addEventListener('card-save', this.validateLayoutState.bind(this));
		window.addEventListener('card-remove', this.validateLayoutState.bind(this));
		this.overlay.addEventListener('click', this.validateLayoutState.bind(this));
	}

	/**
	 * @description	Deactivates editMode and removes classes from content overlay.
	 */
	deactivateEditMode () {
		window.isEditMode = false;
		this.overlay.classList.add('is-fading');
		setTimeout(() => {
			this.overlay.classList.remove('is-visible', 'is-fading');
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
			window.isEditMode = true;
			this.overlay.classList.add('is-visible');
		}

		// saved card or remove card
		if (event.type === 'card-save' || event.type === 'card-remove') {
			this.deactivateEditMode();

			if (event.type === 'card-save') {
				this.layout();
				hasCustomCards();
			}

			if (event.type === 'card-remove') {
				this.remove(elem);
			}
		}

		else if (event.type === 'click' && window.isEditMode) {
			elem = this.content.querySelector('.is-edit');
			elem.saveToStorage();
			elem.classList.remove('fx', 'is-edit');
			this.deactivateEditMode();
		}
	}

	/**
	 * @description	Checks if editMode is active and weither disables or enables the dragging.
	 */
	validateEditMode () {
		if (window.isEditMode) {
			this.disable();
		} else {
			this.enable();
		}
	}
}

export default LayoutManager;