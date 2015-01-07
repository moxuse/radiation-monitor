var gulp = require('gulp');
var _compass = require('gulp-compass');
var _slim = require("gulp-slim");
var _watch = require('gulp-watch');
var _rimraf = require('rimraf');

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

gulp.task('javascripts', function(){
  gulp.src("./src/javascripts/**")
  .pipe(gulp.dest("./public/javascripts/"));
});

gulp.task('stylesheets', function(){
  gulp.src("./src/stylesheets/**")
  .pipe(gulp.dest("./public/stylesheets/"));
});

gulp.task('images', function(){
  gulp.src("./src/images/**")
  .pipe(gulp.dest("./public/images/"));
});

gulp.task('geojson', function(){
  gulp.src("./src/geojson/**")
  .pipe(gulp.dest("./public/geojson/"));
});

gulp.task('clean', function(fn) {
  rimraf('./build', fn);
});

/*
gulp tasks
*/
gulp.task('build', function() {
  gulp.run([
    'compass',
    'slim',
    'javascripts',
    'stylesheets',
    'images',
    'geojson'
  ]);
});

gulp.task('watch', function() {
  gulp.watch([
    'src/*.slim',
    './src/javascripts/**',
    './src/stylesheets/**',
    './src/images/**'
    ],
    ['build'])
});

gulp.task('default', function() {
  gulp.run('build');
});
