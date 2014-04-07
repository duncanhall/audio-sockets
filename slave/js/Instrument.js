/*
 * INSTRUMENT
 */
var Instrument = Class.extend({

	init: function (parent, color) {

		this.color = color;
		this.synth = Synth.createInstrument('piano');
		this.notes = ['A', 'C', 'D', 'E'];
		this.octave = 3;
		this.duration = 0.2;
		this.n = 0;
		this.fx = 0;
		this.fy = 0;
		this.active = false;
		this.step = 0;
		this.interval = 0;
		this.dirty = false;

		this.element = document.createElement('div');
		this.element.className = 'instrument';
		parent.appendChild(this.element);

		this.setSpeed(160);
	},

	setColor: function (color) {

		this.color = color;
		this.element.style.borderColor = '#' + this.color;
		this.element.style.boxShadow = '0 0 30px #' + this.color;
		this.element.style.webkitBoxShadow = '0 0 30px #' + this.color;
		this.element.style.mozBoxShadow = '0 0 30px #' + this.color;
	},

	setSpeed: function (interval) {

		this.interval = interval;
		this.beat = Math.floor(interval / AudioController.MIN_STEP);

		this.duration = (this.beat * 0.1);

		if (this.active) {

			this.dirty = true;
			this.element.style.animation = "none";
			this.element.style.webkitAnimation = "none";
		}
	},

	playNextNote: function () {

		if (++this.step >= this.beat) {		

			this.synth.play(this.notes[this.n++], this.octave, this.duration);
			this.n = this.n > this.notes.length - 1 ? 0 : this.n;
			this.step = 0;

			if (this.dirty) {

				var c = "pulse " + ((this.interval / 1000) * 4) + "s infinite";
				this.dirty = false;
				this.element.style.animation = c;
				this.element.style.webkitAnimation = c;
			}
	
		}
	},

	start: function () {

		this.active = true;

		this.element.style.animation = "pulse .32s infinite";
		this.element.style.webkitAnimation = "pulse .32s infinite";
	},

	stop: function () {

		this.active = false;
		this.applyForce(0, 0);

		this.element.style.animation = "none";
		this.element.style.webkitAnimation = "none";		
	},

	applyForce: function (fx, fy) {

		this.fx = fx;
		this.fy = fy;
	},

	step: function () {

		this.x = this.element.offsetLeft - this.fx;
		this.y = this.element.offsetTop - this.fy;
	},

	destroy: function () {

		this.element.parent.removeChild(this.element);
		this.element = null;
		this.synth = null;
	}	

});


/*
 * NOTE
 */
var Note = Class.extend({

	init: function(note, octave, duration) {

		this.note = note;
		this.octave = octave;
		this.duration = duration;
	},

	toArgs: function () {

		return [this.note, this.octave, this.duration];
	}

});
