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
    .pipe(deleteLines({
      'filters': [/DEBUG/]  //  Delete debugging comments
    }))
    .pipe(deleteLines({
      'filters': [/exports/]  //  Delete exporting modules codes
    }))
    .pipe(gulp.dest('dist'));
});
