BrowMasonry = (function (window, Brow) {
	'use strict';

	class BrowMasonry {
		constructor (container) {
			this.container	= container;
			this.items		= null;
			this.grid		= [];
			this.rowCount	= 3;
			
			this.update();
		}

		update () {
			this.items = this.container.querySelectorAll('.brow__content__module');
			this.grid = [];

			for (let i = 0; i < this.items.length; i += this.rowCount) {
				let itemsRow = [];

				if (!!this.items[i]) itemsRow.push(this.items[i].getAttribute('data-module-guid'));
				if (!!this.items[i + 1]) itemsRow.push(this.items[i + 1].getAttribute('data-module-guid'));
				if (!!this.items[i + 2]) itemsRow.push(this.items[i + 2].getAttribute('data-module-guid'));

				this.grid.push( itemsRow );
			}

			this.organiseDashboard();
		}

		organiseDashboard () {
			console.log(this);
			for (let col = 0; col < this.grid.length; col++) {
				for (let row = 0; row < this.grid[col].length; row++) {
					let item = document.querySelector(`[data-module-guid="${this.grid[col][row]}"]`);
					
					if (col !== 0)  {
						let itemAbove = document.querySelector(`[data-module-guid="${this.grid[col - 1][row]}"]`);
						if (!!itemAbove) {
							item.style.top = `${itemAbove.getBoundingClientRect().bottom - 35}px`;
						}
					}

					item.setAttribute('data-module-column', `${row + 1}`);
				}
			}
		}
	}

	return BrowMasonry;
})(window, Brow);