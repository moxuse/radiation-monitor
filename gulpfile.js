var gulp = require('gulp');
var _compass = require('gulp-compass');
var _slim = require("gulp-slim");
var _watch = require('gulp-watch');

gulp.task('compass', function() {
  gulp.src('src/sass/*.scss').pipe(_compass({
    config_file: 'src/sass/config.rb',
    comments: false,
    css: 'bin/css/',
    sass: 'src/sass/'
  }));
});

gulp.task('slim', function(){
  gulp.src("./src/*.slim")
  .pipe(_slim({
    pretty: true
  }))
  .pipe(gulp.dest("./public"));
});

/*
gulp tasks
*/
gulp.task('build', function() {
  gulp.run(['compass', 'slim']);
});

gulp.task('watch', function() {
  gulp.watch(['src/*.slim'], ['build'])
});

gulp.task('default', function() {
  gulp.run('build');
});
