/**
 * @file
 * Gulpfile for splashawards_base.
 */

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var autoprefixer = require('autoprefixer');

/**
 * @task sass-lint
 * Lint sass, abort calling task on error
 */
gulp.task('sass-lint', function () {
  return gulp.src('scss/**/*.s+(a|c)ss')
  .pipe($.sassLint({configFile: '.sass-lint.yml'}))
  .pipe($.sassLint.format())
  .pipe($.sassLint.failOnError());
});

gulp.task('sass-compile', ['sass-lint'], function () {
  // postCss plugins and processes
  var pcPlug = {
    autoprefixer: require('autoprefixer'),
    mqpacker: require('css-mqpacker')
  };
  var pcProcess = [
    pcPlug.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11']
    }),
    pcPlug.mqpacker()
  ];

  return gulp.src('scss/**/*.s+(a|c)ss') // Gets all files ending
  .pipe($.sass())
  .on('error', function (err) {
    console.log(err);
    this.emit('end');
  })
  .pipe($.sourcemaps.init())
  .pipe($.postcss(pcProcess))
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest('css'));
});

/**
 * @task clean
 * Clean the dist folder.
 */
gulp.task('clean', function () {
  return del(['css/*']);
});

/**
 * @task watch
 * Watch files and do stuff.
 */
gulp.task('watch', ['clean', 'sass-compile'], function () {
  gulp.watch('scss/**/*.+(scss|sass)', ['sass-compile']);
});

/**
 * @task default
 * Watch files and do stuff.
 */
gulp.task('default', ['watch']);

