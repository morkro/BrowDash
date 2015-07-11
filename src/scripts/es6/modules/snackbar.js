import { snackbar } from '../utils/elements';

/**
 * @name				Snackbar
 * @description	/
 */
class Snackbar {
	constructor() {
		this.duration = 2000;
		this.elem = snackbar;
		this.message = 'Ooops, something went wrong! :(';
	}

	alert(msg = this.message) {
		this.message = msg.trim();
		this.show();
	}

	show() {
		this.elem.innerText = this.createParagraph();
		this.elem.classList.add('is-visible');
		setTimeout(() => {
			this.elem.classList.remove('is-visible');
			this.elem.innerText = null;
		}, this.duration);
	}

	createParagraph() {
		let p = document.createElement('p');
		p.innerText = this.message;
		return p;
	}
}

export default Snackbar;