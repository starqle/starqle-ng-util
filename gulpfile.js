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

gulp.task('build-coffee', ['build-clean'], function() {
  source = [
    'src/config/*.coffee',
    'src/directives/*.coffee',
    'src/factories/*.coffee',
    'src/filters/*.coffee',
    'src/prototypes/*.coffee',
    'src/services/*.coffee',
    'src/main.coffee'
  ]
  return gulp.src(source)
    .pipe(gulpCoffee({bare: true, map: true, compile: true}))
    .pipe(gulpConcat("starqle-ng-util.js"))
    .pipe(gulp.dest('dist/'));
    // .pipe(gulp.dest('/opt/ruby-projects/eproc-webapp/.tmp/bower_components/starqle-ng-util/dist/'));
});

gulp.task('build', ['build-coffee']);

// ----------------------------------------------------------------------------
// Default task
// ----------------------------------------------------------------------------

gulp.task('default', ['build']);
