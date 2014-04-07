module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
      options: {
        mangle: true
      },      
      slave: {
        files: {
          'slave/js/slave.min.js': [
          'common/js/Class.js',
          'common/js/ClientCommand.js',
          'slave/audiosynth/audiosynth.js',
          'slave/js/raf.js',
          'slave/js/Instrument.js',
          'slave/js/ClientController.js',
          'slave/js/AudioController.js',
          'slave/js/Renderer.js'
        ]}
      }
    },
    jshint: {
      files: ['slave/js/*.js'],
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
