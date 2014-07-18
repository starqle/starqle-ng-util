require('events').EventEmitter.prototype._maxListeners = 99;

var gulp = require('gulp'),
    gulpCache = require('gulp-cached'),
    gulpCoffee = require('gulp-coffee'),
    gulpConcat = require('gulp-concat'),
    gulpConnect = require('gulp-connect'),
    gulpFilter = require('gulp-filter'),
    gulpImagemin = require('gulp-imagemin'),
    gulpInject = require('gulp-inject'),
    gulpJade = require('gulp-jade'),
    gulpMinifyHtml = require('gulp-minify-html'),
    gulpMinifyCss = require('gulp-minify-css'),
    gulpNgHtml2Js = require('gulp-ng-html2js'),
    gulpNotify = require('gulp-notify'),
    gulpPlumber = require('gulp-plumber'),
    gulpPrefix = require('gulp-autoprefixer'),
    gulpRev = require('gulp-rev'),
    gulpRevReplace = require('gulp-rev-replace'),
    gulpSass = require('gulp-sass'),
    gulpUglify = require('gulp-uglify'),
    gulpUseref = require('gulp-useref'),
    gulpUtil = require('gulp-util'),
    gulpWatch = require('gulp-watch'),
    modRewrite = require('connect-modrewrite'),
    rimraf = require('rimraf'),
    runSequence = require('run-sequence');

var errorHandler = function(error) {
  gulpUtil.log(error);
}

// ----------------------------------------------------------------------------
// Production tasks
// ----------------------------------------------------------------------------

gulp.task('build-clean', function(callback) {
  rimraf('dist', callback);
});

gulp.task('build-js', ['build-clean'], function() {
  source = [
    'src/directives/*.js',
    'src/filters/*.js',
    'src/main.js'
  ]
  return gulp.src(source)
    .pipe(gulpConcat("starqle-ng-util.js"))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['build-js']);

// ----------------------------------------------------------------------------
// Default task
// ----------------------------------------------------------------------------

gulp.task('default', ['build']);
