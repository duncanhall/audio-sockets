module.exports = function(grunt) {

  /**
   * Common src paths and matchers
   */ 
  var COMMON_SRC = 'common/js/*.js';
  var COMPILED_EXT = '.min.js';
  var IGNORE_COMPILED = '!**/*' + COMPILED_EXT;
  var AUDIO_SRC = 'slave/audiosynth/audiosynth.js';

  /**
   * Compiled slave settings
   */
  var slaveDir = 'slave/js/';
  var slaveSrc = slaveDir + '*.js';
  var slaveCompiled = slaveDir + 'slave' + COMPILED_EXT;
  var slaveCompiler = {};

  slaveCompiler[slaveCompiled] = [
      COMMON_SRC,
      AUDIO_SRC,
      slaveSrc,
      IGNORE_COMPILED
  ];

  var clientDir = 'client/js/';
  var clientSrc = clientDir + '*.js';
  var clientCompiled = clientDir + 'client' + COMPILED_EXT;
  var clientCompiler = {};

  clientCompiler[clientCompiled] = [
      COMMON_SRC,
      'client/js/MultiDirectionControl.js',
      IGNORE_COMPILED
  ];

  grunt.initConfig({
    uglify: {
      options: {
        mangle: true
      },      
      slave: { files: slaveCompiler },
      client: { files: clientCompiler }
    },
    jshint: {
      files: [slaveSrc],
      options: {
        globals: {
          console: true,
          browser: true
        }
      }
    }    
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

};
