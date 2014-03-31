/*
 * INSTRUMENT
 */
var Instrument = Class.extend({

	init: function (synth, intro, outro) {

		this.synth = synth;
		this.intro = intro;
		this.outro = outro;
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

	start: function () {

		Synth.setVolume(this.volumeIn);
		this.synth.play.apply(this.synth, this.intro.toArgs());
		this.element.className = 'instrument grow';		

		Synth.setVolume(1);
		this.applyForce(this.randomRangeNegative(40), this.randomRangeNegative(40));
		this.active = true;
	},

	stop: function () {

		this.applyForce(0, 0);
		Synth.setVolume(this.volumeout);
		this.synth.play.apply(this.synth, this.outro.toArgs());
		this.element.className = 'instrument';

		Synth.setVolume(1);
		this.active = false;
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

		this._super(Synth.createInstrument('organ'), 
			new Note('C', 1, 1), new Note('C', 2, 1));
	}	

});


/*
 * MID
 */
var Mid = Instrument.extend({

	init: function (synth) {

		this._super(Synth.createInstrument('organ'), 
			new Note('C', 4, 1.4), new Note('A', 2, 1));

		this.volumeIn = 0.8;
		this.volumeout = 0.7;
	}

});


/*
 * HIGH
 */
var High = Instrument.extend({

	init: function (synth) {

		this._super(Synth.createInstrument('organ'), 
			new Note('G', 1, 1), new Note('G', 2, 1));

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