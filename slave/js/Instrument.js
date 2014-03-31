/*
 * INSTRUMENT
 */
var Instrument = Class.extend({

	init: function (synth, notes) {

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

		var zx = this.element.offsetLeft - this.fx;
		var zy = this.element.offsetTop - this.fy;

		if (zx <= this.minX || zx >= this.maxX)
			this.fx *= -1;
		if (zy <= this.minY || zy >= this.maxY)
			this.fy *= -1;

		this.element.style.margin = zy + 'px 0 0 ' + zx  + 'px';
	},

	setBounds: function (top, right, bottom, left) {

		this.minY = top;
		this.maxX = right;
		this.maxY = bottom;
		this.minX = left;
	},

	destroy: function () {

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

	init: function () {

		this._super(Synth.createInstrument('piano'), 
			[new Note('A', 2, 0.2), new Note('C', 2, 0.2), new Note('D', 2, 0.2)]);
	}	

});


/*
 * MID
 */
var Mid = Instrument.extend({

	init: function (synth) {

		this._super(Synth.createInstrument('piano'), 
			[new Note('A', 2, 0.2), new Note('C', 2, 0.2), new Note('D', 2, 0.2)]);

		this.volumeIn = 0.8;
		this.volumeout = 0.7;
	}

});


/*
 * HIGH
 */
var High = Instrument.extend({

	init: function (synth) {

		this._super(Synth.createInstrument('piano'), 
			[new Note('A', 3, 0.2), new Note('C', 3, 0.2), new Note('D', 3, 0.2)]);

		this.volumeIn = 0.9;
		this.volumeout = 0.7;
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