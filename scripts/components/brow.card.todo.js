/**
 * @name				TodoCard
 * @description	/
 */
TodoCard = (function () {
	'use strict';

	class TodoCard {
		constructor (card) {
			this.parent	= card;
			this.elem	= document.createElement('todo-card');
		}

		/**
		 * @description	Returns the entire module wrapper element.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		get getContent () {
			return this.elem;
		}

		save () {
			localStorage[this.parent.guid] = JSON.stringify(this.parent.storage);
		}
	}

	return TodoCard;
})();