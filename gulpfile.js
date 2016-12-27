var gulp = require('gulp');
var fs = require('fs');
var connect = require('gulp-connect');

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
