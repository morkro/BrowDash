import { snackbar } from '../utils/elements';

/**
 * @name				Snackbar
 * @description	/
 */
class Snackbar {
	constructor() {
		this.duration = 10000;
		this.elem = snackbar;
		this.default = 'Ooops, something went wrong! :(';
		this.message = null;
	}

	alert(msg = this.default) {
		this.message = msg.trim();
		this.show();
	}

	set setDuration (duration) {
		this.duration = duration;
	}

	show() {
		this.elem.innerHTML = null;
		this.elem.appendChild( this.createParagraph() );
		this.elem.classList.add('is-visible');

		setTimeout(() => {
			this.elem.classList.remove('is-visible');
			this.message = null;
		}, this.duration);
	}

	createParagraph() {
		let p = document.createElement('p');
		p.innerText = this.message;
		return p;
	}
}

export default Snackbar;