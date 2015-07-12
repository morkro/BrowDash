/**
 * @name				Card
 * @description	/
 */
class Card {
	constructor (config = {}) {
		this.config = config;
		this.elem = this.createCard();
		this.initialiseCard();
		console.log(this);
		return this.elem;
	}

	/**
	 * @description	Returns a new card element.
	 * @return 			{HTMLElement}
	 */
	createCard () {
		switch (this.config.type) {
			case 'text': return document.createElement('text-card');
			case 'weather': return document.createElement('weather-card');
			case 'todo': return document.createElement('todo-card');
			case 'calculator': return document.createElement('calculator-card');
			default: return document.createElement('text-card');
		}
	}

	/**
	 * @description	Applies class element and calls initialise().
	 */
	initialiseCard () {
		this.elem.initialise( this.config );
		this.elem.classList.add('brow-content__module');
	}
}

export default Card;