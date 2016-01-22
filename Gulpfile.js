/**
 * Customized Gulpfile.
 * @author laobubu
 * 
 * 1. stylesheet: Use scss under `./style/` dir
 */

var gulp = require('gulp');
var changed = require('gulp-changed');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var del = require('del');
var notify = require("gulp-notify");

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var DEST = "dest/";
var SRC = "src/";

/** 
 * generate an array for gulp.src
 * @argument {string} exts - a string containing all the extension names
 * @returns {string[]} file paths
 * @example gulp.src(srclist('html, js, png, jpg, gif'))
 */
function srclist(exts, DIR) {
  var rtn = [], regex = /(\w+)/g, mat;
  while (mat = regex.exec(exts)) {
    rtn.push((DIR || SRC) + "**/*." + mat[1]);
  }
  return rtn;
}


gulp.task('default', () => runSequence('clean', 'build'));

gulp.task('clean', () => del([DEST + "**", "!dest", "!" + DEST + ".git**"]));

gulp.task('build', ['scss', 'static']);

gulp.task('uglify', ['uglify:js', 'uglify:css', 'uglify:html']);

gulp.task('watch', ['default'], function () {
  browserSync({
    server: {
      baseDir: DEST
    }
  });

  gulp.watch([`${SRC}/**/*`, `!${SRC}/**/*.scss`, `!${SRC}/**/*.ts`], () => runSequence('static', reload));
  gulp.watch([`${SRC}/**/*.scss`], () => runSequence('scss', reload));
  gulp.watch([`${SRC}/**/*.ts`], () => runSequence('ts', reload));
});

gulp.task('ts', function () {
  return gulp.src(srclist('ts'))
    .pipe(changed(DEST, { extension: '.js' }))
    .pipe(ts())
    .pipe(gulp.dest(DEST));
});

gulp.task('scss', function () {
  return gulp.src(SRC + "/*/*.scss") //DO NOT proccess sub-dirs
    .pipe(sourcemaps.init())	//TODO: Make "changed" works again
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DEST));
});

gulp.task('static', function () {
  var src = srclist('ts, scss, wav', '!' + SRC);
  src.unshift(SRC + "**", '!' + SRC + 'style/**');
  return gulp.src(src)
    .pipe(changed(DEST))
    .pipe(gulp.dest(DEST));
});

gulp.task('uglify:js', ['build'], function(){
  return gulp.src(srclist("js", DEST))
      .pipe(uglify())
      .pipe(gulp.dest(DEST));
});

gulp.task('uglify:css', ['build'], function(){
  return gulp.src(srclist("css", DEST))
      .pipe(cssmin())
      .pipe(gulp.dest(DEST));
});

gulp.task('uglify:html', ['build'], function(){
  return gulp.src(srclist("html", DEST))
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest(DEST));
});