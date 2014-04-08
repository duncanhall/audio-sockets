
/**
 * Common src paths and matchers
 */ 
var COMMON_SRC = 'common/js/*.js';
var COMPILED_EXT = '.min.js';
var IGNORE_COMPILED = '!**/*' + COMPILED_EXT;
var AUDIO_SRC = 'slave/audiosynth/audiosynth.js';
var SLAVE_NAME = 'slave';
var CLIENT_NAME = 'client';
var CMN_NAME = 'common';
var BUILD_DIR = 'public_html';


/**
 * Grunt config and task setup
 */
module.exports = function(grunt) {

	/*
	 * Create filesets for uglify compiler
	 */ 
	var slaveCompiler = createSrcCompiler(SLAVE_NAME, [AUDIO_SRC]);
	var clientCompiler = createSrcCompiler(CLIENT_NAME);

	/*
	 * Create filesets for jshint
	 */
	var slaveHinter = createSrcHinter(SLAVE_NAME);
	var clientHinter = createSrcHinter(CLIENT_NAME);
	var commonHinter = createSrcHinter(CMN_NAME);

	/**
	 * Prepare the build directory 
	 */
	grunt.registerTask('clean', function () {

		if (grunt.file.exists(BUILD_DIR))
			grunt.file.delete(BUILD_DIR);

		grunt.file.mkdir(BUILD_DIR);
		grunt.file.copy('client/index.html',  BUILD_DIR + '/client/index.html');
		grunt.file.copy('slave/index.html',  BUILD_DIR + '/slave/index.html');
		grunt.file.copy('client/css/client.css',  BUILD_DIR + '/client/css/client.css');
		grunt.file.copy('slave/css/slave.css',  BUILD_DIR + '/slave/css/slave.css');
	});

	/*
	 * Configure installed grunt tasks
	 */
	grunt.initConfig({

		/**
		 * Uglify slave and client srcs to single min.js files
		 * and save the output to BUILD_DIR
		 */
		uglify: {
			options: {mangle:true},      
			slave: {files:slaveCompiler},
			client: {files:clientCompiler}
		},

		/**
		 * Run jshint on all non-compiled srcs 
		 */
		jshint: {
			slave: slaveHinter,
			client: clientHinter,
			common: commonHinter,
			options: { 
				eqnull:true,
				globals: {console:true, browser:true}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('default', ['jshint', 'clean', 'uglify']);
};


/**
 * Returns a set of files to compile, associated to their target file
 */
var createSrcCompiler = function (name, files) {

	var srcDir = name + '/js/';
	var srcFiles = srcDir + '*.js';
	var compiled = BUILD_DIR + '/' + srcDir + name + COMPILED_EXT;
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

	return [name + '/js/*.js', IGNORE_COMPILED, '!**/Class.js'];
}
