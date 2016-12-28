var gulp = require('gulp');
var fs = require('fs');
var connect = require('gulp-connect');
var exec = require('child_process').execFile;
var async = require('async');
var glob = require('glob');

// `gulp.task()` defines task that can be run calling `gulp xyz` from the command line
// The `default` task gets called when no task name is provided to Gulp
gulp.task('default', ['connect', 'watch']);

gulp.task('connect', function() {
  connect.server({
    root: ['app', 'node_modules/konva'],
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch(['app/*.*'], function(evt) {
    gulp.src('app/*.*').pipe(connect.reload())
  })
});

gulp.task('watch-test', function(){
  gulp.watch(['app/*.js', 'tests/*.js'], function(e){
    glob('tests/*.js', function(e, files){
      if (e) {
        console.error(e);
      }
      else {
        var tasks = files.map(f => {
          return function(cb) {
            console.log('Running test:', f);
            exec('node', [f], function(e, stdout, stderr){
              if (e) {
                cb(e)
              }
              else {
                if (stdout.length) {
                  console.log(stdout);
                }
                else {
                  console.log('Test fail:', f);
                  console.log(stderr);
                }
                cb(null);
              }
            });
          };
        });
        async.series(tasks, function(e, cb){
          if (e) {
            console.log('Something failed...');
            console.error(e);
          }
          else {
            console.log('Tests execution finished...');
          }
        });
      }
    });
  });
})
