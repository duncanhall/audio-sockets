
/**
 * Common src paths and matchers
 */ 
var COMMON_SRC = 'common/js/*.js';
var COMPILED_EXT = '.min.js';
var IGNORE_COMPILED = '!**/*' + COMPILED_EXT;
var AUDIO_SRC = 'slave/audiosynth/audiosynth.js';
var SLAVE_NAME = 'slave';
var CLIENT_NAME = 'client';


/**
 * Grunt config and task setup
 */
module.exports = function(grunt) {

	//Create filesets for uglify compiler
	var slaveCompiler = createSrcCompiler(SLAVE_NAME, [AUDIO_SRC]);
	var clientCompiler = createSrcCompiler(CLIENT_NAME);

	//Create filesets for jshint
	var slaveHinter = createSrcHinter(SLAVE_NAME);
	var clientHinter = createSrcHinter(CLIENT_NAME);

	grunt.initConfig({

		uglify: {
			options: {mangle: true},      
			slave: {files: slaveCompiler},
			client: {files: clientCompiler}
		},

		jshint: {
			slave: slaveHinter,
			client: clientHinter,
			options: { 
				eqnull:true,
				globals: {console: true, browser: true}
			}
		}    
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('default', ['jshint', 'uglify']);
};


/**
 * Returns a set of files to compile, associated to their target file
 */
var createSrcCompiler = function (name, files) {

	var srcDir = name + '/js/';
	var srcFiles = srcDir + '*.js';
	var compiled = srcDir + name + COMPILED_EXT;
	var compiler = {};
	var input = [
		COMMON_SRC,
		srcFiles,
		IGNORE_COMPILED
	];

	if (files != null)
		input = input.concat(files);

	compiler[compiled] = input;
	return compiler;
}


/**
 * Returns a fileset of all .js files except compiled files
 */
var createSrcHinter = function (name) {

	return [name + '/js/*.js', IGNORE_COMPILED];
}
