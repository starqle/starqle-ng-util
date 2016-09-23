require('events').EventEmitter.prototype._maxListeners = 99;

var gulp = require('gulp'),
    gulpCache = require('gulp-cached'),
    gulpCoffee = require('gulp-coffee'),
    gulpConcat = require('gulp-concat'),
    gulpConnect = require('gulp-connect'),
    gulpIf = require('gulp-if'),
    gulpJade = require('gulp-jade'),
    gulpPlumber = require('gulp-plumber'),
    gulpSass = require('gulp-sass'),
    gulpUglify = require('gulp-uglify'),
    gulpUtil = require('gulp-util'),
    gulpWatch = require('gulp-watch'),
    modRewrite = require('connect-modrewrite'),
    del = require('del'),
    rimraf = require('rimraf');

var errorHandler = function(error) {
  gulpUtil.log(error);
}

var dest = 'dist/';

// ----------------------------------------------------------------------------
// Production tasks
// ----------------------------------------------------------------------------

gulp.task('clean', function(callback) {
  del('.tmp', callback);
});

gulp.task('serve', function() {
  gulpConnect.server({
    root: '.tmp',
    port: 9000,
    middleware: function(connect, options) {
      var middlewares = [];
      middlewares.push(modRewrite([
        '^/examples/([a-z,\-]*)/(.*)$ /examples/$1/$2 [L]',
        '^/examples/([a-z,\-]*)$ /examples/$1/index.html [L]'
      ]));
      middlewares.push(connect.static('.tmp'));
      return middlewares;
    }
  });
});



gulp.task('jade', function() {
  return gulp.src('examples/**/*.jade')
    .pipe(gulpPlumber({errorHandler:errorHandler}))
    .pipe(gulpCache(('jade')))
    .pipe(gulpJade({pretty: true}))
    .pipe(gulp.dest('.tmp/examples/'));
});

gulp.task('coffee', function() {
  return gulp.src('examples/**/*.coffee')
    .pipe(gulpPlumber({errorHandler:errorHandler}))
    .pipe(gulpCache('coffee'))
    .pipe(gulpCoffee({bare: true, map: true, compile: true}))
    .pipe(gulp.dest('.tmp/examples/'));
});

gulp.task('watch', ['clean'], function() {
  gulpWatch('examples/**/*.jade', {ignoreInitial: false}, function() {
    gulp.start('jade');
  });
  gulpWatch('examples/**/*.coffee', {ignoreInitial: false}, function() {
    gulp.start('coffee');
  });
});

gulp.task('build-clean', function(callback) {
  rimraf('dist', callback);
});

gulp.task('build-coffee', ['build-clean'], function() {
  source = [
    'src/intro.js',
    'src/config/**/*.coffee',
    'src/modules/**/*.coffee',
    'src/directives/**/*.coffee',
    'src/factories/**/*.coffee',
    'src/filters/**/*.coffee',
    'src/prototypes/**/*.coffee',
    'src/services/**/*.coffee',
    'src/main.coffee',
    'src/outro.js'
  ]
  gulp.src(source)
    .pipe(gulpIf('*.coffee', gulpCoffee({bare: true, map: true, compile: true})))
    .pipe(gulpConcat("starqle-ng-util.js"))
    .pipe(gulp.dest(dest));
  return gulp.src(source)
    .pipe(gulpIf('*.coffee', gulpCoffee({bare: true, map: true, compile: true})))
    .pipe(gulpConcat("starqle-ng-util.min.js"))
    .pipe(gulpUglify())
    .pipe(gulp.dest(dest));
});


gulp.task('build-sass', [], function() {
  return gulp.src(['styles/starqle-ng-util.scss'])
    .pipe(gulpPlumber({errorHandler:errorHandler}))
    .pipe(gulpSass())
    .pipe(gulpPlumber.stop())
    .pipe(gulp.dest(dest));
});

gulp.task('build', ['build-coffee', 'build-sass']);

gulp.task('examples', ['serve', 'watch']);

// ----------------------------------------------------------------------------
// Default task
// ----------------------------------------------------------------------------

gulp.task('default', ['build']);
