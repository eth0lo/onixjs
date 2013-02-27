module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');



  grunt.initConfig({
    'connect': {
      'server': {
        'options': {
          'base': 'app/public',
          'keepalive': true,
          'port': 9001
        }
      }
    },
    'copy': {
      'tests': {
        'files': [{'expand': true, 'cwd': 'tests/', 'src': ['**'], 'dest': 'app/public/js/tests'},
                  {'expand': true, 'cwd': 'src/', 'src': ['**'], 'dest': 'app/public/js/src'}]
      }
    },
    'clean': {
      'tests': {
        'src': ['app/public/js/tests', 'app/public/js/src']
      }
    },
    'jshint': {
      'all': ['src/*.js', 'tests/**/*.js']
    },
    'watch': {
      'tests': {
        'files': ['tests/*.js', 'src/*.js'],
        'tasks': ['clean:tests', 'copy:tests', 'reload']
      }
    }
  });
};
