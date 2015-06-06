(function() {
	'use strict';
	
	/* Constants */
	var doc			= document.currentScript.ownerDocument;
	var template	= doc.querySelector('#todo-card');
	var TodoCard	= Object.create(HTMLDivElement.prototype);
	
	/**
	 * @description	An instance of the element is created.
	 */
	TodoCard.createdCallback = function () {
		let root		= this.createShadowRoot();
		root.appendChild( document.importNode(template.content, true) );

		var elem = document.createElement('h1');
		elem.textContent = 'Todo List';
		elem.contentEditable = true;
		
		this.appendChild(elem);
	};

	TodoCard.edit = function () {};

	TodoCard.save = function () {};	
	
	/* Register element in document */
	document.registerElement('todo-card', { prototype: TodoCard });
})();