/**
 * @description	Returns current active list item
 * @return 			{HTMLElement}
 */
var getCurrentActiveItem = (content) => content.querySelector('.dialog__sidebar li.is-active a');

/**
 * @description	Returns current active section
 * @return 			{HTMLElement}
 */
var getCurrentActiveSection = (content) => content.querySelector('section.is-visible');

/**
 * @description	Validates new and old content.
 * @param 			{HTMLElement} content
 */
var validateSection = function (content) {
	let curItem = getCurrentActiveItem(content);
	let curSection = getCurrentActiveSection(content);
	let targetSection = curItem.getAttribute('data-section');
	let section = content.querySelector(`section[data-section="${targetSection}"]`);

	if (curSection) { curSection.classList.remove('is-visible'); }
	section.classList.add('is-visible');
};

/**
 * @description	Adds or removes active state on list and shows/hides content.
 * @param 			{Object} event
 */
var toggleContent = function (event) {
	event.preventDefault();

	let item = event.target;
	let curActive = getCurrentActiveItem(this.categoryList).parentNode;

	if (!item.parentNode.classList.contains('is-active')) {
		curActive.classList.remove('is-active');
		item.parentNode.classList.add('is-active');
		validateSection(this.dialogContent);
	}

};

/**
 * @description	Adds callback to content in dialog and validates <input> fields.
 */
var dialogInformationCallback = function () {
	this.categoryList = this.dialogContent.querySelector('.dialog__sidebar ul');

	validateSection(this.dialogContent);
	this.categoryList.addEventListener('click', toggleContent.bind(this));
};

export default dialogInformationCallback;