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

		this.element = document.createElement('div');
		this.element.className = 'instrument';
	},

	playIntro: function () {

		Synth.setVolume(this.volumeIn);
		this.synth.play.apply(this.synth, this.intro.toArgs());
		this.element.className = 'instrument grow';		
		Synth.setVolume(1);
	},

	playOutro: function () {

		Synth.setVolume(this.volumeout);
		this.synth.play.apply(this.synth, this.outro.toArgs());
		this.element.className = 'instrument';		
		Synth.setVolume(1);
	},

	destroy: function () {

		this.element = null;
		this.synth = null;
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