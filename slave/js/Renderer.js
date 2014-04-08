
var Renderer = Class.extend({

	init: function (items) {

		this.items = items;
		this.renderInterval = -1;
	},

	/**
	 *
	 */
	draw: function () {

		var items = this.items;
		var child = null;

		for (var i in items) {

			child = items[i];
			if (child.active) {

				child.step();

				if (child.x <= minX || child.x >= maxX)
				child.bounce(-1, 1);
				if (child.y <= minY || child.y >= maxY)
				child.bounce(1, -1);

				child.element.style.margin = child.y + 'px 0 0 ' + child.x  + 'px';
			}
		}		
	},

	/**
	 *
	 */
	start: function () {

		var renderer = this;
		this.renderInterval = requestAnimationFrame(function () {
			renderer.start();
		});

		this.draw();
	},

	/**
	 *
	 */
	stop: function () {

		cancelAnimationFrame(this.renderInterval);
	}

});
