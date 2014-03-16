
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