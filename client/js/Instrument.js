/*

	INSTRUMENT

*/
var Instrument = Class.extend({

	init: function (synth, intro, outro) {

		this.synth = synth;
		this.intro = intro;
		this.outro = outro;

		this.element = document.createElement('div');
		this.element.className = 'instrument';
		
	},

	position: function (i) {

		this.element.style.marginLeft = String(i * 200) + "px";
	},

	playIntro: function () {

		this.synth.play.apply(this.synth, this.intro.toArgs());
		this.element.className = 'instrument grow';		

	},

	playOutro: function () {

		this.synth.play.apply(this.synth, this.outro.toArgs());
		this.element.className = 'instrument';		

	},

	destroy: function () {

		this.element = null;
		this.synth = null;

	}

});


/*

	BASS

*/
var Bass = Instrument.extend({

	init: function (synth) {

		this._super(synth,
			new Note('C', 1, 1), 
			new Note('C', 2, 1)
		);
	}	

});


/*

	MID

*/
var Mid = Instrument.extend({

	init: function (synth) {

		this._super(synth,
			new Note('C', 3, 0.4), 
			new Note('C', 2, 1.4)
		);
	}	

});



/*

	NOTE

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