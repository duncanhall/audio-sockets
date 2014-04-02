
var AudioController = Class.extend({

	init: function (instruments) {

		this.instruments = instruments;
		this.stepInterval = -1;
	},

	start: function () {

		var audio = this;
		this.stepInterval = setInterval(function () { audio.step(); }, 80);
	},

	step: function () {

		var instruments = this.instruments;
		var instrument = null;

		for (var i in instruments) {

			instrument = instruments[i];
			if (instrument.active)
				instrument.playNextNote();
		}
	},

	stop: function () {

		clearInterval(this.stepInterval);
	}

});
