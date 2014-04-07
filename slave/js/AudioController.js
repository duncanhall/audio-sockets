
var AudioController = Class.extend({

	/**
	 * Adds shim for performance.now
	 */ 
	init: function (instruments) {

		this.instruments = instruments;
		this.stepInterval = -1;
		this.performance = window.performance || {};
		this.performance.now = (function() {
			return performance.now    ||
			performance.webkitNow     ||
			performance.msNow         ||
			performance.oNow          ||
			performance.mozNow        ||
			function() { return new Date().getTime(); };
		})();	
	},

	/**
	 *
	 */
	start: function () {

		this.stop();
		this.runTimer(AudioController.MIN_STEP);
	},

	/**
	 *
	 */
	step: function () {

		var instruments = this.instruments;
		var instrument = null;

		for (var i in instruments) {
			instrument = instruments[i];
			if (instrument.active)
				instrument.playNextNote();
		}
	},

	/**
	 *
	 */
	stop: function () {

		clearInterval(this.stepInterval);
	},

	/**
	 *
	 */
	runTimer: function (tick) {

		var start = this.performance.now();
		var time = 0;
		var scope = this;
		var elapsed = '0.0';

		function instance()  
		{  
		    time += tick;  
		    scope.step();
		    var diff = (scope.performance.now() - start) - time;  
		    scope.stepInterval = window.setTimeout(instance, (tick - diff));  
		}  

		this.stepInterval = window.setTimeout(instance, tick);
	}

});

AudioController.MIN_STEP = 40;