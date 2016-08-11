var gulp = require('gulp'),
    jasmine = require('gulp-jasmine'),
    deleteLines = require('gulp-delete-lines'),
    replace = require('gulp-replace');

gulp.task('test', function(){
  return gulp.src('test/test.js')
    .pipe(jasmine());
});

gulp.task('dist', function(){
  return gulp.src('src/RandomBackgroundGenerator.js')
    .pipe(replace('//window', 'window'))  //  Uncomment the line to export to the window
    .pipe(deleteLines({
      'filters': [/DEBUG/]  //  Delete debugging codes
    }))
    .pipe(deleteLines({
      'filters': [/exports/]  //  Delete exporting modules codes
    }))
    .pipe(gulp.dest('dist'));
});
