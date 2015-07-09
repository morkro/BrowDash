(function() {
	'use strict';
	
	/* Constants */
	var doc			= document.currentScript.ownerDocument;
	var template	= doc.querySelector('#todo-card');
	var TodoCard	= Object.create(HTMLDivElement.prototype);

	TodoCard.ENTER_KEY	= 13;
	TodoCard.taskCount	= 1;
	TodoCard.config		= { module: true, type: 'todo', content: {} };
	TodoCard.default		= { headline: 'Todo list', todo: 'Create awesome list!' };
	
	/**
	 * @description	Initialises data.
	 * @param 			{Object} config
	 */
	TodoCard.initialise = function (config) {
		// Assign GUID
		if (config.guid) {
			this.config.guid = config.guid;
		} else {
			this.config.guid = this.root.children[1].GUID();
		}

		// Eval content
		if (config.content && typeof config.content === 'object') {
			this.config.content = config.content;	
		} else {
			this.config.content = {};
		}

		// Headline?
		if (this.config.content.headline) {
			this.headlineElement.innerHTML = this.config.content.headline;
		} else {
			this.headlineElement.innerHTML = this.default.headline;
		}

		// Tasks?
		if (this.config.content.tasks) {
			this.taskCount = this.config.content.tasks.length + 1;
			this.config.content.tasks.forEach(function (task) {
				this.addItem({
					id: task.id,
					content: task.content, 
					completed: task.completed
				});
			}, this);
		} else {
			this.config.content.tasks = [];
			let item = this.addItem({
				id: this.taskCount++,
				content: this.default.todo,
				completed: true
			});
			this.config.content.tasks.push(item);
		}

		console.log(this.config);

		this.taskCounter(this.config.content.tasks.length);
		this.root.children[1].setGUID(this.config.guid);
		this.saveToStorage();
	};

	/**
	 * @description	Saves this.config to localStorage.
	 */
	TodoCard.saveToStorage = function () {
		localStorage.setItem(this.config.guid, JSON.stringify(this.config));
	};

	/**
	 * @description	An instance of the element is created.
	 */
	TodoCard.createdCallback = function () {
		this.root = this.createShadowRoot();
		this.root.appendChild( document.importNode(template.content, true) );

		// Input
		this.input = this.root.querySelector('.todo-input');
		this.input.addEventListener('keyup', this.updateList.bind(this));

		// List
		this.list = this.root.querySelector('.todo-main ul');
		this.list.addEventListener('click', this.editList.bind(this));

		// Headline
		this.headlineElement	= document.createElement('h1');
		this.headlineElement.addEventListener('input', this.evalContent.bind(this));

		// Task counter
		this.count = this.root.querySelector('.digest__count');

		this.appendContent();
	};

	/**
	 * @description	Sets contenteditable, updates content and appends to <todo-card>.
	 */
	TodoCard.appendContent = function () {
		this.headlineElement.contentEditable = true;
		this.updateContent();
		this.appendChild( this.headlineElement );
	};

	/**
	 * @description	Stores content of <h1>.
	 */	
	TodoCard.updateContent = function () {
		this.config.content.headline = this.headlineElement.innerHTML;
	};

	/**
	 * @description	Creates task item, appends to <todo-card> and returns content.
	 * @param 			{Object} config
	 * @return 			{Object}
	 */	
	TodoCard.addItem = function (config) {
		config.content = config.content.trim();
		if (config.content === '') return;

		// Create elements
		let item			= document.createElement('li');
		let label		= document.createElement('label');
		let checkbox	= document.createElement('input');
		let btn			= document.createElement('button');
		let storage		= { 
			id: config.id, 
			content: config.content, 
			completed: config.completed
		};

		// Initialise elements
		item.setAttribute('data-todo', config.id);
		checkbox.type = 'checkbox';
		checkbox.checked = config.completed;
		label.textContent = config.content;
		btn.type = 'button';
		btn.innerHTML = `<svg-icon icon="close" color="red"></svg-icon>`;

		// Append elements
		item.appendChild( checkbox );
		item.appendChild( label );
		item.appendChild( btn );
		this.list.appendChild( item );

		return storage;
	};

	/**
	 * @description	Removes given item from view and localStorage.
	 * @param 			{HTMLElement} item
	 */	
	TodoCard.removeItem = function (item) {
		let itemID = parseInt(item.getAttribute('data-todo'), 10);
		let removeItem = this.config.content.tasks.map(function(task) { return task.id; }).indexOf(itemID);
		
		this.list.removeChild( item );
		this.config.content.tasks.splice(removeItem, 1);
		this.saveToStorage();
	};

	TodoCard.updateItem = function (item) {
		let itemID = parseInt(item.parentNode.getAttribute('data-todo'), 10);

		item.checked = !item.checked;
	};

	/**
	 * @description	If ENTER_KEY is pressed, creates a new list item and clears input.
	 * @param  			{Object} event
	 */
	TodoCard.updateList = function (event) {
		if (event.keyCode === this.ENTER_KEY) {
			let item = this.addItem({
				id: this.taskCount++,
				content: event.target.value,
				completed: false
			});
			event.target.value = null;
			this.config.content.tasks.push(item);
			this.taskCounter(this.config.content.tasks.length);
			this.saveToStorage();
		}
	};

	/**
	 * @description	Validates target and updates items.
	 * @param  			{Object} event
	 */
	TodoCard.editList = function (event) {
		// Delete item
		if (event.target.matches('svg-icon')) {
			this.removeItem(event.target.parentNode.parentNode);
		}

		// Check/uncheck item
		if (event.target.matches('label')) {
			this.updateItem(event.target.previousSibling);
		}
	};

	TodoCard.taskCounter = function (tasks) {
		let plural = tasks === 1 ? '' : 's';
		this.count.innerHTML = `<strong>${tasks}</strong> task${plural} left`;
	};

	/**
	 * @description	Saves to localStorage on each input event.
	 * @param 			{Object} event
	 */
	TodoCard.evalContent = function (event) {
		this.updateContent();
		this.saveToStorage();
	};
	
	/* Register element in document */
	document.registerElement('todo-card', { prototype: TodoCard });
})();