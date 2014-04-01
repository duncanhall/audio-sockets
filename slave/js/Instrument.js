/*
 * INSTRUMENT
 */
var Instrument = Class.extend({

	init: function (parent, synth, notes) {

		this.parent = parent;
		this.synth = synth;
		this.n = 0;
		this.notes = notes;
		this.volumeIn = 1;
		this.volumeout = 1;
		this.fx = 0;
		this.fy = 0;
		this.color = '';
		this.active = false;

		this.element = document.createElement('div');
		this.element.className = 'instrument';
		this.parent.appendChild(this.element);
	},

	setColor: function (color) {

		this.color = color;
		this.element.style.borderColor = '#' + this.color;
		this.element.style.boxShadow = '0 0 30px #' + this.color;
		this.element.style.webkitBoxShadow = '0 0 30px #' + this.color;
		this.element.style.mozBoxShadow = '0 0 30px #' + this.color;
	},

	playNextNote: function () {

		this.synth.play.apply(this.synth, this.notes[this.n++].toArgs());
		this.n = this.n > 2 ? 0 : this.n;
	},

	start: function () {

		this.active = true;
		this.element.className = 'instrument grow';		
		this.applyForce(this.randomRangeNegative(40), this.randomRangeNegative(40));
	},

	stop: function () {

		this.active = false;
		this.applyForce(0, 0);
		this.element.className = 'instrument';
	},

	applyForce: function (fx, fy) {

		this.fx = fx;
		this.fy = fy;
	},

	step: function () {

		this.x = this.element.offsetLeft - this.fx;
		this.y = this.element.offsetTop - this.fy;
	},

	bounce: function (fx, fy) {

		this.fx *= fx;
		this.fy *= fy;
	},

	destroy: function () {

		this.parent.removeChild(this.element);
		this.element = null;
		this.synth = null;
	},

	randomRangeNegative: function (pos) {

		var r = Math.random() * pos;
		return r *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
	}	

});


/*
 * BASS
 */
var Bass = Instrument.extend({

	init: function (parent) {

		this._super(parent, Synth.createInstrument('piano'), 
			[new Note('A', 2, 0.2), new Note('C', 2, 0.2), new Note('D', 2, 0.2)]);
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