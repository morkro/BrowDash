/**
 * @name				BasicCard
 * @description	/
 */
BasicCard = (function () {
	'use strict';

	class BasicCard {
		constructor (card) {
			this.parent				= card;
			this.content			= document.createElement('p');
			this.wrapper			= document.createElement('div');
			this.editorOptions	= ['bold', 'italic', 'underline', 'strikethrough', 'link', 'unstyle'];

			this.wrapper.classList.add('content__basic');
			this.wrapper.appendChild( this.createEditor() );
			this.wrapper.appendChild( this.previewContent() );
		}

		/**
		 * @description	Sets the preview content
		 * @public
		 * @return 			{HTMLElement}
		 */
		previewContent () {
			let defaultContent	= Brow.Data.Content('basic')['default'];
			let storedContent		= this.parent.content.text;
			
			if (storedContent) this.content.innerHTML = storedContent;
			this.content.setAttribute('data-basic-preview', defaultContent);

			return this.content;
		}

		/**
		 * @description	Returns the entire module wrapper element.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		get getContent () {
			return this.wrapper;
		}

		/**
		 * @description	Saves current content to localStorage.
		 * @public
		 */	
		updateStorage () {
			this.parent.storage['title'] = this.parent.headline.innerHTML;
			this.parent.storage['content'] = {
				text: this.content.innerHTML
			};
			localStorage[this.parent.guid] = JSON.stringify(this.parent.storage);
		}

		/**
		 * @description	Creates a simple editor to style text.
		 * @public
		 * @todo 			Create everything: bold, italic, unstyle, links.
		 */	
		createEditor () {
			let self			= this;
			let editWrap	= document.createElement('div');
			let editList	= document.createElement('ul');

			this.editorOptions.forEach(function (item) {
				editList.appendChild( self.createEditorItem(item) );
			});
			editWrap.classList.add('content__basic__editor');
			editWrap.appendChild( editList );
			editWrap.addEventListener('click', this.executeEditorOptions);

			return editWrap;
		}

		/**
		 * @description	Creates a list editor list item.
		 * @public
		 * @return 			{HTMLElement}
		 */
		createEditorItem (item) {
			let editorCtrl		= document.createElement('li');
			let editorCtrlBtn	= document.createElement('button');
			let tooltipName	= item.charAt(0).toUpperCase() + item.slice(1);

			editorCtrl.setAttribute('data-tooltip', `${tooltipName}`);
			editorCtrl.setAttribute('data-tooltip-pos', 'bottom');
			editorCtrl.classList.add(`editor__${item}`);
			editorCtrlBtn.setAttribute('data-editor-option', `${item}`);
			editorCtrlBtn.classList.add('btn', 'editor__option');
			editorCtrl.appendChild( editorCtrlBtn );

			return editorCtrl;
		}

		executeEditorOptions (event) {
			event.preventDefault();
			let isOption = event.target.classList.contains('editor__option');
			let optionType = null;

			// This is dirty and only a very first draft.
			if (isOption) {
				optionType = event.target.getAttribute('data-editor-option');
				if (optionType === 'unstyle') optionType = 'removeFormat';
				document.execCommand(`${optionType}`, null, true);
			}
		}

		/**
		 * @description	Sets 'contenteditable="true"' to all elements.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		edit () {
			this.content.setAttribute('contenteditable', true);
			this.parent.headline.setAttribute('contenteditable', true);
		}

		/**
		 * @description	Removes attributes, updates Object and saves it to localStorage.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		save () {
			this.content.removeAttribute('contenteditable');
			this.parent.headline.removeAttribute('contenteditable');
			this.parent.title = this.parent.headline.textContent;
			this.updateStorage();
		}
	}

	return BasicCard;
})();