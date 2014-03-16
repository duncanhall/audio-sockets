
var Instrument = Class.extend({

	init: function (intro, outro) {

		this.intro = intro;
		this.outro = outro;

	}

});



var Bass = Instrument.extend({

	init: function () {

		this._super(
			new Note('C', 1, 1), 
			new Note('C', 2, 1));

	}	

});