require('events').EventEmitter.prototype._maxListeners = 99;

var gulp = require('gulp'),
    gulpCoffee = require('gulp-coffee'),
    gulpConcat = require('gulp-concat'),
    gulpUtil = require('gulp-util'),
    rimraf = require('rimraf');

var errorHandler = function(error) {
  gulpUtil.log(error);
}

// ----------------------------------------------------------------------------
// Production tasks
// ----------------------------------------------------------------------------

gulp.task('build-clean', function(callback) {
  rimraf('dist', callback);
});

gulp.task('build-coffee', ['build-clean'], function() {
  source = [
    'src/config/**/*.coffee',
    'src/modules/**/*.coffee',
    'src/directives/**/*.coffee',
    'src/factories/**/*.coffee',
    'src/filters/**/*.coffee',
    'src/prototypes/**/*.coffee',
    'src/services/**/*.coffee',
    'src/main.coffee'
  ]
  return gulp.src(source)
    .pipe(gulpCoffee({bare: true, map: true, compile: true}))
    .pipe(gulpConcat("starqle-ng-util.js"))
    // .pipe(gulp.dest('dist/'));
    .pipe(gulp.dest('../eproc-webapp/.tmp/bower_components/starqle-ng-util/dist/'));
});

gulp.task('build', ['build-coffee']);

// ----------------------------------------------------------------------------
// Default task
// ----------------------------------------------------------------------------

gulp.task('default', ['build']);
